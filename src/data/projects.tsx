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
            Rubiks Cube Simulator: Solve, learn, and compete!
          </TypographyP>
          <TypographyP className="font-mono ">
            Practice solving the Rubiks Cube, learn algorithms, and compete with others globally. Track your progress and improve your speed.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Menus</TypographyH3>
          <p className="font-mono mb-2">
            Explore the main menu of the Rubiks Cube Simulator, where you can access different game modes, settings, controls and your progress.
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
            Whether you&apos;re a beginner or a speedcuber, there&apos;s a mode for you. 
            <ul className="list-disc ml-6">
              <li>
                <strong>Free play:</strong> Solve at your own pace without any time constraints.
              </li>
              <li>
                <strong>Easy Mode:</strong> 5 moves scramble, perfect for beginners to practice basic algorithms and get familiar with the cube.
              </li>
              <li>
                <strong>Medium Mode:</strong> 10 moves scramble, suitable for intermediate solvers to practice more complex algorithms.
              </li>
              <li>
                <strong>Hard Mode:</strong> Completely random scramble, designed for advanced solvers to challenge their skills and improve their speed.
              </li>
              <li>
                <strong>Limited time Mode:</strong> Solve the cube within a set time limit, adding an extra layer of challenge for speedcubers.
              </li>
              <li>
                <strong>Limited moves Mode:</strong> Solve the cube with a restricted number of moves, testing your efficiency and strategy.
              </li>
              <li>
                <strong>Daily Mode:</strong> Solve a new random scramble each day, providing a fresh challenge and helping you improve your skills consistently.
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
            Get visual hints to learn and master algorithms. 
            The simulator provides step-by-step guidance, highlighting the pieces to move and the sequence of moves needed to solve the cube.
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
                <strong>Personal records:</strong> Track your best times and moves for each game mode, helping you monitor your progress and set new goals.
              </li>
              <li>
                <strong>Global leaderboard:</strong> Compete with players worldwide and see how you rank against other cubers in different game modes.
              </li>
              <li>
                <strong>Daily leaderboard:</strong> Compete with players on the same daily scramble and see how you stack up against others who solved the same challenge.
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
    live: "https://hyrise.it/studio",
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
            Hyrise Studio is a powerful database management tool for Hyrise, enabling visualization, query execution, and performance analysis.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <p className="font-mono mb-2 mt-4">
            As soon as you land, boom! You&apos;re greeted with the freshest
            coupons and top-tier deals that&apos;ll make your wallet happy.
          </p>
          <SlideShow images={[`${BASE_PATH}/hyrise-studio/landing.png`]} />
          <TypographyH3 className="my-4 ">Stores</TypographyH3>
          <p className="font-mono mb-2">
            Dive into a comprehensive list of stores, each packed with exclusive
            deals and discounts. It&apos;s like having a VIP pass to every sale
            in town.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/couponluxury/stores.png`,
              `${BASE_PATH}/couponluxury/store.png`,
            ]}
          />
          <TypographyH3 className="my-4 mt-8">Categories</TypographyH3>

          <p className="font-mono mb-2">
            Whatever you&apos;re into—fashion, tech, food—you&apos;ll find it
            neatly organized here. No more endless scrolling; just pick a
            category and get the best offers instantly.
          </p>
          <SlideShow images={[`${BASE_PATH}/couponluxury/categories.png`]} />
          <TypographyH3 className="my-4 mt-8">Custom CMS </TypographyH3>
          <p className="font-mono mb-2">
            Powered by Vue.js, this bad boy allows us to keep the content
            dynamic and up-to-date. From flash sales to limited-time offers, my
            CMS ensures everything&apos;s live and relevant.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/couponluxury/cms-1.png`,
              `${BASE_PATH}/couponluxury/cms-2.png`,
            ]}
          />
          <p className="font-mono mb-2 mt-5">
            Plus, I&apos;ve sprinkled in some extra magic like personalized
            deal recommendations, user-friendly search features, and a sleek,
            responsive design that works like a charm on any device.
          </p>
          <p className="font-mono mb-2">
            CouponLuxury isn&apos;t just a website; it&apos;s your personal deal-hunting
            assistant, ensuring you never miss out on a bargain!
          </p>
        </div>
      );
    },
  },
  {
    id: "cl-studio-portfolio",
    category: "Portfolio",
    title: "CL Studio Portfolio",
    src: "/assets/projects-screenshots/cl-studio-portfolio/landing.png",
    screenshots: ["1.png"],
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
    screenshots: ["1.png"],
    live: "http://nareshkhatri.vercel.app",
    github:"https://github.com/Naresh-Khatri/Portfolio",
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
            Welcome to my digital playground, where creativity meets code in the
            dopest way possible.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">
            Beautiful 3D Objects{" "}
          </TypographyH3>
          <p className="font-mono mb-2">
            Did you see that 3D keyboard modal? Yeah! I made that. That
            interactive keyboard is being rendered in 3D on a webpage 🤯, and
            pressing each keycap reveals a skill in a goofy way. It&apos;s like
            typing, but make it art.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/portfolio/landing.png`,
              `${BASE_PATH}/portfolio/skills.png`,
            ]}
          />
          <TypographyH3 className="my-4 ">Space Theme</TypographyH3>
          <p className="font-mono mb-2">
            Dark background + floating particles = out-of-this-world cool.
          </p>
          <SlideShow images={[`${BASE_PATH}/portfolio/navbar.png`]} />
          <TypographyH3 className="my-4 mt-8">Projects</TypographyH3>

          <p className="font-mono mb-2">
            My top personal and freelance projects — no filler, all killer.
          </p>
          <SlideShow
            images={[
              `${BASE_PATH}/portfolio/projects.png`,
              `${BASE_PATH}/portfolio/project.png`,
            ]}
          />
          <p className="font-mono mb-2 mt-8 text-center">
            This site&apos;s not just a portfolio — it&apos;s a whole vibe.
          </p>
        </div>
      );
    },
  },
  {
    id: "macos-style-portfolio",
    category: "Portfolio",
    title: "macOS Style Portfolio",
    src: "/assets/projects-screenshots/macos-style-portfolio/landing.png",
    screenshots: ["1.png", "2.png", "3.png", "4.png"],
    live: "https://macos-style-portfolio.example.com/",
    github:"https://github.com/Naresh-Khatri/GhostChat",
    skills: {
      frontend: [PROJECT_SKILLS.js, PROJECT_SKILLS.next, PROJECT_SKILLS.chakra],
      backend: [PROJECT_SKILLS.supabase],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            A portfolio site inspired by macOS, featuring smooth transitions, windowed layouts, and a unique desktop-like experience.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <SlideShow
            images={[
              `${BASE_PATH}/macos-style-portfolio/landing.png`,
              `${BASE_PATH}/macos-style-portfolio/window.png`,
              `${BASE_PATH}/macos-style-portfolio/desktop.png`,
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
