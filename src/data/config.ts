const config = {
  title: "Leonardo Malannino | Full-Stack Developer",
  description: {
    long: "Explore the portfolio of Leonardo, a full-stack developer and creative technologist specializing in interactive web experiences, 3D animations, and innovative projects. Discover my latest work, including Coding Ducks, The Booking Desk, Ghostchat, and more. Let's build something amazing together!",
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
  site: "https://nareshkhatri.site",

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
