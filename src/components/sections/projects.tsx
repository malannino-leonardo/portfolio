"use client";
import Image from "next/image";
import React from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalTrigger,
  useModal,
} from "../ui/animated-modal";
import { FloatingDock } from "../ui/floating-dock";
import Link from "next/link";

import SmoothScroll from "../smooth-scroll";
import projects, { Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";

import SectionWrapper from "../ui/section-wrapper";

const ProjectsSection = () => {
  return (
    <SectionWrapper id="projects" className="max-w-7xl mx-auto min-h-screen h-auto pointer-events-none px-4 sm:px-6 pb-24 md:pb-32">
      <SectionHeader id='projects' title="Projects" className="pointer-events-none mb-16 md:mb-24" />
      <div className="grid grid-cols-1 md:grid-cols-3 pointer-events-none gap-6">
        {projects.map((project, index) => (
          <Modall key={project.src} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
};
const Modall = ({ project }: { project: Project }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <Modal>
        <ModalTrigger className="bg-transparent flex justify-center group/modal-btn w-full">
          <div
            className="relative w-full max-w-[400px] h-auto rounded-lg overflow-hidden"
            style={{ aspectRatio: "3/2" }}
          >
            <Image
              className="absolute w-full h-full top-0 left-0 hover:scale-[1.05] transition-all"
              src={project.src}
              alt={project.title}
              width={300}
              height={300}
            />
            <div className="absolute w-full h-1/2 bottom-0 left-0 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none">
              <div className="flex flex-col h-full items-start justify-end p-6">
                <div className="text-lg text-left">{project.title}</div>
                <div className="text-xs bg-white text-black rounded-lg w-fit px-2">
                  {project.category}
                </div>
              </div>
            </div>
          </div>
        </ModalTrigger>
        <ModalBody className="md:max-w-4xl md:max-h-[80%] overflow-auto">
          <SmoothScroll isInsideModal={true}>
            <ModalContent>
              <ProjectContents project={project} />
            </ModalContent>
          </SmoothScroll>
          <ModalFooter className="gap-2 sm:gap-4 flex-wrap">
            <FooterContent project={project} />
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
};

const FooterContent = ({ project }: { project: Project }) => {
  const { setOpen } = useModal();
  const hasLive = Boolean(project.live && project.live.trim().length > 0);
  const hasGithub = Boolean(project.github && project.github.trim().length > 0);

  return (
    <>
      <button
        onClick={() => setOpen(false)}
        className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28 cursor-can-hover"
      >
        Cancel
      </button>
      {hasGithub && (
        <Link href={project.github!} target="_blank" className="cursor-can-hover">
          <button
            className={cn(
              "text-sm px-2 py-1 rounded-md w-28 cursor-can-hover",
              hasLive
                ? "bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300"
                : "bg-black text-white dark:bg-white dark:text-black border border-black"
            )}
          >
            Github
          </button>
        </Link>
      )}
      {hasLive && (
        <Link href={project.live!} target="_blank" className="cursor-can-hover">
          <button className="bg-black text-white dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28">
            Visit
          </button>
        </Link>
      )}
    </>
  );
};
export default ProjectsSection;

const ProjectContents = ({ project }: { project: Project }) => {
  return (
    <>
      <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
        {project.title}
      </h4>
      <div className="flex flex-col md:flex-row md:justify-evenly max-w-full overflow-hidden md:overflow-visible">
        <div className="flex flex-row md:flex-col-reverse justify-center items-center gap-2 text-3xl mb-8">
          <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-500">
            Frontend
          </p>
          {project.skills.frontend?.length > 0 && (
            <FloatingDock items={project.skills.frontend} />
          )}
        </div>
        {project.skills.backend?.length > 0 && (
          <div className="flex flex-row md:flex-col-reverse justify-center items-center gap-2 text-3xl mb-8">
            <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-500">
              Backend
            </p>
            <FloatingDock items={project.skills.backend} />
          </div>
        )}
      </div>
      {/* <div className="flex justify-center items-center">
        {project.screenshots.map((image, idx) => (
          <motion.div
            key={"images" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover={{
              scale: 1.1,
              rotate: 0,
              zIndex: 100,
            }}
            whileTap={{
              scale: 1.1,
              rotate: 0,
              zIndex: 100,
            }}
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <Image
              src={`${project.src.split("1.png")[0]}${image}`}
              alt="screenshots"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div> */}
      {project.content}
    </>
  );
};
