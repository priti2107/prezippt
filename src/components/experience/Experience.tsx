import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  CloudCog,
  Target,
  Megaphone,
  Globe,
  LineChart,
  PhoneCall,
  RefreshCw,
  Gauge,
  Check,
  Sparkles,
  Volume2,
  Clock,
  Phone,
  Mic,
  TrendingUp,
  BarChart3,
  Headset,
  Workflow,
  Users,
  Search,
  Code,
  ChevronRight,
  Cloud,
  Layers,
  HeartHandshake,
  Award,
  Calendar,
  ShieldCheck,
  Lightbulb,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  MessageSquare,
  Ticket,
  BadgeCheck,
  Mail,
  AlertTriangle,
  Home,
  Landmark,
  Building2,
  Zap,
  X,
  ChevronLeft,
  Wallet,
  Rocket,
  BrainCircuit,
  Database,
  Linkedin,
} from "lucide-react";
import CityScene from "./CityScene";
import { SCENES, type Scene } from "./scenes";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const N = SCENES.length;

function CountUp({
  value,
  suffix = "",
  duration = 1.2,
  delay = 1.8,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const end = value;
      const totalSteps = 60;
      const stepTime = (duration * 1000) / totalSteps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / totalSteps;
        const easeProgress = progress * (2 - progress); // Ease out quadratic
        const currentVal = Math.floor(easeProgress * end);
        setCount(currentVal);

        if (currentStep >= totalSteps) {
          clearInterval(interval);
          setCount(end);
        }
      }, stepTime);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, duration, delay]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}
const getSafeRange = (
  p0: number,
  p1: number,
  p2: number,
  p3: number
): [number, number, number, number] => {
  let r0 = Math.max(0, Math.min(1, p0));
  let r1 = Math.max(0, Math.min(1, p1));
  let r2 = Math.max(0, Math.min(1, p2));
  let r3 = Math.max(0, Math.min(1, p3));

  const eps = 1e-6;

  if (r1 <= r0) r1 = r0 + eps;
  if (r2 <= r1) r2 = r1 + eps;
  if (r3 <= r2) r3 = r2 + eps;

  if (r3 > 1) {
    r3 = 1;
    if (r2 >= r3) r2 = r3 - eps;
    if (r1 >= r2) r1 = r2 - eps;
    if (r0 >= r1) r0 = r1 - eps;
  }

  return [r0, r1, r2, r3];
};

const getSafeRange3 = (
  p0: number,
  p1: number,
  p2: number
): [number, number, number] => {
  let r0 = Math.max(0, Math.min(1, p0));
  let r1 = Math.max(0, Math.min(1, p1));
  let r2 = Math.max(0, Math.min(1, p2));

  const eps = 1e-6;

  if (r1 <= r0) r1 = r0 + eps;
  if (r2 <= r1) r2 = r1 + eps;

  if (r2 > 1) {
    r2 = 1;
    if (r1 >= r2) r1 = r2 - eps;
    if (r0 >= r1) r0 = r1 - eps;
  }

  return [r0, r1, r2];
};

