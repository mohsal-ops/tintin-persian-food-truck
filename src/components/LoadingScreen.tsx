"use client";
// The Wagon Wheel loading loader - a small, centered line-art burger that
// assembles from its ingredients, flashes a shine burst outward when complete,
// then flips like a coin (3D) to reveal the logo, with a shimmering wordmark
// underneath. Loops until the page finishes loading, then fades out.
// Pure CSS, no libraries.

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { SITE_CONFIG } from "@/lib/siteConfig";

type Phase = "assemble" | "hold" | "flip" | "holdLogo" | "fadeOut";

// Cumulative offsets (ms) from the start of a loop.
const T = {
  hold: 1050, // assembled + shine burst
  flip: 1750, // coin flip → logo
  holdLogo: 2400, // logo held
  end: 3900,
};

const NAME = SITE_CONFIG.name;

// Shine lines radiating OUTWARD from around the burger (start near its edge and
// shoot outward past the viewBox - the SVG uses overflow:visible).
const SHINE = [
  { x1: 105, y1: 34, x2: 119, y2: 22, stagger: 0 },
  { x1: 15, y1: 34, x2: 1, y2: 22, stagger: 60 },
  { x1: 109, y1: 50, x2: 123, y2: 50, stagger: 30 },
  { x1: 11, y1: 50, x2: -3, y2: 50, stagger: 30 },
  { x1: 105, y1: 66, x2: 119, y2: 78, stagger: 90 },
  { x1: 15, y1: 66, x2: 1, y2: 78, stagger: 90 },
];

