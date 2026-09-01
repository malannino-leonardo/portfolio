export type ResumeLocale = "en" | "it";

export interface ResumeDataLocalized {
  personal: {
    name: string;
    title: string;
    tagline: string;
    bio: string;
    email: string;
    location: string;
    drivingLicense: string;
    drivingLicenseLabel: string;
    summaryTitle: string;
    status: string;
    avatar: string;
    social: {
      github: string;
      linkedin: string;
      twitter: string;
      instagram: string;
      portfolio: string;
    };
  };
  labels: {
    skillsTitle: string;
    experienceTitle: string;
    educationTitle: string;
    certificationsTitle: string;
    communicationSkillsLabel: string;
    communicationSkillsDesc: string;
    toolsLabel: string;
    frontendLabel: string;
    backendLabel: string;
    animationsLabel: string;
    backToPortfolio: string;
    copyEmail: string;
    copiedEmail: string;
    downloadPdf: string;
    contactForm: string;
    privacyClause: string;
  };
  skills: {
    category: "tools" | "frontend" | "backend" | "animations";
    categoryLabel: string;
    items: {
      name: string;
      label: string;
    }[];
  }[];
  experiences: {
    id: string;
    title: string;
    company: string;
    companyType: string;
    period: string;
    location: string;
    summary: string;
    achievements: string[];
  }[];
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    period: string;
    location: string;
    description: string;
    highlights: string[];
  }[];
  certifications: {
    id: string;
    title: string;
    level: string;
    description: string;
  }[];
}

export type ResumeData = ResumeDataLocalized;

