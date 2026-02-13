const config = {
  title: "Leonardo Malannino | Full-Stack Developer",
  description: {
    long: "Explore the portfolio of Leonardo, a full-stack developer specializing in creating interactive web experiences and innovative projects. From 3D animations to dynamic websites, discover a showcase of creativity and technical expertise.",
    short:
      "Discover the portfolio of Leonardo, a full-stack developer creating interactive web experiences and innovative projects.",
  },
  keywords: [
    "Leonardo",
    "portfolio",
    "full-stack developer",
    "creative technologist",
    "web development",
    "3D animations",
    "interactive websites",
    "Coding Ducks",
    "The Booking Desk",
    "Ghostchat",
    "web design",
    "GSAP",
    "React",
    "Next.js",
    "Spline",
    "Framer Motion",
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
