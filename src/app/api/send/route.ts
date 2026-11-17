import { EmailTemplate } from "@/components/email-template";
import { config } from "@/data/config";
import { ContactSchema, MAX_BODY_BYTES } from "@/lib/contact-schema";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

// Per-IP: 3 messages per 10 minutes and 10 per day.
// Global: 50 per hour, so a botnet rotating IPs still can't burn the Resend quota.
// The global limit is only counted for valid messages that are about to be
// sent, so junk requests can't exhaust it and lock out real visitors.
const IP_LIMITS = [
  { scope: "ip-short", limit: 3, windowMs: 10 * 60 * 1000 },
  { scope: "ip-day", limit: 10, windowMs: 24 * 60 * 60 * 1000 },
] as const;
const GLOBAL_LIMIT = { scope: "global", limit: 50, windowMs: 60 * 60 * 1000 } as const;

function tooMany(rl: { limit: number; resetIn: number }) {
  return json({ error: "Too many messages. Please try again later." }, 429, {
    "Retry-After": String(rl.resetIn),
    "RateLimit-Limit": String(rl.limit),
    "RateLimit-Remaining": "0",
    "RateLimit-Reset": String(rl.resetIn),
  });
}

const NO_STORE = { "Cache-Control": "no-store" };

function json(body: unknown, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  // Browsers always send Origin on a cross-site POST; non-browser clients may
  // omit it and are handled by the rate limiter instead.
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return !!host && new URL(origin).host === host;
  } catch {
    return false;
  }
}

let resend: Resend | null = null;
function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function POST(req: Request) {
  try {
    if (!isSameOrigin(req)) return json({ error: "Forbidden" }, 403);

    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("application/json")) {
      return json({ error: "Unsupported content type" }, 415);
    }

    const declaredLength = Number(req.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return json({ error: "Payload too large" }, 413);
    }

    // Rate limit before doing any real work.
    const ip = getClientIp(req.headers);
    for (const { scope, limit, windowMs } of IP_LIMITS) {
      const rl = await rateLimit(`contact:${scope}:${ip}`, limit, windowMs);
      if (!rl.allowed) return tooMany(rl);
    }

    // Read with a hard cap (Content-Length can be missing or wrong).
    const raw = await req.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
      return json({ error: "Payload too large" }, 413);
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const parsed = ContactSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return json({ error: issue?.message ?? "Invalid input" }, 400);
    }
    const { fullName, email, message, website } = parsed.data;

    // Honeypot filled: pretend success so bots don't learn anything.
    if (website && website.trim() !== "") {
      return json({ ok: true }, 200);
    }

    const globalRl = await rateLimit(
      `contact:${GLOBAL_LIMIT.scope}`,
      GLOBAL_LIMIT.limit,
      GLOBAL_LIMIT.windowMs
    );
    if (!globalRl.allowed) return tooMany(globalRl);

    const client = getResend();
    if (!client) {
      console.error("[contact] RESEND_API_KEY is not set");
      return json({ error: "Email service unavailable" }, 503);
    }

    const { error: resendError } = await client.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [config.email],
      replyTo: email,
      subject: "Contact me from portfolio",
      // React escapes every value, so user input can't inject HTML.
      react: EmailTemplate({ fullName, email, message }),
    });

    if (resendError) {
      console.error("[contact] Resend error:", resendError.name);
      return json({ error: "Could not send message" }, 502);
    }

    return json({ ok: true }, 200);
  } catch {
    console.error("[contact] Unexpected error");
    return json({ error: "Something went wrong" }, 500);
  }
}