export default function LoadingScreen({
  keepLooping = false,
  transparent = false,
}: {
  keepLooping?: boolean;
  // When true the loader has no white backdrop and ignores pointer events, so
  // it floats centered over whatever is behind it (e.g. a page skeleton).
  transparent?: boolean;
}) {
  const [phase, setPhase] = useState<Phase>("assemble");
  const [mounted, setMounted] = useState(true);
  const [loopCount, setLoopCount] = useState(0);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const exitRef = useRef(false);

  useEffect(() => {
    const push = (fn: () => void, ms: number) => {
      timers.current.push(setTimeout(fn, ms));
    };

    const cycle = () => {
      setPhase("assemble");
      push(() => setPhase("hold"), T.hold);
      push(() => setPhase("flip"), T.flip);
      push(() => setPhase("holdLogo"), T.holdLogo);
      push(() => {
        if (exitRef.current) {
          setPhase("fadeOut");
          push(() => setMounted(false), 500);
        } else {
          setLoopCount((c) => c + 1);
          cycle();
        }
      }, T.end);
    };

    const requestExit = () => {
      exitRef.current = true;
    };

    if (!keepLooping) {
      if (document.readyState === "complete") requestExit();
      else window.addEventListener("load", requestExit);
    }

    cycle();

    return () => {
      window.removeEventListener("load", requestExit);
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [keepLooping]);

  if (!mounted) return null;

  const flipped = phase === "flip" || phase === "holdLogo" || phase === "fadeOut";

  const layerAnim = (delay: number) =>
    phase === "assemble"
      ? `layerIn 0.36s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both`
      : "none";

  const svgLayer: React.CSSProperties = { transformBox: "fill-box", transformOrigin: "center" };
  // Line-art: charcoal outlines, no fills (cheese keeps the single yellow accent).
  const outline = {
    stroke: "#121212",
    strokeWidth: 2,
    fill: "none" as const,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };

  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };

  return (
    <>
      <style>{`
        @keyframes layerIn {
          0%   { opacity: 0; transform: translateY(-42px) scale(0.4); }
          70%  { opacity: 1; }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes seedPop { from { opacity: 0; transform: scale(0); } to { opacity: 1; transform: scale(1); } }
        @keyframes shineOut { 0% { stroke-dashoffset: 20; opacity: 0.2; } 45% { stroke-dashoffset: 0; opacity: 1; } 100% { stroke-dashoffset: -20; opacity: 0; } }
        @keyframes coinFlip {
          0%   { transform: rotateY(0deg) scale(1); }
          50%  { transform: rotateY(90deg) scale(1.16); }
          100% { transform: rotateY(180deg) scale(1); }
        }
        @keyframes shimmer { 0% { background-position: 140% 0; } 100% { background-position: -140% 0; } }
        @keyframes screenFadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>

      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          backgroundColor: transparent ? "transparent" : "#ffffff",
          pointerEvents: transparent ? "none" : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "13px",
          fontFamily: "inherit",
          animation: phase === "fadeOut" ? "screenFadeOut 0.5s ease forwards" : undefined,
        }}
      >
        {/* Soft white halo so the loader stays legible over a page skeleton */}
        {transparent && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 240,
              height: 240,
              transform: "translate(-50%, -58%)",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.96) 34%, rgba(255,255,255,0) 72%)",
            }}
          />
        )}
        {/* 3D coin-flip stage: burger on the front, logo on the back */}
        <div style={{ perspective: "560px", width: 88, height: 82, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            key={`card-${loopCount}`}
            style={{
              position: "relative",
              width: 74,
              height: 74,
              transformStyle: "preserve-3d",
              animation: flipped ? "coinFlip 0.62s cubic-bezier(0.5,0,0.3,1) forwards" : undefined,
            }}
          >
            {/* FRONT - line-art burger */}
            <div style={face}>
              <svg width="70" viewBox="0 0 120 100" fill="none" style={{ overflow: "visible" }}>
                {/* Shine burst - outside the burger, on assembly complete */}
                <g>
                  {SHINE.map((l, i) => (
                    <line
                      key={i}
                      x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                      stroke="#FFB800"
                      strokeWidth={2.6}
                      strokeLinecap="round"
                      strokeDasharray={20}
                      strokeDashoffset={20}
                      style={{ opacity: 0, animation: phase === "hold" ? `shineOut 0.5s ease ${l.stagger}ms forwards` : "none" }}
                    />
                  ))}
                </g>

                {/* Burger - line art */}
                <g>
                  {/* Bottom bun */}
                  <path d="M 26,71 Q 24,71 24,74 Q 24,82 60,82 Q 96,82 96,74 Q 96,71 94,71 Z"
                    {...outline} style={{ ...svgLayer, animation: layerAnim(0) }} />
                  {/* Patty */}
                  <path d="M 22,60 Q 60,55 98,60 Q 100,62 98,67 Q 60,72 22,67 Q 20,62 22,60 Z"
                    {...outline} style={{ ...svgLayer, animation: layerAnim(100) }} />
                  {/* Cheese with drips - the one yellow accent */}
                  <path d="M 18,53 L 102,53 Q 103,55 101,57 L 96,57 L 91,63 L 86,57 L 71,57 L 67,62 L 62,57 L 46,57 L 42,63 L 37,57 L 19,57 Q 17,55 18,53 Z"
                    fill="#FFB800" stroke="#121212" strokeWidth={2} strokeLinejoin="round" style={{ ...svgLayer, animation: layerAnim(200) }} />
                  {/* Lettuce - wavy ruffled edge */}
                  <path d="M 15,49 Q 60,44 105,49 Q 107,51 104,53 Q 98,58 93,52 Q 87,58 82,52 Q 76,58 71,52 Q 65,58 60,52 Q 54,58 49,52 Q 43,58 38,52 Q 32,58 27,52 Q 21,58 16,52 Q 13,51 15,49 Z"
                    {...outline} style={{ ...svgLayer, animation: layerAnim(300) }} />
                  {/* Top bun */}
                  <path d="M 22,47 Q 22,24 60,23 Q 98,24 98,47 Q 98,48 96,48 L 24,48 Q 22,48 22,47 Z"
                    {...outline} style={{ ...svgLayer, animation: layerAnim(400) }} />
                  {/* Sesame seeds */}
                  {[
                    { cx: 48, cy: 36, r: 1.7 },
                    { cx: 60, cy: 32, r: 1.8 },
                    { cx: 72, cy: 36, r: 1.7 },
                    { cx: 54, cy: 41, r: 1.5 },
                    { cx: 66, cy: 41, r: 1.5 },
                  ].map((s, i) => (
                    <ellipse key={i} cx={s.cx} cy={s.cy} rx={s.r} ry={s.r * 0.62} fill="#121212"
                      style={{ ...svgLayer, animation: phase === "assemble" ? "seedPop 0.15s ease 520ms both" : "none" }} />
                  ))}
                </g>
              </svg>
            </div>

            {/* BACK - logo, revealed by the flip */}
            <div style={{ ...face, transform: "rotateY(180deg)" }}>
              <Image
                src="/logo.png"
                alt="The Wagon Wheel"
                width={52}
                height={52}
                priority
                className="select-none rounded-full"
                style={{ width: 52, height: 52, objectFit: "cover" }}
              />
            </div>
          </div>
        </div>

        {/* Shimmering wordmark */}
        <div
          style={{
            fontSize: "0.6rem",
            fontWeight: 700,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            paddingLeft: "0.26em",
            backgroundImage: "linear-gradient(90deg, #4d4d4d 0%, #4d4d4d 40%, #000000 50%, #4d4d4d 60%, #4d4d4d 100%)",
            backgroundSize: "220% 100%",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 2.2s linear infinite",
          }}
        >
          {NAME}
        </div>
      </div>
    </>
  );
}
