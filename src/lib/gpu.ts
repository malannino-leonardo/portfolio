/**
 * GPU capability detection + render-resolution budgeting for the 3D scene.
 *
 * The 3D keyboard is a Spline scene (`/assets/skills-keyboard.spline`). The
 * Spline runtime is a closed WebGL renderer, so the scene itself cannot be
 * drawn through WebGPU without re-exporting the model (which we must not
 * change). What we *can* do is use the WebGPU adapter to classify the device
 * and budget the WebGL resolution accordingly: the single biggest cost on
 * phones is the fill-rate of a full-screen canvas at devicePixelRatio 3.
 */

export type GpuTier = "high" | "mid" | "low";

export interface GpuInfo {
  /** `navigator.gpu` exists and returned a real (non-fallback) adapter. */
  webgpu: boolean;
  tier: GpuTier;
  /** Mobile user agent: selects the lighter (subdivision 1) scene. */
  mobile: boolean;
  /** Max devicePixelRatio the 3D canvas is allowed to render at. */
  maxDpr: number;
  /** Human readable adapter description, for debugging. */
  adapter: string;
}

const isMobileUA = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

export async function detectGpu(): Promise<GpuInfo> {
  const nav = navigator as Navigator & {
    gpu?: {
      requestAdapter: () => Promise<{
        isFallbackAdapter?: boolean;
        info?: { vendor?: string; architecture?: string; description?: string };
        limits?: { maxTextureDimension2D?: number };
      } | null>;
    };
    deviceMemory?: number;
  };
  const mobile = isMobileUA();
  const cores = nav.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 8;
  const weakCpu = cores < 4 || mem < 4;

  let webgpu = false;
  let software = false;
  let adapterName = "none";
  try {
    const adapter = nav.gpu ? await nav.gpu.requestAdapter() : null;
    if (adapter) {
      software = !!adapter.isFallbackAdapter;
      webgpu = !software;
      const i = adapter.info;
      adapterName = [i?.vendor, i?.architecture, i?.description]
        .filter(Boolean)
        .join(" ") || "unknown";
    }
  } catch {
    /* WebGPU unavailable */
  }

  let tier: GpuTier;
  if (software || (mobile && weakCpu)) tier = "low";
  else if (mobile || weakCpu || !webgpu) tier = "mid";
  else tier = "high";

  // Phones report a DPR of 3 (9x the pixels of a 1x canvas): cap hard. Weak devices render at 1x.
  const maxDpr = tier === "low" ? 1 : mobile ? 1.25 : tier === "high" ? 2 : 1.25;
  return { webgpu, tier, mobile, maxDpr, adapter: adapterName };
}

/**
 * Caps `window.devicePixelRatio` for code that reads it at init time (the
 * Spline runtime sizes its canvas from it). Returns a function that restores
 * the original behaviour.
 */
export function capDevicePixelRatio(max: number): () => void {
  const desc = Object.getOwnPropertyDescriptor(window, "devicePixelRatio");
  const real = () => (desc?.get ? desc.get.call(window) : desc?.value ?? 1);
  try {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      get: () => Math.min(real(), max),
    });
  } catch {
    return () => {};
  }
  return () => {
    try {
      if (desc) Object.defineProperty(window, "devicePixelRatio", desc);
      else delete (window as { devicePixelRatio?: number }).devicePixelRatio;
    } catch {
      /* ignore */
    }
  };
}