function SceneOverlay({
  scene,
  index,
  progress,
  active,
}: {
  scene: Scene;
  index: number;
  progress: MotionValue<number>;
  active: number;
}) {
  const divisor = N - 1;
  const center = index / divisor;
  const w = 1 / divisor;

  let opacityRange: number[];
  let opacityOutput: number[];
  let yRange: number[];
  let yOutput: number[];
  let scaleRange: number[];
  let scaleOutput: number[];

  if (index === 0) {
    opacityRange = [0, w * 0.45];
    opacityOutput = [1, 0];

    yRange = [0, w * 0.45];
    yOutput = [0, -60];

    scaleRange = [0, w * 0.45];
    scaleOutput = [1, 1.04];
  } else if (index === N - 1) {
    opacityRange = [1 - w * 0.45, 1];
    opacityOutput = [0, 1];

    yRange = [1 - w * 0.45, 1];
    yOutput = [60, 0];

    scaleRange = [1 - w * 0.45, 1];
    scaleOutput = [0.94, 1];
  } else {
    opacityRange = getSafeRange3(
      center - w * 0.45,
      center,
      center + w * 0.45
    );
    opacityOutput = [0, 1, 0];

    yRange = getSafeRange3(
      center - w * 0.45,
      center,
      center + w * 0.45
    );
    yOutput = [60, 0, -60];

    scaleRange = getSafeRange3(
      center - w * 0.45,
      center,
      center + w * 0.45
    );
    scaleOutput = [0.94, 1, 1.04];
  }

  const opacity = useTransform(progress, opacityRange, opacityOutput);
  const y = useTransform(progress, yRange, yOutput);
  const scale = useTransform(progress, scaleRange, scaleOutput);

  const shouldRender = Math.abs(active - index) <= 1;
  if (!shouldRender) return null;
  return (
    <motion.div
      style={{ opacity, y, scale }}
      className={`pointer-events-none fixed inset-0 flex items-center justify-center px-6 md:px-12 py-10`}
    >
      <SceneContent scene={scene} isActive={active === index} />
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


function WhoWeAreScene({ scene }: { scene: Scene }) {
  const [activeCard, setActiveCard] = useState(0);

  return (
    <div className="pointer-events-auto who-we-are-glass-panel rounded-[40px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col pt-5 pb-5 px-6 md:px-8 justify-between gap-3 md:gap-4 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]">
      {/* TOP ROW: Content (55%) + Dashboard (45%) */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-between w-full h-auto relative z-10">
        {/* LEFT SIDE: Content (55% width) */}
        <div className="w-full md:w-[55%] flex flex-col justify-start text-left max-w-[600px]">
          <div className="inline-flex items-center gap-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-4 py-1.5 text-xs font-bold tracking-wider text-[#0369A1] w-fit mb-2.5">
            <span className="size-2 rounded-full bg-[#0284C7] animate-pulse" />
            {scene.kicker}
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-[32px] xl:text-[38px] font-[800] leading-[1.1] tracking-tight text-[#0F172A] font-display max-w-[600px] mb-2">
            Built for the Modern Enterprise
          </h2>
          <div className="w-16 h-[3px] bg-[#0284C7] rounded mb-3" />

          <p className="text-xs md:text-sm text-[#475569] font-medium leading-relaxed max-w-[550px]">
            Cascade Tech Ventures combines deep Salesforce craftsmanship with cutting-edge AI to help organizations grow, scale, and operate with precision.
          </p>
        </div>

        {/* RIGHT SIDE: Floating Dashboard Panel (45% width, reduced height and width) */}
        <div className="w-full md:w-[43%] flex flex-col h-auto rounded-2xl border border-white/60 bg-[#F8FAFC]/90 shadow-inner p-3 md:p-3.5 relative overflow-visible justify-between">
          {/* Console Header */}
          <div className="flex items-center justify-between border-b border-slate-200/40 pb-1.5 mb-1.5">
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-[#EF4444]/90" />
              <div className="size-2 rounded-full bg-[#F59E0B]/90" />
              <div className="size-2 rounded-full bg-[#10B981]/90" />
            </div>
            <span className="text-[8px] font-bold text-slate-400 tracking-wider font-mono">
              cascade.cloud / performance
            </span>
          </div>

          {/* Dashboard Widgets Grid - Compact sizing */}
          <div className="grid grid-cols-2 gap-2 content-center">
            {/* CRM Performance Card */}
            <div className="bg-white border border-slate-100 rounded-xl p-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">CRM Performance</span>
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded-full">+24%</span>
              </div>
              <p className="text-sm md:text-base lg:text-[17px] font-black text-slate-800 mt-0.5 font-display leading-none">99.8% Sync</p>
              <p className="text-[8px] text-slate-400 mt-0.5 font-medium">Real-time Health Check</p>
            </div>

            {/* Workflow Automation Metrics */}
            <div className="bg-white border border-slate-100 rounded-xl p-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">Workflows Active</span>
                <span className="text-[8px] font-bold text-sky-600 bg-sky-50 px-1 rounded-full">Active</span>
              </div>
              <p className="text-sm md:text-base lg:text-[17px] font-black text-slate-800 mt-0.5 font-display leading-none">1,420 / hr</p>
              <p className="text-[8px] text-slate-400 mt-0.5 font-medium">Auto-routing tasks</p>
            </div>

            {/* Customer Growth Analytics */}
            <div className="bg-white border border-slate-100 rounded-xl p-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-left">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">Customer Growth</span>
                <span className="text-[8px] font-bold text-[#10B981] bg-emerald-50 px-1.5 rounded-full">+120%</span>
              </div>
              <div className="flex items-end justify-between h-5 mt-1.5 px-0.5">
                {[20, 45, 30, 55, 60, 40, 80].map((h, i) => (
                  <div key={i} className="w-[8%] bg-[#0EA5E9] rounded-t-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>

            {/* Salesforce Ecosystem Overview */}
            <div className="bg-white border border-slate-100 rounded-xl p-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">Ecosystem Link</span>
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded-full">Secure</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-2 h-5">
                <div className="size-4.5 rounded bg-sky-50 border border-sky-100 flex items-center justify-center flex-shrink-0">
                  <Cloud className="size-2.5 text-[#0284C7]" />
                </div>
                <div className="h-[1px] bg-slate-200 flex-grow relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-[40%] size-1 bg-[#0284C7] rounded-full animate-ping" />
                </div>
                <div className="size-4.5 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="size-2.5 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* AI Process Optimization Chart (Col span 2) */}
            <div className="bg-white border border-slate-100 rounded-xl p-2 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 text-left col-span-2">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-extrabold text-slate-500 uppercase tracking-wider">AI Process Optimization</span>
                <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded-full">-35% Latency</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                  <div className="bg-[#0284C7] h-full rounded-full w-[85%]" />
                </div>
                <span className="text-[10px] font-bold text-slate-700">85%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Sliding Feature Cards */}
      <div className="relative overflow-hidden w-full max-w-[640px] mx-auto h-[210px] md:h-[235px] z-10 flex flex-col justify-center mt-2.5">
        <motion.div
          className="flex w-full h-full"
          animate={{ x: `-${activeCard * 100}%` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {scene.items?.map((it, idx) => {
            const titleText = idx === 0
              ? "Tailored Digital Transformation"
              : idx === 1
                ? "Enhanced Operational Efficiency"
                : "CRM Expertise for Success";

            const descText = idx === 0
              ? "Custom Salesforce strategies designed around your operating model, your customers, and your growth targets — never templated."
              : idx === 1
                ? "Automate manual workflows, eliminate data silos, and free your teams to focus on revenue-generating activity."
                : "Deep multi-cloud Salesforce expertise — from architecture and implementation to managed support and optimization.";

            return (
              <div key={it.title} className="w-full h-full flex-shrink-0 px-2">
                <motion.div
                  animate={{
                    scale: activeCard === idx ? 1 : 0.96,
                    opacity: activeCard === idx ? 1 : 0.4
                  }}
                  transition={{ duration: 0.5 }}
                  className="bg-white/80 backdrop-blur-md border border-[#E2E8F0] rounded-2xl p-4 flex flex-col justify-between text-left shadow-sm hover:shadow-md hover:border-[#0EA5E9]/30 transition-all duration-300 h-full w-full relative"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8.5 items-center justify-center rounded-xl bg-sky-50 border border-sky-100 flex-shrink-0">
                        <it.icon className="size-4.5 text-[#0284C7]" />
                      </div>
                      <h3 className="text-xs sm:text-sm md:text-base font-[800] text-[#0F172A] leading-tight">
                        {titleText}
                      </h3>
                    </div>
                    <p className="mt-1.5 text-[11px] md:text-xs leading-normal text-[#475569] font-medium">
                      {descText}
                    </p>
                  </div>

                  {/* Mini visual component anchored to card bottom */}
                  <div className="mt-auto pt-2.5">
                    {idx === 0 && (
                      <div className="flex items-center justify-between w-full bg-slate-50/50 px-2 py-2 rounded-xl border border-slate-100 text-[10px] md:text-xs font-bold text-[#475569]">
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className="size-6 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100 shadow-sm">
                            <Search className="size-3" />
                          </div>
                          <span className="text-[8.5px] font-bold text-slate-600 mt-0.5">Discovery</span>
                        </div>
                        <ChevronRight className="size-2.5 text-slate-400" />
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className="size-6 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100 shadow-sm">
                            <Layers className="size-3" />
                          </div>
                          <span className="text-[8.5px] font-bold text-slate-600 mt-0.5">Architecture</span>
                        </div>
                        <ChevronRight className="size-2.5 text-slate-400" />
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className="size-6 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100 shadow-sm">
                            <Code className="size-3" />
                          </div>
                          <span className="text-[8.5px] font-bold text-slate-600 mt-0.5">Build</span>
                        </div>
                        <ChevronRight className="size-2.5 text-slate-400" />
                        <div className="flex flex-col items-center gap-1 flex-1">
                          <div className="size-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-sm animate-pulse">
                            <Check className="size-3" />
                          </div>
                          <span className="text-[8.5px] font-bold text-emerald-600 mt-0.5">Adopt</span>
                        </div>
                      </div>
                    )}

                    {idx === 1 && (
                      <div className="flex flex-col gap-1 w-full bg-slate-50/50 px-2 py-2 rounded-xl border border-slate-100">
                        <div className="flex items-center justify-between text-[9px] md:text-[10px] font-extrabold text-[#475569]">
                          <span>Automation Gains</span>
                          <span className="text-[#10B981] font-black text-[11px]">↓ 65% Operations</span>
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[8.5px] text-slate-400 font-bold w-18">Manual Hours</span>
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div className="bg-slate-300 h-full rounded-full w-[30%]" />
                            </div>
                            <span className="text-[8.5px] text-slate-400 font-bold w-6 text-right">30%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[8.5px] text-[#0284C7] font-bold w-18">Automated</span>
                            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                              <div className="bg-[#0284C7] h-full rounded-full w-[85%]" />
                            </div>
                            <span className="text-[8.5px] text-[#0284C7] font-bold w-6 text-right">85%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {idx === 2 && (
                      <div className="flex items-center justify-around w-full bg-slate-50/50 px-2 py-2 rounded-xl border border-slate-100 text-[10px] font-bold uppercase text-[#475569] tracking-wider">
                        <div className="flex flex-col items-center gap-1">
                          <div className="size-6.5 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center border border-[#E2E8F0] shadow-sm">
                            <Target className="size-3 text-[#0284C7]" />
                          </div>
                          <span className="text-[7.5px] md:text-[8px] font-bold text-slate-500 mt-0.5">Sales Cloud</span>
                        </div>
                        <div className="h-[1px] bg-slate-200 flex-grow max-w-[30px] mx-1 border-dashed border-sky-300 border-t" />
                        <div className="flex flex-col items-center gap-1">
                          <div className="size-7.5 rounded-full bg-sky-100 text-[#0284C7] flex items-center justify-center border border-sky-200 shadow-md animate-pulse">
                            <Headset className="size-3.5 text-[#0284C7]" />
                          </div>
                          <span className="text-[7.5px] md:text-[8px] font-black text-[#0284C7] mt-0.5">Service Cloud</span>
                        </div>
                        <div className="h-[1px] bg-slate-200 flex-grow max-w-[30px] mx-1 border-dashed border-sky-300 border-t" />
                        <div className="flex flex-col items-center gap-1">
                          <div className="size-6.5 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center border border-[#E2E8F0] shadow-sm">
                            <Megaphone className="size-3 text-[#0284C7]" />
                          </div>
                          <span className="text-[7.5px] md:text-[8px] font-bold text-slate-500 mt-0.5">Marketing Cloud</span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* SLIDER NAVIGATION CONTROLS */}
      <div className="flex items-center justify-center gap-6 w-full max-w-[640px] mx-auto z-10 mt-6 mb-2">
        {/* Previous Button */}
        <button
          onClick={() => activeCard > 0 && setActiveCard(activeCard - 1)}
          disabled={activeCard === 0}
          className={`group flex items-center gap-2 text-[11px] md:text-xs font-black transition-all duration-300 select-none ${activeCard === 0
              ? "opacity-25 cursor-not-allowed text-slate-400"
              : "cursor-pointer text-slate-700 hover:text-[#0EA5E9]"
            }`}
        >
          <div className={`w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(15,23,42,0.04)] border border-slate-200/50 transition-all duration-300 ${activeCard === 0 ? "" : "group-hover:scale-110 group-hover:shadow-[0_4px_10px_rgba(14,165,233,0.12)] group-hover:border-[#0ea5e9]/20 group-hover:-translate-x-[1px]"
            }`}>
            <ChevronLeft className="w-3.5 h-3.5 text-[#0EA5E9]" />
          </div>
          <span>Previous</span>
        </button>

        {/* Indicator dots: • • • */}
        <div className="flex items-center gap-2 px-1">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveCard(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === activeCard
                  ? "w-4 bg-[#0EA5E9] shadow-[0_0_6px_rgba(14,165,233,0.6)]"
                  : "w-1.5 bg-slate-300 hover:bg-[#0EA5E9]/50"
                }`}
              aria-label={`Go to product ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => activeCard < 2 && setActiveCard(activeCard + 1)}
          disabled={activeCard === 2}
          className={`group flex items-center gap-2 text-[11px] md:text-xs font-black transition-all duration-300 select-none ${activeCard === 2
              ? "opacity-25 cursor-not-allowed text-slate-400"
              : "cursor-pointer text-slate-700 hover:text-[#0EA5E9]"
            }`}
        >
          <span>Next</span>
          <div className={`w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-[0_2px_6px_rgba(15,23,42,0.04)] border border-slate-200/50 transition-all duration-300 ${activeCard === 2 ? "" : "group-hover:scale-110 group-hover:shadow-[0_4px_10px_rgba(14,165,233,0.12)] group-hover:border-[#0ea5e9]/20 group-hover:translate-x-[1px]"
            }`}>
            <ChevronRight className="w-3.5 h-3.5 text-[#0EA5E9]" />
          </div>
        </button>
      </div>

      {/* Bottom Glow reflection element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
    </div>
  );
}

function SceneContent({ scene, isActive = false }: { scene: Scene; isActive?: boolean }) {
  if (scene.id === 2) {
    return <WhoWeAreScene scene={scene} />;
  }

  if (scene.id === 12) {
    return <EngagementModelScene scene={scene} />;
  }

  if (scene.variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut", delay: 0.5 }}
        className="pointer-events-auto hero-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[86vh] md:h-[80vh] max-w-7xl relative overflow-hidden flex flex-col md:flex-row p-8 md:p-10 justify-center gap-6 md:gap-10"
      >
        <div className="w-full md:w-1/2 flex flex-col justify-between h-full text-left">
          {/* Top content */}
          <div className="flex flex-col justify-start">
            {/* Kicker Pill */}
            <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1 text-[10px] font-bold tracking-wider text-[#0369A1] w-fit mb-2">
              <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              Salesforce Partner &bull; AI Voice Platform
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[38px] xl:text-[44px] font-[800] leading-[1.08] tracking-tight text-[#0F172A] font-display">
              Empowering <br />
              Growth Through <br />
              <span className="text-[#0284C7]">Salesforce Expertise</span> <br />
              & AI Innovation
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.7 }}
              className="mt-2 text-xs sm:text-sm text-[#475569] font-medium leading-relaxed max-w-md"
            >
              Unlocking potential through strategic Salesforce solutions and next-generation AI voice technology.
            </motion.p>

            {/* Action Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.9 }}
              className="mt-3.5 flex flex-wrap gap-3 pointer-events-auto"
            >
              <button
                onClick={() =>
                  window.scrollTo({
                    top: (1.5 / N) * (document.body.scrollHeight - window.innerHeight),
                    behavior: "smooth",
                  })
                }
                className="bg-[#0284C7] hover:bg-[#0369A1] text-xs font-bold py-2.5 px-5 rounded-full inline-flex items-center gap-2 shadow-lg shadow-sky-500/10 transition-all duration-300 hover:scale-[1.03]"
              >
                Start a conversation
                <ArrowUpRight className="size-3.5" />
              </button>
              <button
                onClick={() =>
                  window.scrollTo({
                    top: (6.5 / N) * (document.body.scrollHeight - window.innerHeight),
                    behavior: "smooth",
                  })
                }
                className="border border-[#E0F2FE] bg-white hover:bg-slate-50 text-[#0284C7] text-xs font-bold py-2.5 px-5 rounded-full inline-flex items-center gap-2 transition-all duration-300 hover:scale-[1.02]"
              >
                Explore AI Voice
              </button>
            </motion.div>
          </div>

          {/* Bottom elements (Stats & scroll indicator) */}
          <div className="flex flex-col gap-3 mt-auto">
            {/* Statistics Row - Premium Mini KPI Cards */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.1 }}
              className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-200/40 w-full"
            >
              {/* KPI Card 1 */}
              <div className="bg-white/80 hover:bg-white border border-[#E2E8F0] rounded-[16px] p-2.5 flex flex-col justify-between text-left shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-default">
                <div className="size-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center mb-1.5 shadow-sm shadow-sky-500/10">
                  <CloudCog className="size-3.5" />
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-[800] text-[#0F172A] font-display leading-none">
                    <CountUp value={6} suffix="+" delay={2.3} />
                  </span>
                  <span className="block text-[9px] font-bold text-[#475569] mt-0.5 leading-tight">
                    Salesforce Clouds
                  </span>
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 bg-[#F0F9FF] text-[#0284C7] rounded-full px-1.5 py-0.5 text-[7px] font-bold tracking-wide w-fit">
                  <Check className="size-2 text-[#0284C7] stroke-[3]" />
                  <span>Enterprise Ready</span>
                </div>
              </div>

              {/* KPI Card 2 */}
              <div className="bg-white/80 hover:bg-white border border-[#E2E8F0] rounded-[16px] p-2.5 flex flex-col justify-between text-left shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-default">
                <div className="size-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center mb-1.5 shadow-sm shadow-sky-500/10">
                  <BarChart3 className="size-3.5" />
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-[800] text-[#0F172A] font-display leading-none">
                    70-90%
                  </span>
                  <span className="block text-[9px] font-bold text-[#475569] mt-0.5 leading-tight">
                    Cost Savings
                  </span>
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 bg-[#F0F9FF] text-[#0284C7] rounded-full px-1.5 py-0.5 text-[7px] font-bold tracking-wide w-fit">
                  <Check className="size-2 text-[#0284C7] stroke-[3]" />
                  <span>Proven ROI</span>
                </div>
              </div>

              {/* KPI Card 3 */}
              <div className="bg-white/80 hover:bg-white border border-[#E2E8F0] rounded-[16px] p-2.5 flex flex-col justify-between text-left shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 cursor-default">
                <div className="size-7 rounded-full bg-[#0284C7] text-white flex items-center justify-center mb-1.5 shadow-sm shadow-sky-500/10">
                  <Headset className="size-3.5" />
                </div>
                <div>
                  <span className="block text-base sm:text-lg font-[800] text-[#0F172A] font-display leading-none">
                    24/7
                  </span>
                  <span className="block text-[9px] font-bold text-[#475569] mt-0.5 leading-tight">
                    AI Voice Agents
                  </span>
                </div>
                <div className="mt-1.5 inline-flex items-center gap-1 bg-[#F0F9FF] text-[#0284C7] rounded-full px-1.5 py-0.5 text-[7px] font-bold tracking-wide w-fit">
                  <Check className="size-2 text-[#0284C7] stroke-[3]" />
                  <span>Always On</span>
                </div>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 0.6 }}
              className="pt-1.5 flex items-center gap-2 text-[#0284C7] font-bold tracking-wider text-[10px]"
            >
              <span>Scroll to explore</span>
              <ChevronDown className="size-4 animate-bounce text-[#0284C7]" />
            </motion.div>
          </div>
        </div>

        {/* RIGHT SIDE (50%) - LIVE CONSOLE REDESIGNED */}
        <div className="hidden md:flex md:w-1/2 flex-col h-full rounded-2xl border border-white/60 bg-[#F8FAFC]/90 shadow-inner p-6 md:p-7 relative overflow-visible">
          {/* Floating Claude AI badge (top-left edge, overlapping Card 1) */}
          <div className="absolute -left-6 top-[20%] bg-white/95 border border-slate-100 rounded-[16px] py-2 px-3 shadow-lg flex items-center gap-3 z-15 animate-float-slow hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-default">
            <div className="size-8 rounded-full bg-[#0284C7] text-white flex items-center justify-center shadow-md shadow-sky-500/10">
              <Sparkles className="size-4 text-white" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] font-black text-slate-800 leading-none">Claude AI</span>
              <span className="block text-[8px] text-slate-400 font-bold mt-1 leading-none">
                Real-time NLU
              </span>
            </div>
          </div>

          {/* Floating +44% Conversion badge (bottom-right edge) */}
          <div className="absolute -right-4 bottom-[6%] bg-white/95 border border-slate-100 rounded-2xl p-2.5 shadow-xl flex items-center gap-2 max-w-[190px] text-left z-15 animate-float-slow hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-default">
            <div className="size-7 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
              <TrendingUp className="size-4 text-[#10B981]" />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-[#10B981] leading-none">+44% Conversion</p>
              <p className="text-[8px] font-bold text-slate-400 mt-1 leading-none">AI-assisted leads</p>
            </div>
          </div>

          {/* Console Header */}
          <div className="flex items-center justify-between border-b border-slate-200/40 pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <div className="size-2.5 rounded-full bg-[#EF4444]/90" />
              <div className="size-2.5 rounded-full bg-[#F59E0B]/90" />
              <div className="size-2.5 rounded-full bg-[#10B981]/90" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono">
              cascade.cloud / dashboard
            </span>
          </div>

          {/* Grid Layout of Status Cards - Row 1 */}
          <div className="grid grid-cols-3 gap-4">
            {/* Card 1: Claude AI */}
            <div className="relative bg-white border border-slate-100 rounded-2xl p-4 pt-7 shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between text-left cursor-default">
              <div className="flex items-start justify-between">
                <div className="size-7 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
                  <BarChart3 className="size-4 text-[#0284C7]" />
                </div>
                <span className="absolute top-3 right-3 text-[8px] font-extrabold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  +18%
                </span>
              </div>

              <div className="mt-3">
                <p className="text-base md:text-lg font-black text-slate-800 font-display leading-none">$4.2M</p>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider mt-1.5">Pipeline</p>
              </div>
            </div>

            {/* Card 2: Closed */}
            <div className="relative bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between text-left cursor-default">
              <div className="flex items-start justify-between">
                <div className="size-7 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
                  <Clock className="size-4 text-[#0284C7]" />
                </div>
                <span className="absolute top-3 right-3 text-[8px] font-extrabold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  +9%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-base md:text-lg font-black text-slate-800 font-display leading-none">312</p>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider mt-1.5">Closed</p>
              </div>
            </div>

            {/* Card 3: AI Calls */}
            <div className="relative bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between text-left cursor-default">
              <div className="flex items-start justify-between">
                <div className="size-7 rounded-full bg-sky-50 text-[#0284C7] flex items-center justify-center border border-sky-100">
                  <Phone className="size-4 text-[#0284C7]" />
                </div>
                <span className="absolute top-3 right-3 text-[8px] font-extrabold text-[#10B981] bg-emerald-50 px-1.5 py-0.5 rounded-full">
                  +44%
                </span>
              </div>
              <div className="mt-3">
                <p className="text-base md:text-lg font-black text-slate-800 font-display leading-none">8,914</p>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider mt-1.5">AI Calls</p>
              </div>
            </div>
          </div>

          {/* Lead Conversion Rounded Column Chart - Row 2 */}
          <div className="mt-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.01] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between text-left cursor-default">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold text-slate-700 tracking-wider">Lead &rarr; Conversion</span>
              <span className="text-[8px] font-bold text-slate-400">Last 30 days</span>
            </div>

            <div className="flex items-end justify-between h-28 w-full mt-2 pt-2 px-1">
              {[
                { h: "20%" },
                { h: "35%" },
                { h: "28%" },
                { h: "45%" },
                { h: "55%" },
                { h: "35%" },
                { h: "70%" },
                { h: "60%" },
                { h: "85%" },
                { h: "75%" },
                { h: "95%" },
              ].map((bar, idx) => (
                <div
                  key={idx}
                  style={{ height: bar.h }}
                  className="w-[7%] bg-[#0EA5E9] rounded-t-full transition-all duration-500 hover:bg-[#38BDF8]"
                />
              ))}
            </div>
          </div>

          {/* Grid Layout - Row 3 */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            {/* Live AI Voice */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col justify-between cursor-default">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Mic className="size-3.5 text-[#0EA5E9]" />
                <span className="text-[9px] md:text-[10px] font-extrabold text-slate-800 tracking-wider">Live AI Voice</span>
              </div>

              {/* Waveform visual */}
              <div className="flex items-end justify-between h-8 mt-2 px-1">
                {[3, 6, 4, 7, 5, 8, 4, 6, 5, 7, 3, 5].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-[#0EA5E9] rounded-full animate-pulse"
                    style={{
                      height: `${h * 10}%`,
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Salesforce Sync checklist */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-300 text-left flex flex-col justify-between cursor-default">
              <div className="flex items-center gap-1.5 mb-1.5">
                <CloudCog className="size-3.5 text-[#0EA5E9]" />
                <span className="text-[9px] md:text-[10px] font-extrabold text-slate-800 tracking-wider">Salesforce Sync</span>
              </div>

              <div className="flex flex-col gap-1.5 mt-1">
                {[
                  "Contact updated",
                  "Opportunity created",
                  "Case logged",
                ].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-[9px] font-bold text-slate-600">
                    <div className="size-3.5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 flex-shrink-0">
                      <Check className="size-2" />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </motion.div>
    );
  }

  if (scene.variant === "final") {
    const statsItems = [
      { value: 50, suffix: "+", label: "Projects Delivered" },
      { value: 8, suffix: "+", label: "Enterprise Clients" },
      { value: 5, suffix: "+", label: "Cities Served" },
      { value: 100, suffix: "%", label: "In-House Delivery" }
    ];

    return (
      <div
        className="pointer-events-auto who-we-are-glass-panel rounded-[40px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-6 pb-6 px-6 md:px-16 justify-center border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)] animate-in fade-in duration-500"
        style={{
          background: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Ambient soft blue glow */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)"
        }} />

        {/* Headline Spotlight Glow */}
        <div className="absolute left-[30%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[180px] bg-gradient-to-r from-sky-400/8 to-blue-500/8 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Split Screen Container - Centered and Contained within 1080px to close column gap */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-between w-full h-full relative z-10 max-w-[1080px] mx-auto py-2">
          
          {/* LEFT COLUMN: Narrative & CTAs (54% width) */}
          <div className="w-full md:w-[54%] flex flex-col justify-center items-start text-left h-full py-2">
            <div className="flex flex-col items-start gap-3 w-full">
              {/* Kicker Badge */}
              <motion.div 
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3.5 py-1 text-xs md:text-sm font-bold tracking-wider text-[#0284C7] w-fit animate-pulse"
              >
                <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
                LET'S BUILD TOGETHER
              </motion.div>

              {/* Headline - Slightly smaller & readable */}
              <motion.h2 
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-3xl md:text-[34px] lg:text-[42px] xl:text-[46px] font-[900] leading-[1.12] tracking-tight text-[#0F172A] font-display max-w-2xl"
              >
                Let's Build Something{" "}
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
                  That Actually Works.
                  <svg className="absolute -bottom-1.5 left-0 w-full h-[4px]" viewBox="0 0 200 5" fill="none" preserveAspectRatio="none">
                    <path d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </motion.h2>

              {/* Description - Slightly smaller space and font size */}
              <motion.p 
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 text-xs sm:text-sm md:text-sm lg:text-[14.5px] text-[#475569] font-medium leading-relaxed max-w-2xl"
              >
                Whether you're implementing Salesforce, building AI-powered automation, launching digital products, or transforming customer operations — let's discuss what success looks like for your business.
              </motion.p>

              {/* Proven at Scale Label */}
              <div className="mt-2">
                <span className="text-[8.5px] md:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">Proven At Scale</span>
              </div>

              {/* Statistics Cards - Sized down to avoid overlaps and improve layout fit */}
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-md mt-0.5">
                {statsItems.map((item, idx) => (
                  <motion.div 
                    key={idx} 
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="bg-white border border-slate-100 rounded-xl p-1.5 px-3.5 shadow-[0_2px_10px_rgba(14,165,233,0.01)] hover:border-[#0EA5E9]/20 hover:scale-[1.02] transition-all duration-300 flex items-center gap-3.5 cursor-default"
                  >
                    <span className="text-2xl md:text-3xl lg:text-[32px] font-[950] text-[#0284C7] font-display leading-none tracking-tight flex-shrink-0 min-w-[45px]">
                      {isActive ? (
                        <CountUp value={item.value} suffix={item.suffix} delay={0.4 + idx * 0.1} />
                      ) : (
                        `0${item.suffix}`
                      )}
                    </span>
                    <span className="text-[8.5px] md:text-[9.5px] font-bold text-slate-500 uppercase tracking-wider leading-snug">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badges immediately below stats */}
              <motion.div 
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap gap-2.5 mt-2"
              >
                {["Salesforce Partner", "AI-Native Team", "In-House Delivery", "Enterprise Ready"].map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-[#0284C7] text-[9.5px] md:text-[11px] font-black uppercase tracking-wider">
                    <Check className="size-2.5 text-[#0284C7] stroke-[3]" />
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* CTA Buttons - Sized down to look highly compact & premium */}
              <motion.div 
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="relative flex flex-row items-center gap-2.5 mt-3 w-full"
              >
                {/* Subtle blue glow behind buttons */}
                <div className="absolute -inset-2 bg-gradient-to-r from-sky-400/15 via-blue-500/15 to-indigo-500/15 blur-lg rounded-full -z-10 pointer-events-none" />

                <a
                  href="mailto:hello@cascadetech.ventures"
                  className="group relative bg-[#0284C7] hover:bg-[#0369A1] text-white text-[11px] md:text-xs font-extrabold py-2 px-4.5 rounded-full inline-flex items-center gap-1.5 shadow-md shadow-sky-500/5 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0EA5E9]/25 to-[#2563EB]/25 blur-md group-hover:blur-lg transition-all duration-300 -z-10 animate-pulse" />
                  <span>Schedule A Discovery Call</span>
                  <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <button
                  onClick={() => {
                    window.scrollTo({
                      top: 10 * window.innerHeight,
                      behavior: "smooth",
                    });
                  }}
                  className="border border-[#E0F2FE] hover:border-[#0EA5E9]/20 bg-white hover:bg-slate-50 text-[#0284C7] text-[11px] md:text-xs font-bold py-2 px-4 rounded-full inline-flex items-center gap-1.5 transition-all duration-300 hover:scale-[1.01] shadow-sm"
                >
                  View Our Work
                </button>
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Contact Drawer Card (41% width) - Centered and Larger */}
          <motion.div 
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full md:w-[41%] flex flex-col justify-center h-full py-2"
          >
            <div
              className="bg-white/95 border border-white/60 shadow-[0_20px_50px_rgba(15,23,42,0.06)] rounded-3xl p-5 md:p-6.5 flex flex-col gap-4 text-left relative overflow-hidden w-full max-w-[420px] border-t border-r mx-auto md:mx-0"
              style={{
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Subtle grid pattern in background */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="grid-card-contact-refined" width="16" height="16" patternUnits="userSpaceOnUse">
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#000" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid-card-contact-refined)" />
                </svg>
              </div>

              {/* Headline inside card */}
              <div className="border-b border-slate-200/40 pb-2">
                <span className="text-[10px] md:text-[11px] font-extrabold text-[#0284C7] uppercase tracking-widest block">Speak Directly With Our Founders</span>
              </div>

              {/* Leadership Profiles - Vertically centered with larger photos */}
              <div className="flex flex-col gap-3">
                {/* Aashish */}
                <div className="flex items-center gap-4 bg-slate-50/60 hover:bg-slate-50 border border-slate-200/50 hover:border-[#0EA5E9]/25 rounded-2xl p-2 px-3.5 transition-all duration-300">
                  <div className="relative flex-shrink-0">
                    <img 
                      src="/clients/Aashish Yadav.png" 
                      className="w-13 h-13 rounded-full border border-sky-100 object-cover shadow-sm" 
                      alt="Aashish Yadav" 
                    />
                    <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 ring-2 ring-white rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-none">Aashish Yadav</h4>
                    <p className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5 leading-none">CEO & Founder</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full leading-none">
                      <span className="size-1 rounded-full bg-emerald-500" />
                      Active Online
                    </span>
                  </div>
                </div>

                {/* Yash */}
                <div className="flex items-center gap-4 bg-slate-50/60 hover:bg-slate-50 border border-slate-200/50 hover:border-[#0EA5E9]/25 rounded-2xl p-2 px-3.5 transition-all duration-300">
                  <div className="relative flex-shrink-0">
                    <img 
                      src="/clients/Yash Jain.png" 
                      className="w-13 h-13 rounded-full border border-sky-100 object-cover shadow-sm" 
                      alt="Yash Jain" 
                    />
                    <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 ring-2 ring-white rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-none">Yash Jain</h4>
                    <p className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5 leading-none">CTO & Co-Founder</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full leading-none">
                      <span className="size-1 rounded-full bg-emerald-500" />
                      Active Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Subtle divider */}
              <div className="border-t border-slate-200/40 my-1" />

              {/* Direct Action Chips - Compact premium pills */}
              <div className="flex flex-col gap-2">
                {[
                  { label: "Website", icon: Globe, val: "cascadetech.ventures", href: "https://cascadetech.ventures" },
                  { label: "Email", icon: Mail, val: "hello@cascadetech.ventures", href: "mailto:hello@cascadetech.ventures" },
                  { label: "Phone", icon: Phone, val: "+91 98765 43210", href: "tel:+919876543210" },
                  { label: "LinkedIn", icon: Linkedin, val: "linkedin.com/company/cascade-tech", href: "https://linkedin.com" }
                ].map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <a
                      key={chip.label}
                      href={chip.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-50/60 hover:bg-white border border-slate-200/50 hover:border-[#0EA5E9]/25 hover:shadow-[0_4px_12px_rgba(14,165,233,0.04)] transition-all duration-300 group/chip"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="size-4.5 text-[#0EA5E9] transition-transform duration-300 group-hover/chip:scale-110" />
                        <span className="text-xs md:text-[13px] font-bold text-slate-600 group-hover/chip:text-[#0EA5E9]">{chip.val}</span>
                      </div>
                      <ChevronRight className="size-3.5 text-slate-300 group-hover/chip:text-[#0EA5E9] transition-transform duration-300 group-hover/chip:translate-x-0.5" />
                    </a>
                  );
                })}
              </div>

              {/* Card Trust Statement Footer */}
              <p className="text-[10px] md:text-[11px] text-slate-400 font-bold leading-normal text-center border-t border-slate-100/60 pt-3 px-1.5">
                Trusted by leading developers, enterprise teams & businesses across India.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.id === 3) {
    return (
      <div className="pointer-events-auto who-we-are-glass-panel rounded-[40px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col py-5 px-6 md:px-8 justify-between gap-3 md:gap-4">
        {/* SECTION HEADER: Centered */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1 text-[10px] font-bold tracking-wider text-[#0369A1] w-fit mb-1.5">
            <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
            District 03 &bull; Principles
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-[46px] xl:text-[52px] font-[900] leading-[1.08] tracking-tight text-[#0F172A] font-display mb-1.5">
            What we <span className="bg-gradient-to-r from-[#0ea5e9] to-[#0284C7] bg-clip-text text-transparent">stand for</span>
          </h2>
          <p className="text-sm md:text-[17px] text-[#475569] font-medium leading-relaxed max-w-2xl">
            Our values drive every Salesforce implementation, AI automation initiative, and digital transformation journey we deliver.
          </p>
        </div>

        {/* 2x2 Grid of 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 h-[71%] md:h-[73%] w-full items-stretch">
          {/* Card 1: Innovation */}
          <div className="bg-gradient-to-br from-[#F0F9FF]/95 via-white/80 to-[#E0F2FE]/50 backdrop-blur-md hover:bg-white/90 border border-sky-200/50 rounded-[28px] py-4 px-5 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(2,132,199,0.06)] hover:shadow-[0_24px_60px_rgba(2,132,199,0.12)] hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-500 flex-1 h-full animate-float-soft">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-sky-100/80 text-[#0284C7] shadow-[0_0_20px_rgba(14,165,233,0.25)] flex-shrink-0">
                  <Lightbulb className="size-5 text-[#0284C7]" />
                  <span className="absolute inset-0 rounded-xl bg-sky-400/10 blur-sm -z-10" />
                </div>
                <h3 className="text-lg md:text-[22px] lg:text-[24px] font-[800] text-[#0F172A] leading-tight">
                  Innovation
                </h3>
              </div>
              <p className="mt-2 text-xs md:text-[16px] leading-relaxed text-[#475569] font-medium">
                We continuously explore AI, automation, and emerging technologies to create smarter business solutions.
              </p>
            </div>

            {/* Bottom Widget */}
            <div className="mt-auto flex items-center justify-between w-full bg-white/80 p-2.5 rounded-xl border border-sky-100/40 shadow-sm h-14">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-4.5 text-[#0284C7]" />
                <span className="text-[10px] font-bold text-slate-600">AI</span>
              </div>
              <div className="h-5 w-[1px] bg-slate-200/80" />
              <div className="flex items-center gap-1.5">
                <Workflow className="size-4.5 text-[#0284C7]" />
                <span className="text-[10px] font-bold text-slate-600">Auto</span>
              </div>
              <div className="h-5 w-[1px] bg-slate-200/80" />
              <div className="flex items-center gap-1.5">
                <LineChart className="size-4.5 text-[#0284C7]" />
                <span className="text-[10px] font-bold text-slate-600">Data</span>
              </div>
              <div className="h-5 w-[1px] bg-slate-200/80" />
              <div className="flex items-center gap-1.5">
                <Cloud className="size-4.5 text-[#0284C7]" />
                <span className="text-[10px] font-bold text-slate-600">CRM</span>
              </div>
            </div>
          </div>

          {/* Card 2: Client Commitment */}
          <div className="bg-gradient-to-br from-[#E0F2FE]/90 via-white/80 to-[#BAE6FD]/40 backdrop-blur-md hover:bg-white/90 border border-blue-200/50 rounded-[28px] py-4 px-5 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(2,132,199,0.06)] hover:shadow-[0_24px_60px_rgba(2,132,199,0.12)] hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-500 flex-1 h-full">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-sky-100/80 text-[#0284C7] shadow-[0_0_20px_rgba(14,165,233,0.25)] flex-shrink-0">
                  <HeartHandshake className="size-5 text-[#0284C7]" />
                  <span className="absolute inset-0 rounded-xl bg-sky-400/10 blur-sm -z-10" />
                </div>
                <h3 className="text-lg md:text-[22px] lg:text-[24px] font-[800] text-[#0F172A] leading-tight">
                  Client Commitment
                </h3>
              </div>
              <p className="mt-2 text-xs md:text-[16px] leading-relaxed text-[#475569] font-medium">
                We build long-term partnerships focused on measurable outcomes, transparency, and growth.
              </p>
            </div>

            {/* Bottom Widget */}
            <div className="mt-auto flex items-center justify-between w-full bg-white/80 p-2.5 rounded-xl border border-sky-100/40 shadow-sm h-14">
              <div className="flex items-center gap-1.5">
                {["A", "B", "C", "D", "E"].map((letter, index) => (
                  <div key={letter} className="flex items-center">
                    <div className="size-6.5 rounded-full bg-gradient-to-r from-[#0ea5e9] to-[#0284C7] text-white flex items-center justify-center text-[10px] font-bold border border-white shadow-sm hover:scale-110 transition-transform duration-300 cursor-default">
                      {letter}
                    </div>
                    {index < 4 && <div className="w-2 h-[2px] bg-gradient-to-r from-sky-400 to-sky-300" />}
                  </div>
                ))}
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-[10px] font-bold text-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.1)] animate-pulse">
                100% Client Focus
              </div>
            </div>
          </div>

          {/* Card 3: Excellence */}
          <div className="bg-gradient-to-br from-white/95 via-sky-50/70 to-[#F0F9FF]/90 backdrop-blur-md hover:bg-white/90 border border-sky-100/80 rounded-[28px] py-4 px-5 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(2,132,199,0.06)] hover:shadow-[0_24px_60px_rgba(2,132,199,0.12)] hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-500 flex-1 h-full">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-sky-100/80 text-[#0284C7] shadow-[0_0_20px_rgba(14,165,233,0.25)] flex-shrink-0">
                  <Award className="size-5 text-[#0284C7]" />
                  <span className="absolute inset-0 rounded-xl bg-sky-400/10 blur-sm -z-10" />
                </div>
                <h3 className="text-lg md:text-[22px] lg:text-[24px] font-[800] text-[#0F172A] leading-tight">
                  Excellence
                </h3>
              </div>
              <p className="mt-2 text-xs md:text-[16px] leading-relaxed text-[#475569] font-medium">
                We maintain the highest standards in delivery, architecture, implementation, and support.
              </p>
            </div>

            {/* Bottom Widget */}
            <div className="mt-auto flex items-center justify-between w-full bg-white/80 p-2.5 rounded-xl border border-sky-100/50 shadow-sm h-14 gap-4">
              <div className="flex flex-col flex-1 text-left justify-center">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 mb-0.5">
                  <span>Quality Score</span>
                  <span className="text-[#0284C7] font-black">98%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-400 to-[#0284C7] h-full rounded-full w-[98%]" />
                </div>
              </div>
              <div className="h-6 w-[1px] bg-slate-200 flex-shrink-0" />
              <div className="flex flex-col flex-1 text-left justify-center">
                <div className="flex justify-between items-center text-[9px] font-bold text-slate-500 mb-0.5">
                  <span>Success Rate</span>
                  <span className="text-emerald-600 font-black">99%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full w-[99%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Integrity */}
          <div className="bg-gradient-to-br from-[#F8FAFC]/95 via-[#F1F5F9]/85 to-[#E2E8F0]/40 backdrop-blur-md hover:bg-white/90 border border-slate-200/50 rounded-[28px] py-4 px-5 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(2,132,199,0.06)] hover:shadow-[0_24px_60px_rgba(2,132,199,0.12)] hover:-translate-y-1.5 hover:scale-[1.01] transition-all duration-500 flex-1 h-full">
            <div>
              <div className="flex items-center gap-3">
                <div className="relative flex size-10 items-center justify-center rounded-xl bg-sky-100/80 text-[#0284C7] shadow-[0_0_20px_rgba(14,165,233,0.25)] flex-shrink-0">
                  <ShieldCheck className="size-5 text-[#0284C7]" />
                  <span className="absolute inset-0 rounded-xl bg-sky-400/10 blur-sm -z-10" />
                </div>
                <h3 className="text-lg md:text-[22px] lg:text-[24px] font-[800] text-[#0F172A] leading-tight">
                  Integrity
                </h3>
              </div>
              <p className="mt-2 text-xs md:text-[16px] leading-relaxed text-[#475569] font-medium">
                We operate with honesty, accountability, and trust in every engagement and business decision.
              </p>
            </div>

            {/* Bottom Widget */}
            <div className="mt-auto flex items-center justify-between w-full bg-white/80 p-2.5 rounded-xl border border-slate-200/50 shadow-sm h-14">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-[#0284C7] flex items-center justify-center border border-sky-100 shadow-sm flex-shrink-0">
                  <ShieldCheck className="size-4.5 text-[#0284C7]" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-bold text-slate-800 leading-tight">Trust & Ethics</span>
                  <span className="text-[8px] text-[#0284C7] font-black uppercase tracking-wider mt-0.5 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100/40 w-fit">
                    Compliance Active
                  </span>
                </div>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-[9.5px] font-bold text-emerald-600 shadow-[0_0_8px_rgba(16,185,129,0.08)] flex items-center gap-1 animate-pulse">
                <Check className="size-3 stroke-[3] text-emerald-600" />
                <span>Secure Delivery</span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.variant === "duo") {
    return (
      <div className="pointer-events-auto glass-panel shadow-[0_30px_90px_rgba(15,23,42,0.06)] rounded-[32px] p-6 sm:p-8 lg:p-10 w-full max-w-5xl">
        <Header scene={scene} />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {scene.items?.map((it) => (
            <div key={it.title} className="glass-panel rounded-2xl p-5 border border-slate-200/50 bg-white/50">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <it.icon className="size-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-[#0F172A]">{it.title}</h3>
              {it.body && (
                <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-[#475569] font-medium">
                  {it.body}
                </p>
              )}
            </div>
          ))}
        </div>
        {scene.stats && (
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {scene.stats.map((s) => (
              <div
                key={s.label}
                className="glass-chip rounded-xl px-5 py-2 text-center border border-slate-200/40 bg-white/40"
              >
                <div className="text-xl font-bold text-gradient">{s.value}</div>
                <div className="text-[10px] uppercase tracking-wide text-[#475569] font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (scene.id === 5) {
    const funnelSteps = [
      { label: "Lead", value: "1,240", percent: 100 },
      { label: "Opportunity", value: "612", percent: 49.3 },
      { label: "Proposal", value: "284", percent: 22.9 },
      { label: "Conversion", value: "142", percent: 11.4 },
    ];

    const kpiCards = [
      { val: "+68%", label: "Sales Productivity", icon: TrendingUp },
      { val: "+42%", label: "Pipeline Conversion", icon: Target },
      { val: "3.8M", label: "Customer Interactions", icon: Users },
      { val: "91%", label: "Forecast Accuracy", icon: Sparkles },
    ];

    return (
      <div
        className="pointer-events-auto rounded-[40px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col pt-6 pb-4 md:pt-8 md:pb-6 px-6 md:px-8 justify-between gap-3 md:gap-4 border border-[#0176D3]/20 shadow-[0_30px_100px_rgba(1,118,211,0.2)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
        style={{
          background: "rgba(235, 246, 255, 0.92)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Ambient Glow Effects */}
        <div className="absolute right-[-10%] top-[10%] w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.22) 0%, transparent 70%)"
        }} />
        <div className="absolute left-[-5%] bottom-[-5%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(0,161,224,0.12) 0%, transparent 70%)"
        }} />

        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0176D3" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Fractal Noise Overlay for subtle visual grain */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* TOP ROW: Content (40%) + Dashboard (60%) aligned to start */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 lg:gap-8 items-start justify-between w-full relative z-10 flex-1">
          {/* LEFT SIDE: Description and checklist (40% width) */}
          <div className="w-full md:w-[38%] flex flex-col justify-start text-left max-w-[500px]">
            <div className="inline-flex items-center gap-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3.5 py-1 text-[10px] font-bold tracking-wider text-[#0176D3] w-fit mb-2 md:mb-[12px]">
              <span className="size-1.5 rounded-full bg-[#0176D3] animate-pulse" />
              DISTRICT 05 &bull; SALES CLOUD
            </div>

            <h2 className="text-xl sm:text-[30px] md:text-[38px] lg:text-[48px] xl:text-[60px] 2xl:text-[72px] font-extrabold tracking-tight text-[#0F172A] font-display max-w-[600px] mb-2 md:mb-3" style={{ lineHeight: 0.95 }}>
              Close More Deals <br />
              with Intelligent <br />
              <span className="bg-gradient-to-r from-[#00A1E0] via-[#0176D3] to-[#0B5CAB] bg-clip-text text-transparent">Sales Cloud</span>
            </h2>

            <p className="text-sm sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[21px] 2xl:text-[25px] text-[#475569] font-medium max-w-[620px] mb-3 md:mb-4" style={{ lineHeight: 1.5 }}>
              Design Sales Cloud around your real sales process with AI-powered forecasting, opportunity management, lead automation and pipeline visibility.
            </p>

            {/* Checklist: Vertical Stack */}
            <div className="flex flex-col gap-2.5 md:gap-3.5 w-full">
              {[
                "End-to-end lead-to-cash architecture",
                "Einstein forecasting & opportunity scoring",
                "Custom CPQ, quoting and approvals",
                "Sales engagement and outreach automation",
              ].map((feat, idx) => (
                <div key={idx} className="flex items-start gap-3 group/item transition-transform duration-300 hover:translate-x-1 cursor-default">
                  <div className="flex size-5 md:size-5.5 items-center justify-center rounded-full bg-[#0176D3]/10 border border-[#00A1E0]/20 text-[#0176D3] shadow-sm flex-shrink-0 group-hover/item:bg-[#0176D3] group-hover/item:text-white group-hover/item:shadow-md transition-all duration-300 mt-0.5">
                    <Check className="size-3 md:size-3.5 stroke-[3.5]" />
                  </div>
                  <span className="text-xs md:text-sm lg:text-[14px] xl:text-[15px] 2xl:text-[17px] text-[#475569] font-semibold group-hover/item:text-[#0F172A] transition-colors duration-300 leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: CRM Pipeline Dashboard Card (60% width, h-fit, aligned & offset 20px upward relative to heading) */}
          <div className="w-full md:w-[58%] bg-white/92 backdrop-blur-[24px] border border-sky-100/80 shadow-[0_30px_80px_rgba(1,118,211,0.12)] rounded-[28px] p-5 md:p-6 flex flex-col justify-between h-fit md:mt-[16px] transition-all duration-300 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2.5">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Salesforce Dashboard</span>
                <span className="text-sm md:text-base lg:text-[18px] font-black text-[#0F172A] leading-tight">CRM Pipeline</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-[#0176D3]/10 text-[#0176D3] font-extrabold px-3 py-1 rounded-full text-[10px] border border-[#00A1E0]/20 flex items-center gap-1 shadow-sm">
                  <span className="size-1.5 rounded-full bg-[#0176D3] animate-pulse" />
                  Live Syncing
                </span>
              </div>
            </div>

            {/* Premium 2x2 KPI mini cards at the top */}
            <div className="grid grid-cols-2 gap-2.5 md:gap-3 mb-3 text-left">
              {[
                { label: "Total Pipeline Value", val: "$4.8M", color: "text-slate-800" },
                { label: "Forecast Accuracy", val: "95%", color: "text-[#0176D3]" },
                { label: "Active Opportunities", val: "612", color: "text-slate-800" },
                { label: "Revenue Growth", val: "+24%", color: "text-emerald-600 font-extrabold" },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 border border-slate-100 hover:border-[#0176D3]/30 rounded-xl p-2.5 md:p-3 shadow-[0_2px_8px_rgba(1,118,211,0.02)] hover:shadow-[0_4px_12px_rgba(1,118,211,0.06)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="block text-[8px] md:text-[9.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1 md:mb-1.5">{card.label}</span>
                  <span className={`text-xs sm:text-sm md:text-[15px] lg:text-base font-black ${card.color}`}>{card.val}</span>
                </div>
              ))}
            </div>

            {/* Funnel chart (Salesforce brand blue gradient with thicker bars and hover scaling animations) */}
            <div className="flex flex-col gap-2 md:gap-2.5 flex-1 justify-center my-1 md:my-1.5">
              {funnelSteps.map((step) => (
                <div key={step.label} className="flex flex-col gap-0.5 md:gap-1 w-full group/bar cursor-pointer">
                  <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-500 transition-colors duration-200 group-hover/bar:text-slate-800">
                    <span>{step.label}</span>
                    <span className="text-[#0F172A] font-extrabold">{step.value}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-4.5 md:h-5 rounded-full overflow-hidden relative shadow-inner group-hover/bar:scale-[1.015] transition-transform duration-200">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${step.percent}%` }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
                      viewport={{ once: true }}
                      className="bg-gradient-to-r from-[#00A1E0] via-[#0176D3] to-[#0B5CAB] h-full rounded-full shadow-[0_2px_10px_rgba(1,118,211,0.35)] relative overflow-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Dashboard Metrics Row */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="size-8 md:size-8.5 rounded-full bg-[#0176D3]/10 text-[#0176D3] flex items-center justify-center border border-[#00A1E0]/20 shadow-sm flex-shrink-0">
                  <TrendingUp className="size-3.5 md:size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs md:text-sm font-black text-slate-800 leading-tight">11.4%</span>
                  <span className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-wider">Win rate</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="size-8 md:size-8.5 rounded-full bg-[#0176D3]/10 text-[#0176D3] flex items-center justify-center border border-[#00A1E0]/20 shadow-sm flex-shrink-0">
                  <Target className="size-3.5 md:size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs md:text-sm font-black text-slate-800 leading-tight">$32k</span>
                  <span className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-wider">Avg deal</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="size-8 md:size-8.5 rounded-full bg-[#0176D3]/10 text-[#0176D3] flex items-center justify-center border border-[#00A1E0]/20 shadow-sm flex-shrink-0">
                  <Calendar className="size-3.5 md:size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs md:text-sm font-black text-slate-800 leading-tight">28 days</span>
                  <span className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-wider">Sales cycle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Consolidated horizontal ribbon with a top accent blue border, positioned higher */}
        <div className="w-full border-t-[3px] border-t-[#0176D3] bg-white/92 backdrop-blur-md rounded-2xl py-3 px-4 md:py-4 md:px-6 shadow-[0_12px_36px_rgba(1,118,211,0.1)] relative z-10 mt-4 md:mt-5 mb-1 md:mb-2">
          <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-3 md:gap-4 w-full">
            {kpiCards.map((card, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 md:gap-3 flex-1 justify-center md:border-r md:last:border-r-0 md:border-slate-100/60 px-2 group/kpi cursor-default"
              >
                <div className="size-8 rounded-full bg-[#0176D3]/10 text-[#0176D3] flex items-center justify-center border border-[#00A1E0]/20 shadow-sm flex-shrink-0 transition-transform duration-300 group-hover/kpi:scale-110">
                  <card.icon className="size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[8px] md:text-[9.5px] text-[#475569] font-bold uppercase tracking-wider leading-none mb-1">{card.label}</span>
                  <span className="text-sm md:text-base lg:text-lg font-black text-[#0F172A] leading-none transition-colors duration-200 group-hover/kpi:text-[#0176D3]">{card.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }




  if (scene.id === 6) {
    return (
      <div
        className="pointer-events-auto rounded-[40px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col pt-6 pb-6 px-6 md:px-8 justify-between gap-3 md:gap-4 border border-[#0176D3]/20 shadow-[0_30px_100px_rgba(1,118,211,0.2)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
        style={{
          background: "rgba(235, 246, 255, 0.92)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Ambient Glow Effects */}
        <div className="absolute right-[-10%] top-[10%] w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.22) 0%, transparent 70%)"
        }} />
        <div className="absolute left-[-5%] bottom-[-5%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(0,161,224,0.12) 0%, transparent 70%)"
        }} />

        {/* Blueprint Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0176D3" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Fractal Noise Overlay for subtle visual grain */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.015] pointer-events-none mix-blend-overlay">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>

        {/* TOP ROW: Content (50%) + Dashboard (50%) aligned to start */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 lg:gap-6 items-start justify-between w-full relative z-10">
          {/* LEFT SIDE: Description (50% width) */}
          <div className="w-full md:w-[48%] flex flex-col justify-start text-left max-w-[580px]">
            <div className="inline-flex items-center gap-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3.5 py-1 text-[10px] font-bold tracking-wider text-[#0176D3] w-fit mb-1.5 md:mb-2.5">
              <span className="size-1.5 rounded-full bg-[#0176D3] animate-pulse" />
              DISTRICT 06 &bull; MARKETING CLOUD
            </div>

            <h2 className="text-xl sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[48px] 2xl:text-[56px] font-extrabold tracking-tight text-[#0F172A] font-display max-w-[500px] mb-1.5 md:mb-2.5" style={{ lineHeight: 0.95 }}>
              Create Personalized <br />
              Customer Journeys <br />
              <span className="bg-gradient-to-r from-[#00A1E0] via-[#0176D3] to-[#0B5CAB] bg-clip-text text-transparent">That Convert</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[22px] text-[#475569] font-medium max-w-[520px] mb-1" style={{ lineHeight: 1.45 }}>
              Marketing Cloud helps businesses engage customers with personalized campaigns, automated journeys, audience segmentation, and AI-powered engagement across every channel.
            </p>
          </div>

          {/* RIGHT SIDE: Marketing Dashboard Card (50% width, compact size, shadow & grid) */}
          <div className="w-full md:w-[48%] bg-white/92 backdrop-blur-[24px] border border-sky-100/80 shadow-[0_30px_80px_rgba(1,118,211,0.12)] rounded-[24px] p-3 md:p-4 flex flex-col justify-between h-fit transition-all duration-300 relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Marketing Performance Center</span>
                <span className="text-xs md:text-sm lg:text-[15px] font-black text-[#0F172A] leading-tight">Campaign Performance</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="bg-[#0176D3]/10 text-[#0176D3] font-extrabold px-2.5 py-0.5 rounded-full text-[9px] border border-[#00A1E0]/20 flex items-center gap-1 shadow-sm">
                  <span className="size-1.2 rounded-full bg-[#0176D3] animate-pulse" />
                  Live Syncing
                </span>
              </div>
            </div>

            {/* Premium 2x2 KPI mini cards at the top */}
            <div className="grid grid-cols-2 gap-2 md:gap-2.5 mb-2.5 md:mb-3.5 text-left">
              {[
                { label: "Email Campaigns", val: "12,450", color: "text-slate-800" },
                { label: "Active Journeys", val: "186", color: "text-[#0176D3]" },
                { label: "Open Rate", val: "68%", color: "text-slate-800" },
                { label: "Conversion Rate", val: "21%", color: "text-emerald-600 font-extrabold" },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 border border-slate-100 hover:border-[#0176D3]/30 rounded-xl p-3 md:p-3 shadow-[0_2px_8px_rgba(1,118,211,0.02)] hover:shadow-[0_4px_12px_rgba(1,118,211,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <span className="block text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">{card.label}</span>
                  <span className={`text-[11px] sm:text-xs md:text-[13px] lg:text-sm font-black ${card.color} leading-none`}>{card.val}</span>
                </div>
              ))}
            </div>

            {/* Bar chart performance (Campaign Performance 7-day) */}
            <div className="pt-2 md:pt-2.5 border-t border-slate-100 mt-0.5">
              <div className="flex items-end justify-between h-10 md:h-12 lg:h-14 gap-1.5 my-0.5">
                {[35, 52, 42, 68, 78, 84, 92].map((h, i) => (
                  <div key={i} className="w-full bg-gradient-to-t from-[#0176D3] to-[#00A1E0] rounded-t-md hover:scale-y-[1.03] transition-all duration-200 cursor-pointer" style={{ height: `${h}%` }} />
                ))}
              </div>
              <p className="text-[7.5px] md:text-[8.5px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 text-center">Campaign Performance (7-day)</p>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Full-width Checklist Cards (3 columns, 2 rows) */}
        <div className="w-full relative z-10">
          <div className="grid grid-cols-3 gap-2.5 md:gap-3 w-full">
            {scene.items?.map((it, idx) => {
              const featureIcons = [Workflow, Users, Megaphone, Sparkles, Globe, LineChart];
              const IconComp = featureIcons[idx] || Check;
              return (
                <div
                  key={it.title}
                  className="rounded-2xl p-3 flex items-start gap-3 h-[70px] md:h-[78px] lg:h-[84px] transition-all duration-300 hover:shadow-[0_8px_20px_rgba(1,118,211,0.08)] hover:border-[#0176D3]/25 cursor-default bg-white/65 border"
                  style={{ borderColor: "rgba(0, 150, 255, 0.08)" }}
                >
                  <div className="flex size-7 md:size-8 items-center justify-center rounded-full bg-[#0176D3]/10 border border-[#00A1E0]/20 text-[#0176D3] flex-shrink-0 mt-0.5 shadow-sm">
                    <IconComp className="size-4 stroke-[3.5]" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center h-full text-left">
                    <h4 className="font-bold text-xs md:text-sm lg:text-[14px] text-[#0F172A] leading-tight mb-0.5 truncate">{it.title}</h4>
                    <p className="text-[10px] md:text-xs lg:text-[12px] text-[#475569] font-medium leading-snug line-clamp-2">{it.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ROW: Consolidated horizontal ribbon with a top accent blue border */}
        <div className="w-full border-t-[3px] border-t-[#0176D3] bg-white/92 backdrop-blur-md rounded-2xl py-2 px-3 md:py-2.5 md:px-5 shadow-[0_12px_36px_rgba(1,118,211,0.1)] relative z-10">
          <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-2.5 md:gap-3 w-full">
            {[
              { val: "+68%", label: "Engage", icon: Megaphone },
              { val: "+42%", label: "Convert", icon: Target },
              { val: "3.8M", label: "Reach", icon: Users },
              { val: "91%", label: "Completion", icon: Award },
            ].map((card, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 md:gap-2.5 flex-1 justify-center md:border-r md:last:border-r-0 md:border-slate-100/60 px-2 group/kpi cursor-default"
              >
                <div className="size-7 md:size-8 rounded-full bg-[#0176D3]/10 text-[#0176D3] flex items-center justify-center border border-[#00A1E0]/20 shadow-sm flex-shrink-0 transition-transform duration-300 group-hover/kpi:scale-110">
                  <card.icon className="size-3.5 md:size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[7.5px] md:text-[8.5px] text-[#475569] font-bold uppercase tracking-wider leading-none mb-0.5">{card.label}</span>
                  <span className="text-xs sm:text-sm md:text-base font-black text-[#0F172A] leading-none transition-colors duration-200 group-hover/kpi:text-[#0176D3]">{card.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.variant === "flow") {
    return (
      <div className="pointer-events-auto glass-panel shadow-[0_30px_90px_rgba(15,23,42,0.06)] rounded-[32px] p-6 sm:p-8 lg:p-10 w-full max-w-5xl">
        <Header scene={scene} />
        {scene.stats && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {scene.stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                <div className="glass-panel rounded-2xl px-5 py-3 text-center border border-slate-200/50 bg-white/50">
                  <div className="text-lg font-bold text-primary">{s.value}</div>
                  <div className="text-xs font-semibold text-[#0F172A]">{s.label}</div>
                </div>
                {i < scene.stats!.length - 1 && (
                  <span className="text-primary/50 font-bold">→</span>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {scene.items?.map((it) => (
            <div key={it.title} className="glass-panel rounded-2xl p-5 border border-slate-200/50 bg-white/50">
              <it.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-sm md:text-base font-bold text-[#0F172A]">{it.title}</h3>
              {it.body && (
                <p className="mt-1 text-xs text-[#475569] font-medium">{it.body}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (scene.id === 7) {
    return (
      <div
        className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-3 pb-2.5 px-4 md:px-6 justify-between gap-2 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
        style={{
          background: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Style injection for animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes pulseFlow {
            to {
              stroke-dashoffset: -20;
            }
          }
          .animated-flow-line {
            stroke-dasharray: 6, 4;
            animation: pulseFlow 1.2s linear infinite;
          }
          @keyframes voiceWave {
            0%, 100% { transform: scaleY(0.3); }
            50% { transform: scaleY(1.3); }
          }
          .voice-bar-1 { animation: voiceWave 0.8s ease-in-out infinite alternate; transform-origin: center; }
          .voice-bar-2 { animation: voiceWave 1.1s ease-in-out infinite alternate; transform-origin: center; animation-delay: 0.15s; }
          .voice-bar-3 { animation: voiceWave 0.9s ease-in-out infinite alternate; transform-origin: center; animation-delay: 0.3s; }
          .voice-bar-4 { animation: voiceWave 0.7s ease-in-out infinite alternate; transform-origin: center; animation-delay: 0.45s; }
          .voice-bar-5 { animation: voiceWave 1.0s ease-in-out infinite alternate; transform-origin: center; animation-delay: 0.2s; }
        `}} />

        {/* Soft blue ambient glow */}
        <div className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)"
        }} />
        <div className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)"
        }} />

        {/* TOP ROW: Title & Kicker (left) + Description paragraphs (right) */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start justify-start w-full h-auto relative z-10 mt-0.5">
          {/* LEFT SIDE: Title & Kicker */}
          <div className="w-full md:w-fit flex flex-col justify-start text-left max-w-[500px] flex-shrink-0">
            <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold tracking-wider text-[#0284C7] w-fit mb-1">
              <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              DISTRICT 07 • PRODUCT ECOSYSTEM
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[38px] xl:text-[44px] font-[900] leading-[1.05] tracking-tight text-[#0F172A] font-display">
              Real Problems. <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
                Purpose-Built
                <svg className="absolute -bottom-0.5 left-0 w-full h-[5px]" viewBox="0 0 200 5" fill="none" preserveAspectRatio="none">
                  <path d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span> Products.
            </h2>
          </div>

          {/* RIGHT SIDE: Description Paragraphs */}
          <div className="w-full md:flex-1 flex flex-col justify-start text-left max-w-[620px] pt-0 md:pt-[24px]">
            <p className="text-[14.5px] md:text-[18px] lg:text-[20px] font-[800] text-[#0F172A] leading-tight mb-1.5">
              Most Salesforce partners implement what Salesforce sells.<br />We went further.
            </p>
            <p className="text-[12.5px] md:text-[15px] lg:text-[16px] text-slate-500 font-semibold leading-relaxed mb-1.5">
              Working with real estate developers and enterprise teams across India, we found gaps no off-the-shelf tool was solving cleanly — and we built for them.
            </p>
            <p className="text-[12.5px] md:text-[15px] lg:text-[16px] text-[#0EA5E9] font-extrabold leading-relaxed">
              Every product here is live with a paying client. No filler. No vaporware.
            </p>
          </div>
        </div>

        {/* Divider 1 */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent opacity-60 my-0.5 relative z-10" />

        {/* BOTTOM ROW: 3 premium product cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 md:gap-4 w-full max-w-[1240px] mx-auto items-stretch relative z-10 mb-2 justify-center">
          {/* Card 1: Cascade Connect */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-3.5 md:p-4 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(15,23,42,0.06),0_0_20px_rgba(14,165,233,0.02)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.14)] hover:border-[#0EA5E9]/30 transition-all duration-500 relative overflow-hidden group h-[340px] md:h-[375px] w-full">
            {/* Background brand color glow reflection */}
            <div className="absolute -inset-1 bg-gradient-to-br from-[#0EA5E9]/5 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10" />

            <div>
              {/* Header block */}
              <div className="flex items-start gap-3 w-full">
                {/* 1. Large product icon (52px) in wrapper */}
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200/60 text-[#0EA5E9] shadow-[0_4px_20px_rgba(14,165,233,0.12)] group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                  <MessageSquare className="w-7 h-7 text-[#0EA5E9]" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between w-full gap-2">
                    {/* 2. Product Name */}
                    <h3 className="text-lg md:text-xl font-[900] text-[#0F172A] leading-tight tracking-tight truncate">
                      Cascade Connect
                    </h3>

                    {/* Status row badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-sky-100 bg-[#F0F9FF] text-[#2563EB] text-[9.5px] font-bold shadow-sm flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse"></span>
                      Live
                    </div>
                  </div>

                  {/* 3. Colored subtitle */}
                  <p className="text-[11px] md:text-[12px] font-[800] text-[#0EA5E9] mt-0.5 leading-tight truncate">
                    Omnichannel communication inside Salesforce
                  </p>
                </div>
              </div>

              {/* 4. Description */}
              <p className="mt-2 text-[11px] md:text-[12px] leading-normal text-slate-500 font-semibold">
                WhatsApp, Email and SMS natively logged in Salesforce. Real-time delivery tracking, read receipts and communication history inside CRM.
              </p>

              {/* 5. Feature chips */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100/60">
                {[
                  { text: "Salesforce Native", icon: Cloud },
                  { text: "Official API", icon: MessageSquare },
                  { text: "Real-time Tracking", icon: TrendingUp },
                  { text: "Read Receipts", icon: Check },
                  { text: "Chat History", icon: Clock },
                  { text: "Enterprise Ready", icon: ShieldCheck },
                ].map((item) => (
                  <span
                    key={item.text}
                    className="bg-[#F0F9FF] border border-[#E0F2FE]/40 rounded-md px-2 py-1 flex items-center gap-1 text-[9.5px] font-extrabold text-sky-700 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20 transition-all duration-200 truncate"
                  >
                    <item.icon className="w-3 h-3 text-[#0EA5E9] flex-shrink-0" />
                    <span className="truncate">{item.text}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Product illustration (WhatsApp, Email, SMS to Salesforce) */}
            <div className="border border-slate-100 rounded-xl p-2 bg-white shadow-sm mt-3 flex-grow flex flex-col justify-between">
              <div className="relative w-full h-[90px] md:h-[105px] flex items-center justify-between">
                {/* Animated SVG Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 30 20 C 40 20, 43 50, 45 50" fill="none" className="animated-flow-line stroke-[#0EA5E9]" strokeWidth="1.5" />
                  <path d="M 30 50 L 45 50" fill="none" className="animated-flow-line stroke-[#2563EB]" strokeWidth="1.5" />
                  <path d="M 30 80 C 40 80, 43 50, 45 50" fill="none" className="animated-flow-line stroke-[#3B82F6]" strokeWidth="1.5" />
                  <path d="M 55 50 L 70 50" fill="none" className="animated-flow-line stroke-[#2563EB]" strokeWidth="1.5" />
                </svg>

                {/* Left Column: Channels */}
                <div className="flex flex-col justify-between h-full z-10 relative w-[32%] py-0.5">
                  {/* WhatsApp Node */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 rounded-md py-1 px-2 shadow-sm truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-[#0EA5E9] flex-shrink-0" />
                    <span className="text-[9.5px] font-black text-slate-700 truncate">WhatsApp</span>
                  </div>
                  {/* Email Node */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 rounded-md py-1 px-2 shadow-sm truncate">
                    <Mail className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0" />
                    <span className="text-[9.5px] font-black text-slate-700 truncate">Email</span>
                  </div>
                  {/* SMS Node */}
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 rounded-md py-1 px-2 shadow-sm truncate">
                    <Phone className="w-3.5 h-3.5 text-[#3B82F6] flex-shrink-0" />
                    <span className="text-[9.5px] font-black text-slate-700 truncate">SMS</span>
                  </div>
                </div>

                {/* Center Node */}
                <div className="absolute left-[50%] -translate-x-1/2 top-[25px] md:top-[32px] w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10 z-10">
                  <div className="w-7 h-7 rounded-full bg-[#0EA5E9] flex items-center justify-center text-white shadow-md">
                    <MessageSquare className="w-4 h-4 text-white" fill="white" />
                  </div>
                </div>

                {/* Right Salesforce CRM Node */}
                <div className="w-[32%] bg-slate-50 border border-slate-200/50 rounded-xl py-1.5 px-2 shadow-sm flex flex-col items-center justify-center text-center z-10 relative">
                  <Cloud className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                  <span className="text-[9px] font-black text-slate-800 mt-0.5 leading-none">Salesforce CRM</span>
                </div>
              </div>

              {/* Bottom Preview Metrics Row */}
              <div className="grid grid-cols-4 gap-1 border-t border-slate-100 pt-2 mt-2 w-full">
                {[
                  { val: "18.4k", label: "Messages", icon: Check },
                  { val: "842", label: "Active Chat", icon: MessageSquare },
                  { val: "99.8%", label: "Sync Acc.", icon: CloudCog },
                  { val: "98%", label: "Delivery", icon: ShieldCheck },
                ].map((m, idx) => (
                  <div key={idx} className="flex flex-col text-left">
                    <div className="flex items-center gap-0.5 font-[900] text-slate-800 text-[10px] md:text-[11px] leading-none">
                      <m.icon className="w-3 h-3 text-[#0EA5E9] flex-shrink-0" />
                      <span className="truncate">{m.val}</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-slate-400 mt-0.5 leading-none truncate">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: CX Prism */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-3.5 md:p-4 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(15,23,42,0.06),0_0_20px_rgba(37,99,235,0.02)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.14)] hover:border-[#2563EB]/30 transition-all duration-500 relative overflow-hidden group h-[340px] md:h-[375px] w-full">
            {/* Background brand color glow reflection */}
            <div className="absolute -inset-1 bg-gradient-to-br from-[#2563EB]/5 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10" />

            <div>
              {/* Header block */}
              <div className="flex items-start gap-3 w-full">
                {/* 1. Large product icon (52px) in wrapper */}
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200/60 text-[#2563EB] shadow-[0_4px_20px_rgba(37,99,235,0.12)] group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                  <Layers className="w-7 h-7 text-[#2563EB]" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between w-full gap-2">
                    {/* 2. Product Name */}
                    <h3 className="text-lg md:text-xl font-[900] text-[#0F172A] leading-tight tracking-tight truncate">
                      CX Prism™
                    </h3>

                    {/* Status row badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-100 bg-[#F0F4FF] text-[#2563EB] text-[9.5px] font-bold shadow-sm flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
                      Deployment
                    </div>
                  </div>

                  {/* 3. Colored subtitle */}
                  <p className="text-[11px] md:text-[12px] font-[800] text-[#2563EB] mt-0.5 leading-tight truncate">
                    Customer feedback into revenue intelligence
                  </p>
                </div>
              </div>

              {/* 4. Description */}
              <p className="mt-2 text-[11px] md:text-[12px] leading-normal text-slate-500 font-semibold">
                AI-powered NPS analysis, churn prediction, risk alerts, sentiment intelligence and customer health monitoring directly inside Salesforce.
              </p>

              {/* 5. Feature chips */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100/60">
                {[
                  { text: "AI Insights", icon: Sparkles },
                  { text: "Risk Dashboards", icon: AlertTriangle },
                  { text: "Revenue Intel", icon: TrendingUp },
                  { text: "Health Score", icon: HeartPulse },
                  { text: "Leadership rpt", icon: Users },
                  { text: "Predictive Analytics", icon: LineChart },
                ].map((item) => (
                  <span
                    key={item.text}
                    className="bg-[#F0F4FF] border border-[#DBEAFE]/40 rounded-md px-2 py-1 flex items-center gap-1 text-[9.5px] font-extrabold text-[#2563EB] hover:bg-[#2563EB]/10 hover:border-[#2563EB]/20 transition-all duration-200 truncate"
                  >
                    <item.icon className="w-3 h-3 text-[#2563EB] flex-shrink-0" />
                    <span className="truncate">{item.text}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Product illustration (NPS arc + Sentiment trend line + indicators column) */}
            <div className="border border-slate-100 rounded-xl p-2 bg-white shadow-sm mt-3 flex-grow grid grid-cols-3 gap-2 items-stretch h-[115px] md:h-[130px]">
              {/* Column 1: NPS Score */}
              <div className="flex flex-col items-center justify-center text-center border-r border-slate-100 pr-1">
                <span className="text-[8.5px] font-black text-slate-500 mb-0.5 leading-none">NPS Score</span>
                <div className="relative w-20 h-11 md:h-13 flex items-center justify-center mt-0.5">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#2563EB" strokeWidth="8" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset="35.2" />
                  </svg>
                  <div className="absolute top-3.5 md:top-4.5 flex flex-col items-center">
                    <span className="text-base font-black text-slate-800 leading-none">72</span>
                    <span className="text-[7px] font-bold text-slate-500 uppercase leading-none mt-0.5">Good</span>
                  </div>
                </div>
                <span className="text-[7.5px] font-black text-[#0EA5E9] mt-1 leading-none">+12 vs 30d</span>
              </div>

              {/* Column 2: Sentiment Trend */}
              <div className="flex flex-col justify-between h-full relative border-r border-slate-100 pr-1 pl-0.5">
                <span className="text-[8.5px] font-black text-slate-500 text-left pl-0.5">Sentiment</span>
                <div className="relative w-full h-11 md:h-13 mt-0.5">
                  <svg className="w-full h-full" viewBox="0 0 160 50" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="sentiment-prism-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="12.5" x2="160" y2="12.5" stroke="#F1F5F9" strokeWidth="0.5" />
                    <line x1="0" y1="25" x2="160" y2="25" stroke="#F1F5F9" strokeWidth="0.5" />
                    <line x1="0" y1="37.5" x2="160" y2="37.5" stroke="#F1F5F9" strokeWidth="0.5" />
                    <path d="M 0 40 Q 20 20 40 35 T 80 15 T 120 30 T 160 8" fill="none" stroke="#2563EB" strokeWidth="2" />
                    <path d="M 0 40 Q 20 20 40 35 T 80 15 T 120 30 T 160 8 L 160 50 L 0 50 Z" fill="url(#sentiment-prism-gradient)" />
                    <circle cx="160" cy="8" r="2.5" fill="#2563EB" />
                  </svg>
                </div>
                <div className="flex justify-between w-full text-[6.5px] font-bold text-slate-400 mt-0.5 px-0.5">
                  <span>1d</span>
                  <span>8d</span>
                  <span>15d</span>
                  <span>22d</span>
                  <span>29d</span>
                </div>
              </div>

              {/* Column 3: KPI health circle, churn bar, revenue impact */}
              <div className="flex flex-col justify-between h-full gap-0.5 pt-0.5 pl-0.5">
                {/* Customer Health */}
                <div className="flex items-center justify-between gap-1 w-full border-b border-slate-100 pb-0.5">
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] font-bold text-slate-400 uppercase leading-none">Health</span>
                    <span className="text-[8.5px] font-black text-[#0EA5E9] mt-0.5 leading-none">Healthy</span>
                  </div>
                  <svg className="w-5.5 h-5.5 flex-shrink-0" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="12" fill="transparent" stroke="#E2E8F0" strokeWidth="3" />
                    <circle cx="16" cy="16" r="12" fill="transparent" stroke="#0EA5E9" strokeWidth="3" strokeDasharray="75" strokeDashoffset="13.5" strokeLinecap="round" transform="rotate(-90 16 16)" />
                    <text x="16" y="19" textAnchor="middle" className="text-[8px] font-black fill-[#0EA5E9]">82</text>
                  </svg>
                </div>

                {/* Churn Risk */}
                <div className="flex items-center justify-between gap-1 w-full border-b border-slate-100 py-0.5">
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] font-bold text-slate-400 uppercase leading-none">Churn</span>
                    <span className="text-[8.5px] font-black text-slate-600 mt-0.5 leading-none">Low</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="text-[8px] font-black text-slate-700">12%</span>
                    <div className="w-6 h-0.75 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '12%' }} />
                    </div>
                  </div>
                </div>

                {/* Revenue Impact */}
                <div className="flex items-center justify-between gap-1 w-full pt-0.5">
                  <div className="flex flex-col text-left">
                    <span className="text-[7px] font-bold text-slate-400 uppercase leading-none">Revenue</span>
                    <span className="text-[8.5px] font-black text-[#2563EB] mt-0.5 leading-none font-sans">₹48.7L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: AI Voice Platform */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-[24px] p-3.5 md:p-4 flex flex-col justify-between text-left shadow-[0_20px_50px_rgba(15,23,42,0.06),0_0_20px_rgba(14,165,233,0.02)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.14)] hover:border-[#0EA5E9]/30 transition-all duration-500 relative overflow-hidden group h-[340px] md:h-[375px] w-full">
            {/* Background brand color glow reflection */}
            <div className="absolute -inset-1 bg-gradient-to-br from-[#0EA5E9]/5 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500 -z-10" />

            <div>
              {/* Header block */}
              <div className="flex items-start gap-3 w-full">
                {/* 1. Large product icon (52px) in wrapper */}
                <div className="w-[52px] h-[52px] flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-sky-100 border border-blue-200/60 text-[#0EA5E9] shadow-[0_4px_20px_rgba(14,165,233,0.12)] group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                  <PhoneCall className="w-7 h-7 text-[#0EA5E9]" />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center justify-between w-full gap-2">
                    {/* 2. Product Name */}
                    <h3 className="text-lg md:text-xl font-[900] text-[#0F172A] leading-tight tracking-tight truncate">
                      AI Voice Platform
                    </h3>

                    {/* Status row badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-sky-100 bg-[#F0F9FF] text-[#2563EB] text-[9.5px] font-bold shadow-sm flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9] animate-pulse"></span>
                      Live
                    </div>
                  </div>

                  {/* 3. Colored subtitle */}
                  <p className="text-[11px] md:text-[12px] font-[800] text-[#0EA5E9] mt-0.5 leading-tight truncate">
                    Autonomous voice agents with CRM sync
                  </p>
                </div>
              </div>

              {/* 4. Description */}
              <p className="mt-2 text-[11px] md:text-[12px] leading-normal text-slate-500 font-semibold">
                Intelligent inbound and outbound calls. Automatic call transcription, sentiment tagging, CRM updates, and pipelines built for scale.
              </p>

              {/* 5. Feature chips */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100/60">
                {[
                  { text: "AI-Driven Calls", icon: PhoneCall },
                  { text: "Auto CRM Update", icon: RefreshCw },
                  { text: "Real-time Analytics", icon: Gauge },
                  { text: "Voice Agents", icon: Mic },
                  { text: "Speech-to-Text", icon: Volume2 },
                  { text: "Enterprise Ready", icon: ShieldCheck },
                ].map((item) => (
                  <span
                    key={item.text}
                    className="bg-[#F0F9FF] border border-[#E0F2FE]/40 rounded-md px-2 py-1 flex items-center gap-1 text-[9.5px] font-extrabold text-sky-700 hover:bg-[#0EA5E9]/10 hover:border-[#0EA5E9]/20 transition-all duration-200 truncate"
                  >
                    <item.icon className="w-3 h-3 text-[#0EA5E9] flex-shrink-0" />
                    <span className="truncate">{item.text}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Product illustration (Call Flow with waveform) */}
            <div className="border border-slate-100 rounded-xl p-2 bg-white shadow-sm mt-3 flex-grow flex flex-col justify-between">
              <div className="relative w-full h-[90px] md:h-[105px] flex items-center justify-between">
                {/* Animated SVG Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 30 50 L 45 50" fill="none" className="animated-flow-line stroke-[#0EA5E9]" strokeWidth="1.5" />
                  <path d="M 55 50 L 70 50" fill="none" className="animated-flow-line stroke-[#2563EB]" strokeWidth="1.5" />
                </svg>

                {/* Left Column: Customer */}
                <div className="flex flex-col justify-center h-full z-10 relative w-[32%] py-0.5">
                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/50 rounded-md py-1 px-2 shadow-sm truncate">
                    <Phone className="w-3.5 h-3.5 text-[#0EA5E9] flex-shrink-0" />
                    <span className="text-[9.5px] font-black text-slate-700 truncate">Customer</span>
                  </div>
                </div>

                {/* Center Node (AI Voice Agent with microphone) */}
                <div className="absolute left-[50%] -translate-x-1/2 top-[12px] md:top-[18px] flex flex-col items-center z-10">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shadow-lg shadow-blue-500/10">
                    <div className="w-7 h-7 rounded-full bg-[#0EA5E9] flex items-center justify-center text-white shadow-md">
                      <Mic className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  {/* Animated Waveform bars */}
                  <div className="flex items-center gap-[3px] mt-1.5 h-3 justify-center">
                    <span className="w-[3px] bg-[#0EA5E9] rounded-full voice-bar-1 h-3"></span>
                    <span className="w-[3px] bg-[#2563EB] rounded-full voice-bar-2 h-4"></span>
                    <span className="w-[3px] bg-[#0ea5e9] rounded-full voice-bar-3 h-3.5"></span>
                    <span className="w-[3px] bg-[#2563EB] rounded-full voice-bar-4 h-2"></span>
                    <span className="w-[3px] bg-[#0ea5e9] rounded-full voice-bar-5 h-3"></span>
                  </div>
                </div>

                {/* Right Salesforce CRM Node */}
                <div className="w-[32%] bg-slate-50 border border-[#E2E8F0]/50 rounded-xl py-1.5 px-2 shadow-sm flex flex-col items-center justify-center text-center z-10 relative">
                  <Cloud className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                  <span className="text-[9px] font-black text-slate-800 mt-0.5 leading-none">Salesforce CRM</span>
                </div>
              </div>

              {/* Bottom Preview Metrics Row */}
              <div className="grid grid-cols-4 gap-1 border-t border-slate-100 pt-2 mt-2 w-full">
                {[
                  { val: "12.5k", label: "Calls Sync", icon: PhoneCall },
                  { val: "94.2%", label: "Accuracy", icon: Sparkles },
                  { val: "1.4s", label: "Latency", icon: Clock },
                  { val: "99.9%", label: "Sync Rate", icon: BadgeCheck },
                ].map((m, idx) => (
                  <div key={idx} className="flex flex-col text-left">
                    <div className="flex items-center gap-0.5 font-[900] text-slate-800 text-[10px] md:text-[11px] leading-none">
                      <m.icon className="w-3 h-3 text-[#0EA5E9] flex-shrink-0" />
                      <span className="truncate">{m.val}</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-slate-400 mt-0.5 leading-none truncate">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider 2 */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent opacity-60 my-0.5 relative z-10" />

        {/* PREMIUM METRIC STRIP: Slim unified glass ribbon */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-2.5 md:gap-4 w-full max-w-5xl mx-auto h-[60px] md:h-[90px] mb-1.5 py-1 px-6 rounded-xl bg-white/70 backdrop-blur-md border border-[#0EA5E9]/15 shadow-[0_10px_30px_rgba(15,23,42,0.03),0_-6px_25px_rgba(14,165,233,0.06)] z-10 relative">
          {[
            { value: "3", label: "Proprietary Products", icon: Sparkles, color: "#0EA5E9" },
            { value: "100%", label: "Live Deployments", icon: BadgeCheck, color: "#2563EB" },
            { value: "8+", label: "Enterprise Clients", icon: Users, color: "#2563EB" },
            { value: "In-House", label: "Built In-House", icon: Code, color: "#0EA5E9" }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3.5 px-2 py-0.5 group cursor-default"
            >
              <div
                className="w-9 md:w-11 h-9 md:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: `${stat.color}10`,
                  color: stat.color,
                  border: `1px solid ${stat.color}20`
                }}
              >
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl md:text-[28px] font-black text-slate-800 tracking-tight leading-none">
                  {stat.value}
                </span>
                <span className="text-[8px] md:text-[9.5px] uppercase font-bold text-slate-400 mt-1 leading-none">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.id === 8) {
    const industries = [
      {
        id: "real-estate",
        title: "Real Estate & PropTech",
        subtitle: "Primary Vertical",
        desc: "Specialized lead pipelines, developer workflows, builder-broker portals, and automated booking engines.",
        icon: Home,
        highlight: true,
      },
      {
        id: "commercial-cre",
        title: "Commercial Real Estate",
        subtitle: "Asset & Tenant Portals",
        desc: "Custom transaction pipelines, tenant onboarding automation, lease management, and portfolio tracking.",
        icon: Building2,
        highlight: false,
      },
      {
        id: "financial-services",
        title: "Financial Services",
        subtitle: "Secure CRM & Compliance",
        desc: "Highly secure investor onboarding, loan processing checklists, pipeline management, and wealth portals.",
        icon: Landmark,
        highlight: false,
      },
      {
        id: "healthcare",
        title: "Healthcare",
        subtitle: "Patient Lifecycle & CRM",
        desc: "Patient care coordination, provider portals, unified referral tracking, and automated appointment scheduling.",
        icon: HeartPulse,
        highlight: false,
      },
      {
        id: "education",
        title: "Education",
        subtitle: "Student Lifecycle & Portals",
        desc: "Automated student acquisition, enrollment pipelines, academic advisory portals, and alumni engagement.",
        icon: GraduationCap,
        highlight: false,
      },
      {
        id: "d2c-retail",
        title: "D2C & Retail",
        subtitle: "Unified Commerce Support",
        desc: "Automated support ticketing, loyalty management, customer 360 profiles, and behavioral journey building.",
        icon: ShoppingCart,
        highlight: false,
      },
    ];

    return (
      <div
        className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-5 pb-5 md:pt-8 md:pb-8 px-4 md:px-6 justify-center gap-4 md:gap-6 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
        style={{
          background: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Soft blue ambient glow */}
        <div className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)"
        }} />
        <div className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)"
        }} />

        {/* TOP ROW: Title & Kicker (left) + Description paragraphs (right) */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start justify-start w-full h-auto relative z-10 mt-0.5">
          {/* LEFT SIDE: Title & Kicker */}
          <div className="w-full md:w-fit flex flex-col justify-start text-left max-w-[500px] flex-shrink-0">
            <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold tracking-wider text-[#0284C7] w-fit mb-1">
              <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              DISTRICT 08 • INDUSTRIES WE SERVE
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[38px] xl:text-[44px] font-[900] leading-[1.05] tracking-tight text-[#0F172A] font-display">
              Built for Real Estate. <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
                Ready for Enterprise.
                <svg className="absolute -bottom-0.5 left-0 w-full h-[5px]" viewBox="0 0 200 5" fill="none" preserveAspectRatio="none">
                  <path d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>

          {/* RIGHT SIDE: Description Paragraphs */}
          <div className="w-full md:flex-1 flex flex-col justify-start text-left max-w-[620px] pt-0 md:pt-[24px]">
            <p className="text-[14.5px] md:text-[18px] lg:text-[20px] font-[800] text-[#0F172A] leading-tight mb-1.5">
              Deep industry-specific solutions built on Salesforce.<br />We deploy AI where it matters.
            </p>
            <p className="text-[12.5px] md:text-[15px] lg:text-[16px] text-slate-500 font-semibold leading-relaxed">
              We design custom workflows, secure database architectures, and automated customer journeys designed specifically to solve the unique operational pressures of your industry vertical.
            </p>
          </div>
        </div>

        {/* Divider 1 */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent opacity-60 my-0.5 relative z-10" />

        {/* BOTTOM ROW: 3x2 Grid of 6 Premium Industry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-3.5 w-full max-w-[1120px] mx-auto items-stretch relative z-10 mb-2.5">
          {industries.map((ind) => {
            const IconComp = ind.icon;

            return (
              <div
                key={ind.id}
                className={`bg-white/80 backdrop-blur-md rounded-[20px] p-3.5 flex flex-row items-center gap-3.5 text-left transition-all duration-500 relative overflow-hidden group min-h-[96px] md:min-h-[110px] w-full ${ind.highlight
                  ? "border-2 border-[#0EA5E9] shadow-[0_15px_45px_rgba(14,165,233,0.12),inset_0_0_15px_rgba(14,165,233,0.03)]"
                  : "border border-white/60 shadow-[0_10px_35px_rgba(15,23,42,0.04)] hover:border-[#0EA5E9]/30 hover:shadow-[0_15px_45px_rgba(14,165,233,0.08)]"
                  }`}
              >
                {/* Background brand color glow reflection */}
                <div className={`absolute -inset-1 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 ${ind.highlight ? "from-[#0EA5E9]/10 to-transparent" : "from-[#0EA5E9]/5 to-transparent"
                  }`} />

                {/* 64px Icon Wrapper */}
                <div className={`w-[60px] md:w-[64px] h-[60px] md:h-[64px] flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0 ${ind.highlight
                  ? "bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] text-white shadow-[0_6px_20px_rgba(14,165,233,0.25)]"
                  : "bg-[#F0F9FF] border border-[#E0F2FE]/50 text-[#0EA5E9] shadow-[0_4px_12px_rgba(14,165,233,0.08)]"
                  }`}>
                  <IconComp className={`w-7 md:w-8 h-7 md:h-8 ${ind.highlight ? "text-white" : "text-[#0EA5E9]"}`} />
                </div>

                <div className="flex-grow min-w-0 flex flex-col justify-center h-full">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs md:text-sm font-[900] text-[#0F172A] leading-tight tracking-tight truncate">
                      {ind.title}
                    </h3>
                    {ind.highlight && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0EA5E9] text-[8px] font-black uppercase tracking-wider">
                        Primary
                      </span>
                    )}
                  </div>

                  <p className="text-[10px] md:text-[11px] font-[800] text-[#0EA5E9] mt-0.5 leading-tight truncate">
                    {ind.subtitle}
                  </p>

                  <p className="text-[9.5px] md:text-[10.5px] leading-normal text-slate-500 font-semibold mt-1 line-clamp-2 md:line-clamp-3">
                    {ind.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.id === 9) {
    const reasons = [
      {
        id: "know-sales",
        title: "We Know Your Sales Process",
        desc: "Site visits, token collections, unit blocking, channel partners and post-booking workflows — built and optimized before.",
        icon: Workflow,
      },
      {
        id: "build-promise",
        title: "We Build What We Promise",
        desc: "The same team that designs the solution delivers and supports it. No handoffs. No disconnects.",
        icon: ShieldCheck,
      },
      {
        id: "live-products",
        title: "Live Products In Production",
        desc: "Real Salesforce implementations, AI automations and customer-facing products actively used by clients.",
        icon: BadgeCheck,
      },
      {
        id: "built-scale",
        title: "Built For Scale",
        desc: "Solutions designed to grow from startup operations to enterprise-grade business processes.",
        icon: Zap,
      },
      {
        id: "real-projects",
        title: "Products From Real Projects",
        desc: "Cascade Connect and CX Prism were created from real client challenges and proven in production environments.",
        icon: Layers,
        isLarge: true,
      },
      {
        id: "long-term",
        title: "Long-Term Partnership",
        desc: "We continue supporting, optimizing and enhancing solutions long after go-live.",
        icon: HeartHandshake,
        isLarge: true,
      },
    ];

    return (
      <div
        className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-5 pb-5 px-4 md:px-6 justify-center gap-3.5 md:gap-4 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
        style={{
          background: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Soft blue ambient glow */}
        <div className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)"
        }} />
        <div className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
          background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)"
        }} />

        {/* TOP ROW: Title & Kicker (left) + Description paragraphs (right) */}
        <div className="flex flex-col md:flex-row md:items-center justify-start w-full h-auto relative z-10 gap-8 lg:gap-16 mt-1">
          {/* LEFT SIDE: Title & Kicker */}
          <div className="w-full md:max-w-[50%] lg:max-w-[580px] flex flex-col justify-start text-left">
            <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold tracking-wider text-[#0284C7] w-fit mb-1">
              <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              DISTRICT 09 • WHY CASCADE TECH
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] xl:text-[48px] 2xl:text-[56px] font-[900] leading-[1.05] tracking-tight text-[#0F172A] font-display">
              Why Developers & Enterprises <br className="hidden lg:inline" />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
                Choose Cascade
                <svg className="absolute -bottom-0.5 left-0 w-full h-[5px]" viewBox="0 0 200 5" fill="none" preserveAspectRatio="none">
                  <path d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </div>

          {/* RIGHT SIDE: Subheading */}
          <div className="w-full md:max-w-[40%] lg:max-w-[450px] flex flex-col justify-center text-left">
            <p className="text-[11px] md:text-[13px] lg:text-[14.5px] text-slate-500 font-semibold leading-relaxed">
              We combine Salesforce expertise, AI innovation, product thinking and real-world industry execution to deliver measurable business outcomes.
            </p>
          </div>
        </div>

        {/* Divider 1 */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent opacity-60 my-0 relative z-10" />

        {/* MIDDLE ROW: 4 Normal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[1280px] mx-auto items-stretch relative z-10">
          {reasons.filter(r => !r.isLarge).map((r) => {
            const IconComp = r.icon;

            return (
              <div
                key={r.id}
                className="backdrop-blur-md rounded-[20px] p-3.5 md:p-4 flex flex-col justify-start text-left transition-all duration-500 relative overflow-hidden group w-full min-h-[160px] md:min-h-[190px] bg-white/80 border border-white/60 shadow-[0_10px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.15)] hover:border-[#0EA5E9]/40 hover:ring-4 hover:ring-[#0EA5E9]/5 hover:-translate-y-2"
              >
                {/* Permanent subtle background glows */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/5 via-[#2563EB]/2 to-transparent rounded-[20px] pointer-events-none -z-10" />
                <div className="absolute -inset-px bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#2563EB]/5 rounded-[20px] pointer-events-none -z-20" />

                {/* Hover blue glow reflection */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[#0EA5E9]/12 via-[#2563EB]/6 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10 pointer-events-none" />

                {/* Icon Wrapper */}
                <div className="w-[46px] h-[46px] md:w-[52px] md:h-[52px] flex items-center justify-center rounded-full border shadow-sm group-hover:scale-105 transition-all duration-300 flex-shrink-0 mb-2.5 bg-[#F0F9FF] border-[#E0F2FE]/50 text-[#0EA5E9] shadow-[0_4px_12px_rgba(14,165,233,0.06)] group-hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)]">
                  <IconComp className="w-5.5 h-5.5 md:w-6 h-6 text-[#0EA5E9]" />
                </div>

                <div className="flex-grow min-w-0 flex flex-col justify-start">
                  <h3 className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-[900] text-[#0F172A] leading-snug tracking-tight mb-0.5">
                    {r.title}
                  </h3>

                  {/* Horizontal accent line */}
                  <div className="w-8 h-[2px] bg-[#0EA5E9] rounded-full mb-1.5 transition-all duration-300 group-hover:w-12" />

                  <p className="text-[9.5px] md:text-[10.5px] lg:text-[11px] leading-relaxed text-slate-500 font-semibold line-clamp-3 md:line-clamp-4">
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* BOTTOM ROW: 2 Featured Cards (1.5x wider, centered) */}
        <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-[1280px] mx-auto items-stretch relative z-10 mt-1">
          {reasons.filter(r => r.isLarge).map((r) => {
            const IconComp = r.icon;

            return (
              <div
                key={r.id}
                className="backdrop-blur-md rounded-[20px] p-3.5 md:p-4 flex flex-col justify-start text-left transition-all duration-500 relative overflow-hidden group w-full md:w-[36%] flex-shrink-0 min-h-[160px] md:min-h-[190px] bg-gradient-to-br from-[#F8FAFC]/95 via-white/90 to-[#E0F2FE]/40 border border-[#0EA5E9]/20 shadow-[0_12px_40px_rgba(15,23,42,0.05)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.18)] hover:border-[#0EA5E9]/50 hover:ring-4 hover:ring-[#0EA5E9]/5 hover:-translate-y-2"
              >
                {/* Featured Badge */}
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[8px] font-black uppercase tracking-wider shadow-sm border border-[#0EA5E9]/10">
                  Featured
                </span>

                {/* Permanent subtle background glows */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/5 via-[#2563EB]/2 to-transparent rounded-[20px] pointer-events-none -z-10" />
                <div className="absolute -inset-px bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#2563EB]/5 rounded-[20px] pointer-events-none -z-20" />

                {/* Hover blue glow reflection */}
                <div className="absolute -inset-1 bg-gradient-to-br from-[#0EA5E9]/12 via-[#2563EB]/6 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10 pointer-events-none" />

                {/* Icon Wrapper */}
                <div className="w-[46px] h-[46px] md:w-[52px] md:h-[52px] flex items-center justify-center rounded-full border shadow-sm group-hover:scale-105 transition-all duration-300 flex-shrink-0 mb-2.5 bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] border-[#0EA5E9]/20 text-white shadow-[0_8px_20px_rgba(14,165,233,0.2)] group-hover:shadow-[0_12px_28px_rgba(14,165,233,0.3)]">
                  <IconComp className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>

                <div className="flex-grow min-w-0 flex flex-col justify-start">
                  <h3 className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-[900] text-[#0F172A] leading-snug tracking-tight mb-0.5">
                    {r.title}
                  </h3>

                  {/* Horizontal accent line */}
                  <div className="w-12 h-[2.5px] bg-[#2563EB] rounded-full mb-1.5 transition-all duration-300 group-hover:w-20" />

                  <p className="text-[9.5px] md:text-[10.5px] lg:text-[11px] leading-relaxed text-slate-500 font-semibold line-clamp-3 md:line-clamp-4">
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.id === 10) {
    const clients = [
      "KOHINOOR",
      "CREATIVE CLOUD",
      "CANNEXT",
      "EKÂ LIFE",
      "CLEARPACK",
      "NAIKNAVARE",
      "GAYATRI CONSTRUCTORS",
      "AUTOMATENHANDEL24",
      "NANDIVARDHAN",
      "ASHWIN SHETH"
    ];

    return (
      <div
        className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-5 pb-5 px-4 md:px-6 justify-center gap-4 md:gap-5 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
        style={{
          background: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Soft blue ambient glow */}
        <div className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)"
        }} />
        <div className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
          background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)"
        }} />

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-between w-full h-full relative z-10 max-w-[1280px] mx-auto">
          {/* LEFT COLUMN: 40% width */}
          <div className="w-full md:w-[38%] flex flex-col justify-between text-left h-full py-1">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE]/80 rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold tracking-wider text-[#0284C7] w-fit mb-3">
                <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
                DISTRICT 10 • CLIENTS
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-[32px] lg:text-[40px] xl:text-[46px] font-[900] leading-[1.1] tracking-tight text-[#0F172A] font-display mb-3">
                Organizations That <br />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
                  Trust Cascade Tech
                  <svg className="absolute -bottom-0.5 left-0 w-full h-[4px]" viewBox="0 0 200 5" fill="none" preserveAspectRatio="none">
                    <path d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>

              {/* Supporting Text */}
              <p className="text-[11px] md:text-[12.5px] lg:text-[14px] text-slate-500 font-semibold leading-relaxed mb-4">
                From Mumbai's leading real estate developers to growing enterprise organizations, Cascade Tech powers Salesforce, AI and automation initiatives across multiple industries.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-2.5 mt-auto">
              {[
                { value: "8+", label: "Clients Served" },
                { value: "5", label: "Cities" },
                { value: "5", label: "Industries" }
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 border border-[#0EA5E9]/15 rounded-2xl p-3 shadow-[0_8px_30px_rgba(15,23,42,0.02)] text-left flex flex-col justify-center transition-all duration-300 hover:border-[#0EA5E9]/30"
                >
                  <span className="text-lg md:text-xl xl:text-2xl font-[900] text-[#0EA5E9] leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-400 mt-1 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: 3x4 Grid (60% width) */}
          <div className="w-full md:w-[60%] flex flex-col justify-center h-full py-1">
            <div className="grid grid-cols-3 gap-2.5 md:gap-3 w-full">
              {clients.map((clientName, index) => (
                <ClientCard key={index} clientName={clientName} />
              ))}
            </div>

            {/* Grid Caption */}
            <span className="text-[8.5px] md:text-[9.5px] text-slate-400 italic mt-3 text-center block">
              Client names shown for reference — official logos applied at brand kit handover.
            </span>
          </div>
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.id === 11) {
    return <CaseStudiesScene scene={scene} />;
  }

  if (scene.id === 4) {
    const kpiLabels = [
      "AI Selling",
      "Journey Builder",
      "Customer 360",
      "Patient 360",
      "Student Lifecycle",
      "Unified Commerce",
    ];

    return (
      <div className="pointer-events-auto who-we-are-glass-panel rounded-[40px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col py-4 px-6 md:px-8 justify-between gap-4 md:gap-5">
        {/* Blueprint Grid Background + Radial Glow */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0284C7" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Radial Glow Behind Title */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-radial-blue opacity-20 blur-3xl pointer-events-none -z-10" style={{
          background: "radial-gradient(circle, rgba(2,132,199,0.15) 0%, transparent 70%)"
        }} />

        {/* SECTION HEADER: Centered */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1 text-[10px] font-bold tracking-wider text-[#0369A1] w-fit mb-2">
            <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
            {scene.kicker}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[42px] xl:text-[48px] font-[900] leading-[1.08] tracking-tight text-[#0F172A] font-display mb-2">
            {scene.title}
          </h2>
          <p className="text-xs md:text-[15px] text-[#475569] font-medium leading-relaxed max-w-2xl">
            {scene.subtitle}
          </p>
        </div>

        {/* 3x2 Grid of 6 Premium Cloud Cards with Connection Lines */}
        <div className="relative w-full flex-1 min-h-0">
          {/* Subtle Connection Lines (SVG Layer) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-5" style={{ zIndex: 1 }}>
            <line x1="33%" y1="10%" x2="33%" y2="90%" stroke="#0284C7" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="67%" y1="10%" x2="67%" y2="90%" stroke="#0284C7" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#0284C7" strokeWidth="1" strokeDasharray="5,5" />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full h-full items-stretch relative z-10">
            {scene.items?.map((item, idx) => {
              const isSalesCloud = idx === 0;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className={`group relative bg-white/95 hover:bg-white rounded-[24px] flex flex-col justify-between text-center shadow-[0_10px_30px_rgba(2,132,199,0.06)] hover:shadow-[0_20px_50px_rgba(2,132,199,0.15)] hover:-translate-y-2 transition-all duration-500 flex-1 h-full overflow-hidden ${isSalesCloud
                    ? "border-2 border-[#0284C7]"
                    : "border border-[#E2E8F0] hover:border-[#0284C7]/30"
                    }`}
                >
                  {/* Blue Glow on Hover */}
                  <div className="absolute inset-0 rounded-[24px] bg-gradient-to-b from-[#0284C7]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  {/* Most Popular Badge - Sales Cloud Only */}
                  {isSalesCloud && (
                    <div className="absolute top-3 right-3 bg-[#0284C7] text-white rounded-full px-2.5 py-0.5 text-[8px] font-bold uppercase tracking-wider shadow-lg shadow-sky-500/20 z-20">
                      Most Popular
                    </div>
                  )}

                  {/* Cloud Icon in Blue Circle with Glow */}
                  <div className="relative flex justify-center mb-2 pt-1">
                    <div className={`relative flex items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(2,132,199,0.35)] group-hover:shadow-[0_16px_40px_rgba(2,132,199,0.5)] group-hover:scale-110 transition-all duration-500 flex-shrink-0 size-16 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7]`}>
                      <item.icon className="size-9" />
                      <span className="absolute inset-0 rounded-full bg-sky-400/20 blur-md -z-10 group-hover:blur-lg transition-all duration-500" />
                    </div>
                  </div>

                  {/* Cloud Title */}
                  <div className="flex-1 flex flex-col justify-start px-3">
                    <h3 className="text-base md:text-lg font-[800] text-[#0F172A] leading-tight mb-1">
                      {item.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs md:text-sm leading-snug text-[#475569] font-medium mb-2">
                      {item.body}
                    </p>
                  </div>

                  {/* KPI Chip */}
                  <div className="mb-2 px-3">
                    <div className="inline-flex items-center gap-1 bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] border border-[#0284C7]/20 rounded-full px-2.5 py-1 text-[8px] md:text-[9px] font-bold text-[#0284C7] shadow-sm">
                      <span className="size-1 rounded-full bg-[#0284C7]" />
                      {kpiLabels[idx]}
                    </div>
                  </div>

                  {/* Bottom Capability Indicator Bars (5 segmented) */}
                  <div className="mt-auto pt-2 flex items-center justify-center gap-0.5 px-3 pb-2.5 border-t border-[#E0F2FE]">
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <div
                        key={bar}
                        className="h-1.5 flex-1 rounded-full bg-[#E0F2FE] group-hover:bg-[#0284C7] transition-all duration-500 overflow-hidden relative"
                        style={{
                          animation: "slideRight 0.8s ease-out forwards",
                          animationDelay: `${bar * 0.12}s`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0284C7]/60 to-[#0EA5E9] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />

        <style>{`
          @keyframes slideRight {
            from {
              width: 0;
              opacity: 0;
            }
            to {
              width: 100%;
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="pointer-events-auto glass-panel shadow-[0_30px_90px_rgba(15,23,42,0.06)] rounded-[32px] p-6 sm:p-8 lg:p-10 w-full max-w-5xl">
      <Header scene={scene} />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scene.items?.map((it) => (
          <div
            key={it.title}
            className="glass-panel rounded-2xl p-5 border border-slate-200/50 bg-white/50 transition-transform hover:-translate-y-1"
          >
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <it.icon className="size-5 text-primary" />
            </div>
            <h3 className="mt-3 text-sm md:text-base font-bold text-[#0F172A]">{it.title}</h3>
            {it.body && (
              <p className="mt-1 text-xs leading-relaxed text-[#475569] font-medium">
                {it.body}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CountUpText({ text }: { text: string }) {
  const [val, setVal] = useState(0);

  const match = text.match(/([\d.]+)/);
  const hasMatch = !!match;
  const numericValue = match ? parseFloat(match[1]) : 0;
  const isPercent = text.includes("%");
  const isPlus = text.includes("+");
  const suffix = match ? text.replace(match[0], "").replace("+", "") : text;

  useEffect(() => {
    if (!hasMatch) return;

    let start = 0;
    const end = numericValue;
    if (start === end) return;

    const totalMilliseconds = 1200;
    const incrementTime = 25;
    const steps = totalMilliseconds / incrementTime;
    const stepValue = (end - start) / steps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [hasMatch, numericValue]);

  if (!hasMatch) {
    return <>{text}</>;
  }

  const displayVal = Number.isInteger(numericValue) ? Math.floor(val) : val.toFixed(1);
  return (
    <>
      {isPlus ? "+" : ""}
      {displayVal}
      {suffix}
    </>
  );
}

function CaseStudiesScene({ scene }: { scene: Scene }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const caseStudies = [
    {
      id: 1,
      companyName: "Kohinoor Group",
      subtitle: "REAL ESTATE",
      solutionStack: "Salesforce CRM + Meta CAPI + CX Prism™",
      quote: "From lead to booking to possession — Kohinoor's entire customer journey now runs through a single Salesforce environment built by Cascade Tech.",
      challenge: "Pre-sales ran across spreadsheets, broker WhatsApp groups and disconnected calling tools. No single view of a prospect's journey and Meta ad attribution was guesswork.",
      whatWeBuilt: "Full Sales Cloud covering lead capture, source tracking, site-visit scheduling, opportunity management and dashboards — plus a native Meta Conversions API integration in Apex and Flow with zero middleware. CX Prism™ now deploying for post-possession NPS.",
      outcome: "Live in production. End-to-end marketing attribution active for the first time — which campaigns drive site visits, bookings and true CAC.",
      oneLineOutcome: "Active end-to-end marketing attribution sync for true CAC and site visits.",
      metrics: [
        { value: "+40%", label: "Lead Visibility", icon: TrendingUp },
        { value: "+65%", label: "Process Automation", icon: Zap },
        { value: "100%", label: "Salesforce Adoption", icon: ShieldCheck },
        { value: "Real-Time", label: "Attribution Sync", icon: RefreshCw }
      ],
      dashboardType: "kohinoor",
      businessImpact: [
        { icon: Users, text: "More qualified leads captured accurately" },
        { icon: TrendingUp, text: "Clear visibility from ad spend to booking" },
        { icon: Wallet, text: "Lower cost per acquisition with true attribution" },
        { icon: HeartHandshake, text: "Better customer experience with CX Prism™" }
      ]
    },
    {
      id: 2,
      companyName: "Ashwin Sheth Group",
      subtitle: "REAL ESTATE",
      solutionStack: "Enterprise Salesforce Implementation",
      specialBadge: "₹57,74,000 + GST • 138-day roadmap",
      quote: "A ground-up Salesforce transformation across pre-sales, bookings, incentives and channel partners — delivered on time and on budget.",
      challenge: "A comprehensive CRM transformation across multiple projects and teams at once. Existing setup had no channel-partner visibility, no incentive management, no tele-calling integration and no unified booking workflow.",
      whatWeBuilt: "Five-module Salesforce rollout: pre-sales, bookings, incentives, channel-partner onboarding and tele-calling — delivered as one cohesive program.",
      outcome: "One of our largest, most complex implementations to date. All five modules delivered within the committed timeline; channel-partner onboarding time reduced significantly.",
      oneLineOutcome: "Complex 5-module Salesforce CRM transformation delivered on time and budget.",
      metrics: [
        { value: "138 Days", label: "Roadmap Delivery", icon: Clock },
        { value: "5 Modules", label: "CRM Integration", icon: Layers },
        { value: "100%", label: "On Time & Budget", icon: ShieldCheck },
        { value: "Reduced", label: "Onboarding Cycle", icon: TrendingUp }
      ],
      dashboardType: "ashwin",
      businessImpact: [
        { icon: Users, text: "Unified view across multiple project sales teams" },
        { icon: TrendingUp, text: "Accelerated channel-partner onboarding cycle" },
        { icon: BadgeCheck, text: "Automated incentive calculations and audit trails" },
        { icon: ShieldCheck, text: "Zero booking slip-ups or pipeline dead-ends" }
      ]
    },
    {
      id: 3,
      companyName: "Naiknavare Developers",
      subtitle: "REAL ESTATE",
      solutionStack: "Marketing Cloud + Cascade Connect",
      quote: "From unstructured campaign activity to a properly configured Marketing Cloud setup — with a clear roadmap for WhatsApp automation next.",
      challenge: "Marketing team ran email and SMS through Marketing Cloud but lacked campaign structure, reporting visibility and channel-level data. Lead follow-up was manual, inconsistent and untracked.",
      whatWeBuilt: "Restructured Marketing Cloud setup with proper journeys, governance and reporting. Cascade Connect proposed for Phase 2 WhatsApp automation.",
      outcome: "Campaign reporting now active and used weekly by the marketing team. Clear roadmap for WhatsApp automation in place.",
      oneLineOutcome: "Configured clean Campaign Reporting dashboards used weekly by marketing teams.",
      metrics: [
        { value: "+24.8%", label: "Email Open Rate", icon: Mail },
        { value: "Phase 2", label: "WhatsApp Ready", icon: MessageSquare },
        { value: "Weekly", label: "Attribution Reports", icon: LineChart },
        { value: "Active", label: "Campaign Attrib.", icon: RefreshCw }
      ],
      dashboardType: "naiknavare",
      businessImpact: [
        { icon: Megaphone, text: "Structured marketing journeys and clean reporting" },
        { icon: TrendingUp, text: "24.8% open rate achieved on primary campaigns" },
        { icon: Layers, text: "Clean database segmentation and governance" },
        { icon: MessageSquare, text: "Ready for automated Phase 2 WhatsApp journeys" }
      ]
    }
  ];

  const selectedCaseStudy = selectedIdx !== null ? caseStudies[selectedIdx] : null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + caseStudies.length) % caseStudies.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % caseStudies.length);
    }
  };

  return (
    <div
      className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col pt-4 md:pt-5 pb-4 md:pb-5 px-4 md:px-6 justify-start gap-3.5 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)] animate-in fade-in duration-500"
      style={{
        background: "rgba(248, 250, 252, 0.95)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Soft blue ambient glow */}
      <div className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
        background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)"
      }} />
      <div className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
        background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)"
      }} />

      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-start justify-between w-full h-auto relative z-10 mt-1 mb-1">
        <div className="w-full md:max-w-[55%] flex flex-col justify-start text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE]/80 rounded-full px-2.5 py-0.5 text-[9px] md:text-[10px] font-bold tracking-wider text-[#0284C7] w-fit mb-2">
            <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
            DISTRICT 11 • SHOWCASE
          </div>
          <h2 className="text-lg sm:text-xl md:text-[26px] lg:text-[30px] xl:text-[34px] font-[900] leading-[1.1] tracking-tight text-[#0F172A] font-display">
            Work In Production. <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
              Outcomes That Compound.
              <svg className="absolute -bottom-0.5 left-0 w-full h-[4px]" viewBox="0 0 200 5" fill="none" preserveAspectRatio="none">
                <path d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
        </div>
        <div className="w-full md:max-w-[40%] flex flex-col justify-start text-left pt-0 md:pt-4">
          <p className="text-[11px] md:text-[12.5px] text-slate-500 font-semibold leading-normal">
            Real Salesforce implementations, AI automations and marketing transformations delivering measurable business outcomes.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent opacity-60 my-0.5 relative z-10" />

      {/* THREE LARGE FEATURED CARDS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full relative z-10">
        {caseStudies.map((cs, idx) => (
          <div
            key={cs.id}
            className="bg-white/85 hover:bg-white border border-slate-200/40 hover:border-[#0EA5E9]/30 rounded-[20px] p-4 md:p-4.5 flex flex-col justify-between text-left shadow-[0_12px_40px_rgba(15,23,42,0.03)] hover:shadow-[0_25px_60px_rgba(14,165,233,0.08)] hover:scale-[1.01] transition-all duration-300 relative group cursor-pointer"
            onClick={() => setSelectedIdx(idx)}
          >
            <div>
              {/* Card Header */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-2 w-full">
                <span className="bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider text-[#0284C7]">
                  {cs.subtitle}
                </span>
                <span className="text-[8.5px] font-black text-slate-400 truncate max-w-[150px]">
                  {cs.solutionStack}
                </span>
              </div>

              {/* Large Company Name */}
              <h3 className="text-lg md:text-xl font-[900] text-[#0F172A] mt-2.5 tracking-tight group-hover:text-[#0EA5E9] transition-colors leading-tight">
                {cs.companyName}
              </h3>

              {/* Large Dashboard Preview Console on the Card */}
              <div className="w-full h-[110px] bg-slate-50/60 border border-slate-200/40 rounded-xl my-2.5 p-2.5 overflow-hidden relative flex flex-col justify-center select-none shadow-inner">
                {cs.dashboardType === "kohinoor" && (
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between text-[7.5px] text-slate-400 font-black">
                      <span>CONVERSION FUNNEL</span>
                      <span className="text-[#0EA5E9]">420 BOOKINGS</span>
                    </div>
                    <div className="flex flex-col gap-0.5 w-full">
                      <div className="w-full h-1.5 bg-sky-200/40 border border-sky-200/50 rounded-sm" />
                      <div className="w-[75%] h-1.5 bg-sky-300/40 border border-sky-300/50 rounded-sm" />
                      <div className="w-[48%] h-1.5 bg-sky-500 rounded-sm shadow-sm" />
                    </div>
                    <div className="flex justify-between items-center text-[7px] font-bold text-slate-500 bg-white border border-slate-100 rounded px-1.5 py-0.5">
                      <span>Meta Attribution</span>
                      <span className="text-sky-500">68% CAPI</span>
                    </div>
                  </div>
                )}
                {cs.dashboardType === "ashwin" && (
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex justify-between text-[7.5px] text-slate-400 font-black">
                      <span>IMPLEMENTATION STATE</span>
                      <span className="text-emerald-600">100% DELIVERED</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full w-full" />
                    </div>
                    <div className="grid grid-cols-5 gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-1 bg-emerald-100 border border-emerald-200 rounded-xs" />
                      ))}
                    </div>
                    <div className="flex justify-between text-[6.5px] text-slate-500 leading-none">
                      <span>Pre-Sales &bull; Bookings &bull; Incentives</span>
                      <span className="font-extrabold text-[#8B5CF6]">₹57.7L</span>
                    </div>
                  </div>
                )}
                {cs.dashboardType === "naiknavare" && (
                  <div className="flex flex-col gap-1.5 w-full justify-center">
                    <div className="flex justify-between text-[7.5px] text-slate-400 font-black">
                      <span>WHATSAPP INTEGRATION</span>
                      <span className="text-[#0EA5E9] font-black">ACTIVE JOURNEY</span>
                    </div>
                    <div className="flex items-center justify-between w-full bg-white border border-slate-100 p-1 rounded-lg">
                      <div className="flex items-center gap-1 w-full justify-center">
                        <div className="size-3.5 rounded bg-sky-50 border border-sky-100 flex items-center justify-center">
                          <Users className="size-1.5 text-[#0284C7]" />
                        </div>
                        <div className="h-[1px] bg-slate-200 flex-grow border-dashed border-t" />
                        <div className="size-4 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-sm">
                          <MessageSquare className="size-1.5 text-white" />
                        </div>
                        <div className="h-[1px] bg-slate-200 flex-grow border-dashed border-t" />
                        <div className="size-3.5 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          <Check className="size-1.5 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-[6.5px] text-slate-400 leading-none">
                      <span>Open: 24.8%</span>
                      <span>Click: 4.2%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 3 Key Metrics */}
              <div className="grid grid-cols-3 gap-1.5 mt-2.5">
                {cs.metrics.slice(0, 3).map((m, mIdx) => (
                  <div key={mIdx} className="bg-slate-50/50 border border-slate-100 rounded-lg p-2 text-left flex flex-col justify-between min-h-[56px]">
                    <span className="text-[#0EA5E9] text-lg sm:text-xl font-extrabold tracking-tight font-display leading-none">
                      {m.value}
                    </span>
                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap">
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* One-Line Business Outcome */}
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-2.5 pt-2 border-t border-slate-100/60 text-left">
                {cs.oneLineOutcome}
              </p>
            </div>

            {/* View Story CTA Button */}
            <button
              className="w-full mt-3 bg-slate-50 border border-slate-200 group-hover:bg-[#0EA5E9] group-hover:border-[#0ea5e9] group-hover:text-white text-[#0F172A] text-[10px] font-black py-2.5 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIdx(idx);
              }}
            >
              View Success Story
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        ))}
      </div>

      {/* FULL-PAGE SUCCESS STORY OVERLAY VIEW */}
      {selectedCaseStudy && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-slate-50/98 backdrop-blur-sm overflow-y-auto flex flex-col justify-start pointer-events-auto"
        >
          {/* Top Sticky Navigation Bar */}
          <div className="sticky top-0 z-30 bg-white border-b border-slate-200/50 px-6 py-4 flex items-center justify-between shadow-sm">
            <button
              onClick={() => setSelectedIdx(null)}
              className="text-xs font-bold text-slate-600 hover:text-[#0ea5e9] flex items-center gap-1.5 transition-all hover:scale-102 bg-slate-50 border border-slate-200 rounded-full px-4 py-2"
            >
              <ChevronLeft className="size-4" />
              Back to Showcase
            </button>

            {/* Title, Subtitle, and Stack directly in the header */}
            <div className="flex items-center gap-3 text-left">
              <span className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight">{selectedCaseStudy.companyName}</span>
              <span className="bg-[#ebf8ff] text-[#3182ce] text-[10px] font-bold px-2 py-0.5 rounded-md leading-none">
                {selectedCaseStudy.subtitle}
              </span>
              <span className="hidden md:inline text-xs text-slate-500 font-medium ml-2">
                {selectedCaseStudy.solutionStack}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="hover:scale-105 transition-all bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full p-2 text-slate-600 cursor-pointer flex items-center justify-center"
                title="Previous Case Study"
              >
                <ChevronLeft className="size-4.5" />
              </button>
              <button
                onClick={handleNext}
                className="hover:scale-105 transition-all bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full p-2 text-slate-600 cursor-pointer flex items-center justify-center"
                title="Next Case Study"
              >
                <ChevronRight className="size-4.5" />
              </button>
            </div>
          </div>

          {/* Success Story Article Container */}
          <div className="max-w-6xl mx-auto w-full px-6 py-6 flex flex-col gap-6 flex-grow">

            {/* Top row: Quote & Metrics */}
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between w-full border-b border-slate-100 pb-5 text-left">
              {/* Left Quote */}
              <div className="w-full lg:w-[50%] flex items-start gap-4 pr-4">
                <div className="size-10 rounded-full bg-[#0ea5e9] text-white flex items-center justify-center flex-shrink-0 shadow-sm shadow-sky-500/10">
                  <span className="text-xl font-serif leading-none mt-1">“</span>
                </div>
                <p className="text-[#0F172A] text-sm md:text-base font-semibold leading-relaxed">
                  {selectedCaseStudy.quote}
                </p>
              </div>

              {/* Right Metrics Grid */}
              <div className="w-full lg:w-[50%] grid grid-cols-4 gap-3">
                {selectedCaseStudy.metrics.map((m: any, mIdx: number) => {
                  const MetricIcon = m.icon;
                  return (
                    <div key={mIdx} className="bg-white border border-slate-200/50 rounded-2xl p-3 flex flex-col justify-between min-h-[90px] shadow-[0_2px_8px_rgba(15,23,42,0.02)] hover:border-sky-500/30 transition-all duration-300">
                      <div className="text-sky-500 flex items-center justify-start">
                        <MetricIcon className="size-4" />
                      </div>
                      <div className="flex flex-col gap-0.5 mt-2">
                        <span className="text-[#0ea5e9] text-lg md:text-xl font-black tracking-tight font-display leading-none">
                          <CountUpText text={m.value} />
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-1.5 block overflow-hidden text-ellipsis whitespace-nowrap">
                          {m.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Details Section */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full mt-2">

              {/* Left column details (Timeline Layout) */}
              <motion.div
                key={`left-article-${selectedIdx}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="w-full lg:w-[48%] flex flex-col gap-5 relative pl-12 justify-center py-2"
              >
                {/* Vertical Timeline Line */}
                <div className="absolute left-[20px] top-6 bottom-6 w-[2px] bg-slate-200" />

                {[
                  { label: "Challenge", body: selectedCaseStudy.challenge, icon: AlertTriangle },
                  { label: "What We Built", body: selectedCaseStudy.whatWeBuilt, icon: Workflow },
                  { label: "Outcome", body: selectedCaseStudy.outcome, icon: BadgeCheck }
                ].map((item, subIdx) => (
                  <div key={subIdx} className="relative flex flex-col">
                    {/* Circle Node */}
                    <div className="absolute left-[-44px] top-2 size-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm z-10 hover:border-sky-500 hover:text-sky-500 transition-colors duration-300">
                      <div className="size-6.5 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                        <item.icon className="size-3.5" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="bg-white border border-slate-200/50 rounded-2xl p-4 md:p-5 flex flex-col justify-start text-left shadow-[0_4px_16px_rgba(15,23,42,0.02)] hover:border-sky-500/30 transition-all duration-300">
                      <span className="text-[10px] font-black uppercase tracking-wider text-sky-500">
                        {item.label}
                      </span>
                      <p className="mt-2 text-xs md:text-[13px] leading-relaxed text-slate-500 font-semibold">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Right column (Dashboard Mockup) */}
              <motion.div
                key={`right-article-${selectedIdx}`}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full lg:w-[52%] flex flex-col"
              >
                {/* Large visual console */}
                <div className="w-full flex-grow flex flex-col justify-between bg-slate-100/60 border border-slate-200/60 rounded-xl p-4 relative overflow-hidden min-h-[300px] lg:min-h-[330px] shadow-sm select-none hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center justify-between border-b border-slate-200/40 pb-2 mb-3">
                    <div className="flex items-center gap-1">
                      <div className="size-2 rounded-full bg-[#EF4444]/90" />
                      <div className="size-2 rounded-full bg-[#F59E0B]/90" />
                      <div className="size-2 rounded-full bg-[#10B981]/90" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 tracking-wider font-mono">
                      {selectedCaseStudy.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}.salesforce / console
                    </span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center gap-3">
                    {selectedCaseStudy.dashboardType === "kohinoor" && (
                      <>
                        <div className="flex flex-col gap-1.5 w-full text-left">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Conversion Funnel</span>
                          <div className="flex flex-col gap-1 mt-0.5 text-[10px] font-bold text-slate-600">
                            <div className="w-full bg-sky-50 border border-sky-100 rounded-lg p-2 flex justify-between items-center leading-none">
                              <span>1. Leads</span>
                              <span className="text-[#0EA5E9] font-black">12,400</span>
                            </div>
                            <div className="w-[82%] bg-sky-50 border border-sky-100 rounded-lg p-2 flex justify-between items-center leading-none">
                              <span>2. Contacted</span>
                              <span className="text-[#0EA5E9] font-black">8,680</span>
                            </div>
                            <div className="w-[62%] bg-sky-100/55 border border-sky-200/55 rounded-lg p-2 flex justify-between items-center leading-none">
                              <span>3. Site Visits</span>
                              <span className="text-[#0EA5E9] font-black">2,400</span>
                            </div>
                            <div className="w-[42%] bg-sky-500 text-white rounded-lg p-2 flex justify-between items-center shadow-md shadow-sky-500/10 leading-none">
                              <span>4. Bookings</span>
                              <span className="font-extrabold text-white">420</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-0.5">
                          <div className="bg-white border border-slate-100 rounded-lg p-2 text-left shadow-sm flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Weekly Visits</span>
                            <div className="flex items-end justify-between h-9 mt-1 px-1">
                              {[25, 45, 60, 75, 95].map((h, i) => (
                                <div key={i} className="w-[12%] bg-[#0EA5E9] rounded-t-xs" style={{ height: `${h}%` }} />
                              ))}
                            </div>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-lg p-2 text-left shadow-sm flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Meta Attribution</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <svg className="size-8 flex-shrink-0" viewBox="0 0 32 32">
                                <circle cx="16" cy="16" r="14" fill="transparent" stroke="#E2E8F0" strokeWidth="4" />
                                <circle cx="16" cy="16" r="14" fill="transparent" stroke="#0EA5E9" strokeWidth="4" strokeDasharray="60 100" strokeDashoffset="0" transform="rotate(-90 16 16)" />
                              </svg>
                              <div className="flex flex-col text-[7.5px] leading-tight">
                                <span className="font-black text-[#0ea5e9]">68% Meta CAPI</span>
                                <span className="text-slate-400 font-semibold">32% Other</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedCaseStudy.dashboardType === "ashwin" && (
                      <>
                        <div className="flex flex-col gap-1.5 w-full text-left">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">Implementation Progress</span>
                          <div className="flex items-center justify-between w-full bg-white border border-slate-100 p-2.5 rounded-lg mt-0.5 shadow-sm">
                            {[
                              { label: "Pre-Sales", status: "completed" },
                              { label: "Bookings", status: "completed" },
                              { label: "Incentives", status: "completed" },
                              { label: "Partners", status: "completed" },
                              { label: "Tele-Calls", status: "completed" }
                            ].map((step, sIdx) => (
                              <div key={sIdx} className="flex flex-col items-center flex-1 relative">
                                <div className="size-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                                  <Check className="size-2.5" />
                                </div>
                                <span className="text-[7.5px] font-bold text-slate-600 mt-1 leading-none truncate w-full text-center">{step.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-0.5">
                          <div className="bg-white border border-slate-100 rounded-lg p-2 text-left shadow-sm flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Incentives Tracked</span>
                            <p className="text-lg font-[900] text-[#8B5CF6] mt-1.5 font-display leading-none">₹57.7L</p>
                            <span className="text-[7px] text-slate-400 font-bold leading-none mt-1">100% Audit Verified</span>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-lg p-2 text-left shadow-sm flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Partner Sync</span>
                            <div className="flex flex-col gap-1 mt-1.5 w-full">
                              <div className="flex justify-between text-[7.5px] text-slate-500 font-bold leading-none">
                                <span>Active Brokers</span>
                                <span>+120</span>
                              </div>
                              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-[#0EA5E9] h-full rounded-full w-[85%]" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {selectedCaseStudy.dashboardType === "naiknavare" && (
                      <>
                        <div className="flex flex-col gap-1.5 w-full text-left">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">WhatsApp Lead Journey</span>
                          <div className="flex items-center justify-between w-full bg-white border border-slate-100 px-3 py-2 rounded-lg mt-0.5 shadow-sm">
                            <div className="flex flex-col items-center">
                              <div className="size-5.5 rounded bg-sky-50 text-[#0EA5E9] border border-sky-100 flex items-center justify-center shadow-xs">
                                <Users className="size-2.5" />
                              </div>
                              <span className="text-[7.5px] font-bold text-slate-500 mt-1 leading-none">Ad Click</span>
                            </div>
                            <div className="h-[1px] bg-slate-200 flex-grow mx-1 border-dashed border-t" />
                            <div className="flex flex-col items-center">
                              <div className="size-6.5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs animate-pulse">
                                <MessageSquare className="size-3 text-white" />
                              </div>
                              <span className="text-[7.5px] font-black text-[#0EA5E9] mt-1 leading-none">Opt-In Msg</span>
                            </div>
                            <div className="h-[1px] bg-slate-200 flex-grow mx-1 border-dashed border-t" />
                            <div className="flex flex-col items-center">
                              <div className="size-5.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
                                <Cloud className="size-2.5" />
                              </div>
                              <span className="text-[7.5px] font-bold text-slate-500 mt-1 leading-none">CRM Update</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-0.5">
                          <div className="bg-white border border-slate-100 rounded-lg p-2 text-left shadow-sm flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Campaign Stats</span>
                            <div className="flex flex-col gap-1 mt-1.5">
                              <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-700">
                                <span className="text-slate-400 text-[7px] font-bold">Open Rate</span>
                                <span>24.8%</span>
                              </div>
                              <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-700">
                                <span className="text-slate-400 text-[7px] font-bold">Click Rate</span>
                                <span>4.2%</span>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white border border-slate-100 rounded-lg p-2 text-left shadow-sm flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">Engagement Trend</span>
                            <div className="h-7 mt-1.5 relative">
                              <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                                <path d="M 0 25 C 20 5, 40 30, 60 10 T 100 8" fill="none" stroke="#2563EB" strokeWidth="1.5" />
                                <path d="M 0 25 C 20 5, 40 30, 60 10 T 100 8 L 100 30 L 0 30 Z" fill="rgba(37,99,235,0.06)" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Bottom business impact ribbon */}
            <div
              key={`impact-article-${selectedIdx}`}
              className="bg-white border border-slate-200/50 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-[0_4px_20px_rgba(15,23,42,0.02)] w-full mt-4 text-left gap-4"
            >
              <div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-slate-200 pb-2 md:pb-0 pr-0 md:pr-4 flex-shrink-0">
                <span className="text-[#0EA5E9] text-[10px] font-black uppercase tracking-wider">
                  Business Impact
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow pl-0 md:pl-2">
                {selectedCaseStudy.businessImpact.map((item: any, itemIdx: number) => {
                  const ImpactIcon = item.icon;
                  return (
                    <div key={itemIdx} className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-sky-50 text-sky-500 border border-sky-100 flex-shrink-0">
                        <ImpactIcon className="size-3.5" />
                      </div>
                      <span className="text-[10.5px] font-bold text-slate-600 leading-snug">
                        {item.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </motion.div>
      )}
      {/* Bottom Glow reflection element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
    </div>
  );
}

function EngagementModelScene({ scene }: { scene: Scene }) {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [expandedStageIdx, setExpandedStageIdx] = useState<number | null>(null);

  const stages = [
    {
      id: "01",
      title: "Discovery",
      duration: "Week 1",
      desc: "Aligning operational workflows and requirements with zero assumptions.",
      challenge: "Fragmented processes, undocumented spreadsheets, and lack of real-time pipeline visibility.",
      whatWeBuild: "Detailed operational audit, systems map, and technical architecture definition.",
      deliverables: ["Lead Flow Audit Map", "API/CRM Integration Specs", "Success Metric Benchmarks"],
      outcome: "Aligned timeline, budget, and system architecture design document.",
      icon: Search,
      illustration: () => (
        <svg viewBox="0 0 200 120" className="w-full h-24 text-[#0EA5E9]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="30" cy="30" r="6" className="fill-[#0EA5E9]/10 stroke-[#0EA5E9]" strokeWidth="1.5" />
          <circle cx="30" cy="60" r="6" className="fill-slate-100 stroke-slate-400" strokeWidth="1.5" />
          <circle cx="30" cy="90" r="6" className="fill-[#3B82F6]/10 stroke-[#3B82F6]" strokeWidth="1.5" />
          <path d="M36 30 H100" className="stroke-slate-300" strokeWidth="1.5" strokeDasharray="3 3" />
          <path d="M36 60 Q70 60 100 60" className="stroke-slate-300" strokeWidth="1.5" />
          <path d="M36 90 Q70 90 100 60" className="stroke-slate-300" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="106" cy="60" r="12" className="fill-sky-50 stroke-[#0EA5E9]" strokeWidth="2" />
          <path d="M101 60 L104 63 L111 56" className="stroke-[#0EA5E9]" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M118 60 H164" className="stroke-[#0EA5E9]" strokeWidth="2" />
          <polygon points="164,57 170,60 164,63" className="fill-[#0EA5E9]" />
          <circle cx="176" cy="60" r="8" className="fill-[#0EA5E9]/10 stroke-[#0EA5E9]" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: "02",
      title: "Blueprint",
      duration: "Week 2",
      desc: "Designing database schemas and automation workflows.",
      challenge: "Data model conflicts, security schema holes, and duplicate contact profiles.",
      whatWeBuild: "Custom Entity Relationship Diagram (ERD) and object schema configuration blueprints.",
      deliverables: ["Entity Relationship Diagrams (ERDs)", "Field-Level Security Matrix", "Sandbox Initialization Plans"],
      outcome: "Technical blueprint signed off and sandbox environments provisioned.",
      icon: Layers,
      illustration: () => (
        <svg viewBox="0 0 200 120" className="w-full h-24 text-[#10B981]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="20" width="50" height="35" rx="4" className="fill-white stroke-[#10B981]" strokeWidth="1.5" />
          <line x1="20" y1="32" x2="70" y2="32" className="stroke-[#10B981]" strokeWidth="1" />
          <rect x="25" y="38" width="15" height="4" rx="1" className="fill-slate-200" />
          <rect x="25" y="46" width="25" height="4" rx="1" className="fill-[#10B981]/30" />
          <rect x="130" y="40" width="50" height="45" rx="4" className="fill-white stroke-slate-400" strokeWidth="1.5" />
          <line x1="130" y1="52" x2="180" y2="52" className="stroke-slate-400" strokeWidth="1" />
          <rect x="135" y="58" width="20" height="4" rx="1" className="fill-slate-200" />
          <rect x="135" y="66" width="25" height="4" rx="1" className="fill-slate-200" />
          <rect x="135" y="74" width="15" height="4" rx="1" className="fill-[#10B981]/30" />
          <path d="M70 37 H95 V62 H130" className="stroke-[#10B981]" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M125 58 L130 62 L125 66" className="stroke-[#10B981]" strokeWidth="1.5" />
          <circle cx="120" cy="62" r="2" className="fill-white stroke-[#10B981]" strokeWidth="1" />
        </svg>
      )
    },
    {
      id: "03",
      title: "Build",
      duration: "Weeks 3–10",
      desc: "Developing custom Apex, LWC, and CRM flow triggers.",
      challenge: "Unreliable manual actions, sluggish data processing, and lack of automated alerts.",
      whatWeBuild: "Robust custom apex coding, lightning web components (LWC), and API flows.",
      deliverables: ["Apex & Flow Automations", "WhatsApp API Integration", "Migration scripts & runs"],
      outcome: "Fully integrated and custom-coded CRM platform ready in staging.",
      icon: Code,
      illustration: () => (
        <svg viewBox="0 0 200 120" className="w-full h-24 text-[#6366F1]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="15" width="160" height="90" rx="6" className="fill-slate-900 stroke-slate-800" strokeWidth="2" />
          <circle cx="35" cy="27" r="3" className="fill-rose-500" />
          <circle cx="45" cy="27" r="3" className="fill-amber-500" />
          <circle cx="55" cy="27" r="3" className="fill-emerald-500" />
          <rect x="32" y="44" width="50" height="6" rx="2" className="fill-[#6366F1]" />
          <rect x="87" y="44" width="30" height="6" rx="2" className="fill-slate-600" />
          <rect x="32" y="58" width="25" height="6" rx="2" className="fill-[#10B981]" />
          <rect x="62" y="58" width="60" height="6" rx="2" className="fill-slate-500" />
          <rect x="45" y="72" width="80" height="6" rx="2" className="fill-[#F59E0B]" />
          <rect x="32" y="86" width="40" height="6" rx="2" className="fill-slate-600" />
        </svg>
      )
    },
    {
      id: "04",
      title: "Train & UAT",
      duration: "Weeks 11–12",
      desc: "Enabling teams and addressing feedback loops.",
      challenge: "Low user adoption rates, administrative skill gaps, and transition friction.",
      whatWeBuild: "Custom role-based training programs, UAT cycles, and transition playbooks.",
      deliverables: ["UAT Testing Cycles", "Role-Based Training Manuals", "Administrator Enablement Guides"],
      outcome: "Stakeholder sign-off and adoption readiness verified.",
      icon: GraduationCap,
      illustration: () => (
        <svg viewBox="0 0 200 120" className="w-full h-24 text-[#8B5CF6]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="35" className="stroke-slate-200" strokeWidth="6" />
          <circle cx="60" cy="60" r="35" className="stroke-[#8B5CF6]" strokeWidth="6" strokeDasharray="220" strokeDashoffset="55" strokeLinecap="round" />
          <text x="60" y="66" className="fill-[#8B5CF6] font-extrabold text-[18px]" textAnchor="middle">85%</text>
          <g transform="translate(135, 35)">
            <rect x="0" y="0" width="45" height="20" rx="4" className="fill-violet-50 stroke-[#8B5CF6]" strokeWidth="1" />
            <text x="22.5" y="13" className="fill-[#8B5CF6] text-[8px] font-bold" textAnchor="middle">Training</text>
          </g>
          <g transform="translate(135, 65)">
            <rect x="0" y="0" width="45" height="20" rx="4" className="fill-emerald-50 stroke-[#10B981]" strokeWidth="1" />
            <text x="22.5" y="13" className="fill-[#10B981] text-[8px] font-bold" textAnchor="middle">UAT Sign-off</text>
          </g>
          <path d="M96 50 C 110 50, 110 45, 135 45" className="stroke-slate-300" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M96 70 C 110 70, 110 75, 135 75" className="stroke-slate-300" strokeWidth="1.5" strokeDasharray="2 2" />
        </svg>
      )
    },
    {
      id: "05",
      title: "Go-Live & Support",
      duration: "Post Week 12",
      desc: "Deploying to production and supporting adoption.",
      challenge: "Deployment downtime, cutover synchronization, and post-launch bugs.",
      whatWeBuild: "Safe production package migration, 30-day hypercare, and ongoing annual maintenance (AMC).",
      deliverables: ["Production Cutover Checklist", "30-Day Hypercare Support", "Long-term AMC Setup"],
      outcome: "Live system deployed with zero downtime and continuous support.",
      icon: Rocket,
      illustration: () => (
        <svg viewBox="0 0 200 120" className="w-full h-24 text-[#EC4899]" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 100 Q 80 85 105 55" className="stroke-[#EF4444]" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 4" />
          <path d="M20 110 Q 70 95 120 110" className="stroke-slate-300" strokeWidth="3" fill="none" />
          <rect x="135" y="70" width="45" height="35" rx="4" className="fill-slate-50 stroke-slate-300" strokeWidth="1.5" />
          <circle cx="145" cy="80" r="3" className="fill-[#10B981]" />
          <line x1="154" y1="80" x2="172" y2="80" className="stroke-slate-400" strokeWidth="1.5" />
          <circle cx="145" cy="90" r="3" className="fill-[#10B981]" />
          <line x1="154" y1="90" x2="172" y2="90" className="stroke-slate-400" strokeWidth="1.5" />
          <g transform="translate(100, 30) rotate(35)">
            <path d="M0 -15 C 6 -10, 6 10, 0 15 C -6 10, -6 -10, 0 -15" className="fill-[#0EA5E9] stroke-[#0284C7]" strokeWidth="1" />
            <path d="M-5 5 L-10 12 L-4 12 Z" className="fill-rose-500" />
            <path d="M5 5 L10 12 L4 12 Z" className="fill-rose-500" />
            <circle cx="0" cy="-2" r="2.5" className="fill-white" />
            <path d="M-3 15 L0 23 L3 15 Z" className="fill-amber-500" />
          </g>
        </svg>
      )
    },
  ];

  const currentStage = expandedStageIdx !== null ? stages[expandedStageIdx] : null;

  return (
    <div
      className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-5 pb-5 px-4 md:px-6 justify-center gap-4 md:gap-5 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)] animate-in fade-in duration-500"
      style={{
        background: "rgba(248, 250, 252, 0.95)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Ambient glows */}
      <div className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
        background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)"
      }} />
      <div className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{
        background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)"
      }} />

      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-dist-12-new" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0284C7" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dist-12-new)" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row gap-5 md:gap-6 items-stretch justify-between w-full h-full relative z-10 max-w-[1280px] mx-auto">
        {/* LEFT COLUMN: 30% width */}
        <div className="w-full md:w-[30%] flex flex-col justify-between text-left h-full py-1">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE]/80 rounded-full px-2.5 py-0.5 text-[9px] md:text-[10px] font-bold tracking-wider text-[#0284C7] w-fit mb-2 md:mb-3">
              <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              ENGAGEMENT MODEL
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[40px] xl:text-[46px] font-[800] leading-[1.08] tracking-tight text-[#0F172A] font-display mb-2 md:mb-3">
              How We{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
                Work With You
                <svg className="absolute -bottom-0.5 left-0 w-full h-[4px]" viewBox="0 0 200 5" fill="none" preserveAspectRatio="none">
                  <path d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-[10.5px] md:text-[12.5px] lg:text-[13.5px] text-slate-500 font-semibold leading-relaxed mb-3 md:mb-4 pr-2">
              We believe in structured delivery, complete alignment, and deep operational understanding. From the initial discovery to production launch, here is our roadmap for your project.
            </p>
          </div>

          {/* Timeline Summary Card */}
          <div className="bg-white/90 border border-sky-100 rounded-2xl p-3.5 md:p-4 shadow-[0_8px_30px_rgba(15,23,42,0.02)] flex items-start gap-3.5 transition-all hover:border-[#0EA5E9]/20 hover:shadow-md mt-auto">
            <div className="size-9 rounded-xl bg-sky-50 flex items-center justify-center text-[#0284C7] border border-sky-100 flex-shrink-0 mt-0.5">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">TYPICAL TIMELINE</span>
              <span className="text-base md:text-lg lg:text-xl font-[900] text-slate-900 leading-tight block mt-0.5">8–14 Weeks</span>
              <p className="text-[9.5px] md:text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                Complex multi-module projects for India's top developers — delivered on time and on budget.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN / CENTER: 68% width */}
        <div className="w-full md:w-[68%] flex flex-col justify-center h-full py-1 relative">

          {/* Background Visual Roadmap Illustration */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] md:opacity-[0.08] select-none z-0 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Circuit board pathways in background connecting nodes */}
              <path d="M120,180 Q250,80 400,150 T680,120" stroke="#0284C7" strokeWidth="2.5" strokeDasharray="5,5" />
              <path d="M120,320 Q250,420 400,350 T680,380" stroke="#0EA5E9" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M280,120 L280,380" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4,4" />
              <path d="M520,120 L520,380" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4,4" />

              {/* Node definitions */}
              <g transform="translate(120, 180)">
                <circle r="22" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="1.5" />
                <text fill="#0284C7" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">Salesforce</text>
              </g>
              <g transform="translate(280, 120)">
                <circle r="22" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
                <text fill="#047857" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">AI Engine</text>
              </g>
              <g transform="translate(280, 380)">
                <circle r="22" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
                <text fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">CRM</text>
              </g>
              <g transform="translate(420, 200)">
                <circle r="22" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="1.5" />
                <text fill="#BE123C" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">WhatsApp</text>
              </g>
              <g transform="translate(520, 120)">
                <circle r="22" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="1.5" />
                <text fill="#6D28D9" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">Integrations</text>
              </g>
              <g transform="translate(520, 380)">
                <circle r="22" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
                <text fill="#1D4ED8" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">Deployment</text>
              </g>
            </svg>
          </div>

          {/* Horizontal connecting line (Desktop only) */}
          <div className="absolute left-[10%] right-[10%] top-5 h-[2px] pointer-events-none hidden md:block z-10">
            {/* Background trace line */}
            <div className="absolute inset-0 bg-slate-200/80 rounded-full h-full w-full" />
            {/* Active filled line */}
            <div
              className="absolute left-0 top-0 bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(14,165,233,0.8)]"
              style={{ width: `${(activeStage / 4) * 100}%` }}
            />
            {/* Pulsing indicator dot */}
            <div
              className="absolute size-2 bg-white border-2 border-[#0EA5E9] rounded-full shadow-[0_0_10px_rgba(14,165,233,1)] pointer-events-none -translate-y-[3px] -translate-x-[4px] transition-all duration-500"
              style={{
                left: `${(activeStage / 4) * 100}%`,
              }}
            />
          </div>

          {/* Desktop milestone cards flex (md and up) */}
          <div className="hidden md:flex flex-row items-stretch justify-between gap-3.5 w-full h-[66%] py-1 relative z-10">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStage === idx;

              return (
                <div
                  key={idx}
                  className="flex-1 min-w-0 flex flex-col items-center text-center cursor-pointer group"
                  onMouseEnter={() => setActiveStage(idx)}
                  onClick={() => setExpandedStageIdx(idx)}
                >
                  {/* Icon Node wrapper */}
                  <div className={`size-10 rounded-full flex items-center justify-center border transition-all duration-500 z-20 bg-white relative ${isActive
                      ? "border-[#0EA5E9] text-[#0EA5E9] shadow-[0_0_15px_rgba(14,165,233,0.25)] scale-110"
                      : "border-slate-200 text-slate-400 group-hover:border-[#0EA5E9]/50 group-hover:text-[#0EA5E9]/70"
                    }`}>
                    <Icon className={`size-4.5 transition-transform duration-500 ${isActive ? "scale-110 rotate-3" : "group-hover:scale-105"}`} />
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-[#0EA5E9]/10 animate-ping pointer-events-none" />
                    )}
                  </div>

                  {/* Card Container */}
                  <div className={`mt-4 bg-white/90 backdrop-blur-sm border rounded-2xl p-4 flex-1 flex flex-col justify-between transition-all duration-500 shadow-sm w-full relative z-10 ${isActive
                      ? "border-[#0EA5E9]/50 bg-white/98 shadow-[0_12px_30px_rgba(14,165,233,0.06)] -translate-y-1.5"
                      : "border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                    }`}>
                    <div>
                      {/* Step & Duration */}
                      <div className="flex flex-col items-center">
                        <span className={`text-[8.5px] font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? "text-[#0EA5E9]" : "text-slate-400"
                          }`}>
                          STAGE {stage.id}
                        </span>

                        <span className="mt-0.5 text-xs lg:text-[13px] font-[800] text-slate-800 leading-tight">
                          {stage.title}
                        </span>

                        <span className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-extrabold border transition-all ${isActive
                            ? "text-[#0EA5E9] bg-sky-50 border-sky-100"
                            : "text-slate-500 bg-slate-50 border-slate-100/80"
                          }`}>
                          {stage.duration}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="mt-2.5 text-[10px] xl:text-[10.5px] leading-relaxed text-slate-500 font-semibold px-0.5">
                        {stage.desc}
                      </p>
                    </div>

                    {/* Action Link */}
                    <div className="mt-3 text-[9px] font-bold text-[#0EA5E9] flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span>Explore stage</span>
                      <ChevronRight className="size-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile/Tablet Stacked timeline (hidden on md and up) */}
          <div className="md:hidden flex flex-col gap-3 w-full max-h-[50vh] overflow-y-auto pr-1 relative z-10">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStage === idx;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveStage(idx);
                    setExpandedStageIdx(idx);
                  }}
                  className={`flex gap-3.5 p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer bg-white/90 ${isActive
                      ? "border-[#0EA5E9] shadow-[0_8px_25px_rgba(14,165,233,0.04)] scale-[1.01]"
                      : "border-slate-200/80"
                    }`}
                >
                  {/* Icon Node */}
                  <div className={`size-9 rounded-full flex items-center justify-center border flex-shrink-0 mt-0.5 transition-all ${isActive
                      ? "border-[#0EA5E9] text-[#0EA5E9] bg-sky-50"
                      : "border-slate-200 text-slate-400"
                    }`}>
                    <Icon className="size-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8.5px] font-bold text-[#0EA5E9] uppercase tracking-wider">
                          STAGE {stage.id}
                        </span>
                        <h4 className="text-xs sm:text-sm font-[800] text-slate-800 leading-tight">
                          {stage.title}
                        </h4>
                      </div>
                      <span className="inline-flex px-1.5 py-0.5 rounded-full text-[8px] font-bold text-slate-500 bg-slate-50 border border-slate-100">
                        {stage.duration}
                      </span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-slate-500 font-semibold mt-1">
                      {stage.desc}
                    </p>
                    <div className="mt-2 text-[9px] font-bold text-[#0EA5E9] flex items-center gap-0.5">
                      <span>Tap to view details</span>
                      <ChevronRight className="size-2.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Slide-over details panel */}
      {expandedStageIdx !== null && currentStage && (
        <div className="fixed inset-0 z-[150] pointer-events-auto">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
            onClick={() => setExpandedStageIdx(null)}
          />

          {/* Drawer Container */}
          <div
            className="absolute inset-y-0 right-0 w-full sm:w-[460px] bg-white border-l border-slate-200/80 shadow-[0_0_80px_rgba(15,23,42,0.15)] flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-[#0EA5E9] uppercase">
                  STAGE {currentStage.id}
                </span>
                <h3 className="text-xl font-[900] text-slate-800 leading-tight mt-0.5">
                  {currentStage.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold text-[#0EA5E9] bg-sky-50 border border-sky-100/50">
                  {currentStage.duration}
                </span>
                <button
                  onClick={() => setExpandedStageIdx(null)}
                  className="size-8 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-left">
              {/* Visual Illustration */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-center min-h-[120px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <svg width="100%" height="100%">
                    <pattern id="grid-ill" width="16" height="16" patternUnits="userSpaceOnUse">
                      <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#000" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid-ill)" />
                  </svg>
                </div>
                <div className="relative z-10 w-full max-w-[240px]">
                  {currentStage.illustration()}
                </div>
              </div>

              {/* Challenge Block */}
              <div>
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-rose-500 block mb-1.5">
                  The Challenge
                </span>
                <div className="bg-rose-50/40 border border-rose-100/60 rounded-xl p-3.5">
                  <p className="text-slate-600 text-[11.5px] font-semibold leading-relaxed">
                    {currentStage.challenge}
                  </p>
                </div>
              </div>

              {/* What We Build Block */}
              <div>
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-[#0EA5E9] block mb-1.5">
                  What We Build
                </span>
                <div className="bg-sky-50/40 border border-sky-100/60 rounded-xl p-3.5">
                  <p className="text-slate-600 text-[11.5px] font-semibold leading-relaxed">
                    {currentStage.whatWeBuild}
                  </p>
                </div>
              </div>

              {/* Deliverables Checklist */}
              <div>
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-slate-400 block mb-2">
                  Key Deliverables
                </span>
                <div className="flex flex-col gap-2 bg-slate-50/50 border border-slate-100/80 rounded-xl p-3.5">
                  {currentStage.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="size-4.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                        <Check className="size-2.5" />
                      </span>
                      <span className="text-slate-600 text-[11px] font-bold mt-0.5">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Outcome */}
              <div>
                <span className="text-[9px] font-extrabold tracking-wider uppercase text-emerald-600 block mb-1.5">
                  Expected Outcome
                </span>
                <div className="bg-emerald-50/40 border border-emerald-100/60 rounded-xl p-3.5">
                  <p className="text-slate-700 text-[11.5px] font-extrabold leading-relaxed">
                    {currentStage.outcome}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <button
                onClick={() => {
                  if (expandedStageIdx > 0) {
                    const newIdx = expandedStageIdx - 1;
                    setExpandedStageIdx(newIdx);
                    setActiveStage(newIdx);
                  }
                }}
                disabled={expandedStageIdx === 0}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="size-3.5" />
                <span>Previous</span>
              </button>

              <span className="text-[10px] font-extrabold text-slate-400">
                Stage {expandedStageIdx + 1} of 5
              </span>

              <button
                onClick={() => {
                  if (expandedStageIdx < 4) {
                    const newIdx = expandedStageIdx + 1;
                    setExpandedStageIdx(newIdx);
                    setActiveStage(newIdx);
                  }
                }}
                disabled={expandedStageIdx === 4}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                <span>Next Stage</span>
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Glow reflection element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />

      {/* Inline styles for connection dash animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -32;
          }
        }
      `}</style>
    </div>
  );
}

function ClientCard({ clientName }: { clientName: string }) {
  const [imgError, setImgError] = useState(false);

  const normalizedName = clientName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return (
    <div
      className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl p-1 md:p-1.5 flex items-center justify-center text-center shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-[0_15px_35px_rgba(14,165,233,0.08)] hover:border-[#0EA5E9]/30 hover:scale-[1.02] transition-all duration-300 min-h-[58px] md:min-h-[72px] overflow-hidden group/card"
    >
      {!imgError ? (
        <img
          src={`/clients/${normalizedName}.png`}
          alt={clientName}
          onError={() => setImgError(true)}
          className="w-full h-full max-h-[58px] md:max-h-[72px] max-w-[95%] object-contain scale-[1.3] transition-transform duration-300 group-hover/card:scale-[1.38]"
        />
      ) : (
        <span className="text-[9.5px] md:text-[11px] lg:text-[12px] font-black text-slate-700 tracking-wider px-2.5">
          {clientName}
        </span>
      )}
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
export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [initStage, setInitStage] = useState(0);
  const [active, setActive] = useState(0);

  // Stage 1: mounted
  useLayoutEffect(() => {
    if (initStage === 0) {
      console.log("mounted")
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      try {
        sessionStorage.removeItem("tsr-scroll-restoration-v1_3");
      } catch (e) { }

      // Scroll immediately
      window.scrollTo(0, 0);

      // Scroll after a small timeout to let browser layout/restoration register
      const t = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 60);

      setInitStage(1);
      return () => clearTimeout(t);
    }
  }, [initStage]);

  // Stage 2: layout ready
  useLayoutEffect(() => {
    if (initStage === 1) {
      console.log("layout ready")
      setInitStage(2);
    }
  }, [initStage]);

  // Stage 3: gsap initialized
  useLayoutEffect(() => {
    if (initStage === 2) {
      console.log("gsap initialized")
      setInitStage(3);
    }
  }, [initStage]);

  // Stage 4: scrolltrigger initialized
  useLayoutEffect(() => {
    if (initStage === 3) {
      ScrollTrigger.refresh();
      console.log("scrolltrigger initialized")
      setInitStage(4);
    }
  }, [initStage]);

  // Stage 5: camera initialized
  useLayoutEffect(() => {
    if (initStage === 4) {
      console.log("camera initialized")
      setInitStage(5);
    }
  }, [initStage]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    setActive(Math.min(N - 1, Math.round(v * (N - 1))));
  });

  const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scrollTween = useRef<gsap.core.Tween | null>(null);

  const scrollToScene = (sceneIndex: number) => {
    const targetScrollTop = sceneIndex * window.innerHeight;

    if (scrollTween.current) {
      scrollTween.current.kill();
    }

    const scrollObj = { y: window.scrollY };
    scrollTween.current = gsap.to(scrollObj, {
      y: targetScrollTop,
      duration: 1.0,
      ease: "power2.inOut",
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
      },
      onComplete: () => {
        scrollTween.current = null;
      }
    });
  };

  const handleNextSection = () => {
    if (active < N - 1) {
      scrollToScene(active + 1);
    }
  };

  const handlePrevSection = () => {
    if (active > 0) {
      scrollToScene(active - 1);
    }
  };

  // Keyboard controls
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      const key = e.key || "";
      const code = e.keyCode || e.which || 0;

      const isDown = key === "ArrowDown" || code === 40;
      const isRight = key === "ArrowRight" || code === 39;
      const isUp = key === "ArrowUp" || code === 38;
      const isLeft = key === "ArrowLeft" || code === 37;

      if (isDown || isRight) {
        e.preventDefault();
        if (activeRef.current < N - 1) {
          scrollToScene(activeRef.current + 1);
        }
      } else if (isUp || isLeft) {
        e.preventDefault();
        if (activeRef.current > 0) {
          scrollToScene(activeRef.current - 1);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMounted(true);

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force scroll to top immediately and reset active section state
    window.scrollTo(0, 0);
    setActive(0);

    // Repeatedly force scroll position at multiple intervals to override asynchronous browser restoration
    const intervals = [50, 150, 300, 500];
    const timers = intervals.map(delay =>
      setTimeout(() => {
        window.scrollTo(0, 0);
        setActive(0);
      }, delay)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

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
            <CityScene progress={progressRef} isCameraReady={initStage >= 5} />
          </Canvas>
        )}
      </div>

      {/* Top brand bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-4 md:px-12 max-w-7xl mx-auto w-full left-1/2 -translate-x-1/2">
        {/* Logo */}
        <div className="glass-chip pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2 shadow-sm">
          <div className="size-6 rounded-full bg-[#0EA5E9] flex items-center justify-center text-white">
            <Sparkles className="size-3.5 text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-tight text-[#0F172A]">
            Cascade Tech
          </span>
        </div>

        {/* Center Links */}
        <div className="glass-chip pointer-events-auto hidden md:flex items-center gap-6 rounded-full px-6 py-2 shadow-sm text-xs font-bold text-[#475569]">
          <button className="hover:text-[#0F172A] transition-colors cursor-pointer bg-transparent border-0 p-0">Who We Are</button>
          <button className="hover:text-[#0F172A] transition-colors cursor-pointer bg-transparent border-0 p-0">Specializations</button>
          <button className="hover:text-[#0F172A] transition-colors cursor-pointer bg-transparent border-0 p-0">AI Voice</button>
          <button className="hover:text-[#0F172A] transition-colors cursor-pointer bg-transparent border-0 p-0">Pricing</button>
          <button className="hover:text-[#0F172A] transition-colors cursor-pointer bg-transparent border-0 p-0">Roadmap</button>
        </div>

        {/* Get in touch Button */}
        <button className="pointer-events-auto bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold py-2.5 px-5 rounded-full shadow-md shadow-sky-500/10 transition-all duration-300 hover:scale-[1.03]">
          Get in touch
        </button>
      </div>

      {/* Scene overlays */}
      {SCENES.map((scene, i) => (
        <SceneOverlay key={scene.id} scene={scene} index={i} progress={scrollYProgress} active={active} />
      ))}

      {/* Floating global page navigation controls */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-row items-center gap-3 bg-white/70 backdrop-blur-md border border-slate-200/50 rounded-full p-1.5 shadow-lg select-none pointer-events-auto">
        {/* Prev Button */}
        <button
          onClick={handlePrevSection}
          disabled={active === 0}
          className={`group/btn w-8.5 h-8.5 rounded-full bg-white flex items-center justify-center border border-slate-200/60 shadow-sm transition-all duration-300 ${active === 0
              ? "opacity-25 cursor-not-allowed text-slate-400"
              : "cursor-pointer text-slate-600 hover:text-[#0EA5E9] hover:border-[#0EA5E9]/30 hover:scale-110 hover:shadow-[0_0_12px_rgba(14,165,233,0.2)]"
            }`}
          aria-label="Previous Section"
        >
          <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
        </button>

        {/* Next Button */}
        <button
          onClick={handleNextSection}
          disabled={active === N - 1}
          className={`group/btn w-8.5 h-8.5 rounded-full bg-white flex items-center justify-center border border-slate-200/60 shadow-sm transition-all duration-300 ${active === N - 1
              ? "opacity-25 cursor-not-allowed text-slate-400"
              : "cursor-pointer text-slate-600 hover:text-[#0EA5E9] hover:border-[#0EA5E9]/30 hover:scale-110 hover:shadow-[0_0_12px_rgba(14,165,233,0.2)]"
            }`}
          aria-label="Next Section"
        >
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </button>
      </div>

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
