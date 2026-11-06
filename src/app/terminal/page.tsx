import type { Metadata } from "next";
import Terminal from "@/components/terminal/terminal";

export const metadata: Metadata = {
  title: "Terminal | Leonardo Malannino",
  description:
    "Interactive matrix-style terminal: explore Leonardo Malannino's experience, skills, projects and GitHub activity with commands.",
};

export default function TerminalPage() {
  return <Terminal />;
}