export const resumeDataByLocale: Record<ResumeLocale, ResumeDataLocalized> = {
  en: {
    personal: {
      name: "Leonardo Malannino",
      title: "Full-Stack Developer",
      tagline: "Full-stack developer specializing in TypeScript, Next.js, and AI-assisted workflows.",
      bio: "Full-stack developer building web applications with TypeScript, React, Next.js, and Node.js. I handle end-to-end implementation from database modeling in PostgreSQL and Supabase to responsive, accessible frontends with Tailwind CSS. My workflow integrates agentic AI tools directly inside the IDE to accelerate prototyping, test coverage, and feature delivery.",
      email: "leonardo.malannino@gmail.com",
      location: "Friuli-Venezia-Giulia, Italy",
      drivingLicense: "Category B",
      drivingLicenseLabel: "Driving license",
      summaryTitle: "Professional Summary",
      status: "Available for freelance & collaborative projects",
      avatar: "/assets/me.jpg",
      social: {
        github: "https://github.com/malannino-leonardo",
        linkedin: "https://www.linkedin.com/in/leonardo-malannino-0b5160341/",
        twitter: "https://x.com/Cronixey",
        instagram: "https://instagram.com/leonardo.malannino",
        portfolio: "https://malannino-leonardo.vercel.app",
      },
    },
    labels: {
      skillsTitle: "Skills",
      experienceTitle: "Experience",
      educationTitle: "Education",
      certificationsTitle: "Certifications",
      communicationSkillsLabel: "Communication skills",
      communicationSkillsDesc:
        "Good communication and teamwork skills developed through years of school, freelance client relations, and collaborative online projects.",
      toolsLabel: "Tools & Deployment",
      frontendLabel: "Frontend",
      backendLabel: "Backend & Databases",
      animationsLabel: "Animations & 3D",
      backToPortfolio: "Back to Portfolio",
      copyEmail: "Copy Email",
      copiedEmail: "Email Copied!",
      downloadPdf: "Download PDF",
      contactForm: "Contact Form",
      privacyClause:
        "I authorize the processing of my personal data pursuant to D. Lgs. 196/2003 and GDPR (EU 2016/679).",
    },
    skills: [
      {
        category: "tools",
        categoryLabel: "Tools & Deployment",
        items: [
          { name: "github", label: "GitHub" },
          { name: "git", label: "Git" },
          { name: "vscode", label: "VS Code" },
          { name: "antigravity", label: "Antigravity" },
          { name: "claude-code", label: "Claude Code" },
          { name: "copilot", label: "GitHub Copilot" },
          { name: "xampp", label: "XAMPP" },
          { name: "vercel", label: "Vercel" },
          { name: "netlify", label: "Netlify" },
        ],
      },
      {
        category: "frontend",
        categoryLabel: "Frontend",
        items: [
          { name: "html5", label: "HTML" },
          { name: "css3", label: "CSS" },
          { name: "javascript", label: "JavaScript" },
          { name: "react", label: "React" },
          { name: "nextjs", label: "Next.js" },
          { name: "typescript", label: "TypeScript" },
          { name: "tailwindcss", label: "Tailwind CSS" },
        ],
      },
      {
        category: "backend",
        categoryLabel: "Backend & Databases",
        items: [
          { name: "php", label: "PHP" },
          { name: "mysql", label: "MySQL" },
          { name: "postgresql", label: "PostgreSQL" },
          { name: "nodejs", label: "Node.js" },
          { name: "supabase", label: "Supabase" },
          { name: "prisma", label: "Prisma" },
          { name: "apache", label: "Apache" },
        ],
      },
      {
        category: "animations",
        categoryLabel: "Animations & 3D",
        items: [
          { name: "python", label: "Python" },
          { name: "pyopengl", label: "PyOpenGL" },
          { name: "pygame", label: "PyGame" },
          { name: "spline", label: "Spline" },
        ],
      },
    ],
    experiences: [
      {
        id: "hyrise-studios",
        title: "Freelance Full-Stack Developer",
        company: "Hyrise Studios",
        companyType: "Freelancer studio",
        period: "SEP 2025 – PRESENT",
        location: "Friuli-Venezia-Giulia, Italy",
        summary:
          "Development and maintenance of modern web applications with a focus on end-user experience and graphic design. Deeply integrated artificial intelligence into the workflow, utilizing advanced AI agents directly within the IDE to maximize efficiency and code quality.",
        achievements: [
          "Custom high-performance web applications using Next.js, React, TypeScript, and modern styling solutions.",
          "Integration of AI coding assistants within the IDE environment to accelerate feature delivery.",
          "Refined collaborative and client communication skills, translating complex project requirements into scalable, clean, and intuitive user interfaces.",
          "Integration of backend APIs and databases using Supabase, Node.js, and PostgreSQL for real-time interactivity.",
        ],
      },
      {
        id: "ublox-spa",
        title: "IT Support & Networking Intern",
        company: "u-blox S.p.A.",
        companyType: "Corporate IoT & Wireless Semiconductor Leader",
        period: "JUL 2024 – AUG 2024",
        location: "Sgonico (TS), Italy",
        summary:
          "School internship focused on networking and IT support, getting hands-on experience in a corporate environment. I assisted in configuring network devices and maintaining network infrastructure.",
        achievements: [
          "Hands-on experience in a high-tech corporate environment assisting the IT infrastructure team.",
          "Enterprise network hardware devices configuration and network infrastructure monitoring.",
          "Hardware, software, and connectivity troubleshooting for on-site corporate employees.",
          "Practical understanding of cybersecurity measures, access controls, and network protocol topologies.",
        ],
      },
      {
        id: "school-developer",
        title: "Student Developer & Project Collaborator",
        company: "I.S.I.S. “Brignoli-Einaudi-Marconi”",
        companyType: "Technical Institute",
        period: "SEP 2021 – PRESENT",
        location: "Staranzano (GO), Italy",
        summary:
          "Development of responsive and optimized user interfaces for web applications. Collaboration with design teams to implement high-quality UI/UX.",
        achievements: [
          "Full-featured web applications incorporating front-to-back database connectivity, authentication, and responsive design.",
          "Team projects to design, prototype, and implement academic software solutions.",
          "Foundational programming concepts in C++, Python, PHP, and modern JavaScript/TypeScript.",
        ],
      },
    ],
    education: [
      {
        id: "isis-bem",
        institution: "I.T.T. Guglielmo Marconi",
        degree: "Technical Diploma",
        field: "Information Technology and Telecommunications",
        period: "SEP 2021 – JUN 2026",
        location: "Staranzano (GO), Italy",
        description:
          "Through my studies, I have gained experience in building secure, responsive web applications and collaborating effectively within team-based projects.",
        highlights: [
          "Hands-on coursework in secure web application development, database management systems (SQL), and object-oriented programming.",
          "Network design, switching & routing protocols, network security, and telecommunications theory.",
          "Emphasis on collaborative group projects, code reviews, and practical lab assignments.",
        ],
      },
    ],
    certifications: [
      {
        id: "cambridge-b2",
        title: "English B2 – Cambridge First Certificate",
        level: "CEFR B2 Upper-Intermediate",
        description:
          "Demonstrates the linguistic competence to communicate fluently and effectively in professional and international technical settings.",
      },
      {
        id: "cisco-ite",
        title: "Cisco ITE – IT Essentials",
        level: "Foundational",
        description:
          "Entry-level certificate that validates the ability to build, secure, and troubleshoot computer hardware, software, and basic networks.",
      },
      {
        id: "cisco-ccna",
        title: "Cisco CCNA – Introduction to Networks",
        level: "Intermediate",
        description:
          "Intermediate-level certification that validates the ability to install, configure, and manage advanced switched and routed networks using industry-standard protocols.",
      },
      {
        id: "icdl-full",
        title: "ICDL – Full Standard",
        level: "International Standard",
        description:
          "A comprehensive, internationally recognized certification that proves the mastery of essential digital skills, ranging from office productivity applications to online security and collaboration.",
      },
    ],
  },
  it: {
    personal: {
      name: "Leonardo Malannino",
      title: "Sviluppatore Full-Stack",
      tagline: "Sviluppatore full-stack specializzato in TypeScript, Next.js e workflow assistiti da AI.",
      bio: "Sviluppatore full-stack specializzato nella realizzazione di applicazioni web con TypeScript, React, Next.js e Node.js. Mi occupo dell'intero ciclo di sviluppo: dalla modellazione dei database con PostgreSQL e Supabase fino alla creazione di interfacce responsive e accessibili con Tailwind CSS. Integro agenti AI direttamente nell'IDE per velocizzare la prototipazione, i test e il rilascio del codice.",
      email: "leonardo.malannino@gmail.com",
      location: "Friuli-Venezia Giulia, Italia",
      drivingLicense: "Patente B",
      drivingLicenseLabel: "Patente di guida",
      summaryTitle: "Profilo Professionale",
      status: "Disponibile per progetti freelance e collaborazioni",
      avatar: "/assets/me.jpg",
      social: {
        github: "https://github.com/malannino-leonardo",
        linkedin: "https://www.linkedin.com/in/leonardo-malannino-0b5160341/",
        twitter: "https://x.com/Cronixey",
        instagram: "https://instagram.com/leonardo.malannino",
        portfolio: "https://malannino-leonardo.vercel.app",
      },
    },
    labels: {
      skillsTitle: "Competenze",
      experienceTitle: "Esperienza",
      educationTitle: "Istruzione",
      certificationsTitle: "Certificazioni",
      communicationSkillsLabel: "Competenze comunicative",
      communicationSkillsDesc:
        "Buone capacità comunicative e di lavoro in team sviluppate nel corso degli anni scolastici e in progetti collaborativi online.",
      toolsLabel: "Strumenti & Deployment",
      frontendLabel: "Frontend",
      backendLabel: "Backend & Database",
      animationsLabel: "Animazioni & 3D",
      backToPortfolio: "Torna al Portfolio",
      copyEmail: "Copia Email",
      copiedEmail: "Email Copiata!",
      downloadPdf: "Scarica PDF",
      contactForm: "Modulo di Contatto",
      privacyClause:
        "Autorizzo il trattamento dei miei dati personali ai sensi del Dlgs. 196 del 30 giugno 2003 e dell'art. 13 GDPR (Regolamento UE 2016/679).",
    },
    skills: [
      {
        category: "tools",
        categoryLabel: "Strumenti & Deployment",
        items: [
          { name: "github", label: "GitHub" },
          { name: "git", label: "Git" },
          { name: "vscode", label: "VS Code" },
          { name: "antigravity", label: "Antigravity" },
          { name: "claude-code", label: "Claude Code" },
          { name: "copilot", label: "GitHub Copilot" },
          { name: "xampp", label: "XAMPP" },
          { name: "vercel", label: "Vercel" },
          { name: "netlify", label: "Netlify" },
        ],
      },
      {
        category: "frontend",
        categoryLabel: "Frontend",
        items: [
          { name: "html5", label: "HTML" },
          { name: "css3", label: "CSS" },
          { name: "javascript", label: "JavaScript" },
          { name: "react", label: "React" },
          { name: "nextjs", label: "Next.js" },
          { name: "typescript", label: "TypeScript" },
          { name: "tailwindcss", label: "Tailwind CSS" },
        ],
      },
      {
        category: "backend",
        categoryLabel: "Backend & Database",
        items: [
          { name: "php", label: "PHP" },
          { name: "mysql", label: "MySQL" },
          { name: "postgresql", label: "PostgreSQL" },
          { name: "nodejs", label: "Node.js" },
          { name: "supabase", label: "Supabase" },
          { name: "prisma", label: "Prisma" },
          { name: "apache", label: "Apache" },
        ],
      },
      {
        category: "animations",
        categoryLabel: "Animazioni & 3D",
        items: [
          { name: "python", label: "Python" },
          { name: "pyopengl", label: "PyOpenGL" },
          { name: "pygame", label: "PyGame" },
          { name: "spline", label: "Spline" },
        ],
      },
    ],
    experiences: [
      {
        id: "hyrise-studios",
        title: "Sviluppatore Full-Stack Freelance",
        company: "Hyrise Studios",
        companyType: "Studio Freelance",
        period: "SET 2025 – PRESENTE",
        location: "Friuli-Venezia Giulia, Italia",
        summary:
          "Sviluppo e manutenzione di moderne applicazioni web con particolare attenzione per l’esperienza dell’utente finale e per il design grafico. Ho integrato profondamente l’intelligenza artificiale nel mio processo di lavoro, sfruttando agenti AI avanzati direttamente all’interno del mio IDE per massimizzare l’efficienza e la qualità del codice.",
        achievements: [
          "Progettazione e sviluppo di siti web moderni, veloci e completamente responsive.",
          "Integrazione di agenti AI nell'IDE di sviluppo.",
          "Collaborazione con i clienti per comprendere le loro esigenze e sviluppare soluzioni su misura.",
          "Integrazione di database relazionali e API sicure.",
        ],
      },
      {
        id: "ublox-spa",
        title: "Tirocinio IT Support & Networking",
        company: "u-blox S.p.A.",
        companyType: "Azienda Leader nel settore IoT e Semiconduttori Wireless",
        period: "LUG 2024 – AGO 2024",
        location: "Sgonico (TS), Italia",
        summary:
          "Tirocinio scolastico focalizzato sul networking e sul supporto IT, con esperienza pratica in un ambiente aziendale strutturato. Ho fornito assistenza nella configurazione dei dispositivi di rete e nel mantenimento dell'infrastruttura di rete.",
        achievements: [
          "Esperienza pratica in un ambiente aziendale ad alta tecnologia a supporto del reparto IT.",
          "Configurazione di apparati di rete aziendali e monitoraggio delle performance di rete.",
          "Approfondimento delle tematiche di cybersecurity, policy di accesso e connettività sicura.",
        ],
      },
      {
        id: "school-developer",
        title: "Sviluppatore Studente & Progetti",
        company: "I.S.I.S. “Brignoli-Einaudi-Marconi”",
        companyType: "Istituto Tecnico",
        period: "SET 2021 – GIU 2026",
        location: "Staranzano (GO), Italia",
        summary:
          "Sviluppo di interfacce utente responsive e ottimizzate per applicazioni web. Progetti scolastici in team orientati al problem-solving e all'innovazione tecnologica.",
        achievements: [
          "Sviluppo di applicazioni web",
          "Database MySQL/PostgreSQL e architetture client-server",
          "Collaborazione in team per la progettazione e implementazione di progetti accademici",
          "Solida comprensione dei linguaggi C++, HTML, CSS, JavaScript, Python, PHP e MySQL",
        ],
      },
    ],
    education: [
      {
        id: "isis-bem",
        institution: "I.T.T. Guglielmo Marconi",
        degree: "Diploma di Istruzione Tecnica",
        field: "Informatica e Telecomunicazioni",
        period: "SET 2021 – GIU 2026",
        location: "Staranzano (GO), Italia",
        description:
          "Durante il mio percorso di studi, ho maturato esperienza nella creazione di applicazioni web sicure e responsive e nella collaborazione efficace all'interno di progetti di gruppo.",
        highlights: [
          "Formazione completa in sviluppo web, programmazione orientata agli oggetti, architettura di database relazionali e sicurezza informatica.",
          "Progettazione di reti di computer, protocolli di switching e routing Cisco e sistemi di telecomunicazione.",
          "Attività pratiche di laboratorio e progetti collaborativi orientati al problem-solving.",
        ],
      },
    ],
    certifications: [
      {
        id: "cambridge-b2",
        title: "English B2 – Cambridge First Certificate",
        level: "QCER B2 Intermedio-Superiore",
        description:
          "Certificazione linguistica che attesta la capacità di comunicare fluentemente ed efficacemente in contesti professionali e internazionali.",
      },
      {
        id: "cisco-ite",
        title: "Cisco ITE – IT Essentials",
        level: "Livello Base",
        description:
          "Certificato entry-level che convalida la capacità di assemblare, proteggere e risolvere problemi relativi a hardware, software e reti di base per computer.",
      },
      {
        id: "cisco-ccna",
        title: "Cisco CCNA – Introduction to Networks",
        level: "Livello Intermedio",
        description:
          "Certificazione di livello intermedio che convalida la capacità di installare, configurare e gestire reti avanzate commutate e instradate utilizzando protocolli standard di settore.",
      },
      {
        id: "icdl-full",
        title: "ICDL – Full Standard",
        level: "Standard Internazionale",
        description:
          "Una certificazione completa e riconosciuta a livello internazionale che attesta la padronanza delle competenze digitali essenziali, dalla produttività d'ufficio alla sicurezza online e alla collaborazione.",
      },
    ],
  },
};

// Default export for backward compatibility
export const resumeData = resumeDataByLocale.en;
