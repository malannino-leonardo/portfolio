const config = {
  title: "Leonardo Malannino | Full-Stack Developer",
  description: {
    long: "Full-stack developer, handling everything from planning, implementing and maintaining software. I have experience with web development, database design and implementation, and much more.",
    short:
      "Full-stack developer, handling everything from planning, implementing and maintaining software.",
  },
  keywords: [
    "Leonardo",
    "portfolio",
    "full-stack developer",
    "creative technologist",
    "web development",
    "3D animations",
    "interactive websites",
    "web design",
    "Hyrise",
    "Hyrise Studios",
    "React",
    "Next.js",
    "Spline",
    "HTML",
    "CSS",
    "JavaScript",
  ],
  author: "Leonardo Malannino",
  email: "leonardo.malannino@gmail.com",
  site: "https://malannino-leonardo.vercel.app",

  // for github stars button
  githubUsername: "malannino-leonardo",
  githubRepo: "portfolio",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "https://x.com/Cronixey",
    linkedin: "https://www.linkedin.com/in/leonardo-malannino-0b5160341/",
    instagram: "https://www.instagram.com/leonardo.malannino/",
    facebook: "https://www.facebook.com/leonardo.malannino",
    github: "https://github.com/malannino-leonardo",
  },
};
export { config };
