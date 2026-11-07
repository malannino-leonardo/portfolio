"use client";
import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { sleep, cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePreloader } from "./preloader";
import { useTheme } from "next-themes";
import { Section, getKeyboardState } from "./animated-background-config";
import { useSounds } from "./realtime/hooks/use-sounds";
import { usePerformance } from "@/hooks/use-performance";
import { detectGpu, capDevicePixelRatio, GpuInfo } from "@/lib/gpu";

gsap.registerPlugin(ScrollTrigger);

const SKILL_REMAP: Record<string, SkillNames> = {
  "express": SkillNames.PYTHON,
  "mongodb": SkillNames.PHP,
  "prettier": SkillNames.MYSQL,
  "firebase": SkillNames.CPP,
  "wordpress": SkillNames.JSON,
  "linux": SkillNames.NETLIFY,
  "nginx": SkillNames.VSCODE,
  "aws": SkillNames.SUPABASE,
  "vim": SkillNames.APACHE,
};

// Every wobbling key dirties the WebGL frame; a subset looks the same but is far cheaper.
const MAX_WOBBLING_KEYS = 14;
const KEYBOARD_SCROLL_TRIGGER_PREFIX = "keyboard-section-";
const KEYBOARD_TRANSITION_DURATION = {
  default: 0.7,
  aboutProjects: 1.2,
  projectsContact: 1.5,
} as const;

