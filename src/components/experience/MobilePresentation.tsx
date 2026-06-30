/**
 * MobilePresentation.tsx
 *
 * Highly optimized Slide Presentation Mode for mobile viewports (< 768px).
 *
 * Features:
 * 1. Slide Preloading: Keeps only [current-1, current, current+1] mounted in the DOM.
 *    IFrame / DesktopFrame is cached across transitions.
 * 2. Instantaneous Spring Transitions: GPU-accelerated translate3d slide animations.
 * 3. React.memo for zero-re-render slide caching.
 * 4. Lazy-loaded placeholder skeleton screens before load.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ChevronLeft,
  ChevronRight,
  Minimize2,
} from "lucide-react";
import { SceneContent } from "./Experience";
import { SCENES } from "./scenes";
import { DesktopFrame } from "./DesktopFrame";

const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 800;

// ─── Lightweight Skeleton Placeholder ───────────────────────────────────────

const SlideSkeleton = React.memo(function SlideSkeleton() {
  return (
    <div
      style={{
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        background: "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(20px)",
        borderRadius: "32px",
        border: "1px solid rgba(255,255,255,0.4)",
      }}
      className="flex flex-col items-center justify-center p-8 gap-6 animate-pulse"
    >
      <div className="w-48 h-8 bg-slate-200/60 rounded-full" />
      <div className="w-96 h-16 bg-slate-200/50 rounded-2xl" />
      <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-4">
        <div className="h-28 bg-slate-200/40 rounded-xl" />
        <div className="h-28 bg-slate-200/40 rounded-xl" />
        <div className="h-28 bg-slate-200/40 rounded-xl" />
      </div>
    </div>
  );
});

// ─── Pinch/Pan Hook ──────────────────────────────────────────────────────────

function usePinchPan(baseScale: number) {
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const lastPinchDist = useRef<number | null>(null);
  const lastMidpoint = useRef<{ x: number; y: number } | null>(null);
  const currentTransform = useRef(transform);
  currentTransform.current = transform;

  const clamp = useCallback((sc: number, x: number, y: number) => {
    const visualW = DESIGN_WIDTH * baseScale * sc;
    const visualH = DESIGN_HEIGHT * baseScale * sc;
    const maxX = Math.max(0, (visualW - window.innerWidth) / 2);
    const maxY = Math.max(0, (visualH - window.innerHeight) / 2);
    return {
      scale: Math.min(5, Math.max(1, sc)),
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY + 150, Math.max(-(maxY + 150), y)),
    };
  }, [baseScale]);

  const reset = useCallback(() => {
    setTransform({ scale: 1, x: 0, y: 0 });
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pointers.current.values()];

    if (pts.length === 2) {
      const dx = pts[1].x - pts[0].x;
      const dy = pts[1].y - pts[0].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };

      if (lastPinchDist.current !== null && lastMidpoint.current !== null) {
        const scaleDelta = dist / lastPinchDist.current;
        const { scale: cs, x: cx, y: cy } = currentTransform.current;
        const newScale = Math.min(5, Math.max(1, cs * scaleDelta));
        const panDX = mid.x - lastMidpoint.current.x;
        const panDY = mid.y - lastMidpoint.current.y;
        setTransform(clamp(newScale, cx + panDX, cy + panDY));
      }
      lastPinchDist.current = dist;
      lastMidpoint.current = mid;
    } else if (pts.length === 1 && currentTransform.current.scale > 1.05) {
      const [pt] = pts;
      if (lastMidpoint.current) {
        const panDX = pt.x - lastMidpoint.current.x;
        const panDY = pt.y - lastMidpoint.current.y;
        const { scale: cs, x: cx, y: cy } = currentTransform.current;
        setTransform(clamp(cs, cx + panDX, cy + panDY));
      }
      lastMidpoint.current = { x: pt.x, y: pt.y };
    } else {
      lastMidpoint.current = pts.length === 1 ? { x: pts[0].x, y: pts[0].y } : null;
    }
  }, [clamp]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) lastPinchDist.current = null;
    if (pointers.current.size === 0) lastMidpoint.current = null;
  }, []);

  const handleDoubleTap = useCallback(() => {
    setTransform((t) => t.scale > 1.1 ? { scale: 1, x: 0, y: 0 } : { scale: 2.2, x: 0, y: 0 });
  }, []);

  return { transform, reset, handlePointerDown, handlePointerMove, handlePointerUp, handleDoubleTap };
}

// ─── Scaled Slide (Memoized) ──────────────────────────────────────────────────

const ScaledSlide = React.memo(function ScaledSlide({
  scene,
  isActive,
  isVisited,
  baseScale,
  onSwipeLeft,
  onSwipeRight,
}: {
  scene: any;
  isActive: boolean;
  isVisited: boolean;
  baseScale: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}) {
  const { transform, reset, handlePointerDown, handlePointerMove, handlePointerUp, handleDoubleTap } = usePinchPan(baseScale);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    swipeStartX.current = e.touches[0].clientX;
    swipeStartY.current = e.touches[0].clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (swipeStartX.current === null || transform.scale > 1.05) return;
    const dx = swipeStartX.current - e.changedTouches[0].clientX;
    const dy = swipeStartY.current! - e.changedTouches[0].clientY;

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
      if (dx > 0) onSwipeLeft(); else onSwipeRight();
    }
    swipeStartX.current = null;
  }, [transform.scale, onSwipeLeft, onSwipeRight]);

  const lastTap = useRef(0);
  const onDoubleTap = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleDoubleTap();
    }
    lastTap.current = now;
  }, [handleDoubleTap]);

  return (
    <div
      style={{ width: "100vw", height: "100vh", overflow: "hidden", position: "relative", touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={onDoubleTap}
      className="flex items-center justify-center"
    >
      {/* Scaled Desktop Content Container */}
      <div
        style={{
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transformOrigin: "center center",
          transform: `scale(${baseScale}) translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`,
          willChange: "transform",
        }}
        className="flex-shrink-0 flex items-center justify-center"
      >
        {isVisited ? (
          <DesktopFrame width={DESIGN_WIDTH} height={DESIGN_HEIGHT}>
            <div className="w-full h-full flex items-center justify-center p-4">
              <SceneContent scene={scene} isActive={isActive} activeCardIdx={0} />
            </div>
          </DesktopFrame>
        ) : (
          <SlideSkeleton />
        )}
      </div>

      {/* Reset Zoom Button */}
      {transform.scale > 1.1 && (
        <button
          onClick={(e) => { e.stopPropagation(); reset(); }}
          className="absolute top-20 right-4 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-full p-2.5 shadow-lg active:scale-95 transition-transform"
          aria-label="Reset zoom"
        >
          <Minimize2 className="size-4 text-slate-700" />
        </button>
      )}
    </div>
  );
}, (prev, next) => {
  return (
    prev.scene.id === next.scene.id &&
    prev.isActive === next.isActive &&
    prev.isVisited === next.isVisited &&
    prev.baseScale === next.baseScale
  );
});

