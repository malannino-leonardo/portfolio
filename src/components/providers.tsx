import Preloader from "./preloader";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/toaster";

import { TooltipProvider } from "./ui/tooltip";
import AsciiRevealProvider from "./ascii-reveal-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider
    attribute="class"
    defaultTheme="dark"
    disableTransitionOnChange
  >
    <Preloader>
      <TooltipProvider>
        {children}
      </TooltipProvider>
      <Toaster />
      <AsciiRevealProvider />
    </Preloader>
  </ThemeProvider>;
};
