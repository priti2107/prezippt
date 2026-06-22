import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import CityScene from "./CityScene";
import { SCENES, type Scene } from "./scenes";

const N = SCENES.length;

function SceneOverlay({
  scene,
  index,
  progress,
}: {
  scene: Scene;
  index: number;
  progress: MotionValue<number>;
}) {
  const center = (index + 0.5) / N;
  const w = 1 / N;
  const opacity = useTransform(
    progress,
    [
      Math.max(0, center - w * 0.62),
      Math.max(0, center - w * 0.28),
      Math.min(1, center + w * 0.28),
      Math.min(1, center + w * 0.62),
    ],
    [0, 1, 1, 0],
  );
  const y = useTransform(
    progress,
    [
      Math.max(0, center - w * 0.62),
      center,
      Math.min(1, center + w * 0.62),
    ],
    [60, 0, -60],
  );
  const scale = useTransform(
    progress,
    [
      Math.max(0, center - w * 0.62),
      center,
      Math.min(1, center + w * 0.62),
    ],
    [0.94, 1, 1.04],
  );

  return (
    <motion.div
      style={{ opacity, y, scale }}
      className="pointer-events-none fixed inset-0 flex items-center justify-center px-6 py-20 md:px-12"
    >
      <SceneContent scene={scene} />
    </motion.div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="glass-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
      <span className="size-1.5 rounded-full bg-primary animate-pulse" />
      {children}
    </span>
  );
}