const AnimatedBackground = () => {
  const { isLoading, bypassLoading } = usePreloader();
  const { theme, resolvedTheme } = useTheme();
  const { isLowPowerMode } = usePerformance();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const [gpu, setGpu] = useState<GpuInfo | null>(null);
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");
  const activeSectionRef = useRef<Section>("hero");

  // Classify the GPU (WebGPU adapter when available) and cap the render
  // resolution of the 3D canvas *before* the Spline runtime initialises.
  useEffect(() => {
    let alive = true;
    let restore = () => {};
    detectGpu().then((info) => {
      if (!alive) return;
      restore = capDevicePixelRatio(info.maxDpr);
      setGpu(info);
    });
    return () => {
      alive = false;
      restore();
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "") as Section;
    if (["hero", "skills", "about", "projects", "contact"].includes(hash)) {
      activeSectionRef.current = hash;
      setActiveSection(hash);
    }
  }, []);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Animation controllers refs
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void }>();
  // >0 while a timer-driven (non-gsap) animation needs the render loop to keep running
  const extraBusyRef = useRef(0);
  const keycapAnimationsRef = useRef<{ start: () => void; stop: () => void }>();

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);

  // Helper to safely set variables without crashing if they don't exist
  const setSplineVariable = useCallback((name: string, value: string | number) => {
    if (!splineApp) return;
    try {
      // Some versions of Spline runtime might throw on getVariable too if missing, 
      // or return undefined. We wrap in try/catch to be safe.
      if (splineApp.getVariable(name) !== undefined) {
        splineApp.setVariable(name, value);
      }
    } catch (err) {
      console.warn(`Create variable '${name}' in Spline Editor to enable this feature.`);
    }
  }, [splineApp]);

  // --- Event Handlers ---

  const getSkillFromObjectName = (name: string): Skill | null => {
    const searchName = name.toLowerCase().trim();
    
    const directMatchKey = Object.keys(SKILLS).find(key => 
      key.toLowerCase() === searchName || 
      (key === "cpp" && (searchName === "cplusplus" || searchName === "c++"))
    ) as SkillNames;

    if (directMatchKey) return SKILLS[directMatchKey];

    const remappedSkillName = SKILL_REMAP[searchName];
    if (remappedSkillName) return SKILLS[remappedSkillName as SkillNames];

    // Try a more flexible search if no direct match
    const flexibleMatch = Object.keys(SKILLS).find(key => 
      searchName.includes(key.toLowerCase()) || key.toLowerCase().includes(searchName)
    ) as SkillNames;

    if (flexibleMatch) return SKILLS[flexibleMatch];

    return null;
  };

  const handleMouseHover = useCallback((e: SplineEvent) => {
    const targetName = e.target.name;
    const skill = getSkillFromObjectName(targetName);
    
    if (!splineApp || (skill && selectedSkillRef.current?.name === skill.name)) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) {
        playReleaseSound();
      }
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      setSplineVariable("heading", "");
      setSplineVariable("desc", "");
    } else if (skill) {
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== skill.name) {
        if (selectedSkillRef.current) {
          playReleaseSound();
        }
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
      }
    }
  }, [splineApp, playReleaseSound, playPressSound, setSplineVariable]);

  const handleSplineInteractions = useCallback(() => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    const onKeyUp = () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      setSplineVariable("heading", "");
      setSplineVariable("desc", "");
    };

    const onKeyDown = (e: SplineEvent) => {
      if (!splineApp || isInputFocused()) return;
      const skill = getSkillFromObjectName(e.target.name);
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        setSplineVariable("heading", skill.label);
        setSplineVariable("desc", skill.shortDescription);
      }
    };

    const onMouseHover = (e: SplineEvent) => handleMouseHover(e);

    splineApp.addEventListener("keyUp", onKeyUp);
    splineApp.addEventListener("keyDown", onKeyDown);
    splineApp.addEventListener("mouseHover", onMouseHover);

    return () => {
      splineApp.removeEventListener("keyUp", onKeyUp);
      splineApp.removeEventListener("keyDown", onKeyDown);
      splineApp.removeEventListener("mouseHover", onMouseHover);
    };
  }, [splineApp, playReleaseSound, playPressSound, setSplineVariable, handleMouseHover]);

  // --- Animation Setup Helpers ---

  const clearKeyboardScrollTriggers = useCallback(() => {
    ScrollTrigger.getAll().forEach((trigger) => {
      const id = trigger.vars.id;
      if (typeof id === "string" && id.startsWith(KEYBOARD_SCROLL_TRIGGER_PREFIX)) {
        trigger.kill();
      }
    });
  }, []);

  const applyKeyboardState = useCallback((
    kbd: SPEObject,
    section: Section,
    duration: number = KEYBOARD_TRANSITION_DURATION.default
  ) => {
    const state = getKeyboardState({ section, isMobile });

    if (isMobile) {
      if (section !== "skills") {
        gsap.to(kbd.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 0.4,
          ease: "power2.in",
          overwrite: "auto",
          onComplete: () => {
            kbd.visible = false;
          },
        });
      } else {
        kbd.visible = true;
        gsap.killTweensOf(kbd.scale);
        gsap.killTweensOf(kbd.position);
        gsap.killTweensOf(kbd.rotation);

        gsap.to(kbd.scale, {
          ...state.scale,
          duration,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(kbd.position, {
          ...state.position,
          duration,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(kbd.rotation, {
          ...state.rotation,
          duration,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    } else {
      kbd.visible = true;
      gsap.killTweensOf(kbd.scale);
      gsap.killTweensOf(kbd.position);
      gsap.killTweensOf(kbd.rotation);

      gsap.to(kbd.scale, {
        ...state.scale,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(kbd.position, {
        ...state.position,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(kbd.rotation, {
        ...state.rotation,
        duration,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (activeSectionRef.current !== section) {
      activeSectionRef.current = section;
      setActiveSection(section);
    }
  }, [isMobile]);

  const createSectionTimeline = useCallback((
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom",
    transitionDuration: number = KEYBOARD_TRANSITION_DURATION.default
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard") || 
                splineApp.findObjectByName("Keyboard") || 
                splineApp.getAllObjects().find(obj => obj.name.toLowerCase() === "keyboard");
    if (!kbd) return;

    ScrollTrigger.create({
      id: `${KEYBOARD_SCROLL_TRIGGER_PREFIX}${targetSection}`,
      trigger: triggerId,
      start,
      end,
      onEnter: () => {
        applyKeyboardState(kbd, targetSection, transitionDuration);
      },
      onEnterBack: () => {
        applyKeyboardState(kbd, targetSection, transitionDuration);
      },
      onLeaveBack: () => {
        applyKeyboardState(kbd, prevSection, transitionDuration);
      },
    });
  }, [splineApp, applyKeyboardState]);

  const setupScrollAnimations = useCallback(() => {
    if (!splineApp || !splineContainer.current) return;

    clearKeyboardScrollTriggers();

    const kbd = splineApp.findObjectByName("keyboard") || 
                splineApp.findObjectByName("Keyboard") || 
                splineApp.getAllObjects().find(obj => obj.name.toLowerCase() === "keyboard");
    if (!kbd) return;

    const hash = window.location.hash.replace("#", "") as Section;
    const initialSection: Section = ["hero", "skills", "about", "projects", "contact"].includes(hash)
      ? hash
      : activeSectionRef.current;

    const initialState = getKeyboardState({ section: initialSection, isMobile });
    gsap.killTweensOf(kbd.scale);
    gsap.killTweensOf(kbd.position);
    gsap.killTweensOf(kbd.rotation);
    gsap.set(kbd.scale, initialState.scale);
    gsap.set(kbd.position, initialState.position);
    gsap.set(kbd.rotation, initialState.rotation);

    if (activeSectionRef.current !== initialSection) {
      activeSectionRef.current = initialSection;
      setActiveSection(initialSection);
    }

    // Section transitions
    createSectionTimeline("#skills", "skills", "hero");
    createSectionTimeline("#about", "about", "skills", "top 70%");
    createSectionTimeline(
      "#projects",
      "projects",
      "about",
      "top 70%",
      "bottom bottom",
      KEYBOARD_TRANSITION_DURATION.aboutProjects
    );
    createSectionTimeline(
      "#contact",
      "contact",
      "projects",
      "top 30%",
      "bottom bottom",
      KEYBOARD_TRANSITION_DURATION.projectsContact
    );

    ScrollTrigger.refresh();
  }, [splineApp, isMobile, createSectionTimeline, clearKeyboardScrollTriggers]);

  const getBongoAnimation = useCallback(() => {
    const findObj = (name: string) => splineApp?.findObjectByName(name) || 
                                      splineApp?.getAllObjects().find(o => o.name.toLowerCase() === name.toLowerCase());

    const framesParent = findObj("bongo-cat");
    const frame1 = findObj("frame-1");
    const frame2 = findObj("frame-2");

    if (!frame1 || !frame2 || !framesParent) {
      return { start: () => { }, stop: () => { } };
    }

    let interval: NodeJS.Timeout;
    let running = false;
    const start = () => {
      let i = 0;
      if (!running) {
        running = true;
        extraBusyRef.current++;
      }
      framesParent.visible = true;
      interval = setInterval(() => {
        if (i % 2) {
          frame1.visible = false;
          frame2.visible = true;
        } else {
          frame1.visible = true;
          frame2.visible = false;
        }
        i++;
      }, 100);
    };
    const stop = () => {
      clearInterval(interval);
      if (running) {
        running = false;
        extraBusyRef.current--;
      }
      framesParent.visible = false;
      frame1.visible = false;
      frame2.visible = false;
    };
    return { start, stop };
  }, [splineApp]);

  const getKeycapsAnimation = useCallback(() => {
    if (!splineApp || isLowPowerMode) return { start: () => { }, stop: () => { } };

    let tweens: gsap.core.Tween[] = [];
    const removePrevTweens = () => tweens.forEach((t) => t.kill());

    const findKeycap = (skillName: string) => {
      const remappedObjName = Object.keys(SKILL_REMAP).find(key => SKILL_REMAP[key] === skillName);
      return splineApp.findObjectByName(skillName) ||
        (remappedObjName ? splineApp.findObjectByName(remappedObjName) : null) ||
        (skillName === "cpp" ? (splineApp.findObjectByName("c++") || splineApp.findObjectByName("cplusplus")) : null) ||
        splineApp.getAllObjects().find(obj => obj.name.toLowerCase() === skillName.toLowerCase());
    }

    const start = () => {
      removePrevTweens();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .slice(0, MAX_WOBBLING_KEYS)
        .forEach((skill, idx) => {
          const keycap = findKeycap(skill.name);

          if (!keycap) return;
          const originalY = keycap.position.y || 0;
          const t = gsap.to(keycap.position, {
            y: originalY + Math.random() * 200 + 200,
            duration: Math.random() * 2 + 2,
            delay: idx * 0.6,
            repeat: -1,
            yoyo: true,
            yoyoEase: "none",
            ease: "elastic.out(1,0.3)",
          });
          tweens.push(t);
        });
    };

    const stop = () => {
      removePrevTweens();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = findKeycap(skill.name);

        if (!keycap) return;
        const t = gsap.to(keycap.position, {
          y: 0, // Reset to base position
          duration: 4,
          repeat: 1,
          ease: "elastic.out(1,0.7)",
        });
        tweens.push(t);
      });
      setTimeout(removePrevTweens, 1000);
    };

    return { start, stop };
  }, [splineApp]);

  const updateKeyboardTransform = useCallback(async () => {
    if (!splineApp) return;
    const allObjects = splineApp.getAllObjects();
    const kbd = splineApp.findObjectByName("keyboard") || 
                splineApp.findObjectByName("Keyboard") || 
                allObjects.find(obj => obj.name.toLowerCase() === "keyboard");
    if (!kbd) return;

    // 1. Identify all objects we intend to show and animate
    const keycaps = allObjects.filter((obj) => obj.name.toLowerCase().includes("keycap"));
    const skillKeys: SPEObject[] = [];
    Object.values(SKILLS).forEach(skill => {
      const remappedName = Object.keys(SKILL_REMAP).find(k => SKILL_REMAP[k] === skill.name);
      const obj = splineApp.findObjectByName(skill.name) || 
                  (remappedName ? splineApp.findObjectByName(remappedName) : null) ||
                  (skill.name === "cpp" ? (splineApp.findObjectByName("c++") || splineApp.findObjectByName("cplusplus")) : null) ||
                  allObjects.find(o => o.name.toLowerCase() === skill.name.toLowerCase());
                  
      if (obj) skillKeys.push(obj);
    });

    const platformSpecificKeycaps = isMobile 
      ? keycaps.filter(k => k.name.toLowerCase().includes("mobile"))
      : keycaps.filter(k => k.name.toLowerCase().includes("desktop"));

    const allKeysToAnimate = [...platformSpecificKeycaps, ...skillKeys]
      .filter((obj, index, self) => 
        index === self.indexOf(obj) && obj !== kbd
      )
      .sort((a, b) => {
        // Reduced tolerance to 1 unit to better distinguish between rows.
        if (Math.abs(a.position.z - b.position.z) > 1) {
          return a.position.z - b.position.z;
        }
        return a.position.x - b.position.x;
      });

    // 2. Hide ALL keys and potential key objects initially so the keyboard is purely "empty"
    const skillNames = Object.values(SkillNames) as string[];
    allObjects.forEach(obj => {
      if (obj === kbd) return;
      const name = obj.name.toLowerCase();
      const isKey = name.includes("keycap") || 
                    skillNames.some(sn => name === sn.toLowerCase()) ||
                    Object.keys(SKILL_REMAP).some(rk => name === rk.toLowerCase()) ||
                    name === "c++" || 
                    name === "cplusplus";
      
      if (isKey) {
        obj.visible = false;
      }
    });

    // Reveal the keyboard base
    kbd.visible = false;
    await sleep(400);
    kbd.visible = true;
    setKeyboardRevealed(true);

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );

    await sleep(900);

    // 3. Populate one by one with a strictly sequential animation
    for (let i = 0; i < allKeysToAnimate.length; i++) {
        const keycap = allKeysToAnimate[i];
        const originalY = keycap.position.y || 0;
        
        if (!isLowPowerMode) await sleep(45); 
        keycap.visible = true;

        if (!isLowPowerMode) {
          gsap.fromTo(
            keycap.position,
            { y: originalY + 200 },
            { y: originalY, duration: 0.5, delay: 0.1, ease: "bounce.out" }
          );
        } else {
          keycap.position.y = originalY;
        }
      }
  }, [splineApp, activeSection, isMobile]);

  // --- Effects ---

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    const cleanup = handleSplineInteractions();
    setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();

    return () => {
      cleanup?.();
      clearKeyboardScrollTriggers();
      bongoAnimationRef.current?.stop();
      keycapAnimationsRef.current?.stop();
    };
  }, [splineApp, isMobile, handleSplineInteractions, setupScrollAnimations, getBongoAnimation, getKeycapsAnimation, clearKeyboardScrollTriggers]);

  // Handle keyboard text visibility based on theme and section
  useEffect(() => {
    if (!splineApp) return;
    const findObj = (name: string) => splineApp.findObjectByName(name) || 
                                      splineApp.getAllObjects().find(o => o.name.toLowerCase() === name.toLowerCase());

    const textDesktopDark = findObj("text-desktop-dark");
    const textDesktopLight = findObj("text-desktop");
    const textMobileDark = findObj("text-mobile-dark");
    const textMobileLight = findObj("text-mobile");

    if (!textDesktopDark || !textDesktopLight || !textMobileDark || !textMobileLight) return;

    const setVisibility = (
      dDark: boolean,
      dLight: boolean,
      mDark: boolean,
      mLight: boolean
    ) => {
      textDesktopDark.visible = dDark;
      textDesktopLight.visible = dLight;
      textMobileDark.visible = mDark;
      textMobileLight.visible = mLight;
    };

    if (activeSection !== "skills") {
      setVisibility(false, false, false, false);
    } else if (theme === "dark") {
      isMobile
        ? setVisibility(false, false, false, true)
        : setVisibility(false, true, false, false);
    } else {
      isMobile
        ? setVisibility(false, false, true, false)
        : setVisibility(true, false, false, false);
    }
  }, [theme, splineApp, isMobile, activeSection]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    // console.log(selectedSkill)
    setSplineVariable("heading", selectedSkill.label);
    setSplineVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill, splineApp, setSplineVariable]);

  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp) return;

    let rotateKeyboard: gsap.core.Tween | undefined;
    let contactKeyboardWobble: gsap.core.Tween | undefined;
    let cancelled = false;

    const kbd = splineApp.findObjectByName("keyboard") || 
                splineApp.findObjectByName("Keyboard") || 
                splineApp.getAllObjects().find(obj => obj.name.toLowerCase() === "keyboard");

    if (kbd) {
      const contactRotation = getKeyboardState({ section: "contact", isMobile }).rotation;

      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true, // Start paused
      });

      contactKeyboardWobble = gsap.fromTo(
        kbd.rotation,
        {
          x: contactRotation.x - 0.08,
          y: contactRotation.y + 0.12,
          z: contactRotation.z - 0.04,
        },
        {
          x: contactRotation.x + 0.08,
          y: contactRotation.y - 0.12,
          z: contactRotation.z + 0.04,
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          immediateRender: false,
          paused: true,
        }
      );
    }

    const wait = async (duration: number) => {
      await sleep(duration);
      return !cancelled;
    };

    const manageAnimations = async () => {
      // Reset text if not in skills
      if (activeSection !== "skills") {
        setSplineVariable("heading", "");
        setSplineVariable("desc", "");
      }

      // Handle Rotate/Teardown Tweens
      if (activeSection === "hero") {
        rotateKeyboard?.restart(true, false);
        contactKeyboardWobble?.pause(0);
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause(0);
      } else {
        rotateKeyboard?.pause(0);
        contactKeyboardWobble?.pause(0);
      }

      // Handle Bongo Cat
      if (activeSection === "projects") {
        if (!(await wait(300))) return;
        bongoAnimationRef.current?.start();
      } else {
        if (!(await wait(200))) return;
        bongoAnimationRef.current?.stop();
      }

      // Handle Contact Section Animations
      if (activeSection === "contact") {
        if (!(await wait(350))) return;
        contactKeyboardWobble?.restart(true, false);
        keycapAnimationsRef.current?.start();
      } else {
        contactKeyboardWobble?.pause(0);
        keycapAnimationsRef.current?.stop();
      }
    };

    manageAnimations();

    return () => {
      cancelled = true;
      rotateKeyboard?.kill();
      contactKeyboardWobble?.kill();
    };
  }, [activeSection, splineApp, setSplineVariable, isMobile]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    const hash = activeSection === "hero" ? "#" : `#${activeSection}`;
    // replaceState: updating the hash must not trigger a Next.js navigation
    // (which re-renders the route tree on every section change).
    if (window.location.hash !== (hash === "#" ? "" : hash)) {
      window.history.replaceState(window.history.state, "", "/" + (hash === "#" ? "" : hash));
    }

    if (!splineApp || isLoading || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [splineApp, isLoading, activeSection, keyboardRevealed, updateKeyboardTransform]);

  const isKeyboardVisible = !isMobile || activeSection === "hero" || activeSection === "skills";

  // Don't burn GPU on a canvas nobody can see (phones hide the keyboard after "skills").
  useEffect(() => {
    if (!splineApp) return;
    if (isKeyboardVisible) splineApp.play();
    else splineApp.stop();
  }, [splineApp, isKeyboardVisible]);

  // Light theme: the page starfield (Particles) shows through the transparent canvas in dark
  // mode and made dark-on-light text unreadable. In light mode the canvas is painted with the
  // page colour; in dark mode it goes back to transparent. Both switch instantly.
  useEffect(() => {
    if (!splineApp || !resolvedTheme) return;
    try {
      splineApp.setBackgroundColor(resolvedTheme === "light" ? "#f2f6f3" : "rgba(0,0,0,0)");
      splineApp.requestRender();
    } catch {}
  }, [splineApp, resolvedTheme]);

  // Render scheduler. Spline's default "auto" mode renders every animation frame
  // (a 120 Hz phone does 2x the work of a 60 Hz one). We switch the runtime to
  // manual mode and request frames ourselves: at most 30 fps on phones / weak
  // GPUs, and only while something is actually changing (gsap tweens, the bongo
  // cat, recent input). When the scene is idle the GPU does no work at all.
  useEffect(() => {
    if (!splineApp || !gpu) return;
    const interval = isMobile || gpu.tier === "low" ? 1000 / 30 : 0;
    const app = splineApp as Application & { renderMode?: string };
    const evts = ["pointermove", "pointerdown", "keydown", "wheel", "scroll", "touchmove", "resize"];
    let raf = 0;
    let last = 0;
    let lastInput = performance.now();
    const onInput = () => {
      lastInput = performance.now();
    };

    const busy = () =>
      extraBusyRef.current > 0 ||
      performance.now() - lastInput < 1500 ||
      gsap.globalTimeline.getChildren(true, true, false).some((t) => t.isActive());

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || t - last < interval - 2 || !busy()) return;
      last = t;
      app.requestRender();
    };

    app.renderMode = "manual";
    evts.forEach((e) => window.addEventListener(e, onInput, { passive: true }));
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      evts.forEach((e) => window.removeEventListener(e, onInput));
      app.renderMode = "auto";
      app.requestRender();
    };
  }, [splineApp, gpu, isMobile]);

  return (
    <div className={cn(
      "w-full h-full fixed inset-0 transition-opacity duration-700 z-0",
      !keyboardRevealed || !isKeyboardVisible ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
    )}>
      <Suspense fallback={null}>
        {gpu && <Spline
          className="w-full h-full"
          ref={splineContainer}
          onLoad={(app: Application) => {
            setSplineApp(app);
            bypassLoading();
          }}
          scene={gpu.mobile ? "/assets/skills-keyboard-mobile.spline" : "/assets/skills-keyboard.spline"}
        />}
      </Suspense>
    </div>
  );
};

export default AnimatedBackground;
