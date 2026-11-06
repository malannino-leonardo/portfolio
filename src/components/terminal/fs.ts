import { resumeDataByLocale } from "@/data/resume";
import projects from "@/data/projects";
import { config } from "@/data/config";

/** Virtual, read-only filesystem built from the portfolio data. */
export type FsNode =
  | { type: "dir"; children: Record<string, FsNode> }
  | { type: "file"; text: string; url?: string; binary?: boolean };

const R = resumeDataByLocale.en;
const P = R.personal;

export const HOME = "/home/leonardo";

const file = (text: string, extra: Partial<Extract<FsNode, { type: "file" }>> = {}): FsNode => ({
  type: "file",
  text,
  ...extra,
});
const dir = (children: Record<string, FsNode>): FsNode => ({ type: "dir", children });
const lines = (...l: (string | false | undefined)[]) => l.filter((x) => x !== false && x !== undefined).join("\n");

function build(): FsNode {
  const experience: Record<string, FsNode> = {};
  R.experiences.forEach((e) => {
    experience[`${e.id}.md`] = file(
      lines(
        `# ${e.title}`,
        `${e.company} — ${e.companyType}`,
        `${e.period} · ${e.location}`,
        "",
        e.summary,
        "",
        ...e.achievements.map((a) => `- ${a}`)
      )
    );
  });

  const education: Record<string, FsNode> = {};
  R.education.forEach((e) => {
    education[`${e.id}.md`] = file(
      lines(
        `# ${e.degree}, ${e.field}`,
        `${e.institution} · ${e.location}`,
        e.period,
        "",
        e.description,
        "",
        ...e.highlights.map((h) => `- ${h}`)
      )
    );
  });

  const skills: Record<string, FsNode> = {};
  R.skills.forEach((s) => {
    skills[`${s.category}.txt`] = file(lines(`# ${s.categoryLabel}`, ...s.items.map((i) => `- ${i.label}`)));
  });

  const proj: Record<string, FsNode> = {};
  projects.forEach((p, i) => {
    const stack = Array.from(
      new Set([...p.skills.frontend, ...p.skills.backend].map((s) => s.title))
    ).join(", ");
    proj[`${p.id}.md`] = file(
      lines(
        `# ${p.title}`,
        p.category,
        "",
        `stack:  ${stack}`,
        p.live && `live:   ${p.live}`,
        p.github && `source: ${p.github}`,
        !p.live && !p.github && "no public links for this one.",
        "",
        `(project ${i + 1} of ${projects.length})`
      ),
      { url: p.live || p.github || undefined }
    );
  });

  const certs: Record<string, FsNode> = {};
  R.certifications.forEach((c) => {
    certs[`${c.id}.md`] = file(lines(`# ${c.title}`, c.level, "", c.description));
  });

  const link = (url: string) => file(url, { url });
  const contact: Record<string, FsNode> = {
    "email.txt": file(P.email, { url: `mailto:${P.email}` }),
    "github.url": link(config.social.github),
    "linkedin.url": link(config.social.linkedin),
    "twitter.url": link(config.social.twitter),
    "instagram.url": link(config.social.instagram),
    "form.url": file("/#contact", { url: "/#contact" }),
  };

  const home = dir({
    "README.md": file(
      lines(
        `# ${P.name} — ${P.title}`,
        `${P.location}`,
        "",
        `status: ${P.status}`,
        "",
        "This is my portfolio as a filesystem. Everything is a folder or a file:",
        "",
        "- ls              list what is here",
        "- cd projects     walk into a folder",
        "- cat about.txt   read a file",
        "- open <file>     open a file or link",
        "- help            every available command"
      )
    ),
    "about.txt": file(lines(P.bio, "", R.labels.communicationSkillsDesc)),
    "status.txt": file(P.status),
    "resume.pdf": file("%PDF-1.7 ...binary...", {
      binary: true,
      url: "/assets/resume/Resume_Leonardo_Malannino.pdf",
    }),
    experience: dir(experience),
    education: dir(education),
    skills: dir(skills),
    projects: dir(proj),
    certifications: dir(certs),
    contact: dir(contact),
  });

  return dir({ home: dir({ leonardo: home }) });
}

export const ROOT: FsNode = build();

/** Resolve `p` against `cwd` into absolute path segments. */
export function resolveSegments(cwd: string, p: string): string[] {
  let path = p || ".";
  if (path === "~" || path.startsWith("~/")) path = HOME + path.slice(1);
  const abs = path.startsWith("/") ? path : `${cwd}/${path}`;
  const out: string[] = [];
  for (const seg of abs.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return out;
}

export const toPath = (segs: string[]) => "/" + segs.join("/");

export function getNode(segs: string[]): FsNode | null {
  let n: FsNode = ROOT;
  for (const s of segs) {
    if (n.type !== "dir" || !n.children[s]) return null;
    n = n.children[s];
  }
  return n;
}

export function lookup(cwd: string, p: string) {
  const segs = resolveSegments(cwd, p);
  return { segs, path: toPath(segs), node: getNode(segs) };
}

/** `/home/leonardo/projects` -> `~/projects` */
export function display(path: string) {
  if (path === HOME) return "~";
  if (path.startsWith(HOME + "/")) return "~" + path.slice(HOME.length);
  return path;
}

export const sizeOf = (n: FsNode) => (n.type === "file" ? n.text.length : 4096);

/** Walk every file under `path` (depth first, sorted). */
export function walk(path: string, node: FsNode, cb: (path: string, node: FsNode) => void) {
  cb(path, node);
  if (node.type === "dir") {
    Object.keys(node.children)
      .sort()
      .forEach((k) => walk(`${path === "/" ? "" : path}/${k}`, node.children[k], cb));
  }
}