function SceneContent({ scene }: { scene: Scene }) {
  if (scene.variant === "hero") {
    return (
      <div className="pointer-events-auto flex max-w-4xl flex-col items-center text-center">
        <Kicker>{scene.kicker}</Kicker>
        <h1 className="mt-6 text-4xl font-bold leading-[1.05] text-foreground md:text-6xl">
          <span className="text-gradient">{scene.title}</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          {scene.subtitle}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          {scene.items?.map((it) => (
            <span
              key={it.title}
              className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-foreground"
            >
              <it.icon className="size-4 text-primary" />
              {it.title}
            </span>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-[0.2em]">Scroll to enter the city</span>
          <ChevronDown className="size-5 animate-bounce text-primary" />
        </div>
      </div>
    );
  }

  if (scene.variant === "final") {
    return (
      <div className="pointer-events-auto flex max-w-3xl flex-col items-center text-center">
        <Kicker>{scene.kicker}</Kicker>
        <h2 className="mt-6 text-4xl font-bold text-foreground md:text-5xl">
          {scene.title}
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">{scene.subtitle}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {scene.items?.map((it) => (
            <span
              key={it.title}
              className="glass-panel flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-foreground"
            >
              <it.icon className="size-4 text-primary" />
              {it.title}
            </span>
          ))}
        </div>
        <div className="glass-panel mt-8 rounded-2xl px-6 py-4 text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Contact
          </p>
          <p className="mt-1 text-lg font-semibold text-foreground">Yash Jain</p>
          <p className="text-sm text-primary">CTO — Cascade Tech Ventures</p>
        </div>
        <a
          href="mailto:hello@cascadetech.ventures"
          className="mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-[0_18px_40px_-14px_color-mix(in_oklab,var(--primary)_70%,transparent)] transition-transform hover:scale-[1.03]"
        >
          Let's Build The Future Together
          <ArrowUpRight className="size-5" />
        </a>
      </div>
    );
  }

  if (scene.variant === "duo") {
    return (
      <div className="pointer-events-auto w-full max-w-5xl">
        <Header scene={scene} />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {scene.items?.map((it) => (
            <div key={it.title} className="glass-panel rounded-3xl p-7">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                <it.icon className="size-6 text-primary" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-foreground">{it.title}</h3>
              {it.body && (
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {it.body}
                </p>
              )}
            </div>
          ))}
        </div>
        {scene.stats && (
          <div className="mt-5 flex flex-wrap justify-center gap-4">
            {scene.stats.map((s) => (
              <div
                key={s.label}
                className="glass-chip rounded-2xl px-6 py-3 text-center"
              >
                <div className="text-2xl font-bold text-gradient">{s.value}</div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (scene.variant === "flow") {
    return (
      <div className="pointer-events-auto w-full max-w-5xl">
        <Header scene={scene} />
        {scene.stats && (
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            {scene.stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="glass-panel rounded-2xl px-5 py-3 text-center">
                  <div className="text-lg font-bold text-primary">{s.value}</div>
                  <div className="text-xs font-medium text-foreground">{s.label}</div>
                </div>
                {i < scene.stats!.length - 1 && (
                  <span className="text-primary/50">→</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {scene.items?.map((it) => (
            <div key={it.title} className="glass-panel rounded-2xl p-6">
              <it.icon className="size-6 text-primary" />
              <h3 className="mt-4 text-base font-bold text-foreground">{it.title}</h3>
              {it.body && (
                <p className="mt-1.5 text-sm text-muted-foreground">{it.body}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // grid (default)
  return (
    <div className="pointer-events-auto w-full max-w-5xl">
      <Header scene={scene} />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scene.items?.map((it) => (
          <div
            key={it.title}
            className="glass-panel rounded-2xl p-5 transition-transform hover:-translate-y-1"
          >
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <it.icon className="size-5 text-primary" />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">{it.title}</h3>
            {it.body && (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {it.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ scene }: { scene: Scene }) {
  return (
    <div className="max-w-2xl">
      <Kicker>{scene.kicker}</Kicker>
      <h2 className="mt-4 text-3xl font-bold leading-tight text-foreground md:text-4xl">
        {scene.title}
      </h2>
      {scene.subtitle && (
        <p className="mt-3 text-base text-muted-foreground">{scene.subtitle}</p>
      )}
    </div>
  );
}

function ProgressDots({ progress }: { progress: MotionValue<number> }) {
  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setActive(Math.min(N - 1, Math.round(v * (N - 1))));
  });
  return (
    <div className="fixed right-5 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-2.5 md:flex">
      {SCENES.map((s, i) => (
        <button
          key={s.id}
          aria-label={`Go to ${s.title}`}
          onClick={() =>
            window.scrollTo({
              top: ((i + 0.5) / N) * (document.body.scrollHeight - window.innerHeight),
              behavior: "smooth",
            })
          }
          className="group flex items-center justify-end gap-2"
        >
          <span
            className={`h-1.5 rounded-full bg-primary transition-all ${
              i === active ? "w-7 opacity-100" : "w-1.5 opacity-30 group-hover:opacity-60"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
  });

  const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => setMounted(true), []);

  return (
    <div ref={containerRef} style={{ height: `${N * 100}vh` }} className="relative">
      {/* Fixed 3D world */}
      <div className="fixed inset-0 z-0 ambient-glow">
        {mounted && (
          <Canvas
            dpr={[1, 1.8]}
            camera={{ position: [0, 14, 60], fov: 52, near: 0.1, far: 600 }}
            gl={{ antialias: true, alpha: false }}
          >
            <CityScene progress={progressRef} />
          </Canvas>
        )}
      </div>

      {/* Top brand bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
        <div className="glass-chip pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
            C
          </span>
          <span className="text-sm font-bold tracking-tight text-foreground">
            Cascade Tech
          </span>
        </div>
        <span className="glass-chip pointer-events-auto hidden rounded-full px-4 py-2 text-xs font-semibold text-muted-foreground sm:block">
          Salesforce · AI Voice · Analytics
        </span>
      </div>

      {/* Scene overlays */}
      {SCENES.map((scene, i) => (
        <SceneOverlay key={scene.id} scene={scene} index={i} progress={scrollYProgress} />
      ))}

      <ProgressDots progress={scrollYProgress} />

      {/* Bottom progress bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 h-1 bg-border/40">
        <motion.div
          style={{ scaleX: barScaleX, transformOrigin: "0% 50%" }}
          className="h-full bg-gradient-to-r from-primary to-secondary"
        />
      </div>
    </div>
  );
}
