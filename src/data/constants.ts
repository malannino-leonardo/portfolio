export enum SkillNames {
  JS = "js",
  TS = "ts",
  HTML = "html",
  CSS = "css",
  REACT = "react",
  VUE = "vue",
  NEXTJS = "nextjs",
  TAILWIND = "tailwind",
  NODEJS = "nodejs",
  POSTGRES = "postgres",
  GIT = "git",
  GITHUB = "github",
  NPM = "npm",
  XAMPP = "xampp",
  VERCEL = "vercel",
  PYTHON = "python",
  PHP = "php",
  MYSQL = "mysql",
  CPP = "cpp",
  JSON = "json",
  NETLIFY = "netlify",
  VSCODE = "vscode",
  SUPABASE = "supabase",
  APACHE = "apache",
  CISCO = "cisco",
}
export type Skill = {
  id: number;
  name: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
};
export const SKILLS: Record<SkillNames, Skill> = {
  [SkillNames.JS]: {
    id: 1,
    name: "js",
    label: "JavaScript",
    shortDescription:
      "Versatile programming language for building interactive web applications.",
    color: "#f0db4f",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  [SkillNames.TS]: {
    id: 2,
    name: "ts",
    label: "TypeScript",
    shortDescription:
      "Strongly typed superset of JavaScript for reliable web development.",
    color: "#007acc",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  [SkillNames.HTML]: {
    id: 3,
    name: "html",
    label: "HTML",
    shortDescription:
      "Standard markup language for web page structure and content.",
    color: "#e34c26",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  [SkillNames.CSS]: {
    id: 4,
    name: "css",
    label: "CSS",
    shortDescription: "Style sheet language for web presentation and design.",
    color: "#563d7c",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  [SkillNames.REACT]: {
    id: 5,
    name: "react",
    label: "React",
    shortDescription:
      "Popular library for building component-based user interfaces.",
    color: "#61dafb",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  [SkillNames.VUE]: {
    id: 6,
    name: "vue",
    label: "Vue",
    shortDescription:
      "Progressive framework for building modern user interfaces.",
    color: "#41b883",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  },
  [SkillNames.NEXTJS]: {
    id: 7,
    name: "nextjs",
    label: "Next.js",
    shortDescription:
      "React framework for server-side rendering and static sites.",
    color: "#fff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  [SkillNames.TAILWIND]: {
    id: 8,
    name: "tailwind",
    label: "Tailwind",
    shortDescription: "Utility-first CSS framework for rapid UI development.",
    color: "#38bdf8",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  [SkillNames.NODEJS]: {
    id: 9,
    name: "nodejs",
    label: "Node.js",
    shortDescription:
      "JavaScript runtime for executing code outside the browser.",
    color: "#6cc24a",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  [SkillNames.POSTGRES]: {
    id: 10,
    name: "postgres",
    label: "PostgreSQL",
    shortDescription: "Robust open-source relational database system.",
    color: "#336791",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  [SkillNames.GIT]: {
    id: 11,
    name: "git",
    label: "Git",
    shortDescription: "Distributed version control system for code tracking.",
    color: "#f1502f",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  [SkillNames.GITHUB]: {
    id: 12,
    name: "github",
    label: "GitHub",
    shortDescription:
      "Collaborative platform for version control and development.",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  [SkillNames.NPM]: {
    id: 13,
    name: "npm",
    label: "NPM",
    shortDescription: "Software registry used for managing JavaScript packages.",
    color: "#fff",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg",
  },
  [SkillNames.XAMPP]: {
    id: 14,
    name: "xampp",
    label: "XAMPP",
    shortDescription:
      "Local development stack with Apache, MariaDB, and PHP.",
    color: "#fb7300",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/xampp.svg",
  },
  [SkillNames.VERCEL]: {
    id: 16,
    name: "vercel",
    label: "Vercel",
    shortDescription:
      "Cloud platform for performant static and serverless apps.",
    color: "#6cc24a",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  },
  [SkillNames.PYTHON]: {
    id: 17,
    name: "python",
    label: "Python",
    shortDescription:
      "Versatile language known for readability and extensive libraries.",
    color: "#3776AB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  [SkillNames.PHP]: {
    id: 18,
    name: "php",
    label: "PHP",
    shortDescription: "Widely-used scripting language for web development.",
    color: "#777BB4",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
  },
  [SkillNames.MYSQL]: {
    id: 19,
    name: "mysql",
    label: "MySQL",
    shortDescription: "Open-source relational database for web applications.",
    color: "#4479A1",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  [SkillNames.CPP]: {
    id: 20,
    name: "cpp",
    label: "C++",
    shortDescription:
      "High-performance language for system and game development.",
    color: "#00599C",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  [SkillNames.JSON]: {
    id: 21,
    name: "json",
    label: "JSON",
    shortDescription:
      "Lightweight and human-readable data-interchange format.",
    color: "#000000",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/json/json-original.svg",
  },
  [SkillNames.NETLIFY]: {
    id: 22,
    name: "netlify",
    label: "Netlify",
    shortDescription: "Platform for automated web deployment and hosting.",
    color: "#00C7B7",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg",
  },
  [SkillNames.VSCODE]: {
    id: 23,
    name: "vscode",
    label: "VS Code",
    shortDescription: "Extensible, cross-platform code editor by Microsoft.",
    color: "#007ACC",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
  [SkillNames.SUPABASE]: {
    id: 24,
    name: "supabase",
    label: "Supabase",
    shortDescription: "Open-source platform for backend-as-a-service.",
    color: "#3ECF8E",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
  },
  [SkillNames.APACHE]: {
    id: 25,
    name: "apache",
    label: "Apache",
    shortDescription: "Reliable HTTP server for web infrastructure.",
    color: "#D22128",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg",
  },
  [SkillNames.CISCO]: {
    id: 26,
    name: "cisco",
    label: "Cisco",
    shortDescription: "Networking technology and digital infrastructure leader.",
    color: "#1BA0E2",
    icon: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/cisco-icon.svg",
  },
};

export type Experience = {
  id: number;
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  description: string[];
  skills: SkillNames[];
};

export const EXPERIENCE: Experience[] = [
  {
    id: 1,
    startDate: "Sep 2025",
    endDate: "Present",
    title: "Freelancer Full Stack Developer",
    company: "Hyrise Studios",
    description: [
      "Freelance full stack web development, creating dynamic and responsive websites for clients across various industries.",
      "Collaborated with clients to understand their needs and deliver custom solutions that exceeded expectations.",
      "Implemented modern web technologies to build scalable and efficient applications.",
    ],
    skills: [
      SkillNames.REACT,
      SkillNames.HTML,
      SkillNames.CSS,
      SkillNames.TAILWIND,
      SkillNames.JS,
      SkillNames.NODEJS,
      SkillNames.PHP,
      SkillNames.MYSQL,
      SkillNames.XAMPP,
      SkillNames.GITHUB,
      SkillNames.GIT,
      SkillNames.JSON,
      SkillNames.VSCODE,
      SkillNames.SUPABASE,
      SkillNames.VERCEL,
      SkillNames.TS,
      SkillNames.POSTGRES,
      SkillNames.VUE,
      SkillNames.NEXTJS,
      SkillNames.XAMPP,
      SkillNames.NPM,
      SkillNames.NETLIFY,
    ],
  },
  {
    id: 2,
    startDate: "Jul 2024",
    endDate: "Aug 2024",
    title: "Internship Networking",
    company: "U-Blox Italy s.p.a.",
    description: [
      "School internship focused on networking and IT support, gaining hands-on experience in a corporate environment.",
      "Provided technical support to employees, resolving hardware and software issues efficiently.", 
      "Implemented cybersecurity solutions to protect company data.",
      "Assisted in configuring network devices and maintaining network infrastructure.",
    ],
    skills: [
      SkillNames.CISCO,
    ],
  },
  {
    id: 3,
    startDate: "Sep 2021",
    endDate: "Present",
    title: "Student Developer",
    company: "I.S.I.S. Brignoli Einaudi Marconi",
    description: [
      "Development of responsive and optimized user interfaces for web applications.",
      "Collaboration with design teams to implement high-quality UI/UX.",
    ],
    skills: [
      SkillNames.HTML,
      SkillNames.CSS,
      SkillNames.JS,
      SkillNames.NODEJS,
      SkillNames.PHP,
      SkillNames.MYSQL,
      SkillNames.XAMPP,
      SkillNames.GITHUB,
      SkillNames.GIT,
      SkillNames.CPP,
      SkillNames.PYTHON,
      SkillNames.JSON,
      SkillNames.VSCODE,
    ],
  },
];

export const themeDisclaimers = {
  light: [
    "Warning: Light mode emits a gazillion lumens of pure radiance!",
    "Caution: Light mode ahead! Please don't try this at home.",
    "Only trained professionals can handle this much brightness. Proceed with sunglasses!",
    "Brace yourself! Light mode is about to make everything shine brighter than your future.",
    "Flipping the switch to light mode... Are you sure your eyes are ready for this?",
  ],
  dark: [
    "Light mode? I thought you went insane... but welcome back to the dark side!",
    "Switching to dark mode... How was life on the bright side?",
    "Dark mode activated! Thanks you from the bottom of my heart, and my eyes too.",
    "Welcome back to the shadows. How was life out there in the light?",
    "Dark mode on! Finally, someone who understands true sophistication.",
  ],
};

