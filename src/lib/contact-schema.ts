import { z } from "zod";

export const CONTACT_LIMITS = {
  fullName: { min: 2, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
} as const;

/** Max raw request body size accepted by /api/send (bytes). */
export const MAX_BODY_BYTES = 16 * 1024;

// Invisible / direction-changing characters that can be used to spoof text
// (zero-width chars, bidi overrides, BOM, soft hyphen).
const INVISIBLE_RE = /[\u00AD\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF]/g;
// C0/C1 control chars except tab (\u0009) and newline (\u000A).
const CONTROL_RE = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;
// Anything that could break onto a new line (incl. Unicode line/para separators).
const LINEBREAK_RE = /[\r\n\u2028\u2029\u0085]/g;

export function cleanSingleLine(input: string): string {
  return input
    .normalize("NFC")
    .replace(INVISIBLE_RE, "")
    .replace(LINEBREAK_RE, " ")
    .replace(CONTROL_RE, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanMultiLine(input: string): string {
  return input
    .normalize("NFC")
    .replace(INVISIBLE_RE, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u2028\u2029\u0085]/g, "\n")
    .replace(CONTROL_RE, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{4,}/g, "\n\n\n")
    .trim();
}

// No markup/URL-ish characters in a person's name: blocks HTML and the classic
// "click http://evil" spam that would otherwise land in the email heading.
const NAME_FORBIDDEN_RE = /[<>{}[\]\\/@:;|`"=]|https?|www\./i;

export const ContactSchema = z
  .object({
    fullName: z
      .string()
      .max(CONTACT_LIMITS.fullName.max * 4) // pre-clean guard
      .transform(cleanSingleLine)
      .pipe(
        z
          .string()
          .min(CONTACT_LIMITS.fullName.min, "Full name is too short")
          .max(CONTACT_LIMITS.fullName.max, "Full name is too long")
          .refine((v) => !NAME_FORBIDDEN_RE.test(v), "Full name contains invalid characters")
      ),
    email: z
      .string()
      .max(CONTACT_LIMITS.email.max * 2)
      .transform((v) => cleanSingleLine(v).toLowerCase())
      .pipe(
        z
          .string()
          .max(CONTACT_LIMITS.email.max, "Email is too long")
          .email("Email is invalid")
          // Belt and braces on top of zod's check: one @, no whitespace,
          // no header/markup characters.
          .regex(/^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i, "Email is invalid")
      ),
    message: z
      .string()
      .max(CONTACT_LIMITS.message.max * 2)
      .transform(cleanMultiLine)
      .pipe(
        z
          .string()
          .min(CONTACT_LIMITS.message.min, "Message is too short")
          .max(CONTACT_LIMITS.message.max, "Message is too long")
      ),
    // Honeypot: hidden in the UI, real users leave it empty.
    website: z.string().max(200).optional(),
  })
  .strict();

export type ContactInput = z.infer<typeof ContactSchema>;
