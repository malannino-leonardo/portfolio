import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill } from "react-icons/ri";
import {
  SiChakraui,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReactquery,
  SiSanity,
  SiShadcnui,
  SiSocketdotio,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVuedotjs,
  SiHtml5,
  SiCss3,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";
const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};
const PROJECT_SKILLS = {
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  chakra: {
    title: "Chakra UI",
    bg: "black",
    fg: "white",
    icon: <SiChakraui />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  python: {
    title: "Python",
    bg: "black",
    fg: "white",
    icon: <SiPython />,
  },
  prisma: {
    title: "prisma",
    bg: "black",
    fg: "white",
    icon: <SiPrisma />,
  },
  postgres: {
    title: "PostgreSQL",
    bg: "black",
    fg: "white",
    icon: <SiPostgresql />,
  },
  mongo: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
  express: {
    title: "Express",
    bg: "black",
    fg: "white",
    icon: <SiExpress />,
  },
  reactQuery: {
    title: "React Query",
    bg: "black",
    fg: "white",
    icon: <SiReactquery />,
  },
  shadcn: {
    title: "ShanCN UI",
    bg: "black",
    fg: "white",
    icon: <SiShadcnui />,
  },
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: {
    title: "Tailwind",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  docker: {
    title: "Docker",
    bg: "black",
    fg: "white",
    icon: <SiDocker />,
  },
  yjs: {
    title: "Y.js",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Y</strong>js
      </span>
    ),
  },
  firebase: {
    title: "Firebase",
    bg: "black",
    fg: "white",
    icon: <SiFirebase />,
  },
  sockerio: {
    title: "Socket.io",
    bg: "black",
    fg: "white",
    icon: <SiSocketdotio />,
  },
  js: {
    title: "JavaScript",
    bg: "black",
    fg: "white",
    icon: <SiJavascript />,
  },
  ts: {
    title: "TypeScript",
    bg: "black",
    fg: "white",
    icon: <SiTypescript />,
  },
  vue: {
    title: "Vue.js",
    bg: "black",
    fg: "white",
    icon: <SiVuedotjs />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  sanity: {
    title: "Sanity",
    bg: "black",
    fg: "white",
    icon: <SiSanity />,
  },
  spline: {
    title: "Spline",
    bg: "black",
    fg: "white",
    icon: <SiThreedotjs />,
  },
  gsap: {
    title: "GSAP",
    bg: "black",
    fg: "white",
    icon: "",
  },
  framerMotion: {
    title: "Framer Motion",
    bg: "black",
    fg: "white",
    icon: <TbBrandFramerMotion />,
  },
  supabase: {
    title: "Supabase",
    bg: "black",
    fg: "white",
    icon: <SiSupabase />,
  },
  html: {
    title: "HTML",
    bg: "black",
    fg: "white",
    icon: <SiHtml5 />,
  },
  css: {
    title: "CSS",
    bg: "black",
    fg: "white",
    icon: <SiCss3 />,
  },
};
export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};
const projects: Project[] = [
  {
    id: "rubiks-cube-simulator",
    category: "Puzzle game",
    title: "Rubik's Cube Simulator",
    src: "/assets/projects-screenshots/rubiks-cube-simulator/landing.png",
    screenshots: ["landing.png"],
    skills: {
      frontend: [
        PROJECT_SKILLS.python,
      ],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.supabase,
      ],
    },
    live: "https://giansob.itch.io/rubiks-cube-simulator",
    github: "https://github.com/soban-gianluca/Rubik-Simulator",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Rubik&apos;s Cube Simulator: Improve your solving skills and compete globally!
          </TypographyP>
          <TypographyP className="font-mono ">
            Practice solving the Rubik&apos;s Cube, learn new techniques, and compete with cubers around the world. Track your progress and work on improving your solving speed.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Menus</TypographyH3>
          <p className="font-mono mb-2">
            Browse the menus to access different game modes, customize your settings, adjust controls, and review your progress.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/rubiks-cube-simulator/main-menu.png`,
              `${BASE_PATH}/rubiks-cube-simulator/statistics.png`,
              `${BASE_PATH}/rubiks-cube-simulator/controls.png`,
              `${BASE_PATH}/rubiks-cube-simulator/achievements.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">Game modes</TypographyH3>
          <p className="font-mono mb-2">
            Whether you&apos;re a beginner or an experienced solver, there&apos;s a mode suited for you. 
            <ul className="list-disc ml-6">
              <li>
                <strong>Free play:</strong> Solve at your own pace without time constraints.
              </li>
              <li>
                <strong>Easy Mode:</strong> 5 moves scramble, ideal for learning basic techniques and understanding cube mechanics.
              </li>
              <li>
                <strong>Medium Mode:</strong> 10 moves scramble, good for practicing more advanced techniques once you&apos;ve mastered the basics.
              </li>
              <li>
                <strong>Hard Mode:</strong> Fully randomized scramble, designed for experienced solvers who want to challenge themselves and improve their speed.
              </li>
              <li>
                <strong>Limited time Mode:</strong> Solve the cube within a set time limit for an additional challenge.
              </li>
              <li>
                <strong>Limited moves Mode:</strong> Solve the cube with a limited number of moves, testing your efficiency and strategic thinking.
              </li>
              <li>
                <strong>Daily Mode:</strong> A new scramble each day, providing a consistent challenge and helping you improve over time.
              </li>
            </ul>
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/rubiks-cube-simulator/game-modes.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">Visual hints</TypographyH3>

          <p className="font-mono mb-2">
            Visual guidance to help you solve the cube. Provides step-by-step instructions, highlighting pieces to move and the necessary sequence of moves.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/rubiks-cube-simulator/hint-animation.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">Statistics</TypographyH3>

          <p className="font-mono mb-2">
            
            <ul className="list-disc ml-6">
              <li>
                <strong>Personal records:</strong> Track your best times and move counts for each game mode to monitor your progress and identify areas for improvement.
              </li>
              <li>
                <strong>Global leaderboard:</strong> Compete with solvers worldwide and see your ranking across different game modes.
              </li>
              <li>
                <strong>Daily leaderboard:</strong> Compete with other players on the daily scramble and compare your performance against others on the same challenge.
              </li>
            </ul>
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/rubiks-cube-simulator/personal-records.png`,
              `${BASE_PATH}/rubiks-cube-simulator/global-leaderboard.png`,
              `${BASE_PATH}/rubiks-cube-simulator/daily-leaderboard.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "hyrise-studio",
    category: "Freelancer Platform",
    title: "Hyrise Studio",
    src: "/assets/projects-screenshots/hyrise-studio/landing.png",
    screenshots: ["landing.png"],
    live: "",
    skills: {
      frontend: [
        PROJECT_SKILLS.react,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.js,
        PROJECT_SKILLS.ts,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.prisma,
        PROJECT_SKILLS.postgres,
        PROJECT_SKILLS.supabase,
        PROJECT_SKILLS.docker,
      ],
    },
    get content(): JSX.Element {
      return (
        <div>
          <TypographyP className="font-mono ">
            Hyrise Studio connects businesses with skilled freelancers for web, design, and marketing projects. Fast, reliable, and easy.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <p className="font-mono mb-2 mt-4">
            The landing page of Hyrise Studio welcomes you with a sleek, modern design that immediately conveys professionalism and creativity.
             A bold headline captures your attention, while a concise description highlights the platform&apos;s value proposition. 
             The call-to-action button invites you to explore the services offered, making it easy for potential clients to get started on their projects.
          </p>
          <SlideShow images={[`${BASE_PATH}/hyrise-studio/home.png`]} />

          <TypographyH3 className="my-4 ">Services</TypographyH3>
          <p className="font-mono mb-2">
            Check out all the services—they cover everything from building websites to helping you get noticed online. Whatever you need for your project, you’ll probably find it here.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/hyrise-studio/services.png`,
            ]}
          />

          <TypographyH3 className="my-4 ">Freelancers</TypographyH3>
          <p className="font-mono mb-2">
            Take a look at the freelancers on Hyrise Studio. Everyone’s got their own skills and style, so you can find the right person for your job without any hassle.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/hyrise-studio/freelancers.png`,
            ]}
          />

          <TypographyH3 className="my-4 ">Projects</TypographyH3>
          <p className="font-mono mb-2">
            See what kind of projects Hyrise Studio has worked on. There’s a good mix, and you can tell they know what they’re doing and care about doing a solid job.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/hyrise-studio/projects.png`,
            ]}
          />

          <TypographyH3 className="my-4 ">Contact Us</TypographyH3>
          <p className="font-mono mb-2">
            Got questions or want to work together? Just reach out. The team’s friendly and will help you out with whatever you need.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/hyrise-studio/contact-us.png`,
            ]}
          />
          
          <TypographyH3 className="my-4 ">Account Dashboard</TypographyH3>
          <p className="font-mono mb-2">
            The account dashboard is where you keep track of your projects and see how things are going—all your info in one spot, nice and simple.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/hyrise-studio/account-dashboard.png`,
            ]}
          />
          
          <TypographyH3 className="my-4 ">Admin Dashboard</TypographyH3>
          <p className="font-mono mb-2">
            If you’re an admin, there’s a dashboard for you too. You can keep an eye on users, check how projects are moving along, and see all the important stats in one place.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/hyrise-studio/admin-dashboard.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "cl-studio-portfolio",
    category: "Portfolio",
    title: "CL Studio Portfolio",
    src: "/assets/projects-screenshots/cl-studio-portfolio/landing.png",
    screenshots: ["landing.png"],
    live: "https://cl-studio.it/",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.aceternity,
        PROJECT_SKILLS.tailwind,
      ],
      backend: [PROJECT_SKILLS.sanity],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            CL Studio Portfolio showcases creative works and projects with a modern, visually engaging interface and smooth animations.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <p className="font-mono mb-2 mt-8">
            A sleek, modern interface greets you, featuring the latest travel
            tips, deals, and must-visit spots around the globe.
          </p>
          <SlideShow images={[`${BASE_PATH}/cl-studio-portfolio/landing.png`]} />
          <TypographyH3 className="my-4 mt-8">Blogs</TypographyH3>
          <p className="font-mono mb-2">
            Dive into the curated articles written by travel experts. Whether
            you&apos;re looking for hidden gems or travel hacks, our blog section has
            you covered.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/the-booking-desk/blogs.png`,
              `${BASE_PATH}/the-booking-desk/blog.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">Sanity CMS</TypographyH3>

          <p className="font-mono mb-2">
            Keeping everything fresh and up-to-date, I&apos;ve integrated Sanity CMS
            to manage all the content with ease, ensuring you always get the
            latest and greatest information.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/the-booking-desk/cms-1.png`,
              `${BASE_PATH}/the-booking-desk/cms-2.png`,
            ]}
          />
          <p className="font-mono mb-2 my-8">
            With a stunning 100% score on Lighthouse, The Booking Desk isn&apos;t
            just beautiful—it&apos;s built to perform. Whether you&apos;re planning your
            next adventure or just daydreaming, our site delivers a top-notch
            experience that&apos;s both informative and enjoyable.
          </p>
        </div>
      );
    },
  },
  {
    id: "portfolio",
    category: "Portfolio",
    title: "My Portfolio",
    src: "/assets/projects-screenshots/portfolio/landing.png",
    screenshots: ["landing.png"],
    live: "http://malannino-leonardo.vercel.app",
    github:"https://github.com/malannino-leonardo/Portfolio",
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.next,
        PROJECT_SKILLS.shadcn,
        PROJECT_SKILLS.aceternity,
        PROJECT_SKILLS.framerMotion,
        PROJECT_SKILLS.tailwind,
        PROJECT_SKILLS.spline,
      ],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Hey there! This is my little corner on the web where I mix creativity and code in a fun and relaxed way.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">
            Beautiful 3D Objects{" "}
          </TypographyH3>
          <p className="font-mono mb-2">
            Did you check out that 3D keyboard modal? It&apos;s super cool! 
            The whole keyboard pops out in 3D right on the site 🤯, and when you smash a key, 
            it shows off a skill in a fun, goofy way. It&apos;s like typing, but way cooler.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/portfolio/landing.png`,
              `${BASE_PATH}/portfolio/skills.png`,
            ]}
          />
          <TypographyH3 className="my-4 ">Space Theme</TypographyH3>
          <p className="font-mono mb-2">
            Dark background + floating particles = super cool space vibes.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/navbar.png`]} />
          <TypographyH3 className="my-4 mt-8">Projects</TypographyH3>

          <p className="font-mono mb-2">
            Here are my coolest projects. 
            Just the good stuff, no boring bits.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/portfolio/projects.png`,
              `${BASE_PATH}/portfolio/project.png`,
            ]}
          />
          <p className="font-mono mb-2 mt-8 text-center">
            This site isn&apos;t just a portfolio. It&apos;s got its own style.
          </p>
        </div>
      );
    },
  },
  {
    id: "macos-style-portfolio",
    category: "Portfolio",
    title: "MacOS Style Portfolio",
    src: "/assets/projects-screenshots/macos-style-portfolio/landing.png",
    screenshots: ["1.png", "2.png", "3.png", "4.png"],
    live: "https://macos-style-portfolio.example.com/",
    github:"https://github.com/malannino-leonardo/macos-style-portfolio",
    skills: {
      frontend: [PROJECT_SKILLS.html, PROJECT_SKILLS.css, PROJECT_SKILLS.js],
      backend: [],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            A portfolio site that looks and feels like your Mac, with smooth animations, windows you can drag around, and a really cool desktop-like vibe.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <SlideShow
            images={[
              `${BASE_PATH}/macos-style-portfolio/landing.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">Desktop Experience</TypographyH3>
          <p className="font-mono mb-2">
            The site works just like your Mac desktop. You can drag windows around, use a dock to jump between things, and everything animates smoothly to keep it feeling alive and interactive.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/macos-style-portfolio/pfp.png`,
              `${BASE_PATH}/macos-style-portfolio/about-me.png`,
              `${BASE_PATH}/macos-style-portfolio/notes-app.png`,
              `${BASE_PATH}/macos-style-portfolio/photos-folder.png`,
              `${BASE_PATH}/macos-style-portfolio/videos-folder.png`,
              `${BASE_PATH}/macos-style-portfolio/contacts.png`,
              `${BASE_PATH}/macos-style-portfolio/reviews.png`,
              `${BASE_PATH}/macos-style-portfolio/trash.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">OS Starting Animation</TypographyH3>
          <p className="font-mono mb-2">
            You get to see that cool Mac startup animation when you first visit, which sets the mood for the whole experience and makes everything feel really immersive right away.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/macos-style-portfolio/os-starting.png`,
            ]}
          />

          <TypographyH3 className="my-4 mt-8">User Selection</TypographyH3>
          <p className="font-mono mb-2">
            Pick a user profile to get started, kind of like logging into your Mac. Each profile gives you your own personalized setup.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/macos-style-portfolio/user-selection.png`,
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "football-championship-website",
    category: "Sports",
    title: "Universitarian Football Championship",
    src: "/assets/projects-screenshots/football-championship-website/landing.png",
    screenshots: ["1.png"],
    live: "https://football-championship.example.com/",
    github: "https://github.com/malannino-leonardo/tuc-units",
    skills: {
      frontend: [PROJECT_SKILLS.js, PROJECT_SKILLS.vue],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.mongo,
        PROJECT_SKILLS.express,
        PROJECT_SKILLS.docker,
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Universitarian Football Championship website provides schedules, results, team info, and highlights for university football tournaments.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <SlideShow images={[`${BASE_PATH}/football-championship-website/landing.png`]} />
          <TypographyH3 className="my-4 mt-8">
            Effortless Results Retrieval
          </TypographyH3>
          {/* Effortless Results Retrieval: */}
          <ul className="list-disc ml-6">
            <li className="font-mono">
              Search all your results using a single roll number, eliminating
              the tedious task of sifting through thousands of rows on the
              official site.
            </li>
          </ul>
          <TypographyH3 className="my-4 mt-8">Class-Wise Results:</TypographyH3>
          <ul className="list-disc ml-6">
            <li className="font-mono">
              class-wise results effortlessly by entering a roll number range.
              No more manual searches or filtering.
            </li>
          </ul>
          <TypographyH3 className="my-4 mt-8">Faculty Features:</TypographyH3>
          <ul className="list-disc ml-6">
            <li className="font-mono">
              Faculty members could download batch results in Excel format,
              making administrative tasks a breeze.
            </li>
          </ul>
          <TypographyH3 className="my-4 mt-8">
            Enhanced Data Insights:
          </TypographyH3>
          <ul className="list-disc ml-6">
            <li className="font-mono">
              Each result came with additional features including:
              <ul className="list-disc font-mono ml-6">
                <li>
                  <strong>CGPA Calculations: </strong>Easily track your
                  cumulative grade point average.
                </li>
                <li>
                  <strong>Charts:</strong> Visualize your academic performance
                  with comprehensive charts.
                </li>
                <li>
                  <strong>Future Projections:</strong> Get insights into
                  potential future outcomes based on current performance.
                </li>
                <li>
                  <strong> Backlog Counts: </strong>Keep track of your backlog
                  subjects at a glance.
                </li>
              </ul>
            </li>
          </ul>
          <TypographyH3 className="my-4 mt-8">Performance:</TypographyH3>
          <ul className="list-disc ml-6">
            <li className="font-mono">
              The application was significantly faster and more efficient than
              the official site, providing a smoother user experience.
            </li>
          </ul>
          <TypographyH3 className="my-4 mt-8">Downfall:</TypographyH3>
          <ul className="list-disc ml-6">
            <li className="font-mono">
              Unfortunately, as of May 2022, the tool stopped working due to the
              introduction of CAPTCHA on the official JNTUA results site, which
              disrupted the seamless functionality of the app. JNTUA Results
              Analyzer transformed the way students and faculty interacted with
              academic results, making it a must-have tool until its unexpected
              shutdown.
            </li>
          </ul>
        </div>
      );
    },
  },
];
export default projects;