// ─── Main Presentation View ──────────────────────────────────────────────────

export default function MobilePresentation() {
  const [current, setCurrent] = useState(0);
  const [showSlideMenu, setShowSlideMenu] = useState(false);
  const [visitedSlides, setVisitedSlides] = useState<Set<number>>(() => new Set([0, 1]));
  const prefersReducedMotion = useReducedMotion();
  const total = SCENES.length;

  useEffect(() => {
    setVisitedSlides((prev) => {
      if (prev.has(current) && (current === 0 || prev.has(current - 1)) && (current === total - 1 || prev.has(current + 1))) {
        return prev;
      }
      const next = new Set(prev);
      next.add(current);
      if (current > 0) next.add(current - 1);
      if (current < total - 1) next.add(current + 1);
      return next;
    });
  }, [current, total]);

  // Precompute scale once on mount
  const baseScale = useMemo(() => {
    if (typeof window === "undefined") return 0.28;
    const scaleX = (window.innerWidth * 0.94) / DESIGN_WIDTH;
    const scaleY = (window.innerHeight * 0.76) / DESIGN_HEIGHT;
    return Math.min(scaleX, scaleY);
  }, []);

  const goTo = useCallback((idx: number) => {
    if (idx < 0 || idx >= total) return;
    setCurrent(idx);
  }, [total]);

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  // Transition spring
  const transition = useMemo(() => ({
    type: "spring" as const,
    stiffness: prefersReducedMotion ? 500 : 280,
    damping: prefersReducedMotion ? 40 : 32,
    mass: 0.8,
  }), [prefersReducedMotion]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#EDF3FB]">
      {/* Background ambient mesh */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "radial-gradient(#0077B6 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full blur-[130px] opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #0EA5E9 0%, transparent 70%)" }} />
      <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full blur-[100px] opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, #2563EB 0%, transparent 70%)" }} />

      {/* ── TOP NAV BAR ── */}
      <div
        className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-4 bg-white/80 backdrop-blur-xl border-b border-slate-200/50"
        style={{ paddingTop: "max(12px, env(safe-area-inset-top))", paddingBottom: "10px" }}
      >
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] flex items-center justify-center text-white font-[900] text-xs shadow-md shadow-sky-500/20">C</div>
          <div>
            <span className="text-[9px] font-[900] text-slate-400 uppercase tracking-widest block">Cascade Tech</span>
            <span className="text-[11px] font-[900] text-[#0F172A] leading-none">{SCENES[current].kicker.replace(/^District\s+\d+\s+·\s+/i, "")}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-[11px] font-[900] text-slate-400 tabular-nums">
            <span className="text-[#0EA5E9]">{String(current + 1).padStart(2, "0")}</span>
            <span className="text-slate-200 mx-0.5">/</span>
            {String(total).padStart(2, "0")}
          </div>
          <button
            onClick={() => setShowSlideMenu(!showSlideMenu)}
            className="text-[9px] font-[900] text-slate-500 border border-slate-200 bg-white rounded-full px-2.5 py-1 uppercase tracking-wider"
          >
            Slides
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-slate-200/50 z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]"
          animate={{ width: `${((current + 1) / total) * 100}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 28 }}
        />
      </div>

      {/* ── SLIDE SELECTOR MENU ── */}
      <AnimatePresence>
        {showSlideMenu && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-14 right-4 z-50 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl p-3 min-w-[170px] max-h-[70vh] overflow-y-auto"
          >
            {SCENES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => { goTo(i); setShowSlideMenu(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-[11px] font-bold transition-colors ${i === current ? "bg-[#0EA5E9] text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <span className="opacity-40 mr-1.5 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {slide.kicker.replace(/^District\s+\d+\s+·\s+/i, "")}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SLIDES STAGE (Preloaded & Cached [current-1, current, current+1] layout) ── */}
      <div className="absolute inset-0" style={{ paddingTop: 56, paddingBottom: 80 }}>
        {SCENES.map((scene, i) => {
          const isNear = Math.abs(i - current) <= 1;
          if (!isNear) return null; // Keep only near slides mounted in DOM

          const isActive = i === current;
          const isPreloaded = Math.abs(i - current) === 1;

          const isVisited = visitedSlides.has(i);
          return (
            <motion.div
              key={scene.id}
              style={{
                position: "absolute",
                inset: 0,
                willChange: "transform, opacity",
              }}
              animate={{
                x: `${(i - current) * 100}%`,
                opacity: isActive ? 1 : 0,
              }}
              transition={transition}
            >
              <ScaledSlide
                scene={scene}
                isActive={isActive}
                isVisited={isVisited}
                baseScale={baseScale}
                onSwipeLeft={goNext}
                onSwipeRight={goPrev}
              />
            </motion.div>
          );
        })}
      </div>

      {/* ── BOTTOM SLIDE CONTROLS ── */}
      <div
        className="absolute bottom-0 inset-x-0 z-30 bg-white/80 backdrop-blur-xl border-t border-slate-200/50 px-4 pt-2"
        style={{ paddingBottom: "max(16px, env(safe-area-inset-bottom))" }}
      >
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-1.5 mb-2.5">
          {SCENES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="p-1"
            >
              <motion.span
                animate={{
                  width: i === current ? 18 : 5,
                  backgroundColor: i === current ? "#0EA5E9" : i < current ? "#94A3B8" : "#CBD5E1",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="block h-[5px] rounded-full"
              />
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={goPrev}
            disabled={current === 0}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-[12px] font-[900] transition-all active:scale-95 border ${current === 0 ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed" : "bg-white border-slate-200 text-slate-700 shadow-sm"}`}
          >
            <ChevronLeft className="size-4" /> Prev
          </button>
          <button
            onClick={goNext}
            disabled={current === total - 1}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-[12px] font-[900] transition-all active:scale-95 ${current === total - 1 ? "bg-slate-100 border border-slate-100 text-slate-300 cursor-not-allowed" : "bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] text-white shadow-lg shadow-sky-500/20"}`}
          >
            Next <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
