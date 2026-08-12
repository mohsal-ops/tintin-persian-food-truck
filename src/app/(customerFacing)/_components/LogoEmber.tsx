"use client";

// Brand-forward logo animation: a swarm of golden embers converges into the
// restaurant's logo (sampled from its real pixels) and then holds, shimmering.
// Two modes:
//   - "form"    : embers fly in and assemble the mark (used for the intro).
//   - "ambient" : the mark is already formed and just breathes/shimmers softly
//                 (used as a calm hero medallion).
// Renders on a transparent canvas, so place it on a dark surface for the glow to
// read. Samples a SAME-ORIGIN logo so getImageData never taints the canvas.
// Respects prefers-reduced-motion (draws the logo once, no animation).
import { useEffect, useRef } from "react";

type Props = {
  /** Same-origin, transparent logo PNG (e.g. /general/logo/logo.png). */
  src?: string;
  variant?: "form" | "ambient";
  className?: string;
};

export default function LogoEmber({
  src = "/general/logo/logo.png",
  variant = "form",
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0,
      H = 0,
      dpr = 1,
      raf = 0,
      t0 = 0,
      ready = false;
    type P = { tx: number; ty: number; x: number; y: number; delay: number; dur: number; size: number; ph: number };
    let parts: P[] = [];

    // Pre-rendered soft golden dot, blended additively per particle (cheap glow).
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const sctx = sprite.getContext("2d")!;
    const sg = sctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    sg.addColorStop(0, "rgba(255,236,180,1)");
    sg.addColorStop(0.35, "rgba(250,180,40,.85)");
    sg.addColorStop(1, "rgba(250,150,20,0)");
    sctx.fillStyle = sg;
    sctx.fillRect(0, 0, 32, 32);

    const img = new Image();
    img.decoding = "async";
    img.onload = build;
    img.src = src;

    function fit() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = cv!.getBoundingClientRect();
      W = r.width;
      H = r.height;
      cv!.width = Math.max(1, Math.round(W * dpr));
      cv!.height = Math.max(1, Math.round(H * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function build() {
      fit();
      if (W === 0 || H === 0) return;
      const iw = img.width,
        ih = img.height;
      const scale = Math.min((W * 0.92) / iw, (H * 0.92) / ih);
      const dw = Math.max(1, Math.round(iw * scale)),
        dh = Math.max(1, Math.round(ih * scale));
      const ox = (W - dw) / 2,
        oy = (H - dh) / 2;

      // Reduced motion: just paint the logo once, no particles.
      if (reduce) {
        ctx!.clearRect(0, 0, W, H);
        ctx!.drawImage(img, ox, oy, dw, dh);
        return;
      }

      const off = document.createElement("canvas");
      off.width = dw;
      off.height = dh;
      const octx = off.getContext("2d")!;
      octx.drawImage(img, 0, 0, dw, dh);
      const data = octx.getImageData(0, 0, dw, dh).data;

      const step = Math.max(3, Math.round(dw / 150));
      const ambient = variant === "ambient";
      parts = [];
      for (let y = 0; y < dh; y += step) {
        for (let x = 0; x < dw; x += step) {
          const a = data[(y * dw + x) * 4 + 3];
          if (a > 130) {
            const tx = ox + x,
              ty = oy + y;
            if (ambient) {
              parts.push({ tx, ty, x: tx, y: ty, delay: 0, dur: 0.001, size: 3.5 + Math.random() * 3, ph: Math.random() * 6.283 });
            } else {
              const ang = Math.random() * 6.283,
                dist = 60 + Math.random() * Math.max(W, H) * 0.5;
              parts.push({
                tx,
                ty,
                x: tx + Math.cos(ang) * dist,
                y: ty + Math.sin(ang) * dist + 120 + Math.random() * 160,
                delay: Math.random() * 0.32,
                dur: 0.55 + Math.random() * 0.4,
                size: 4 + Math.random() * 4,
                ph: Math.random() * 6.283,
              });
            }
          }
        }
      }
      ready = true;
      t0 = performance.now();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    }

    const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

    function loop(now: number) {
      if (!ready) return;
      const t = (now - t0) / 1000;
      ctx!.clearRect(0, 0, W, H);
      ctx!.globalCompositeOperation = "lighter";
      let formed = true;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const lt = (t - p.delay) / p.dur;
        const g = lt <= 0 ? 0 : lt >= 1 ? 1 : easeOutCubic(lt);
        if (g < 1) formed = false;
        const idleX = Math.sin(now / 1400 + p.ph) * 0.6;
        const idleY = Math.cos(now / 1600 + p.ph) * 0.6;
        const x = p.x + (p.tx - p.x) * g + idleX * g;
        const y = p.y + (p.ty - p.y) * g + idleY * g;
        const sheen = 0.6 + 0.4 * Math.sin(now / 900 - (p.tx / Math.max(W, 1)) * 4 + p.ph * 0.2);
        const a = (0.25 + 0.75 * g) * (formed ? sheen : 0.4 + 0.6 * g);
        const s = p.size * (1 + (1 - g) * 1.3);
        ctx!.globalAlpha = Math.max(0, Math.min(1, a));
        ctx!.drawImage(sprite, x - s, y - s, s * 2, s * 2);
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(loop);
    }

    let to: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(to);
      to = setTimeout(build, 180);
    };
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (ready && !reduce) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(to);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      img.onload = null;
    };
  }, [src, variant]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
