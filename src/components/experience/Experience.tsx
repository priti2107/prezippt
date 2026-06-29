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
  ArrowRight,
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
  Star,
  MapPin,
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
  Compass,
  Package,
  Cpu,
  CheckSquare,
} from "lucide-react";
import CityScene from "./CityScene";
import IndustriesShowcase from "./IndustriesShowcase";
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
  p3: number,
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

const getSafeRange3 = (p0: number, p1: number, p2: number): [number, number, number] => {
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
  activeCardIdx,
}: {
  scene: Scene;
  index: number;
  progress: MotionValue<number>;
  active: number;
  activeCardIdx: number;
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
    opacityRange = [0, w];
    opacityOutput = [1, 0];

    yRange = [0, w];
    yOutput = [0, -60];

    scaleRange = [0, w];
    scaleOutput = [1, 1.04];
  } else if (index === N - 1) {
    opacityRange = [1 - w, 1];
    opacityOutput = [0, 1];

    yRange = [1 - w, 1];
    yOutput = [60, 0];

    scaleRange = [1 - w, 1];
    scaleOutput = [0.94, 1];
  } else {
    opacityRange = getSafeRange3(center - w, center, center + w);
    opacityOutput = [0, 1, 0];

    yRange = getSafeRange3(center - w, center, center + w);
    yOutput = [60, 0, -60];

    scaleRange = getSafeRange3(center - w, center, center + w);
    scaleOutput = [0.94, 1, 1.04];
  }

  const isCurrentActive = active === index;

  const opacity = useTransform(progress, opacityRange, opacityOutput, { clamp: true });
  const y = useTransform(progress, yRange, yOutput, { clamp: true });
  const scale = useTransform(progress, scaleRange, scaleOutput, { clamp: true });

  // Strictly map visibility and pointerEvents dynamically to only allow the active slide
  const visibility = useTransform(opacity, (o) => (isCurrentActive && o > 0.01 ? "visible" : "hidden"));
  const pointerEvents = useTransform(opacity, (o) => (isCurrentActive && o > 0.99 ? "auto" : "none"));

  const shouldRender = Math.abs(active - index) <= 1;
  if (!shouldRender) return null;

  return (
    <motion.div
      style={{
        opacity,
        y,
        scale,
        visibility,
        pointerEvents
      }}
      className="fixed inset-0 z-10 flex items-center justify-center px-6 md:px-12 py-10 pointer-events-none"
    >
      <SceneContent scene={scene} isActive={active === index} activeCardIdx={activeCardIdx} />
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

function WhoWeAreScene({ scene, isActive = false, activeCardIdx = 0 }: { scene: Scene; isActive?: boolean; activeCardIdx?: number }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const stats = [
    { value: 3, suffix: "+", title: "Years Experience", icon: Clock },
    { value: 65, suffix: "+", title: "Projects Delivered", icon: Award },
    { value: 8, suffix: "+", title: "Enterprise Clients", icon: Users },
    { value: 2, suffix: "", title: "Proprietary Products", icon: Layers },
  ];

  return (
    <div className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-5 pb-5 px-6 md:px-8 justify-center gap-4">
      {/* Scoped CSS classes for District 02 foundations scene styling */}
      <style>{`
        .who-we-are-glass-panel {
          background: rgba(248, 251, 255, 0.94) !important;
          backdrop-filter: blur(24px) !important;
          border: 1px solid rgba(14, 165, 233, 0.15) !important;
          box-shadow: 
            0 25px 65px -15px rgba(0, 119, 182, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.9) !important;
        }
        .foundations-quote-card {
          background: rgba(255, 255, 255, 0.45) !important;
          backdrop-filter: blur(20px) !important;
          box-shadow: 
            0 15px 35px -10px rgba(0, 119, 182, 0.04),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.7) !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .foundations-quote-card:hover {
          background: rgba(255, 255, 255, 0.6) !important;
          box-shadow: 
            0 20px 45px -8px rgba(0, 119, 182, 0.08),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.8) !important;
          transform: translateY(-4px) !important;
        }
        
        @keyframes float-particle {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate3d(15px, -20px, 0);
            opacity: 0.8;
          }
        }
        @keyframes pulse-glow-slow {
          0%, 100% {
            opacity: 0.65;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.04);
          }
        }
        @keyframes dash-animation {
          to {
            stroke-dashoffset: -50;
          }
        }
        .animated-data-path {
          animation: dash-animation 6s linear infinite;
        }
        @keyframes float-cloud {
          0%, 100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(0deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-8px) rotate(1deg);
          }
        }
        @keyframes float-node-1 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-5px); }
        }
        @keyframes float-node-2 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-7px); }
        }
        @keyframes float-node-3 {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateY(-4px); }
        }
      `}</style>

      {/* Blueprint Grid Accent (3.5% Opacity) */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern
            id="grid-pattern-foundations"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#003B73" strokeWidth="0.8" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid-pattern-foundations)" />
        </svg>
      </div>

      {/* One large blurred blue gradient behind the section at 6% opacity */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full blur-[130px] pointer-events-none -z-20 opacity-[0.06] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          background: "radial-gradient(circle, #0EA5E9 0%, #2563EB 50%, transparent 100%)",
        }}
      />

      {/* 2 tiny glowing particles */}
      <div
        className="absolute rounded-full bg-[#90E0EF] pointer-events-none -z-10 shadow-[0_0_8px_#90E0EF]"
        style={{
          width: "4px",
          height: "4px",
          left: "22%",
          top: "18%",
          animation: "float-particle 9s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full bg-[#48CAE4] pointer-events-none -z-10 shadow-[0_0_8px_#48CAE4]"
        style={{
          width: "3px",
          height: "3px",
          right: "25%",
          bottom: "28%",
          animation: "float-particle 10s ease-in-out infinite",
        }}
      />

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10 items-stretch justify-between w-full h-full relative z-10 max-w-[1280px] mx-auto py-2">
        {/* LEFT COLUMN: 48% width */}
        <div
          className="w-full md:w-[48%] flex flex-col justify-center text-left h-full py-2 relative z-10"
          style={{
            transform: `translate3d(${mousePos.x * 4}px, ${mousePos.y * 4}px, 0)`,
          }}
        >
          <div className="flex flex-col gap-1.5">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-sky-500/5 border border-sky-400/20 rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold tracking-wider text-[#0284C7] w-fit mb-1">
              <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              WHO WE ARE
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[44px] font-[900] leading-[1.08] tracking-tight text-[#0F172A] font-display">
              We Are <br />
              <span className="text-[#0284C7]">Cascade Tech</span>
            </h2>

            {/* Horizontal Line Under Heading */}
            <div className="w-16 h-[2.5px] bg-[#0284C7] rounded-full my-3" />

            {/* Supporting Text paragraphs matching mockup */}
            <div className="flex flex-col gap-3.5 text-[13.5px] md:text-[14.5px] leading-relaxed text-slate-600 font-medium max-w-[480px]">
              <p>
                Cascade Tech Ventures LLP is a Salesforce implementation partner helping real estate developers and enterprise businesses modernise their sales, marketing, and customer experience operations.
              </p>
              <p>
                Founded by CRM practitioners not generalists, we bring deep knowledge of the Indian real estate sales cycle, from first inquiry to possession, and build Salesforce solutions that match how your teams actually work on the ground.
              </p>
              <p>
                We are a boutique firm. Every client gets senior attention, faster turnarounds, and solutions built specifically for their business, not recycled from someone else's project.
              </p>
            </div>
          </div>

          {/* Founder Philosophy Card with Outline Quote Icon & Checklist */}
          <div
            className="p-[1px] bg-gradient-to-br from-sky-400/20 to-blue-500/20 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 max-w-[480px] w-full mt-5"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? undefined : "translateY(20px) scale(0.98)",
              transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), scale 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className="foundations-quote-card bg-white/45 backdrop-blur-xl rounded-[19px] p-5 text-left relative overflow-hidden w-full h-full flex flex-col justify-center"
            >
              {/* Soft Diagonal Glass Reflection Highlight */}
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.35) 0%, transparent 40%)",
                  opacity: 0.15,
                }}
              />

              {/* Soft glow in quote card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl pointer-events-none -z-10" />

              <div className="flex gap-4 relative z-10">
                {/* Double quotes icon wrapper */}
                <div className="size-9 rounded-lg border border-sky-400/20 bg-sky-500/5 text-sky-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <svg className="size-4.5 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 17h3l2-4V7h-6v6h3zM3 13h3l2-4V7H2v6h3z" />
                  </svg>
                </div>
                <p className="text-[13.5px] md:text-[14.5px] text-slate-700 leading-relaxed font-semibold italic">
                  We deliberately cap our active client load to ensure deep engineering integration. Your architecture is owned directly by senior strategists, not junior delegates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Asymmetric Image Container & Awards Capsule (48% width) */}
        <div
          className="w-full md:w-[48%] flex flex-col justify-between h-full py-2 relative z-10"
          style={{
            transform: `translate3d(${mousePos.x * -4}px, ${mousePos.y * -4}px, 0)`,
          }}
        >
          {/* Asymmetric Organic Glass Image Container */}
          <div
            className="w-full aspect-[4/3] md:flex-grow rounded-[140px_30px_140px_30px] border-[5px] border-white/80 shadow-[0_20px_50px_rgba(0,119,182,0.12)] relative overflow-hidden bg-white/20 backdrop-blur-md"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? undefined : "scale(0.96)",
              transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Salesforce office image inside */}
            <img
              src="/salesforce-office.png"
              alt="Cascade Tech Office & Salesforce Operations"
              className="w-full h-full object-cover select-none"
            />
            {/* Glossy overlay reflections */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)",
              }}
            />
            {/* Soft shadow gradient overlay */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none z-10"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.12), transparent)",
              }}
            />

            {/* Floating Glass Spheres */}
            {/* Top-right sphere overlapping the border */}
            <div
              className="absolute size-14 rounded-full bg-gradient-to-br from-white/40 to-white/5 border border-white/50 shadow-[inset_-4px_-4px_8px_rgba(255,255,255,0.35),_4px_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-md -top-3 -right-3 z-20 pointer-events-none"
              style={{
                transform: `translate3d(${mousePos.x * 6}px, ${mousePos.y * 6}px, 0)`,
              }}
            />
            {/* Bottom-left sphere overlapping the border */}
            <div
              className="absolute size-16 rounded-full bg-gradient-to-br from-white/45 to-white/8 border border-white/50 shadow-[inset_-5px_-5px_10px_rgba(255,255,255,0.4),_5px_5px_15px_rgba(0,0,0,0.18)] backdrop-blur-md -bottom-4 -left-4 z-20 pointer-events-none"
              style={{
                transform: `translate3d(${mousePos.x * -8}px, ${mousePos.y * -8}px, 0)`,
              }}
            />
          </div>

          {/* Awards Capsule Bar below the image */}
          <div
            className="w-fit mx-auto mt-4 px-6 py-2.5 bg-white/95 border border-white/60 shadow-sm rounded-full flex items-center gap-6 backdrop-blur-md"
            style={{
              opacity: isActive ? 1 : 0,
              transform: isActive ? undefined : "translateY(10px)",
              transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          >
            <span className="text-[11px] font-extrabold tracking-wider text-sky-850 uppercase whitespace-nowrap">
              Our Achieved Awards
            </span>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-5">
              {/* Award Logo 1: The Legal 500 */}
              <div className="flex items-center text-slate-800" title="The Legal 500">
                <svg className="h-6 w-auto text-slate-800" viewBox="0 0 100 30" fill="currentColor">
                  <text x="0" y="14" fontFamily="Georgia, serif" fontSize="10" fontWeight="bold">The</text>
                  <text x="0" y="24" fontFamily="Georgia, serif" fontSize="9" letterSpacing="0.5">LEGAL</text>
                  <text x="35" y="25" fontFamily="Georgia, serif" fontSize="24" fontWeight="900" letterSpacing="-1">500</text>
                </svg>
              </div>

              {/* Award Logo 2: Shield/Crest */}
              <div className="text-slate-700" title="Registered Salesforce Partner">
                <svg className="h-6 w-auto text-slate-700" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 2C10 2 6 5 6 12C6 22 16 30 16 30C16 30 26 22 26 12C26 5 22 2 16 2ZM16 26C12 21 8.5 15 8.5 12C8.5 10 9 6.5 16 4.5C23 6.5 23.5 10 23.5 12C23.5 15 20 21 16 26Z" />
                  <path d="M16 8V20M12 11V16C12 18 16 19 16 19C16 19 20 18 20 16V11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </div>

              {/* Award Logo 3: Scale circle 50 */}
              <div className="text-slate-700" title="AppExchange Certified">
                <svg className="h-6 w-auto text-slate-700" viewBox="0 0 32 32" fill="currentColor">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 8V24M10 13H22M10 13L13 19H7L10 13ZM22 13L25 19H19L22 13Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <text x="16" y="21.5" fontFamily="sans-serif" fontSize="7" fontWeight="bold" textAnchor="middle">50</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



function ProductEcosystemScene() {
  const [productSlide, setProductSlide] = useState(0);
  const totalProductSlides = 2;

  return (
    <div
      className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col pt-5 pb-4 px-6 md:px-10 gap-4 border border-white/30"
      style={{
        background: "radial-gradient(ellipse at 60% 0%, rgba(0,119,182,0.07) 0%, transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(59,169,245,0.05) 0%, transparent 50%), rgba(247,250,253,0.98)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 32px 80px rgba(0,90,160,0.10), 0 2px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,119,182,0.08) inset",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes flowPulse { to { stroke-dashoffset: -30; } }
        @keyframes floatNode { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes glowBeat { 0%,100%{opacity:0.35;transform:scale(1)} 50%{opacity:0.85;transform:scale(1.15)} }
        @keyframes pulseRing1 { 0%{r:30;opacity:0.7} 100%{r:52;opacity:0} }
        @keyframes pulseRing2 { 0%{r:30;opacity:0.5} 100%{r:62;opacity:0} }
        @keyframes fadeSlideIn { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes chipHover { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-1px)} }
        @keyframes orbitSpin { from{transform:rotateZ(0deg) rotateX(72deg)} to{transform:rotateZ(360deg) rotateX(72deg)} }
        @keyframes orbitSpin2 { from{transform:rotateZ(120deg) rotateX(55deg)} to{transform:rotateZ(480deg) rotateX(55deg)} }
        @keyframes orbitSpin3 { from{transform:rotateZ(240deg) rotateX(30deg)} to{transform:rotateZ(600deg) rotateX(30deg)} }
        @keyframes spherePulse { 0%,100%{transform:scale(1);opacity:0.55} 50%{transform:scale(1.06);opacity:0.75} }
        @keyframes particleDrift { 0%{opacity:0;transform:translateY(0)} 30%{opacity:1} 70%{opacity:1} 100%{opacity:0;transform:translateY(-28px)} }
        .eco-flow-line { stroke-dasharray: 10 6; animation: flowPulse 1.6s linear infinite; }
        .eco-float { animation: floatNode 3.2s ease-in-out infinite; }
        .eco-float-2 { animation: floatNode 4s ease-in-out infinite; animation-delay:0.9s; }
        .eco-float-3 { animation: floatNode 3.6s ease-in-out infinite; animation-delay:1.6s; }
        .eco-glow { animation: glowBeat 2.4s ease-in-out infinite; }
        .eco-ring1 { animation: pulseRing1 2.4s ease-out infinite; }
        .eco-ring2 { animation: pulseRing2 2.4s ease-out infinite; animation-delay:0.8s; }
        .eco-slide-in { animation: fadeSlideIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards; }
        .eco-chip:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,119,182,0.15); }
        .eco-chip { transition: all 0.2s ease; }
        .holo-orbit1 { animation: orbitSpin 12s linear infinite; transform-origin: center; }
        .holo-orbit2 { animation: orbitSpin2 18s linear infinite; transform-origin: center; }
        .holo-orbit3 { animation: orbitSpin3 24s linear infinite reverse; transform-origin: center; }
        .holo-sphere { animation: spherePulse 4s ease-in-out infinite; }
        .holo-p1 { animation: particleDrift 3.5s ease-in-out infinite; }
        .holo-p2 { animation: particleDrift 4.2s ease-in-out infinite; animation-delay:1.2s; }
        .holo-p3 { animation: particleDrift 3.8s ease-in-out infinite; animation-delay:2.1s; }
        .holo-p4 { animation: particleDrift 5s ease-in-out infinite; animation-delay:0.6s; }
        .holo-p5 { animation: particleDrift 4.5s ease-in-out infinite; animation-delay:1.8s; }
      ` }} />

      {/* Ambient background orbs */}
      <div className="absolute -right-20 -top-20 w-[500px] h-[500px] rounded-full pointer-events-none -z-10 opacity-60"
        style={{ background: "radial-gradient(circle, rgba(0,119,182,0.09) 0%, transparent 68%)" }} />
      <div className="absolute -left-16 -bottom-16 w-[380px] h-[380px] rounded-full pointer-events-none -z-10 opacity-50"
        style={{ background: "radial-gradient(circle, rgba(59,169,245,0.07) 0%, transparent 68%)" }} />
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.045]"
        style={{ backgroundImage: "radial-gradient(#0077B6 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      {/* ── HOLOGRAPHIC AI SPHERE (background decoration) ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 0, top: "38%" }}>
        <svg width="520" height="520" viewBox="0 0 520 520" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.13 }}>
          <defs>
            <radialGradient id="hs-core" cx="42%" cy="38%" r="58%">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#3BA9F5" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#0077B6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#003F73" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="hs-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0077B6" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hs-shine" cx="35%" cy="28%" r="40%">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <filter id="hs-blur-glow">
              <feGaussianBlur stdDeviation="18" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="hs-dot-glow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Outer soft ambient glow */}
          <circle cx="260" cy="260" r="200" fill="url(#hs-glow)" filter="url(#hs-blur-glow)" />

          {/* Orbit ring 1 — steep tilt */}
          <g className="holo-orbit1" style={{ transformOrigin: "260px 260px" }}>
            <ellipse cx="260" cy="260" rx="180" ry="52" fill="none" stroke="#3BA9F5" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.9" />
            {/* Orbit dot 1 */}
            <circle cx="440" cy="260" r="5" fill="#7DD3FC" filter="url(#hs-dot-glow)" />
            <circle cx="80" cy="260" r="3.5" fill="#3BA9F5" filter="url(#hs-dot-glow)" />
          </g>

          {/* Orbit ring 2 — moderate tilt */}
          <g className="holo-orbit2" style={{ transformOrigin: "260px 260px" }}>
            <ellipse cx="260" cy="260" rx="155" ry="70" fill="none" stroke="#0077B6" strokeWidth="1" strokeDasharray="4 6" opacity="0.7" />
            <circle cx="415" cy="260" r="4" fill="#0EA5E9" filter="url(#hs-dot-glow)" />
            <circle cx="105" cy="260" r="3" fill="#38BDF8" filter="url(#hs-dot-glow)" />
          </g>

          {/* Orbit ring 3 — shallow tilt (equatorial) */}
          <g className="holo-orbit3" style={{ transformOrigin: "260px 260px" }}>
            <ellipse cx="260" cy="260" rx="195" ry="30" fill="none" stroke="#6EC8FF" strokeWidth="0.8" strokeDasharray="8 5" opacity="0.6" />
            <circle cx="455" cy="260" r="3.5" fill="#BAE6FD" filter="url(#hs-dot-glow)" />
          </g>

          {/* Core sphere */}
          <circle cx="260" cy="260" r="88" fill="url(#hs-core)" className="holo-sphere" filter="url(#hs-blur-glow)" />
          {/* Inner sphere body */}
          <circle cx="260" cy="260" r="88" fill="url(#hs-core)" className="holo-sphere" />
          {/* Specular highlight */}
          <circle cx="260" cy="260" r="88" fill="url(#hs-shine)" />
          {/* Equatorial latitude line */}
          <ellipse cx="260" cy="260" rx="88" ry="24" fill="none" stroke="#7DD3FC" strokeWidth="0.8" opacity="0.5" />
          {/* Meridian line */}
          <ellipse cx="260" cy="260" rx="28" ry="88" fill="none" stroke="#7DD3FC" strokeWidth="0.8" opacity="0.4" />

          {/* Floating ambient particles */}
          <circle cx="170" cy="155" r="3" fill="#38BDF8" opacity="0.8" className="holo-p1" filter="url(#hs-dot-glow)" />
          <circle cx="360" cy="140" r="2.5" fill="#7DD3FC" opacity="0.7" className="holo-p2" filter="url(#hs-dot-glow)" />
          <circle cx="130" cy="310" r="2" fill="#0EA5E9" opacity="0.6" className="holo-p3" filter="url(#hs-dot-glow)" />
          <circle cx="390" cy="340" r="3" fill="#3BA9F5" opacity="0.75" className="holo-p4" filter="url(#hs-dot-glow)" />
          <circle cx="220" cy="390" r="2.5" fill="#38BDF8" opacity="0.65" className="holo-p5" filter="url(#hs-dot-glow)" />
          <circle cx="310" cy="120" r="2" fill="#BAE6FD" opacity="0.7" className="holo-p1" filter="url(#hs-dot-glow)" />
          <circle cx="400" cy="190" r="2" fill="#7DD3FC" opacity="0.6" className="holo-p3" filter="url(#hs-dot-glow)" />
        </svg>
      </div>

      {/* ── HEADER ── */}
      <div className="flex flex-col items-center text-center w-full flex-shrink-0 z-10 gap-3">
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-[#EFF8FF] border border-[#BFDBFE]/80 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] text-[#0077B6] w-fit mb-3 shadow-[0_2px_8px_rgba(0,119,182,0.10)]">
            <span className="size-1.5 rounded-full bg-[#0077B6] animate-pulse" />
            OUR PRODUCT ECOSYSTEM
          </div>
          <h2 className="text-[28px] sm:text-[32px] font-[900] leading-[1.1] tracking-tight text-[#0A1628]">
            Real Problems.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066A0] via-[#0077B6] to-[#3BA9F5]">
              Purpose-Built Products.
            </span>
          </h2>
          <p className="mt-2.5 text-[14px] md:text-[16px] text-slate-500 font-medium leading-relaxed max-w-[760px]">
            Most Salesforce partners implement what Salesforce sells. We built products that solve real business problems for enterprise real estate teams. Every product is actively deployed and continuously improved with real customers.
          </p>
        </div>
        {/* Slide nav */}
        <div className="flex items-center gap-4">
          <button onClick={() => setProductSlide(p => Math.max(0, p - 1))} disabled={productSlide === 0}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200/80 bg-white/90 text-slate-400 hover:border-[#0077B6] hover:text-[#0077B6] hover:bg-[#EFF8FF] hover:shadow-[0_4px_14px_rgba(0,119,182,0.15)] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 shadow-sm backdrop-blur">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalProductSlides }).map((_, i) => (
              <button key={i} onClick={() => setProductSlide(i)}
                className={`rounded-full transition-all duration-300 ${i === productSlide ? "w-7 h-2.5 bg-gradient-to-r from-[#0077B6] to-[#3BA9F5] shadow-[0_2px_8px_rgba(0,119,182,0.4)]" : "w-2.5 h-2.5 bg-slate-200 hover:bg-slate-300"}`} />
            ))}
          </div>
          <button onClick={() => setProductSlide(p => Math.min(totalProductSlides - 1, p + 1))} disabled={productSlide === totalProductSlides - 1}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-slate-200/80 bg-white/90 text-slate-400 hover:border-[#0077B6] hover:text-[#0077B6] hover:bg-[#EFF8FF] hover:shadow-[0_4px_14px_rgba(0,119,182,0.15)] disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-200 shadow-sm backdrop-blur">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── SLIDES ── */}
      <div className="flex-1 min-h-0 w-full z-10 relative overflow-hidden">

        {/* ── SLIDE 1 ── */}
        {productSlide === 0 && (
          <div className="eco-slide-in grid grid-cols-2 gap-5 h-full w-full">

            {/* ══ CARD 1: Cascade Connect ══ */}
            <div className="group relative rounded-[24px] p-5 flex flex-col gap-3 overflow-hidden transition-all duration-400 hover:-translate-y-1.5"
              style={{
                background: "radial-gradient(ellipse at 15% 0%, rgba(0,119,182,0.18) 0%, rgba(59,169,245,0.10) 40%, rgba(224,242,254,0.85) 100%)",
                border: "1px solid rgba(0,119,182,0.25)",
                boxShadow: "0 4px 24px rgba(0,90,160,0.12), 0 1px 0 rgba(255,255,255,0.7) inset",
              }}>
              {/* Inner top highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
              {/* Hover glow overlay */}
              <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,119,182,0.05) 0%, transparent 65%)" }} />

              {/* Top row */}
              <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3.5">
                  {/* 3D gradient icon */}
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 40%, #7DD3FC 100%)", boxShadow: "0 6px 20px rgba(0,119,182,0.20), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                      <defs>
                        <linearGradient id="ic1" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#0077B6" />
                          <stop offset="100%" stopColor="#0EA5E9" />
                        </linearGradient>
                      </defs>
                      <rect x="2" y="5" width="20" height="14" rx="3.5" fill="url(#ic1)" opacity="0.18" />
                      <rect x="2" y="5" width="20" height="14" rx="3.5" stroke="url(#ic1)" strokeWidth="1.6" />
                      <path d="M2 9.5l10 5.5 10-5.5" stroke="url(#ic1)" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-[900] text-[#0A1628] leading-tight tracking-tight">Cascade Connect</h3>
                    <p className="text-[13px] font-semibold text-[#0077B6] mt-0.5 leading-snug">Omnichannel communication inside Salesforce</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FFF4] border border-emerald-200/70 text-emerald-600 text-[10px] font-bold shadow-[0_2px_8px_rgba(16,185,129,0.12)] flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
                </span>
              </div>

              {/* Illustration */}
              <div className="flex-1 min-h-0 rounded-[16px] overflow-hidden relative flex items-center justify-center"
                style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(0,119,182,0.07) 0%, rgba(240,249,255,0.6) 55%, rgba(248,252,255,0.8) 100%)", border: "1px solid rgba(186,230,253,0.35)" }}>
                <svg viewBox="0 0 360 195" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: "100%" }}>
                  <defs>
                    <radialGradient id="cc-hub-g" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0077B6" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#3BA9F5" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="cc-ln1" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3BA9F5" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#3BA9F5" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#0077B6" stopOpacity="0.2" />
                    </linearGradient>
                    <filter id="cc-glow-f" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="cc-soft-glow">
                      <feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <linearGradient id="cc-card-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="white" stopOpacity="1" />
                      <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>

                  {/* Center glow */}
                  <circle cx="178" cy="97" r="56" fill="url(#cc-hub-g)" />
                  {/* Pulse rings */}
                  <circle cx="178" cy="97" r="32" fill="none" stroke="#3BA9F5" strokeWidth="1.5" className="eco-ring1" opacity="0.6" />
                  <circle cx="178" cy="97" r="32" fill="none" stroke="#0077B6" strokeWidth="1" className="eco-ring2" opacity="0.4" />

                  {/* Paths */}
                  <path d="M 76 57 Q 130 57 152 97" fill="none" stroke="#3BA9F5" strokeWidth="1.8" className="eco-flow-line" opacity="0.7" />
                  <path d="M 76 97 L 152 97" fill="none" stroke="#0077B6" strokeWidth="1.8" className="eco-flow-line" opacity="0.7" />
                  <path d="M 76 137 Q 130 137 152 97" fill="none" stroke="#6EC8FF" strokeWidth="1.8" className="eco-flow-line" opacity="0.7" />
                  <path d="M 204 97 L 268 97" fill="none" stroke="#3BA9F5" strokeWidth="1.8" className="eco-flow-line" opacity="0.7" />

                  {/* Animated particles */}
                  <circle r="3.5" fill="#3BA9F5" opacity="0.9" filter="url(#cc-glow-f)">
                    <animateMotion dur="2.2s" repeatCount="indefinite" path="M 76 57 Q 130 57 152 97" />
                  </circle>
                  <circle r="3" fill="#0077B6" opacity="0.85" filter="url(#cc-glow-f)">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M 76 97 L 152 97" begin="0.4s" />
                  </circle>
                  <circle r="3" fill="#6EC8FF" opacity="0.9" filter="url(#cc-glow-f)">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 76 137 Q 130 137 152 97" begin="0.8s" />
                  </circle>
                  <circle r="3" fill="#3BA9F5" opacity="0.85" filter="url(#cc-glow-f)">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 204 97 L 268 97" begin="0.2s" />
                  </circle>

                  {/* WhatsApp node */}
                  <g className="eco-float">
                    <rect x="10" y="38" width="66" height="38" rx="11" fill="url(#cc-card-g)" stroke="#E2EEF6" strokeWidth="1" filter="url(#cc-glow-f)" />
                    <rect x="10" y="38" width="66" height="38" rx="11" fill="#25D366" opacity="0.06" />
                    <circle cx="27" cy="57" r="9" fill="#25D366" opacity="0.18" />
                    <path d="M27 51C23.5 51 20.5 54 20.5 57.5c0 1.2.3 2.3.9 3.2L20 65l4.4-.9c.9.5 1.9.8 3.1.8 3.5 0 6.5-3 6.5-6.5S30.5 51 27 51z" fill="#25D366" />
                    <text x="40" y="55" fontSize="7.5" fontWeight="800" fill="#0F172A">What</text>
                    <text x="40" y="65" fontSize="7.5" fontWeight="800" fill="#0F172A">sApp</text>
                  </g>
                  {/* Email node */}
                  <g className="eco-float-2">
                    <rect x="10" y="78" width="66" height="38" rx="11" fill="url(#cc-card-g)" stroke="#E2EEF6" strokeWidth="1" filter="url(#cc-glow-f)" />
                    <rect x="10" y="78" width="66" height="38" rx="11" fill="#0077B6" opacity="0.05" />
                    <rect x="19" y="88" width="20" height="14" rx="3.5" fill="#0077B6" opacity="0.12" stroke="#0077B6" strokeWidth="1" />
                    <path d="M19 90.5 L29 96 L39 90.5" stroke="#0077B6" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                    <text x="43" y="98" fontSize="7.5" fontWeight="800" fill="#0F172A">Email</text>
                    <text x="43" y="108" fontSize="6.5" fill="#64748B">Native</text>
                  </g>
                  {/* SMS node */}
                  <g className="eco-float-3">
                    <rect x="10" y="118" width="66" height="38" rx="11" fill="url(#cc-card-g)" stroke="#E2EEF6" strokeWidth="1" filter="url(#cc-glow-f)" />
                    <rect x="10" y="118" width="66" height="38" rx="11" fill="#6EC8FF" opacity="0.06" />
                    <rect x="19" y="126" width="16" height="22" rx="5" fill="#6EC8FF" opacity="0.18" stroke="#6EC8FF" strokeWidth="1" />
                    <rect x="22" y="140" width="10" height="3" rx="1.5" fill="#6EC8FF" />
                    <text x="38" y="137" fontSize="7.5" fontWeight="800" fill="#0F172A">SMS</text>
                    <text x="38" y="147" fontSize="6.5" fill="#64748B">Direct</text>
                  </g>

                  {/* Central AI Hub */}
                  <circle cx="178" cy="97" r="32" fill="white" filter="url(#cc-soft-glow)" />
                  <circle cx="178" cy="97" r="30" fill="none" stroke="#3BA9F5" strokeWidth="1" opacity="0.3" />
                  <circle cx="178" cy="97" r="26" fill="url(#cc-hub-g)" />
                  <path d="M170 97C170 92.6 173.6 89 178 89c4.4 0 8 3.6 8 8 0 4.4-3.6 8-8 8-1.6 0-3-.4-4.2-1.2L163 108l.8-2.9C162.7 104 170 102 170 97z" fill="#0077B6" className="eco-glow" />
                  <path d="M173.5 95.5L182.5 95.5M173.5 97.5L181 97.5M173.5 99.5L182.5 99.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />

                  {/* Salesforce CRM widget */}
                  <g className="eco-float-2">
                    <rect x="270" y="65" width="78" height="64" rx="14" fill="url(#cc-card-g)" stroke="#BAE6FD" strokeWidth="1.2" filter="url(#cc-glow-f)" />
                    <rect x="270" y="65" width="78" height="14" rx="14" fill="#0077B6" opacity="0.08" />
                    <text x="309" y="76" fontSize="7" fontWeight="900" fill="#0077B6" textAnchor="middle">SALESFORCE</text>
                    <path d="M288 86 C288 82.5 290.8 80 294 80c1.2 0 2.3.4 3.2 1C298.3 79 300.7 77 303.5 77c3.9 0 7 3.2 7 7.2 0 .2 0 .4-.1.5 1.4.6 2.3 2 2.3 3.6 0 2.1-1.7 3.7-3.8 3.7h-21c-2.1 0-3.8-1.6-3.8-3.7 0-1.5.9-2.8 2.2-3.3" stroke="#0077B6" strokeWidth="1.2" fill="none" />
                    <text x="309" y="107" fontSize="7" fontWeight="700" fill="#0077B6" textAnchor="middle">CRM Platform</text>
                    <rect x="282" y="111" width="54" height="12" rx="6" fill="#0077B6" opacity="0.08" />
                    <text x="309" y="121" fontSize="6.5" fontWeight="700" fill="#0077B6" textAnchor="middle">Connected</text>
                  </g>

                  {/* Floating badges */}
                  <g className="eco-float">
                    <rect x="143" y="56" width="70" height="19" rx="9.5" fill="white" stroke="#BAE6FD" strokeWidth="1" filter="url(#cc-glow-f)" />
                    <circle cx="155" cy="65.5" r="3.5" fill="#0077B6" opacity="0.3" />
                    <text x="163" y="69.5" fontSize="7" fontWeight="700" fill="#0077B6">Comm. History</text>
                  </g>
                  <g className="eco-float-3">
                    <rect x="143" y="119" width="70" height="19" rx="9.5" fill="white" stroke="#BAE6FD" strokeWidth="1" filter="url(#cc-glow-f)" />
                    <circle cx="155" cy="128.5" r="3.5" fill="#3BA9F5" opacity="0.3" />
                    <text x="163" y="132.5" fontSize="7" fontWeight="700" fill="#0077B6">Read Receipts</text>
                  </g>
                </svg>
              </div>

              {/* Feature chips */}
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                {["WhatsApp", "Email", "SMS", "Comm. History"].map((label) => (
                  <span key={label} className="eco-chip inline-flex items-center text-[10px] font-bold rounded-full px-3 py-1.5 cursor-default"
                    style={{ background: "linear-gradient(135deg, rgba(240,249,255,0.9) 0%, rgba(224,242,254,0.7) 100%)", border: "1px solid rgba(125,211,252,0.5)", color: "#0055A5", boxShadow: "0 2px 8px rgba(0,119,182,0.08), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ══ CARD 2: CX Prism™ ══ */}
            <div className="group relative rounded-[24px] p-5 flex flex-col gap-3 overflow-hidden transition-all duration-400 hover:-translate-y-1.5"
              style={{
                background: "radial-gradient(ellipse at 80% 0%, rgba(59,169,245,0.18) 0%, rgba(0,119,182,0.10) 40%, rgba(224,242,254,0.85) 100%)",
                border: "1px solid rgba(0,119,182,0.25)",
                boxShadow: "0 4px 24px rgba(0,90,160,0.12), 0 1px 0 rgba(255,255,255,0.7) inset",
              }}>
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,169,245,0.05) 0%, transparent 65%)" }} />

              <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 40%, #7DD3FC 100%)", boxShadow: "0 6px 20px rgba(0,119,182,0.20), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                      <defs><linearGradient id="ic2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0077B6" /><stop offset="100%" stopColor="#38BDF8" /></linearGradient></defs>
                      <circle cx="12" cy="12" r="9" fill="url(#ic2)" opacity="0.15" stroke="url(#ic2)" strokeWidth="1.6" />
                      <path d="M7.5 14.5L9.5 11l2.5 2.5 2.5-5L17 11" stroke="url(#ic2)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="16.5" cy="7.5" r="2.5" fill="#38BDF8" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-[900] text-[#0A1628] leading-tight tracking-tight">CX Prism™</h3>
                    <p className="text-[13px] font-semibold text-[#0077B6] mt-0.5">AI-powered customer intelligence platform</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-amber-200/70 text-amber-600 text-[10px] font-bold shadow-[0_2px_8px_rgba(245,158,11,0.12)] flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />Deployment
                </span>
              </div>

              <div className="flex-1 min-h-0 rounded-[16px] overflow-hidden relative flex items-center justify-center"
                style={{ background: "radial-gradient(ellipse at 50% 40%, rgba(59,169,245,0.07) 0%, rgba(240,249,255,0.6) 55%, rgba(248,252,255,0.8) 100%)", border: "1px solid rgba(186,230,253,0.35)" }}>
                <svg viewBox="0 0 360 195" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: "100%" }}>
                  <defs>
                    <radialGradient id="cxp-hub-g" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#3BA9F5" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#3BA9F5" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="cxp-bar-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0077B6" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#3BA9F5" stopOpacity="0.4" />
                    </linearGradient>
                    <linearGradient id="cxp-card-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="white" />
                      <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="cxp-glow-f">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  <circle cx="178" cy="97" r="80" fill="url(#cxp-hub-g)" />

                  {/* Connection lines */}
                  <path d="M100 72 L140 90" fill="none" stroke="#3BA9F5" strokeWidth="1.5" className="eco-flow-line" opacity="0.6" />
                  <path d="M100 122 L140 105" fill="none" stroke="#0077B6" strokeWidth="1.5" className="eco-flow-line" opacity="0.6" />
                  <path d="M218 90 L258 72" fill="none" stroke="#6EC8FF" strokeWidth="1.5" className="eco-flow-line" opacity="0.6" />
                  <path d="M218 105 L258 122" fill="none" stroke="#3BA9F5" strokeWidth="1.5" className="eco-flow-line" opacity="0.6" />

                  {/* Particles */}
                  <circle r="3" fill="#3BA9F5" opacity="0.9" filter="url(#cxp-glow-f)"><animateMotion dur="2s" repeatCount="indefinite" path="M100 72 L140 90" /></circle>
                  <circle r="3" fill="#0077B6" opacity="0.85" filter="url(#cxp-glow-f)"><animateMotion dur="2.3s" repeatCount="indefinite" path="M218 90 L258 72" begin="0.5s" /></circle>
                  <circle r="3" fill="#6EC8FF" opacity="0.9" filter="url(#cxp-glow-f)"><animateMotion dur="2.6s" repeatCount="indefinite" path="M218 105 L258 122" begin="1s" /></circle>

                  {/* AI Brain card */}
                  <g className="eco-float">
                    <rect x="8" y="30" width="88" height="74" rx="14" fill="url(#cxp-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#cxp-glow-f)" />
                    <rect x="8" y="30" width="88" height="18" rx="14" fill="#0077B6" opacity="0.07" />
                    <text x="52" y="43" fontSize="8" fontWeight="900" fill="#0077B6" textAnchor="middle">AI BRAIN</text>
                    {/* Neural dots */}
                    <circle cx="28" cy="68" r="5" fill="#3BA9F5" opacity="0.25" />
                    <circle cx="52" cy="58" r="5" fill="#0077B6" opacity="0.25" />
                    <circle cx="76" cy="68" r="5" fill="#6EC8FF" opacity="0.25" />
                    <circle cx="40" cy="78" r="4" fill="#3BA9F5" opacity="0.2" />
                    <circle cx="64" cy="78" r="4" fill="#0077B6" opacity="0.2" />
                    <line x1="28" y1="68" x2="52" y2="58" stroke="#3BA9F5" strokeWidth="1.2" opacity="0.5" />
                    <line x1="52" y1="58" x2="76" y2="68" stroke="#0077B6" strokeWidth="1.2" opacity="0.5" />
                    <line x1="28" y1="68" x2="40" y2="78" stroke="#3BA9F5" strokeWidth="1.2" opacity="0.5" />
                    <line x1="76" y1="68" x2="64" y2="78" stroke="#0077B6" strokeWidth="1.2" opacity="0.5" />
                    <circle cx="28" cy="68" r="3" fill="#3BA9F5" className="eco-glow" />
                    <circle cx="52" cy="58" r="3" fill="#0077B6" className="eco-glow" />
                    <circle cx="76" cy="68" r="3" fill="#6EC8FF" className="eco-glow" />
                  </g>

                  {/* Analytics Dashboard top */}
                  <g className="eco-float-2">
                    <rect x="116" y="8" width="124" height="60" rx="14" fill="url(#cxp-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#cxp-glow-f)" />
                    <rect x="116" y="8" width="124" height="18" rx="14" fill="#0077B6" opacity="0.07" />
                    <text x="178" y="21.5" fontSize="7.5" fontWeight="900" fill="#0077B6" textAnchor="middle">Analytics Dashboard</text>
                    {/* Bar chart */}
                    <rect x="128" y="56" width="10" height="8" rx="2" fill="url(#cxp-bar-g)" />
                    <rect x="142" y="48" width="10" height="16" rx="2" fill="url(#cxp-bar-g)" />
                    <rect x="156" y="40" width="10" height="24" rx="2" fill="url(#cxp-bar-g)" />
                    <rect x="170" y="35" width="10" height="29" rx="2" fill="url(#cxp-bar-g)" />
                    <rect x="184" y="42" width="10" height="22" rx="2" fill="url(#cxp-bar-g)" />
                    <rect x="198" y="50" width="10" height="14" rx="2" fill="url(#cxp-bar-g)" />
                    <rect x="212" y="45" width="10" height="19" rx="2" fill="url(#cxp-bar-g)" />
                    <path d="M128 56 L142 48 L156 40 L170 35 L184 42 L198 50 L212 45" stroke="#0077B6" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
                    <circle cx="170" cy="35" r="3" fill="#0077B6" className="eco-glow" />
                  </g>

                  {/* Health Score right */}
                  <g className="eco-float-3">
                    <rect x="264" y="22" width="90" height="80" rx="14" fill="url(#cxp-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#cxp-glow-f)" />
                    <rect x="264" y="22" width="90" height="18" rx="14" fill="#0077B6" opacity="0.07" />
                    <text x="309" y="35.5" fontSize="7.5" fontWeight="900" fill="#0077B6" textAnchor="middle">Health Score</text>
                    <path d="M279 88 A 30 30 0 0 1 339 88" fill="none" stroke="#E2EEF8" strokeWidth="9" strokeLinecap="round" />
                    <path d="M279 88 A 30 30 0 0 1 336 73" fill="none" stroke="url(#cxp-bar-g)" strokeWidth="9" strokeLinecap="round" />
                    <text x="309" y="85" fontSize="16" fontWeight="900" fill="#0A1628" textAnchor="middle">82</text>
                    <text x="309" y="96" fontSize="7" fontWeight="700" fill="#0077B6" textAnchor="middle">Healthy</text>
                  </g>

                  {/* Churn Prediction bottom left */}
                  <g className="eco-float">
                    <rect x="8" y="115" width="106" height="65" rx="14" fill="url(#cxp-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#cxp-glow-f)" />
                    <rect x="8" y="115" width="106" height="18" rx="14" fill="#0077B6" opacity="0.07" />
                    <text x="61" y="128.5" fontSize="7.5" fontWeight="900" fill="#0077B6" textAnchor="middle">Churn Prediction</text>
                    <path d="M20 170 Q 38 145 60 155 T 102 140" fill="none" stroke="#0077B6" strokeWidth="2" strokeLinecap="round" />
                    <path d="M20 170 Q 38 145 60 155 T 102 140 L102 173 L20 173Z" fill="#0077B6" opacity="0.07" />
                    <circle cx="102" cy="140" r="3.5" fill="#0077B6" className="eco-glow" />
                  </g>

                  {/* Revenue Intel bottom right */}
                  <g className="eco-float-2">
                    <rect x="254" y="115" width="100" height="65" rx="14" fill="url(#cxp-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#cxp-glow-f)" />
                    <rect x="254" y="115" width="100" height="18" rx="14" fill="#0077B6" opacity="0.07" />
                    <text x="304" y="128.5" fontSize="7.5" fontWeight="900" fill="#0077B6" textAnchor="middle">Revenue Intel</text>
                    <text x="304" y="153" fontSize="19" fontWeight="900" fill="#0A1628" textAnchor="middle">₹48.7L</text>
                    <text x="304" y="170" fontSize="8" fontWeight="700" fill="#3BA9F5" textAnchor="middle">↑ 28% vs last qtr</text>
                  </g>
                </svg>
              </div>

              <div className="flex flex-wrap gap-2 flex-shrink-0">
                {["NPS Analytics", "Churn Predict", "Health Score", "Revenue Intel"].map((label) => (
                  <span key={label} className="eco-chip inline-flex items-center text-[10px] font-bold rounded-full px-3 py-1.5 cursor-default"
                    style={{ background: "linear-gradient(135deg, rgba(240,249,255,0.9) 0%, rgba(224,242,254,0.7) 100%)", border: "1px solid rgba(125,211,252,0.5)", color: "#0055A5", boxShadow: "0 2px 8px rgba(0,119,182,0.08), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SLIDE 2 ── */}
        {productSlide === 1 && (
          <div className="eco-slide-in grid grid-cols-2 gap-5 h-full w-full">

            {/* ══ CARD 3: Case Flow ══ */}
            <div className="group relative rounded-[24px] p-5 flex flex-col gap-3 overflow-hidden transition-all duration-400 hover:-translate-y-1.5"
              style={{
                background: "radial-gradient(ellipse at 15% 0%, rgba(0,119,182,0.18) 0%, rgba(59,169,245,0.10) 40%, rgba(224,242,254,0.85) 100%)",
                border: "1px solid rgba(0,119,182,0.25)",
                boxShadow: "0 4px 24px rgba(0,90,160,0.12), 0 1px 0 rgba(255,255,255,0.7) inset",
              }}>
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,119,182,0.05) 0%, transparent 65%)" }} />

              <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 40%, #7DD3FC 100%)", boxShadow: "0 6px 20px rgba(0,119,182,0.20), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                      <defs><linearGradient id="ic3" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0077B6" /><stop offset="100%" stopColor="#0EA5E9" /></linearGradient></defs>
                      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" stroke="url(#ic3)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-[900] text-[#0A1628] leading-tight tracking-tight">Case Flow</h3>
                    <p className="text-[13px] font-semibold text-[#0077B6] mt-0.5">AI Customer Case Management Platform</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FFF4] border border-emerald-200/70 text-emerald-600 text-[10px] font-bold shadow-[0_2px_8px_rgba(16,185,129,0.12)] flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
                </span>
              </div>

              <div className="flex-1 min-h-0 rounded-[16px] overflow-hidden relative flex items-center justify-center"
                style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(0,119,182,0.07) 0%, rgba(240,249,255,0.5) 60%, rgba(248,252,255,0.85) 100%)", border: "1px solid rgba(186,230,253,0.35)" }}>
                <svg viewBox="0 0 340 195" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: "100%" }}>
                  <defs>
                    <linearGradient id="cf-step-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="white" />
                      <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="cf-accent" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0077B6" />
                      <stop offset="100%" stopColor="#3BA9F5" />
                    </linearGradient>
                    <filter id="cf-glow-f">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <marker id="cf-arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                      <path d="M0,0 L0,8 L8,4 z" fill="#3BA9F5" opacity="0.8" />
                    </marker>
                  </defs>

                  {/* Vertical spine */}
                  <line x1="170" y1="25" x2="170" y2="178" stroke="#E2EEF8" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Step 1 */}
                  <g className="eco-float">
                    <rect x="88" y="10" width="164" height="38" rx="12" fill="url(#cf-step-g)" stroke="#BAE6FD" strokeWidth="1.2" filter="url(#cf-glow-f)" />
                    <rect x="88" y="10" width="164" height="38" rx="12" fill="#0077B6" opacity="0.04" />
                    <rect x="88" y="10" width="4" height="38" rx="2" fill="url(#cf-accent)" />
                    <rect x="100" y="19" width="20" height="20" rx="5" fill="#0077B6" opacity="0.12" />
                    <path d="M104 25L118 25M104 30L114 30" stroke="#0077B6" strokeWidth="1.5" strokeLinecap="round" />
                    <text x="128" y="27" fontSize="9" fontWeight="900" fill="#0A1628">Customer Ticket</text>
                    <text x="128" y="39" fontSize="7.5" fontWeight="700" fill="#3BA9F5">Inbound case created</text>
                  </g>

                  {/* Arrow + particle */}
                  <path d="M170 48 L170 62" stroke="#3BA9F5" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#cf-arr)" className="eco-flow-line" />
                  <circle r="3.5" fill="#3BA9F5" opacity="0.9" filter="url(#cf-glow-f)">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M170 48 L170 62" />
                  </circle>

                  {/* Step 2 */}
                  <g className="eco-float-2">
                    <rect x="80" y="60" width="180" height="38" rx="12" fill="url(#cf-step-g)" stroke="#BAE6FD" strokeWidth="1.5" filter="url(#cf-glow-f)" />
                    <rect x="80" y="60" width="180" height="38" rx="12" fill="#0077B6" opacity="0.07" />
                    <rect x="80" y="60" width="4" height="38" rx="2" fill="url(#cf-accent)" />
                    <circle cx="100" cy="79" r="11" fill="#0077B6" opacity="0.14" />
                    <path d="M96 79 L100 72 L104 79 L100 86Z" fill="#0077B6" opacity="0.7" />
                    <text x="118" y="77" fontSize="9" fontWeight="900" fill="#0A1628">AI Routing Engine</text>
                    <text x="118" y="89" fontSize="7.5" fontWeight="700" fill="#3BA9F5">Auto-assigns to best agent</text>
                  </g>

                  <path d="M170 98 L170 112" stroke="#3BA9F5" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#cf-arr)" className="eco-flow-line" />
                  <circle r="3.5" fill="#0077B6" opacity="0.9" filter="url(#cf-glow-f)">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M170 98 L170 112" begin="0.4s" />
                  </circle>

                  {/* Step 3 */}
                  <g className="eco-float-3">
                    <rect x="88" y="110" width="164" height="38" rx="12" fill="url(#cf-step-g)" stroke="#BAE6FD" strokeWidth="1.2" filter="url(#cf-glow-f)" />
                    <rect x="88" y="110" width="164" height="38" rx="12" fill="#3BA9F5" opacity="0.04" />
                    <rect x="88" y="110" width="4" height="38" rx="2" fill="url(#cf-accent)" />
                    <circle cx="106" cy="129" r="10" fill="none" stroke="#3BA9F5" strokeWidth="1.8" />
                    <path d="M106 122 L106 129 L112 133" stroke="#3BA9F5" strokeWidth="1.8" strokeLinecap="round" />
                    <text x="124" y="127" fontSize="9" fontWeight="900" fill="#0A1628">SLA Tracking</text>
                    <text x="124" y="139" fontSize="7.5" fontWeight="700" fill="#3BA9F5">12-min target enforced</text>
                  </g>

                  <path d="M170 148 L170 162" stroke="#3BA9F5" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#cf-arr)" className="eco-flow-line" />
                  <circle r="3.5" fill="#3BA9F5" opacity="0.9" filter="url(#cf-glow-f)">
                    <animateMotion dur="1.9s" repeatCount="indefinite" path="M170 148 L170 162" begin="0.7s" />
                  </circle>

                  {/* Step 4 */}
                  <g className="eco-float-2">
                    <rect x="88" y="160" width="164" height="30" rx="12" fill="url(#cf-step-g)" stroke="#BAE6FD" strokeWidth="1.2" filter="url(#cf-glow-f)" />
                    <rect x="88" y="160" width="164" height="30" rx="12" fill="#0077B6" opacity="0.04" />
                    <rect x="88" y="160" width="4" height="30" rx="2" fill="url(#cf-accent)" />
                    <circle cx="106" cy="175" r="9" fill="#0077B6" opacity="0.14" />
                    <path d="M101 175 L104 178 L111 170" stroke="#0077B6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <text x="124" y="172" fontSize="9" fontWeight="900" fill="#0A1628">Resolution</text>
                    <text x="124" y="183" fontSize="7.5" fontWeight="700" fill="#3BA9F5">Solved &amp; auto-closed</text>
                  </g>

                  {/* Ambient side glows */}
                  <circle cx="60" cy="79" r="6" fill="#6EC8FF" opacity="0.35" className="eco-glow" />
                  <circle cx="280" cy="129" r="6" fill="#3BA9F5" opacity="0.35" className="eco-glow" />
                </svg>
              </div>

              <div className="flex flex-wrap gap-2 flex-shrink-0">
                {["Auto Routing", "SLA Automation", "Escalation Mgmt", "Resolution Track"].map((label) => (
                  <span key={label} className="eco-chip inline-flex items-center text-[10px] font-bold rounded-full px-3 py-1.5 cursor-default"
                    style={{ background: "linear-gradient(135deg, rgba(240,249,255,0.9) 0%, rgba(224,242,254,0.7) 100%)", border: "1px solid rgba(125,211,252,0.5)", color: "#0055A5", boxShadow: "0 2px 8px rgba(0,119,182,0.08), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* ══ CARD 4: Nexora ══ */}
            <div className="group relative rounded-[24px] p-5 flex flex-col gap-3 overflow-hidden transition-all duration-400 hover:-translate-y-1.5"
              style={{
                background: "radial-gradient(ellipse at 80% 0%, rgba(59,169,245,0.18) 0%, rgba(0,119,182,0.10) 40%, rgba(224,242,254,0.85) 100%)",
                border: "1px solid rgba(0,119,182,0.25)",
                boxShadow: "0 4px 24px rgba(0,90,160,0.12), 0 1px 0 rgba(255,255,255,0.7) inset",
              }}>
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(59,169,245,0.05) 0%, transparent 65%)" }} />

              <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: "linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 40%, #7DD3FC 100%)", boxShadow: "0 6px 20px rgba(0,119,182,0.20), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                      <defs><linearGradient id="ic4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#0077B6" /><stop offset="100%" stopColor="#38BDF8" /></linearGradient></defs>
                      <circle cx="12" cy="12" r="3.5" fill="url(#ic4)" opacity="0.25" stroke="url(#ic4)" strokeWidth="1.6" />
                      <circle cx="5" cy="6" r="2.5" stroke="#3BA9F5" strokeWidth="1.4" />
                      <circle cx="19" cy="6" r="2.5" stroke="#3BA9F5" strokeWidth="1.4" />
                      <circle cx="5" cy="18" r="2.5" stroke="#7DD3FC" strokeWidth="1.4" />
                      <circle cx="19" cy="18" r="2.5" stroke="#7DD3FC" strokeWidth="1.4" />
                      <path d="M7.5 7.5L10 10M16.5 7.5L14 10M7.5 16.5L10 14M16.5 16.5L14 14" stroke="url(#ic4)" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[20px] font-[900] text-[#0A1628] leading-tight tracking-tight">Nexora</h3>
                    <p className="text-[13px] font-semibold text-[#0077B6] mt-0.5">Partner &amp; Sourcing Management Platform</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FFF4] border border-emerald-200/70 text-emerald-600 text-[10px] font-bold shadow-[0_2px_8px_rgba(16,185,129,0.12)] flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live
                </span>
              </div>

              <div className="flex-1 min-h-0 rounded-[16px] overflow-hidden relative flex items-center justify-center"
                style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,119,182,0.08) 0%, rgba(240,249,255,0.55) 55%, rgba(248,252,255,0.85) 100%)", border: "1px solid rgba(186,230,253,0.35)" }}>
                <svg viewBox="0 0 360 200" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ maxHeight: "100%" }}>
                  <defs>
                    <radialGradient id="nx-hub-g" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0077B6" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#0077B6" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="nx-card-g" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="white" />
                      <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.95" />
                    </linearGradient>
                    <filter id="nx-glow-f">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  <circle cx="180" cy="100" r="70" fill="url(#nx-hub-g)" />
                  {/* Pulse rings on hub */}
                  <circle cx="180" cy="100" r="34" fill="none" stroke="#3BA9F5" strokeWidth="1.5" className="eco-ring1" opacity="0.5" />
                  <circle cx="180" cy="100" r="34" fill="none" stroke="#0077B6" strokeWidth="1" className="eco-ring2" opacity="0.35" />

                  {/* Connections: left 2 nodes */}
                  <path d="M98 60 L152 100" fill="none" stroke="#3BA9F5" strokeWidth="1.8" className="eco-flow-line" opacity="0.65" />
                  <path d="M98 140 L152 100" fill="none" stroke="#0077B6" strokeWidth="1.8" className="eco-flow-line" opacity="0.65" />
                  {/* Connections: right 3 nodes */}
                  <path d="M208 100 L262 55" fill="none" stroke="#6EC8FF" strokeWidth="1.8" className="eco-flow-line" opacity="0.65" />
                  <path d="M208 100 L262 100" fill="none" stroke="#3BA9F5" strokeWidth="1.8" className="eco-flow-line" opacity="0.65" />
                  <path d="M208 100 L262 145" fill="none" stroke="#0077B6" strokeWidth="1.8" className="eco-flow-line" opacity="0.65" />

                  {/* Particles */}
                  <circle r="3.5" fill="#3BA9F5" opacity="0.9" filter="url(#nx-glow-f)"><animateMotion dur="2.2s" repeatCount="indefinite" path="M98 60 L152 100" /></circle>
                  <circle r="3" fill="#0077B6" opacity="0.85" filter="url(#nx-glow-f)"><animateMotion dur="2.5s" repeatCount="indefinite" path="M98 140 L152 100" begin="0.5s" /></circle>
                  <circle r="3" fill="#6EC8FF" opacity="0.9" filter="url(#nx-glow-f)"><animateMotion dur="2s" repeatCount="indefinite" path="M208 100 L262 55" begin="0.3s" /></circle>
                  <circle r="3" fill="#3BA9F5" opacity="0.85" filter="url(#nx-glow-f)"><animateMotion dur="2.3s" repeatCount="indefinite" path="M208 100 L262 100" begin="0.8s" /></circle>
                  <circle r="3" fill="#0077B6" opacity="0.9" filter="url(#nx-glow-f)"><animateMotion dur="2.1s" repeatCount="indefinite" path="M208 100 L262 145" begin="1.1s" /></circle>

                  {/* Central Nexora Hub */}
                  <circle cx="180" cy="100" r="36" fill="white" filter="url(#nx-glow-f)" />
                  <circle cx="180" cy="100" r="34" fill="url(#nx-hub-g)" />
                  <text x="180" y="96" fontSize="8" fontWeight="900" fill="#0077B6" textAnchor="middle">NEXORA</text>
                  <text x="180" y="108" fontSize="7" fontWeight="700" fill="#64748B" textAnchor="middle">Platform</text>
                  <circle cx="180" cy="100" r="34" stroke="#3BA9F5" strokeWidth="1.2" strokeDasharray="4 3" fill="none" className="eco-glow" />

                  {/* Left: Partner Network */}
                  <g className="eco-float">
                    <rect x="10" y="35" width="88" height="50" rx="13" fill="url(#nx-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#nx-glow-f)" />
                    <rect x="10" y="35" width="88" height="15" rx="13" fill="#3BA9F5" opacity="0.07" />
                    <text x="54" y="47" fontSize="7" fontWeight="900" fill="#0077B6" textAnchor="middle">Partner Network</text>
                    <circle cx="26" cy="64" r="7" fill="#3BA9F5" opacity="0.2" />
                    <circle cx="22" cy="61" r="4" fill="#3BA9F5" opacity="0.5" />
                    <circle cx="30" cy="61" r="3.5" fill="#6EC8FF" opacity="0.5" />
                    <circle cx="26" cy="68" r="4" fill="#0077B6" opacity="0.4" />
                    <line x1="22" y1="61" x2="26" y2="68" stroke="#3BA9F5" strokeWidth="1" />
                    <line x1="30" y1="61" x2="26" y2="68" stroke="#6EC8FF" strokeWidth="1" />
                    <text x="68" y="63" fontSize="7.5" fontWeight="800" fill="#0A1628" textAnchor="middle">120+</text>
                    <text x="68" y="73" fontSize="6.5" fill="#64748B" textAnchor="middle">active</text>
                  </g>
                  {/* Left: Meeting Planning */}
                  <g className="eco-float-3">
                    <rect x="10" y="115" width="88" height="50" rx="13" fill="url(#nx-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#nx-glow-f)" />
                    <rect x="10" y="115" width="88" height="15" rx="13" fill="#0077B6" opacity="0.07" />
                    <text x="54" y="127" fontSize="7" fontWeight="900" fill="#0077B6" textAnchor="middle">Meeting Planning</text>
                    <rect x="20" y="134" width="22" height="22" rx="5" fill="#0077B6" opacity="0.1" />
                    <line x1="22" y1="140" x2="40" y2="140" stroke="#0077B6" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="22" y1="145" x2="36" y2="145" stroke="#3BA9F5" strokeWidth="1.2" strokeLinecap="round" />
                    <line x1="22" y1="150" x2="40" y2="150" stroke="#0077B6" strokeWidth="1.2" strokeLinecap="round" />
                    <text x="70" y="143" fontSize="7.5" fontWeight="800" fill="#0A1628" textAnchor="middle">Auto</text>
                    <text x="70" y="153" fontSize="7.5" fontWeight="800" fill="#0A1628" textAnchor="middle">Sched.</text>
                  </g>
                  {/* Right: Activity */}
                  <g className="eco-float-2">
                    <rect x="262" y="30" width="88" height="50" rx="13" fill="url(#nx-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#nx-glow-f)" />
                    <rect x="262" y="30" width="88" height="15" rx="13" fill="#6EC8FF" opacity="0.08" />
                    <text x="306" y="42" fontSize="7" fontWeight="900" fill="#0077B6" textAnchor="middle">Activity Tracker</text>
                    <rect x="272" y="51" width="10" height="20" rx="3" fill="#6EC8FF" opacity="0.5" />
                    <rect x="285" y="44" width="10" height="27" rx="3" fill="#3BA9F5" opacity="0.6" />
                    <rect x="298" y="38" width="10" height="33" rx="3" fill="#0077B6" opacity="0.7" />
                    <text x="330" y="63" fontSize="7.5" fontWeight="800" fill="#3BA9F5" textAnchor="middle">High ↑</text>
                  </g>
                  {/* Right: Deal Pipeline */}
                  <g className="eco-float">
                    <rect x="262" y="75" width="88" height="50" rx="13" fill="url(#nx-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#nx-glow-f)" />
                    <rect x="262" y="75" width="88" height="15" rx="13" fill="#0077B6" opacity="0.07" />
                    <text x="306" y="87" fontSize="7" fontWeight="900" fill="#0077B6" textAnchor="middle">Deal Pipeline</text>
                    <path d="M272 115 L278 106 L284 110 L292 98 L300 102" stroke="#0077B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <circle cx="300" cy="102" r="3" fill="#0077B6" className="eco-glow" />
                    <text x="326" y="107" fontSize="9" fontWeight="900" fill="#0A1628" textAnchor="middle">₹4.2Cr</text>
                  </g>
                  {/* Right: Growth */}
                  <g className="eco-float-3">
                    <rect x="262" y="120" width="88" height="50" rx="13" fill="url(#nx-card-g)" stroke="#BAE6FD" strokeWidth="1" filter="url(#nx-glow-f)" />
                    <rect x="262" y="120" width="88" height="15" rx="13" fill="#3BA9F5" opacity="0.07" />
                    <text x="306" y="132" fontSize="7" fontWeight="900" fill="#0077B6" textAnchor="middle">Growth Dashboard</text>
                    <path d="M272 163 L280 152 L288 156 L296 144 L304 148 L312 138" stroke="#3BA9F5" strokeWidth="2" strokeLinecap="round" fill="none" />
                    <path d="M272 163 L280 152 L288 156 L296 144 L304 148 L312 138 L312 165 L272 165Z" fill="#3BA9F5" opacity="0.07" />
                    <circle cx="312" cy="138" r="3.5" fill="#3BA9F5" className="eco-glow" />
                    <text x="338" y="148" fontSize="7" fontWeight="700" fill="#3BA9F5" textAnchor="middle">↑ Trend</text>
                  </g>
                </svg>
              </div>

              <div className="flex flex-wrap gap-2 flex-shrink-0">
                {["Meeting Planner", "Activity Track", "Partner Mgmt", "Deal Pipeline"].map((label) => (
                  <span key={label} className="eco-chip inline-flex items-center text-[10px] font-bold rounded-full px-3 py-1.5 cursor-default"
                    style={{ background: "linear-gradient(135deg, rgba(240,249,255,0.9) 0%, rgba(224,242,254,0.7) 100%)", border: "1px solid rgba(125,211,252,0.5)", color: "#0055A5", boxShadow: "0 2px 8px rgba(0,119,182,0.08), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-6px_30px_rgba(116,203,244,0.9)] opacity-90 rounded-full pointer-events-none" />
    </div>
  );
}

function LeadershipScene({ scene: _scene }: { scene: Scene }) {
  const leaders = [
    {
      name: "Aashish Yadav",
      role: "CEO & Co-Founder",
      desc: "Drives business strategy, Salesforce delivery, and enterprise growth — pairing deep CRM expertise with robust execution models to scale developer operations.",
      image: "/clients/Aashish Yadav.png?v=5",
      linkedin: "https://www.linkedin.com/in/aashishyadav-ceo/",
      tags: ["Business Strategy", "Salesforce", "Enterprise Growth"],
      concept: "VISION",
      imgPos: "[object-position:50%_32%]",
    },
    {
      name: "Yash Jain",
      role: "CTO & Co-Founder",
      desc: "Architects scalable technology solutions and leads AI innovation — bridging cloud systems engineering with customer-centric CRM products.",
      image: "/clients/Yash Jain.png?v=5",
      linkedin: "https://www.linkedin.com/in/yashjain-cto/",
      tags: ["AI Innovation", "Solution Architecture", "Product Engineering"],
      concept: "TECHNOLOGY",
      imgPos: "[object-position:50%_32%]",
    },
  ];

  return (
    <div
      className="pointer-events-auto rounded-[28px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[84vh] max-w-7xl relative overflow-hidden flex flex-col pt-10 pb-10 px-6 md:px-12 border border-slate-200/70 shadow-[0_24px_80px_rgba(0,55,120,0.13)] justify-center"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.97) 0%, rgba(241,248,255,0.95) 60%, rgba(224,240,255,0.93) 100%)",
        backdropFilter: "blur(32px)",
      }}
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #0077B6 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      {/* Glow accents */}
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-[0.18] bg-[#0077B6]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[120px] pointer-events-none opacity-[0.08] bg-[#48CAE4]" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6 max-w-2xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.25em] text-[#0077B6] uppercase bg-[#E0F2FE] border border-[#BAE6FD] rounded-full px-3 py-1 mb-3">
          <span className="size-1.5 rounded-full bg-[#0077B6] animate-pulse" />
          LEADERSHIP
        </span>
        <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-[900] tracking-tight text-[#03045E] leading-[1.1]">
          The Vision Behind{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] to-[#00B4D8]">
            Cascade Tech
          </span>
        </h2>
        <p className="text-slate-500 text-[13px] sm:text-sm font-medium leading-relaxed mt-1.5 max-w-xl">
          From the blueprint to the boardroom — bridging strategy and technology.
        </p>
      </div>

      {/* 2-column premium showcase card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 w-full max-w-6xl mx-auto relative z-10 justify-items-center items-stretch">
        
        {/* Center Divider / Partnership Connection (Desktop only) */}
        <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4 pointer-events-none z-20">
          <span className="text-[10px] font-black text-slate-400 tracking-[0.22em] uppercase text-center max-w-[140px] leading-tight">
            Business Strategy
          </span>
          <div className="h-20 w-[1px] bg-gradient-to-b from-sky-200 via-sky-400 to-sky-200 relative flex items-center justify-center">
            <div className="size-2 rounded-full bg-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.6)] animate-pulse" />
          </div>
          <span className="text-[10px] font-black text-slate-400 tracking-[0.22em] uppercase text-center max-w-[140px] leading-tight">
            Technology Innovation
          </span>
        </div>

        {leaders.map((m) => (
          <div
            key={m.name}
            className="group flex flex-col rounded-[24px] bg-white/85 border border-slate-200/80 shadow-[0_12px_40px_rgba(0,119,182,0.06)] hover:shadow-[0_30px_70px_rgba(0,119,182,0.18)] hover:border-sky-300/80 transition-all duration-500 p-5 md:p-6 w-full max-w-[440px] relative hover:-translate-y-1.5"
          >
            {/* Soft Ambient Glow behind each card (hover-triggered) */}
            <div className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-sky-400/5 via-transparent to-transparent pointer-events-none" />

            {/* Square/Portrait Image with subtle blue ambient glow behind portrait */}
            <div className="w-full aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 shadow-sm relative mb-4 bg-slate-50 group-hover:border-sky-200/80 transition-colors duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-sky-500/10 via-transparent to-transparent z-10 mix-blend-overlay" />
              <img
                src={m.image}
                alt={m.name}
                className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 ${m.imgPos}`}
                loading="eager"
              />
            </div>

            {/* Profile Info */}
            <div className="flex flex-col flex-grow text-left">
              <div className="flex items-center justify-between gap-2 mb-1">
                <h3 className="text-[20px] md:text-[22px] font-black text-[#03045E] leading-tight tracking-tight">
                  {m.name}
                </h3>
                <a
                  href={m.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md text-slate-400 hover:text-[#0A66C2] transition-colors"
                >
                  <Linkedin className="size-4.5" />
                </a>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[12px] font-bold text-[#0077B6] uppercase tracking-wider leading-none">
                  {m.role}
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded bg-sky-50 text-sky-600 border border-sky-100/60 leading-none">
                  {m.concept}
                </span>
              </div>

              {/* Bio description */}
              <p className="text-slate-600 text-[13px] leading-relaxed font-medium mb-5">
                {m.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MeetOurTeamScene({ scene: _scene }: { scene: Scene }) {
  const team = [
    {
      name: "Pravesh Prajapati",
      role: "Project Manager",
      responsibility: "Owns delivery end to end — keeping scope, timeline and quality aligned.",
      image: "/clients/Pravesh Prajapati.png?v=5",
      imgPos: "object-top",
    },
    {
      name: "Jainam Jain",
      role: "Business Development Head",
      responsibility: "Leads growth and client partnerships — connecting clients with solutions.",
      image: "/clients/Jainam Jain.png?v=5",
      imgPos: "object-top",
    },
  ];

  return (
    <div
      className="pointer-events-auto rounded-[28px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[84vh] max-w-7xl relative overflow-hidden flex flex-col pt-8 pb-6 px-6 md:px-12 border border-slate-200/70 shadow-[0_24px_80px_rgba(0,55,120,0.13)] justify-center"
      style={{
        background: "linear-gradient(160deg, rgba(255,255,255,0.97) 0%, rgba(241,248,255,0.95) 60%, rgba(224,240,255,0.93) 100%)",
        backdropFilter: "blur(32px)",
      }}
    >
      {/* Dot grid texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, #0077B6 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      {/* Glow accents */}
      <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full blur-[100px] pointer-events-none opacity-[0.18] bg-[#0077B6]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-[120px] pointer-events-none opacity-[0.08] bg-[#48CAE4]" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10 max-w-2xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.25em] text-[#0077B6] uppercase bg-[#E0F2FE] border border-[#BAE6FD] rounded-full px-3 py-1 mb-3">
          <span className="size-1.5 rounded-full bg-[#0077B6] animate-pulse" />
          Meet Our Team
        </span>
        <h2 className="text-[28px] sm:text-[34px] lg:text-[40px] font-[900] tracking-tight text-[#03045E] leading-[1.1]">
          The Execution{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] to-[#00B4D8]">
            Engine
          </span>
        </h2>
        <p className="text-slate-500 text-[13px] sm:text-sm font-medium leading-relaxed mt-2 max-w-xl">
          The PMs and domain experts driving every successful Salesforce implementation and enterprise rollout.
        </p>
      </div>

      {/* Grid of smaller profile cards (3-4 per row on desktop, centered) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mx-auto relative z-10">
        {team.map((m) => (
          <div
            key={m.name}
            className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white/80 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_36px_rgba(0,119,182,0.12)] hover:border-sky-300 cursor-pointer"
          >
            {/* Photo – 4:3 aspect ratio */}
            <div className="w-full overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                src={m.image}
                alt={m.name}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${m.imgPos}`}
                loading="eager"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col px-4 pt-3 pb-4 gap-1.5 text-left">
              <h3 className="text-[14px] font-black text-[#03045E] leading-tight">{m.name}</h3>
              <p className="text-[11px] font-bold text-[#0077B6] leading-tight">{m.role}</p>
              <p className="text-slate-500 text-[11px] leading-relaxed mt-1">
                {m.responsibility}
              </p>
            </div>
          </div>
        ))}

        {/* 2 empty styled container cards */}
        {[
          {
            title: "Join Our Team",
            role: "Salesforce Developer",
            desc: "Always looking for skilled builders to join the Cascade delivery engine.",
          },
          {
            title: "Join Our Team",
            role: "Consultant / Architect",
            desc: "Always looking for domain specialists to design high-quality CRM systems.",
          },
        ].map((pos, idx) => (
          <div
            key={idx}
            className="group flex flex-col rounded-2xl border border-dashed border-slate-300 bg-white/40 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_36px_rgba(0,119,182,0.06)] hover:border-sky-300/80 cursor-pointer min-h-[220px]"
          >
            {/* Aspect ratio matching empty placeholder box */}
            <div className="w-full bg-slate-50/50 flex items-center justify-center border-b border-dashed border-slate-200" style={{ aspectRatio: "4/3" }}>
              <Sparkles className="size-6 text-sky-300/85 group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Info */}
            <div className="flex flex-col px-4 pt-3 pb-4 gap-1.5 text-left">
              <h3 className="text-[14px] font-black text-[#03045E]/60 leading-tight">{pos.title}</h3>
              <p className="text-[11px] font-bold text-[#0077B6]/60 leading-tight">{pos.role}</p>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                {pos.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SceneContent({ scene, isActive = false, activeCardIdx = 0 }: { scene: Scene; isActive?: boolean; activeCardIdx?: number }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (scene.variant !== "hero") return;
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [scene.variant]);

  if (scene.id === 2) {
    return <WhoWeAreScene scene={scene} isActive={isActive} activeCardIdx={activeCardIdx} />;
  }

  if (scene.id === 11) {
    return <EngagementModelScene scene={scene} />;
  }

  if (scene.id === 13) {
    return <LeadershipScene scene={scene} />;
  }

  if (scene.id === 18) {
    return <MeetOurTeamScene scene={scene} />;
  }

  if (scene.variant === "hero") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut", delay: 0.5 }}
        className="pointer-events-auto hero-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[86vh] md:h-[80vh] max-w-7xl relative overflow-hidden flex flex-col p-6 md:p-8 justify-between gap-6"
      >
        {/* Layered Background Stack */}
        {/* 1. Subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid-pattern-hero-redesign"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#003B73" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern-hero-redesign)" />
          </svg>
        </div>
        {/* 2. Noise Filter Overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.012] pointer-events-none mix-blend-overlay">
          <filter id="noiseFilterHeroRedesign">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilterHeroRedesign)" />
        </svg>
        {/* 3. Deep blue mesh gradients and ambient spotlights */}
        <div
          className="absolute left-[-10%] top-[-10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(2,132,199,0.18) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[40%] top-[20%] w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 60%)",
          }}
        />

        {/* 4. Glowing Floating Particles */}
        <div
          className="absolute top-[12%] left-[18%] size-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] blur-[0.3px] animate-float-slow"
          style={{ animationDelay: "0.2s", animationDuration: "6s" }}
        />
        <div
          className="absolute top-[42%] right-[10%] size-2.5 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] blur-[0.4px] animate-float-slow"
          style={{ animationDelay: "1.5s", animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-[35%] left-[25%] size-2 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8] blur-[0.3px] animate-float-slow"
          style={{ animationDelay: "2.5s", animationDuration: "7s" }}
        />
        <div
          className="absolute bottom-[18%] right-[28%] size-1.8 rounded-full bg-sky-300 shadow-[0_0_6px_#7dd3fc] blur-[0.2px] animate-float-slow"
          style={{ animationDelay: "0.9s", animationDuration: "9s" }}
        />
        <div
          className="absolute top-[60%] left-[8%] size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] blur-[0.3px] animate-float-slow"
          style={{ animationDelay: "3.2s", animationDuration: "10s" }}
        />
        <div
          className="absolute top-[25%] right-[32%] size-1 rounded-full bg-blue-300 shadow-[0_0_6px_#93c5fd] blur-[0.1px] animate-float-slow"
          style={{ animationDelay: "0.5s", animationDuration: "5s" }}
        />

        {/* Content Container */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-between w-full h-full relative z-10 overflow-hidden md:overflow-visible">
          {/* LEFT SIDE (38% width) */}
          <div className="w-full md:w-[38%] flex flex-col justify-between h-full text-left">
            <div className="flex flex-col justify-start">
              {/* Kicker Pill */}
              <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1.5 text-[10px] font-extrabold tracking-wider text-[#0284C7] w-fit mb-4 shadow-sm">
                <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
                Salesforce Partner &bull; AI Voice Platform
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[40px] xl:text-[46px] font-[900] leading-[1.06] tracking-tight text-[#0F172A] font-display">
                Empowering <br />
                Growth Through <br />
                <span className="relative inline-block text-[#0284C7] drop-shadow-[0_2px_12px_rgba(2,132,199,0.25)] font-[900]">
                  Salesforce Expertise
                  <span className="absolute -inset-1 bg-sky-500/5 blur-md rounded-lg -z-10" />
                </span>{" "}
                <br />&{" "}
                <span className="relative inline-block text-[#0284C7] drop-shadow-[0_2px_12px_rgba(2,132,199,0.25)] font-[900]">
                  AI Innovation
                  <span className="absolute -inset-1 bg-sky-500/5 blur-md rounded-lg -z-10" />
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.7 }}
                className="mt-4 text-xs sm:text-[13px] text-[#475569] font-medium leading-[1.65] max-w-[420px]"
              >
                Cascade Tech Ventures LLP is a Mumbai-based Salesforce partner helping real estate developers and enterprise businesses modernise their sales, marketing and customer experience operations — boutique by design, senior on every project.
              </motion.p>

              {/* Action Row */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.9 }}
                className="mt-6 flex flex-wrap gap-3 pointer-events-auto"
              >
                <button
                  onClick={() =>
                    window.scrollTo({
                      top: (1.5 / N) * (document.body.scrollHeight - window.innerHeight),
                      behavior: "smooth",
                    })
                  }
                  className="bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold py-2.5 px-6 rounded-full inline-flex items-center gap-2 shadow-lg shadow-sky-500/10 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(2,132,199,0.2)] cursor-pointer"
                >
                  Book a 30-min consult
                  <ArrowRight className="size-3.5" />
                </button>
                <button
                  onClick={() =>
                    window.scrollTo({
                      top: (6.5 / N) * (document.body.scrollHeight - window.innerHeight),
                      behavior: "smooth",
                    })
                  }
                  className="border border-slate-200 bg-white hover:bg-slate-50 text-[#0284C7] text-xs font-bold py-2.5 px-6 rounded-full inline-flex items-center gap-2 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 cursor-pointer"
                >
                  Explore our products
                </button>
              </motion.div>
            </div>

            {/* Clean Trust Information Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 2.1 }}
              className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 pt-5 border-t border-slate-200/40 w-full mt-auto text-left"
            >
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-extrabold tracking-wider uppercase">
                <Award className="size-4 text-[#0284C7]" />
                <span>Salesforce Registered Partner</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-extrabold tracking-wider uppercase">
                <Star className="size-4 text-[#0284C7]" />
                <span>5-Star on AppExchange</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-extrabold tracking-wider uppercase">
                <MapPin className="size-4 text-[#0284C7]" />
                <span>Mumbai, India</span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE (58% width) - PREMIUM VIDEO DASHBOARD & ECOSYSTEM */}
          <div
            className="hidden md:flex md:w-[58%] h-full relative items-center justify-center select-none"
            style={{ perspective: "1000px" }}
          >
            {/* --- 3. Ambient Glow Elements Behind Video --- */}
            {/* Primary soft blue glow spot */}
            <div
              className="absolute w-[80%] h-[80%] bg-[#0284C7]/18 blur-[80px] rounded-full pointer-events-none -z-20 animate-pulse"
              style={{
                animationDuration: "8s",
                transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 0)`,
              }}
            />
            {/* Secondary indigo gradient spot */}
            <div
              className="absolute w-[60%] h-[60%] bg-[#6366F1]/12 blur-[90px] rounded-full pointer-events-none -z-20"
              style={{
                transform: `translate3d(${mousePos.x * -8}px, ${mousePos.y * -8}px, 0)`,
              }}
            />
            {/* Light blue core spotlight */}
            <div
              className="absolute w-[40%] h-[40%] bg-sky-300/10 blur-[60px] rounded-full pointer-events-none -z-20"
              style={{
                transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * -25}px, 0)`,
              }}
            />

            {/* --- 2. Data Orbit System Behind Video --- */}
            <div
              className="absolute w-[125%] h-[125%] -z-10 pointer-events-none flex items-center justify-center"
              style={{
                transform: `translate3d(${mousePos.x * -6}px, ${mousePos.y * -6}px, 0)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            >
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 500">
                {/* Orbit Ellipse 1 */}
                <ellipse
                  cx="250"
                  cy="250"
                  rx="220"
                  ry="130"
                  fill="none"
                  stroke="rgba(14,165,233,0.15)"
                  strokeWidth="1"
                  transform="rotate(-15, 250, 250)"
                />
                {/* Orbit Ellipse 2 (Dashed) */}
                <ellipse
                  cx="250"
                  cy="250"
                  rx="250"
                  ry="160"
                  fill="none"
                  stroke="rgba(99,102,241,0.12)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                  transform="rotate(18, 250, 250)"
                />

                {/* Traveling dot on Orbit 1 */}
                <circle r="3.5" fill="#38BDF8" className="shadow-[0_0_10px_#38bdf8]">
                  <animateMotion
                    dur="18s"
                    repeatCount="indefinite"
                    path="M 250,120 A 220,130 0 1,1 249.9,120 Z"
                    rotate="auto"
                  />
                </circle>

                {/* Traveling dot on Orbit 2 */}
                <circle r="2.5" fill="#818CF8" className="shadow-[0_0_8px_#818cf8]">
                  <animateMotion
                    dur="26s"
                    repeatCount="indefinite"
                    path="M 250,90 A 250,160 0 1,1 249.9,90 Z"
                    rotate="auto"
                  />
                </circle>
              </svg>
            </div>

            {/* --- 4. Enterprise Tech Accents (Grid Fragments, Matrix) --- */}
            {/* Dot Matrix Grid (Top-Center/Right) */}
            <div
              className="absolute -top-[5%] right-[20%] opacity-20 -z-10 pointer-events-none"
              style={{
                transform: `translate3d(${mousePos.x * -8}px, ${mousePos.y * -8}px, 0)`,
              }}
            >
              <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
                {[0, 10, 20, 30, 40, 50].map((x) =>
                  [0, 10, 20, 30].map((y) => (
                    <circle key={`${x}-${y}`} cx={x + 4} cy={y + 4} r="1.2" fill="#0284C7" />
                  ))
                )}
              </svg>
            </div>

            {/* Bottom-Right Dot Matrix */}
            <div
              className="absolute bottom-[8%] right-[4%] opacity-20 -z-10 pointer-events-none"
              style={{ transform: `translate3d(${mousePos.x * -4}px, ${mousePos.y * -4}px, 0)` }}
            >
              <svg width="46" height="46" viewBox="0 0 40 40" fill="none">
                {[0, 10, 20, 30].map((x) =>
                  [0, 10, 20, 30].map((y) => (
                    <circle key={`${x}-${y}`} cx={x + 4} cy={y + 4} r="1" fill="#6366F1" />
                  )),
                )}
              </svg>
            </div>

            {/* Corner Tech Bracket Accents framing the video parent */}
            <div
              className="absolute w-[102%] h-[96%] pointer-events-none -z-10 flex items-center justify-center"
              style={{
                transform: `translate3d(${mousePos.x * -11}px, ${mousePos.y * -11}px, 0)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            >
              <div className="w-full h-full relative max-w-full max-h-full aspect-[1.6]">
                <div className="absolute -top-3 -left-3 size-5 border-t border-l border-[#0284C7]/50" />
                <div className="absolute -top-3 -right-3 size-5 border-t border-r border-[#0284C7]/50" />
                <div className="absolute -bottom-3 -left-3 size-5 border-b border-l border-[#0284C7]/50" />
                <div className="absolute -bottom-3 -right-3 size-5 border-b border-r border-[#0284C7]/50" />
              </div>
            </div>

            {/* --- 1. Floating 3D/Glass Objects (Redesigned matching screenshot) --- */}

            {/* Floating 3D Glass Cube with solid blue cube inside (Top-Left) */}
            <div
              className="absolute -top-[5%] left-[5%] pointer-events-none z-20"
              style={{
                transform: `translate3d(${mousePos.x * -25}px, ${mousePos.y * -25}px, 0)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            >
              <div className="size-14 relative flex items-center justify-center bg-white/20 border border-white/40 rounded-2xl shadow-lg backdrop-blur-md rotate-[15deg] animate-float-slow">
                <div className="size-5.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md shadow-md animate-pulse" />
              </div>
            </div>

            {/* Vibrant Gradient Sphere (Bottom-Left) */}
            <div
              className="absolute bottom-[8%] left-[2%] pointer-events-none z-20"
              style={{
                transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -35}px, 0)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            >
              <div className="size-13 rounded-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 shadow-[0_10px_25px_rgba(99,102,241,0.4)] animate-float-slow" />
            </div>

            {/* Floating Pie Chart (Bottom-Right) */}
            <div
              className="absolute bottom-[4%] right-[2%] pointer-events-none z-20"
              style={{
                transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            >
              <div className="relative size-20 animate-float-slow" style={{ animationDelay: "1s" }}>
                <svg className="w-full h-full filter drop-shadow-[0_12px_20px_rgba(2,132,199,0.3)]" viewBox="0 0 100 100">
                  <path d="M 50,50 L 50,10 A 40,40 0 0,1 90,50 Z" fill="#0284C7" />
                  <path d="M 50,50 L 90,50 A 40,40 0 0,1 50,90 Z" fill="#38BDF8" />
                  <rect x="30" y="60" width="12" height="12" rx="3" fill="white" className="shadow-sm" />
                </svg>
              </div>
            </div>

            {/* Floating Connection Node Card (Far-Right) */}
            <div
              className="absolute top-[25%] -right-[6%] pointer-events-none z-20"
              style={{
                transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15}px, 0)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            >
              <div className="size-10 rounded-xl bg-white border border-slate-200/80 shadow-md flex items-center justify-center text-[#0284C7] animate-float-slow">
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v1" />
                  <path d="M18 8h4a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4" />
                  <circle cx="8" cy="12" r="2" />
                </svg>
              </div>
            </div>

            {/* Outer glowing blue frame accent */}
            <div
              className="absolute w-[100%] h-[94%] rounded-[30px] border border-[#0284C7]/30 pointer-events-none -z-10 shadow-[0_0_15px_rgba(2,132,199,0.12)]"
              style={{
                transform: `translate3d(${mousePos.x * -10.5}px, ${mousePos.y * -10.5}px, 0)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            />

            {/* --- The Video Container (Centered & Shrunk by ~10% for visual breathing space) --- */}
            <div
              className="w-[98%] h-[92%] max-w-full max-h-full aspect-[1.6] rounded-3xl border border-[#0284C7]/40 bg-white/5 backdrop-blur-md relative overflow-hidden shadow-[0_20px_50px_rgba(2,132,199,0.25),0_0_20px_rgba(2,132,199,0.15)] z-10 hover:scale-[1.01] transition-all duration-300"
              style={{
                transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -10}px, 0)`,
                transition: "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)",
              }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover rounded-[inherit]"
              >
                <source src="/Create_a_premium_SaaS_product.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* Full-width Certification Trust Strip at the bottom */}
        <div className="w-full mt-auto pt-4 border-t border-slate-200/35 flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
          <span className="text-[10px] font-black text-[#475569] uppercase tracking-widest leading-none">
            Cascade Tech Credentials:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {[
              { text: "Salesforce Partner", icon: Cloud },
              { text: "Agentforce Specialist", icon: Headset },
              { text: "AI Specialist", icon: Sparkles },
              { text: "Trailhead Ranger", icon: Globe },
              { text: "Multi-Cloud Certified", icon: ShieldCheck }
            ].map((cert) => {
              const Icon = cert.icon;
              return (
                <div
                  key={cert.text}
                  className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-full px-3.5 py-1.5 text-[11px] font-bold text-[#0F172A] shadow-sm hover:border-[#0284C7]/45 hover:text-slate-800 transition-all duration-300 cursor-default"
                >
                  <Icon className="size-3.5 text-[#0284C7]" />
                  <span>{cert.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom CSS animations self-contained inside the variant block */}
        <style>{`
          @keyframes energy-pulse-anim {
            0% {
              stroke-dashoffset: 380;
            }
            100% {
              stroke-dashoffset: -380;
            }
          }
          .energy-line-pulse {
            animation: energy-pulse-anim 6s linear infinite;
          }
          @keyframes glow-pulse {
            0%, 100% {
              filter: drop-shadow(0 0 2px rgba(2, 132, 199, 0.3));
            }
            50% {
              filter: drop-shadow(0 0 10px rgba(2, 132, 199, 0.65));
            }
          }
          .pulse-node-glow {
            animation: glow-pulse 3s ease-in-out infinite;
          }
        `}</style>
      </motion.div>
    );
  }

  if (scene.variant === "final") {
    const statsItems = [
      { value: 50, suffix: "+", label: "Projects Delivered" },
      { value: 8, suffix: "+", label: "Enterprise Clients" },
      { value: 5, suffix: "+", label: "Cities Served" },
      { value: 100, suffix: "%", label: "In-House Delivery" },
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
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Headline Spotlight Glow */}
        <div className="absolute left-[30%] top-[30%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[180px] bg-gradient-to-r from-sky-400/8 to-blue-500/8 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Split Screen Container - Centered and Contained within 1080px to close column gap */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center justify-between w-full h-full relative z-10 max-w-[1080px] mx-auto py-2">
          {/* LEFT COLUMN: Narrative & CTAs (40% width) */}
          <div className="w-full md:w-[40%] flex flex-col justify-center items-start text-left h-full py-2 md:-mt-12">
            <div className="flex flex-col items-start gap-2.5 w-full">
              {/* Kicker Badge */}
              <motion.div
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3.5 py-1 text-xs md:text-sm font-bold tracking-wider text-[#0284C7] w-fit animate-pulse"
              >
                <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
                LET'S BUILD TOGETHER
              </motion.div>

              {/* Headline - Sized and wrapped into two lines */}
              <motion.h2
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-2xl sm:text-3xl md:text-[34px] lg:text-[42px] xl:text-[46px] font-[900] leading-[1.12] tracking-tight text-[#0F172A] font-display max-w-2xl animate-in"
              >
                Let's Build Something That <br className="hidden md:inline" />
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
                  Actually Works.
                  <svg
                    className="absolute -bottom-1.5 left-0 w-full h-[4px]"
                    viewBox="0 0 200 5"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5"
                      stroke="#0EA5E9"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.h2>

              {/* Description - Concise and vertically aligned */}
              <motion.p
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-1 text-xs sm:text-sm md:text-sm lg:text-[14.5px] text-[#475569] font-medium leading-relaxed max-w-2xl"
              >
                Whether you're implementing Salesforce, building AI-powered automation, launching
                digital products, or transforming customer operations — let's discuss what success
                looks like for your business.
              </motion.p>

              {/* CTA Buttons - Premium Schedule A Discovery Call Only */}
              <motion.div
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative flex flex-col items-start gap-2 mt-1.5 w-full"
              >
                {/* Subtle blue glow behind button */}
                <div className="absolute -inset-2 bg-gradient-to-r from-sky-400/20 via-blue-500/20 to-indigo-500/20 blur-xl rounded-full -z-10 pointer-events-none transition-all duration-300" />

                <a
                  href="mailto:info@cascadetechventures.com"
                  className="group relative bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs md:text-base font-extrabold py-4 px-9 rounded-full inline-flex items-center gap-2 shadow-md shadow-sky-500/10 transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(3,105,161,0.25)] overflow-hidden border border-white/10"
                >
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#0EA5E9]/25 to-[#2563EB]/25 blur-md group-hover:blur-lg transition-all duration-300 -z-10 animate-pulse" />
                  <span>Schedule a Discovery Call</span>
                  <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>

                <span className="text-[10px] md:text-[11px] text-slate-400 font-bold leading-normal mt-1 cursor-default">
                  Trusted by Real Estate Developers, Enterprises & Growing Businesses.
                </span>
              </motion.div>
            </div>
          </div>

          {/* RIGHT COLUMN: Premium Contact Drawer Card (57% width) - Centered and Larger */}
          <motion.div
            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: 15 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="w-full md:w-[57%] flex flex-col justify-center h-full py-2 relative md:-mt-6"
          >
            {/* Soft ambient glow behind contact panel */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-sky-400/6 via-blue-500/4 to-indigo-500/6 blur-3xl rounded-[40px] -z-10 pointer-events-none" />

            <div className="premium-glass-card rounded-3xl p-5 md:p-6.5 flex flex-col gap-4 text-left relative overflow-hidden w-full max-w-[620px] mx-auto md:mx-0">
              {/* Subtle animated grid texture (low opacity: 2-4%) */}
              <div className="absolute inset-0 opacity-[0.035] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <pattern
                    id="grid-card-contact-refined-noise"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#000" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid-card-contact-refined-noise)" />
                </svg>
              </div>

              {/* Headline inside card */}
              <div className="border-b border-slate-200/40 pb-2">
                <span className="text-[11px] md:text-[12px] font-extrabold text-[#0284C7] uppercase tracking-widest block">
                  GET IN TOUCH
                </span>
              </div>

              {/* Contact Hub Vertical List (1 column) */}
              <div className="flex flex-col gap-2 mt-1.5 w-full">
                {[
                  {
                    label: "Business Email",
                    icon: Mail,
                    val: "info@cascadetechventures.com",
                    href: "mailto:info@cascadetechventures.com",
                  },
                  {
                    label: "Sales & Consulting",
                    icon: Phone,
                    val: "Sales: +91 91366 36953  |  Support: +91 77385 58929",
                    href: "tel:+919136636953",
                  },
                  {
                    label: "Mumbai Office",
                    icon: MapPin,
                    val: "2/11 Ram Niwas Society, Sakinaka, Mumbai",
                    href: "https://www.google.com/maps/search/?api=1&query=Ram+Niwas+Building+Ahimsa+Marg+Sakinaka+Mumbai",
                  },
                  {
                    label: "Business Hours",
                    icon: Clock,
                    val: "Mon–Fri | 10 AM–6 PM",
                  },
                  {
                    label: "Website",
                    icon: Globe,
                    val: "cascadetechventures.com",
                    href: "https://cascadetechventures.com",
                  },
                  {
                    label: "LinkedIn",
                    icon: Linkedin,
                    val: "Cascade Tech Ventures",
                    href: "https://www.linkedin.com/company/cascadetechventures/?originalSubdomain=in",
                  },
                ].map((chip) => {
                  const Icon = chip.icon;
                  const isLink = !!chip.href;
                  const CardElement = isLink ? "a" : "div";
                  return (
                    <CardElement
                      key={chip.label}
                      {...(isLink ? {
                        href: chip.href,
                        target: "_blank",
                        rel: "noopener noreferrer"
                      } : {})}
                      className={`flex items-center gap-3.5 p-3 min-h-[64px] rounded-2xl premium-glass-card bg-sky-50/50 border border-sky-100/50 shadow-sm transition-all duration-300 ${isLink ? 'premium-glass-card-hover hover:bg-sky-100/40 hover:border-sky-300/60 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(14,165,233,0.06)] group/chip cursor-pointer' : 'cursor-default'}`}
                    >
                      <motion.div 
                        animate={{ scale: [1, 1.03, 1] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="size-[42px] rounded-xl bg-sky-50 flex items-center justify-center border border-sky-100/40 text-[#0EA5E9] flex-shrink-0"
                      >
                        <Icon className="size-5 text-[#0EA5E9]" />
                      </motion.div>
                      
                      <div className="min-w-0 flex-grow">
                        <span className="text-[9.5px] font-bold text-sky-600 uppercase tracking-widest block leading-none mb-1">
                          {chip.label}
                        </span>
                        <span className="text-[13px] font-bold text-slate-700 block leading-tight break-keep whitespace-nowrap overflow-hidden text-ellipsis hover:text-[#0EA5E9] transition-colors">
                          {chip.val}
                        </span>
                      </div>
                    </CardElement>
                  );
                })}
              </div>
            </div>
          </motion.div>
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
            <div
              key={it.title}
              className="glass-panel rounded-2xl p-5 border border-slate-200/50 bg-white/50"
            >
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
            <div
              key={it.title}
              className="glass-panel rounded-2xl p-5 border border-slate-200/50 bg-white/50"
            >
              <it.icon className="size-5 text-primary" />
              <h3 className="mt-3 text-sm md:text-base font-bold text-[#0F172A]">{it.title}</h3>
              {it.body && <p className="mt-1 text-xs text-[#475569] font-medium">{it.body}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (scene.id === 3) {
    return <ProductEcosystemScene />;
  }


  if (scene.id === 7) {
    return <IndustriesShowcase />;
  }

  if (scene.id === 5) {
    const services = [
      {
        id: "crm-implementation",
        title: "CRM Implementation",
        desc: "Sales Cloud, Service Cloud & custom orgs — config, Apex/LWC, migration, training, full lead-to-booking lifecycle.",
        subtitle: "CRM & SALES CLOUD",
        chips: ["Sales Cloud", "Apex", "LWC"],
        gradient: "from-[#00a1e0] to-[#0070d2]",
        bgStyle: { backgroundColor: "rgba(240, 249, 255, 0.45)", borderColor: "rgba(147, 197, 253, 0.3)" },
        iconGradient: "from-[#e0f2fe] to-[#bae6fd] text-[#0369a1]",
        borderColor: "group-hover:border-[#00a1e0]/50",
        customIcon: (
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-2.54-4.5-5-4.5-.42 0-.83.05-1.22.14A7 7 0 0 0 5 12.5a4.5 4.5 0 0 0 2.5 8.5h10" />
            <circle cx="12" cy="15" r="1.5" fill="currentColor" />
            <path d="M12 16.5v2.5" />
            <circle cx="8" cy="18" r="1" fill="currentColor" />
            <circle cx="16" cy="18" r="1" fill="currentColor" />
          </svg>
        ),
        illustration: (
          <svg className="absolute -top-6 -right-6 size-48 text-[#0070d2] pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3" style={{ opacity: 0.11 }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M30 65 C18 65 12 53 22 43 C18 30 35 18 50 25 C60 12 85 14 90 30 C100 30 104 42 98 52 C104 63 92 71 80 69" />
            <circle cx="30" cy="65" r="4" fill="currentColor" />
            <circle cx="50" cy="25" r="4" fill="currentColor" />
            <circle cx="90" cy="30" r="4" fill="currentColor" />
            <circle cx="45" cy="50" r="3" fill="currentColor" />
            <circle cx="65" cy="45" r="3" fill="currentColor" />
            <path d="M30 65 L45 50 L65 45 L90 30" strokeDasharray="3 3" />
            <path d="M50 25 L45 50" strokeDasharray="3 3" />
          </svg>
        )
      },
      {
        id: "marketing-automation",
        title: "Marketing Automation",
        desc: "Marketing Cloud journeys across email, SMS & WhatsApp, with live Meta CAPI ad-attribution integrations.",
        subtitle: "AUTOMATION & FLOWS",
        chips: ["Marketing Cloud", "Meta CAPI", "WhatsApp Flows"],
        gradient: "from-[#0ea5e9] to-[#2563EB]",
        bgStyle: { backgroundColor: "rgba(236, 254, 255, 0.45)", borderColor: "rgba(165, 243, 252, 0.3)" },
        iconGradient: "from-[#cffafe] to-[#a5f3fc] text-[#0891b2]",
        borderColor: "group-hover:border-[#0ea5e9]/50",
        customIcon: (
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
            <path d="m22 9-8.53 5.72a2 2 0 0 1-2.94 0L2 9" />
            <path d="M12 14v5" />
          </svg>
        ),
        illustration: (
          <svg className="absolute -top-6 -right-6 size-48 text-[#0070d2] pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3" style={{ opacity: 0.11 }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="15" y="20" width="40" height="26" rx="4" />
            <path d="M15 20 L35 34 L55 20" />
            <path d="M35 46 C35 65 65 60 65 75" strokeDasharray="4 3" />
            <path d="M62 70 L65 75 L60 77" />
            <rect x="50" y="65" width="38" height="24" rx="6" />
            <path d="M50 78 C50 75 52 73 55 73 H83 C86 73 88 75 88 78 V83" />
            <circle cx="60" cy="77" r="2" fill="currentColor" />
          </svg>
        )
      },
      {
        id: "custom-dev",
        title: "Custom Dev & Integrations",
        desc: "Apex, LWC and REST integrations connecting ERP, payment, and broker portals — middleware-free.",
        subtitle: "CUSTOM CODE & APIS",
        chips: ["REST API", "Apex / LWC", "Integrations"],
        gradient: "from-[#0284c7] to-[#1d4ed8]",
        bgStyle: { backgroundColor: "rgba(239, 246, 255, 0.45)", borderColor: "rgba(191, 219, 254, 0.3)" },
        iconGradient: "from-[#eff6ff] to-[#dbeafe] text-[#1d4ed8]",
        borderColor: "group-hover:border-[#0284c7]/50",
        customIcon: (
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </svg>
        ),
        illustration: (
          <svg className="absolute -top-6 -right-6 size-48 text-[#0070d2] pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3" style={{ opacity: 0.11 }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M25 30 L10 45 L25 60" />
            <path d="M45 60 L60 45 L45 30" />
            <line x1="38" y1="25" x2="32" y2="65" />
            <circle cx="80" cy="45" r="10" />
            <circle cx="80" cy="45" r="3" fill="currentColor" />
            <path d="M60 45 L70 45" />
            <path d="M80 15 L80 35" strokeDasharray="3 3" />
            <path d="M80 55 L80 75" strokeDasharray="3 3" />
            <circle cx="80" cy="15" r="3" fill="currentColor" />
            <circle cx="80" cy="75" r="3" fill="currentColor" />
          </svg>
        )
      },
      {
        id: "proprietary-products",
        title: "Proprietary Products",
        desc: "Deploy Cascade Connect & CX Prism™ — pre-built, tested products that solve gaps Salesforce alone can't.",
        subtitle: "CUSTOM PRODUCT MODULES",
        chips: ["Cascade Connect", "CX Prism™", "Voice AI"],
        gradient: "from-[#3B82F6] to-[#1e40af]",
        bgStyle: { backgroundColor: "rgba(245, 243, 255, 0.45)", borderColor: "rgba(224, 231, 255, 0.3)" },
        iconGradient: "from-[#e0e7ff] to-[#c7d2fe] text-[#4338ca]",
        borderColor: "group-hover:border-[#3B82F6]/50",
        customIcon: (
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22 2 17V7l10-5 10 5v10l-10 5z" />
            <path d="M12 22V12" />
            <path d="m2 7 10 5 10-5" />
            <path d="M17 14.5l-5 2.5-5-2.5" />
          </svg>
        ),
        illustration: (
          <svg className="absolute -top-6 -right-6 size-48 text-[#0070d2] pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3" style={{ opacity: 0.11 }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M50 10 L85 30 L85 70 L50 90 L15 70 L15 30 Z" />
            <path d="M50 10 L50 90" />
            <path d="M15 30 L50 50 L85 30" />
            <path d="M15 70 L50 50" />
            <path d="M85 70 L50 50" />
            <rect x="25" y="42" width="10" height="10" fill="currentColor" opacity="0.3" />
            <rect x="65" y="42" width="10" height="10" fill="currentColor" opacity="0.3" />
            <circle cx="50" cy="30" r="4" fill="currentColor" />
          </svg>
        )
      },
      {
        id: "audit-optimisation",
        title: "Audit & Optimisation",
        desc: "Full org audits of config, automation, data hygiene & adoption, with a prioritised fix-and-grow roadmap.",
        subtitle: "ANALYTICS & DIAGNOSTICS",
        chips: ["Org Audits", "Data Hygiene", "Architecture Map"],
        gradient: "from-[#6366F1] to-[#2563EB]",
        bgStyle: { backgroundColor: "rgba(240, 249, 255, 0.55)", borderColor: "rgba(147, 197, 253, 0.3)" },
        iconGradient: "from-[#e0f2fe] to-[#bfdbfe] text-[#0284c7]",
        borderColor: "group-hover:border-[#6366F1]/50",
        customIcon: (
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
            <circle cx="14" cy="14" r="2" fill="currentColor" />
            <circle cx="10" cy="10" r="2" fill="currentColor" />
          </svg>
        ),
        illustration: (
          <svg className="absolute -top-6 -right-6 size-48 text-[#0070d2] pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3" style={{ opacity: 0.11 }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="10" y="20" width="60" height="45" rx="4" />
            <path d="M10 32 H70" />
            <path d="M20 52 L35 40 L50 48 L65 35" strokeWidth="2" />
            <circle cx="35" cy="40" r="4" fill="currentColor" />
            <circle cx="50" cy="48" r="4" fill="currentColor" />
            <circle cx="55" cy="70" r="16" />
            <line x1="66" y1="81" x2="82" y2="97" strokeWidth="3" />
            <circle cx="55" cy="70" r="6" strokeDasharray="2 2" />
          </svg>
        )
      },
      {
        id: "managed-support",
        title: "Managed Support & AMC",
        desc: "Post go-live AMC: bug fixes, enhancements, user support and quarterly health check-ins.",
        subtitle: "24x7 MONITORING & SUPPORT",
        chips: ["24×7 Support", "AMC Support", "SLAs"],
        gradient: "from-[#0070d2] to-[#1d4ed8]",
        bgStyle: { backgroundColor: "rgba(239, 246, 255, 0.55)", borderColor: "rgba(191, 219, 254, 0.3)" },
        iconGradient: "from-[#eff6ff] to-[#bfdbfe] text-[#2563eb]",
        borderColor: "group-hover:border-[#0070d2]/50",
        customIcon: (
          <svg className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
            <path d="m6 10 3-3 3 3" />
          </svg>
        ),
        illustration: (
          <svg className="absolute -top-6 -right-6 size-48 text-[#0070d2] pointer-events-none transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3" style={{ opacity: 0.11 }} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="15" y="15" width="70" height="50" rx="6" />
            <path d="M15 28 H85" />
            <path d="M25 48 H75" strokeDasharray="2 2" />
            <path d="M20 48 L35 48 L42 35 L50 60 L58 40 L65 48 L80 48" strokeWidth="2" />
            <circle cx="50" cy="60" r="3" fill="currentColor" />
            <circle cx="75" cy="21" r="3" fill="#22C55E" />
          </svg>
        )
      },
    ];

    return (
      <div
        className="pointer-events-auto rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto flex flex-col pt-5 pb-5 px-4 md:px-8 justify-between gap-4 border border-slate-100 shadow-[0_30px_90px_rgba(15,23,42,0.05)] bg-white"
        style={{
          background: "#ffffff",
        }}
      >
        <div
          className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(14,165,233,0.04) 0%, transparent 70%)",
          }}
        />

        <div className="w-full flex flex-col justify-start text-left max-w-3xl relative z-10">
          <div className="text-[10px] md:text-[11px] font-bold tracking-widest text-[#0ea5e9] uppercase mb-1">
            WHAT WE DELIVER
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[38px] font-[900] leading-[1.1] tracking-tight text-[#0F172A] font-display mb-2">
            Our Services
          </h2>
          <p className="text-[13.5px] md:text-[14.5px] text-slate-500 font-semibold leading-relaxed max-w-2xl">
            From strategy to go-live to long-term support — we cover the full Salesforce journey.
          </p>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent opacity-60 relative z-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 w-full max-w-6xl mx-auto items-stretch relative z-10 flex-grow py-0.5">
          {services.map((ser) => {
            return (
              <div
                key={ser.id}
                className={`group relative rounded-[24px] overflow-hidden flex flex-col justify-between p-4 md:p-4.5 transition-all duration-300 hover:-translate-y-1 cursor-pointer border backdrop-blur-md hover:bg-white/95 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.08)] hover:shadow-[0_0_30px_rgba(0,112,210,0.25),_0_20px_40px_-15px_rgba(0,112,210,0.15)] ${ser.borderColor}`}
                style={{
                  ...ser.bgStyle
                }}
              >
                <div className={`absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r ${ser.gradient} opacity-70 group-hover:opacity-100 group-hover:h-[5px] transition-all duration-300`} />

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, transparent 70%)"
                  }}
                />

                {ser.illustration}

                <div className="flex flex-col gap-2 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className={`size-10 rounded-xl bg-gradient-to-br ${ser.iconGradient} flex items-center justify-center shadow-[0_4px_12px_rgba(37,99,235,0.08)] group-hover:scale-110 transition-transform duration-300`}>
                      {ser.customIcon}
                    </div>
                    <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">{ser.subtitle}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-[13.5px] md:text-[14px] lg:text-[15px] font-extrabold text-slate-900 leading-tight tracking-tight">
                      {ser.title}
                    </h3>
                    <p className="text-[11.5px] md:text-[12px] lg:text-[12.5px] leading-relaxed text-slate-500 font-semibold line-clamp-2">
                      {ser.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {ser.chips.map((chip, idx) => (
                      <span
                        key={idx}
                        className="text-[9px] font-bold text-slate-500 bg-[#F1F5F9] border border-slate-200/50 rounded-full px-2.5 py-0.5"
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.id === 8) {
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
        <div
          className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)",
          }}
        />

        {/* TOP ROW: Title & Kicker + Description */}
        <div className="w-full flex flex-col justify-start text-left max-w-4xl relative z-10 shrink-0 mt-1">
          <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold tracking-wider text-[#0284C7] w-fit mb-1.5">
            <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
            WHY CASCADE TECH
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[40px] xl:text-[48px] 2xl:text-[56px] font-[900] leading-[1.05] tracking-tight text-[#0F172A] font-display">
            Why Developers & Enterprises{" "}
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
              Choose Cascade Tech
              <svg
                className="absolute -bottom-0.5 left-0 w-full h-[5px]"
                viewBox="0 0 200 5"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5"
                  stroke="#0EA5E9"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>

          <p className="text-[12px] md:text-[14px] lg:text-[15.5px] text-slate-500 font-semibold leading-relaxed mt-2.5 max-w-3xl">
            We combine Salesforce expertise, AI innovation, product thinking and real-world
            industry execution to deliver measurable business outcomes.
          </p>
        </div>

        {/* Divider 1 */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200/80 to-transparent opacity-60 my-0 relative z-10" />

        {/* MIDDLE ROW: 4 Normal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-[1280px] mx-auto items-stretch relative z-10">
          {reasons
            .filter((r) => !r.isLarge)
            .map((r) => {
              const IconComp = r.icon;

              return (
                <div
                  key={r.id}
                  className="premium-glass-card premium-glass-card-hover rounded-[20px] p-3.5 md:p-4 flex flex-col justify-start text-left relative overflow-hidden group w-full min-h-[160px] md:min-h-[190px]"
                >
                  {/* Permanent subtle background glows */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9]/5 via-[#2563EB]/2 to-transparent rounded-[20px] pointer-events-none -z-10" />
                  <div className="absolute -inset-px bg-gradient-to-br from-[#0EA5E9]/10 via-transparent to-[#2563EB]/5 rounded-[20px] pointer-events-none -z-20" />

                  {/* Hover blue glow reflection */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#0EA5E9]/12 via-[#2563EB]/6 to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10 pointer-events-none" />

                  {/* Header Row: Icon + Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-[40px] h-[40px] md:w-[46px] md:h-[46px] flex items-center justify-center rounded-full border shadow-sm group-hover:scale-105 transition-all duration-300 flex-shrink-0 bg-[#F0F9FF] border-[#E0F2FE]/50 text-[#0EA5E9] shadow-[0_4px_12px_rgba(14,165,233,0.06)] group-hover:shadow-[0_8px_24px_rgba(14,165,233,0.1)]">
                      <IconComp className="w-5 h-5 md:w-5.5 md:h-5.5 text-[#0EA5E9]" />
                    </div>
                    <div>
                      <h3 className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-[900] text-[#0F172A] leading-tight tracking-tight">
                        {r.title}
                      </h3>
                      {/* Horizontal accent line */}
                      <div className="w-8 h-[2px] bg-[#0EA5E9] rounded-full mt-1 transition-all duration-300 group-hover:w-12" />
                    </div>
                  </div>

                  <p className="text-[12px] md:text-[13px] lg:text-[14px] leading-relaxed text-slate-500 font-semibold line-clamp-3 md:line-clamp-4">
                    {r.desc}
                  </p>
                </div>
              );
            })}
        </div>

        {/* BOTTOM ROW: 2 Featured Cards (1.5x wider, centered) */}
        <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-[1280px] mx-auto items-stretch relative z-10 mt-1">
          {reasons
            .filter((r) => r.isLarge)
            .map((r) => {
              const IconComp = r.icon;

              return (
                <div
                  key={r.id}
                  className="premium-glass-card premium-glass-card-hover rounded-[20px] p-3.5 md:p-4 flex flex-col justify-start text-left relative overflow-hidden group w-full md:w-[36%] flex-shrink-0 min-h-[160px] md:min-h-[190px]"
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

                  {/* Header Row: Icon + Title */}
                  <div className="flex items-center gap-3 mb-2.5">
                    <div className="w-[40px] h-[40px] md:w-[46px] md:h-[46px] flex items-center justify-center rounded-full border shadow-sm group-hover:scale-105 transition-all duration-300 flex-shrink-0 bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] border-[#0EA5E9]/20 text-white shadow-[0_8px_20px_rgba(14,165,233,0.2)] group-hover:shadow-[0_12px_28px_rgba(14,165,233,0.3)]">
                      <IconComp className="w-5 h-5 md:w-5.5 md:h-5.5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[13px] sm:text-[15px] md:text-[16px] lg:text-[18px] font-[900] text-[#0F172A] leading-tight tracking-tight">
                        {r.title}
                      </h3>
                      {/* Horizontal accent line */}
                      <div className="w-12 h-[2px] bg-[#2563EB] rounded-full mt-1 transition-all duration-300 group-hover:w-20" />
                    </div>
                  </div>

                  <p className="text-[12px] md:text-[13px] lg:text-[14px] leading-relaxed text-slate-500 font-semibold line-clamp-3 md:line-clamp-4">
                    {r.desc}
                  </p>
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
      "ASHWIN SHETH",
    ];

    return (
      <div
        className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-4.5 pb-4 px-4 md:px-8 justify-between border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
        style={{
          background: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(24px)",
          backgroundImage: "radial-gradient(circle, rgba(14,165,233,0.03) 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float-dot-1 {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-6px) scale(1.08); }
            }
            @keyframes float-dot-2 {
              0%, 100% { transform: translateY(0px) scale(1.08); }
              50% { transform: translateY(6px) scale(0.96); }
            }
            .animate-float-dot-1 { animation: float-dot-1 7s ease-in-out infinite; }
            .animate-float-dot-2 { animation: float-dot-2 9s ease-in-out infinite; }
          `
        }} />

        {/* Decorative corner glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full blur-3xl pointer-events-none -z-10 bg-blue-400/6 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[250px] h-[250px] rounded-full blur-3xl pointer-events-none -z-10 bg-sky-400/6 animate-pulse" />

        {/* Soft radial blue glow behind the heading */}
        <div
          className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(0,161,224,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Floating gradient dots */}
        <div className="absolute top-12 left-16 size-3 rounded-full bg-gradient-to-br from-blue-400/20 to-sky-500/20 blur-[0.5px] pointer-events-none animate-float-dot-1" />
        <div className="absolute bottom-20 left-24 size-4 rounded-full bg-gradient-to-br from-sky-300/25 to-blue-400/15 blur-[0.5px] pointer-events-none animate-float-dot-2" />
        <div className="absolute top-1/3 right-16 size-2.5 rounded-full bg-gradient-to-br from-indigo-300/20 to-blue-400/20 blur-[1px] pointer-events-none animate-float-dot-1" />

        {/* Very subtle corner geometric wireframe elements */}
        <svg className="absolute inset-0 size-full pointer-events-none opacity-15 -z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          <circle cx="8" cy="18" r="0.4" fill="#0284c7" />
          <circle cx="92" cy="82" r="0.4" fill="#0284c7" />
          <rect x="4" y="12" width="6" height="6" stroke="#0284c7" strokeWidth="0.06" fill="none" strokeDasharray="0.5 0.5" />
          <rect x="90" y="76" width="6" height="6" stroke="#0284c7" strokeWidth="0.06" fill="none" strokeDasharray="0.5 0.5" />
        </svg>

        {/* MAIN CONTAINER LAYOUT */}
        <div className="flex flex-col items-center justify-between w-full h-full relative z-10 max-w-[96%] mx-auto py-1 gap-3.5">

          {/* TOP: Centered Heading Block */}
          <div className="w-full flex flex-col items-center text-center max-w-3xl relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE]/80 rounded-full px-3 py-0.5 text-[10px] md:text-[11px] font-bold tracking-wider text-[#0284C7] w-fit mb-2">
              <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
              CLIENTS
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-[26px] lg:text-[32px] xl:text-[36px] font-[900] leading-[1.1] tracking-tight text-[#0F172A] font-display mb-1.5">
              Organizations That{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#0EA5E9] to-[#2563EB]">
                Trust Cascade Tech
                <svg
                  className="absolute -bottom-0.5 left-0 w-full h-[4px]"
                  viewBox="0 0 200 5"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5"
                    stroke="#0EA5E9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="text-[13px] md:text-[14px] text-slate-500 font-semibold leading-relaxed max-w-2xl">
              From Mumbai's leading real estate developers to growing enterprise organizations,
              Cascade Tech powers Salesforce, AI and automation initiatives across multiple industries.
            </p>
          </div>

          {/* Thin Glowing Divider */}
          <div className="w-3/5 max-w-2xl h-[1px] bg-gradient-to-r from-transparent via-[#00a1e0]/80 to-transparent relative z-10 mx-auto shadow-[0_0_8px_rgba(0,161,224,0.4)]" />

          {/* MIDDLE: Logo Grid with Center alignment and tighter spacing */}
          <div className="w-full max-w-5xl md:max-w-6xl px-4 md:px-6 -mt-3.5 md:-mt-5.5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-5 md:gap-x-6 gap-y-6 md:gap-y-7.5 justify-center items-center">
              {clients.map((clientName, index) => (
                <ClientCard key={index} clientName={clientName} isFeatured={index === 0} />
              ))}
            </div>

            {/* Grid Caption */}
            <span className="text-[8px] md:text-[9px] text-slate-400 italic mt-2.5 text-center block">
              Client names shown for reference — official logos applied at brand kit handover.
            </span>
          </div>

          {/* BOTTOM: Unified horizontal glass panel containing statistics */}
          <div className="w-full max-w-2xl px-4 mt-0.5">
            <div className="flex items-center justify-center gap-2 border border-blue-200/30 bg-gradient-to-r from-white/95 via-[#F0F9FF]/90 to-white/95 shadow-[0_4px_20px_rgba(0,112,210,0.05),_inset_0_0_12px_rgba(255,255,255,0.7)] backdrop-blur-md rounded-2xl py-2 px-5 max-w-md mx-auto relative z-10">
              <div className="flex items-center justify-between w-full px-2">
                <div className="text-center flex-1">
                  <span className="text-lg md:text-xl xl:text-2xl font-[950] text-[#0070d2] leading-none tracking-tight block">8+</span>
                  <span className="text-[9px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider block">Clients Served</span>
                </div>
                <div className="w-[1px] h-7 bg-gradient-to-b from-transparent via-blue-200 to-transparent mx-2" />
                <div className="text-center flex-1">
                  <span className="text-lg md:text-xl xl:text-2xl font-[950] text-[#0070d2] leading-none tracking-tight block">5</span>
                  <span className="text-[9px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider block">Cities</span>
                </div>
                <div className="w-[1px] h-7 bg-gradient-to-b from-transparent via-blue-200 to-transparent mx-2" />
                <div className="text-center flex-1">
                  <span className="text-lg md:text-xl xl:text-2xl font-[950] text-[#0070d2] leading-none tracking-tight block">5</span>
                  <span className="text-[9px] font-bold text-slate-500 mt-0.5 uppercase tracking-wider block">Industries</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Glow reflection element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
      </div>
    );
  }

  if (scene.id === 10) {
    return <CaseStudiesScene scene={scene} />;
  }

  if (scene.id === 14) {
    return <ProductTemplateCard productKey="cascade-connect" />;
  }

  if (scene.id === 15) {
    return <ProductTemplateCard productKey="cx-prism" />;
  }

  if (scene.id === 16) {
    return <ProductTemplateCard productKey="caseflow" />;
  }

  if (scene.id === 17) {
    return <ProductTemplateCard productKey="nexora" />;
  }


  if (scene.id === 4) {
    return (
      <div
        className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col pt-6 pb-4 px-6 md:px-10 gap-5"
        style={{
          background: "radial-gradient(ellipse at 60% 0%, rgba(0,119,182,0.07) 0%, transparent 55%), radial-gradient(ellipse at 10% 100%, rgba(59,169,245,0.05) 0%, transparent 50%), rgba(247,250,253,0.98)",
          backdropFilter: "blur(28px)",
          boxShadow: "0 32px 80px rgba(0,90,160,0.10), 0 2px 0 rgba(255,255,255,0.8) inset",
        }}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes cred-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
          @keyframes cred-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
          @keyframes cred-spin-rev { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
          @keyframes cred-particle { 0%{opacity:0;transform:scale(0.5) translateY(0)} 40%{opacity:1;transform:scale(1) translateY(-10px)} 80%{opacity:0.6;transform:scale(0.8) translateY(-22px)} 100%{opacity:0;transform:scale(0.3) translateY(-34px)} }
          @keyframes cred-pulse-ring { 0%{r:46;opacity:0.5} 100%{r:70;opacity:0} }
          .cred-float { animation: cred-float 3.5s ease-in-out infinite; }
          .cred-float-2 { animation: cred-float 4.2s ease-in-out infinite; animation-delay:1s; }
          .cred-orbit1 { animation: cred-spin-slow 14s linear infinite; transform-origin: 100px 100px; }
          .cred-orbit2 { animation: cred-spin-rev 20s linear infinite; transform-origin: 100px 100px; }
          .cred-p1 { animation: cred-particle 3s ease-in-out infinite; }
          .cred-p2 { animation: cred-particle 4s ease-in-out infinite; animation-delay:1.2s; }
          .cred-p3 { animation: cred-particle 3.5s ease-in-out infinite; animation-delay:2.2s; }
          .cred-pulse { animation: cred-pulse-ring 2.8s ease-out infinite; }
          .cred-badge { transition: all 0.25s ease; }
          .cred-badge:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,119,182,0.18); }
        ` }} />

        {/* Ambient orbs */}
        <div className="absolute -right-24 -top-24 w-[420px] h-[420px] rounded-full pointer-events-none -z-10"
          style={{ background: "radial-gradient(circle, rgba(0,119,182,0.08) 0%, transparent 68%)" }} />
        <div className="absolute -left-20 bottom-0 w-[340px] h-[340px] rounded-full pointer-events-none -z-10"
          style={{ background: "radial-gradient(circle, rgba(59,169,245,0.06) 0%, transparent 68%)" }} />
        <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#0077B6 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

        {/* ── HEADER ── */}
        <div className="flex flex-col items-center text-center flex-shrink-0 gap-2 z-10">
          <div className="inline-flex items-center gap-2 bg-[#EFF8FF] border border-[#BFDBFE]/80 rounded-full px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] text-[#0077B6] w-fit shadow-[0_2px_8px_rgba(0,119,182,0.10)]">
            <span className="size-1.5 rounded-full bg-[#0077B6] animate-pulse" />
            CREDENTIALS
          </div>
          <h2 className="text-[28px] sm:text-[34px] font-[900] leading-[1.1] tracking-tight text-[#0A1628]">
            Our Salesforce{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066A0] via-[#0077B6] to-[#3BA9F5]">
              Credentials
            </span>
          </h2>
          <p className="text-[14px] text-slate-500 font-medium max-w-xl">
            Before you evaluate us — here is what qualifies us.
          </p>
        </div>

        {/* ── BODY: Illustration + Two Cards ── */}
        <div className="flex-1 min-h-0 z-10 grid grid-cols-[220px_1fr_1fr] gap-5 w-full">

          {/* LEFT: 3D Certification Shield */}
          <div className="flex flex-col items-center justify-center relative select-none">
            <svg width="210" height="230" viewBox="0 0 210 230" xmlns="http://www.w3.org/2000/svg" className="cred-float" style={{ filter: "drop-shadow(0 16px 40px rgba(0,119,182,0.28))" }}>
              <defs>
                <linearGradient id="sh-body" x1="0" y1="0" x2="0.4" y2="1">
                  <stop offset="0%" stopColor="#005B99" /><stop offset="45%" stopColor="#0077B6" /><stop offset="100%" stopColor="#0099D4" />
                </linearGradient>
                <linearGradient id="sh-shine" x1="0" y1="0" x2="0.55" y2="0.6">
                  <stop offset="0%" stopColor="white" stopOpacity="0.38" /><stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="sh-holo" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.18" /><stop offset="35%" stopColor="#A78BFA" stopOpacity="0.10" /><stop offset="65%" stopColor="#34D399" stopOpacity="0.08" /><stop offset="100%" stopColor="#F472B6" stopOpacity="0.06" />
                </linearGradient>
                <radialGradient id="sh-halo" cx="50%" cy="55%" r="50%">
                  <stop offset="0%" stopColor="#3BA9F5" stopOpacity="0.28" /><stop offset="100%" stopColor="#0077B6" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="sh-rim" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.7" /><stop offset="50%" stopColor="#0077B6" stopOpacity="0.3" /><stop offset="100%" stopColor="#38BDF8" stopOpacity="0.6" />
                </linearGradient>
                <filter id="sh-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="sh-shadow" x="-20%" y="-10%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0055A5" floodOpacity="0.38" />
                </filter>
              </defs>
              <ellipse cx="105" cy="132" rx="78" ry="88" fill="url(#sh-halo)" />
              <path d="M105 14 L178 42 L178 108 C178 152 105 188 105 188 C105 188 32 152 32 108 L32 42 Z" fill="#002F5C" opacity="0.30" transform="translate(0,6)" filter="url(#sh-shadow)" />
              <path d="M105 14 L178 42 L178 108 C178 152 105 188 105 188 C105 188 32 152 32 108 L32 42 Z" fill="url(#sh-body)" filter="url(#sh-shadow)" />
              <path d="M105 14 L178 42 L178 108 C178 152 105 188 105 188 C105 188 32 152 32 108 L32 42 Z" fill="url(#sh-holo)" />
              <path d="M105 14 L178 42 L178 108 C178 152 105 188 105 188 C105 188 32 152 32 108 L32 42 Z" fill="url(#sh-shine)" />
              <path d="M105 14 L178 42 L178 108 C178 152 105 188 105 188 C105 188 32 152 32 108 L32 42 Z" fill="none" stroke="url(#sh-rim)" strokeWidth="1.8" />
              <path d="M105 24 L170 49 L170 108 C170 146 105 178 105 178 C105 178 40 146 40 108 L40 49 Z" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
              <g filter="url(#sh-glow)">
                <path d="M105 72 C98 72 92 77 91.5 84 C89 84 86 86.5 86 90 C86 93.5 89 96 92 96 L118 96 C121 96 124 93.5 124 90 C124 86.5 121 84 118.5 84 C118 77 112 72 105 72Z" fill="white" opacity="0.95" />
              </g>
              <g filter="url(#sh-glow)">
                <circle cx="105" cy="115" r="12" fill="white" opacity="0.13" />
                <path d="M105 107l2 5.8h6.2l-5 3.6 1.9 5.8-5.1-3.7-5.1 3.7 1.9-5.8-5-3.6h6.2z" fill="white" opacity="0.90" />
              </g>
              <line x1="68" y1="137" x2="142" y2="137" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
              <text x="105" y="152" fontSize="8.5" fontWeight="900" fill="white" textAnchor="middle" opacity="0.85" letterSpacing="2">CERTIFIED</text>
              <text x="105" y="163" fontSize="6.5" fontWeight="600" fill="rgba(255,255,255,0.6)" textAnchor="middle" letterSpacing="1">SALESFORCE</text>
              <g className="cred-p1" filter="url(#sh-glow)">
                <rect x="12" y="50" width="30" height="30" rx="9" fill="rgba(255,255,255,0.92)" stroke="rgba(0,119,182,0.22)" strokeWidth="1" />
                <circle cx="27" cy="65" r="8" fill="url(#sh-body)" opacity="0.9" />
                <path d="M22.5 65l3 3 6-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
              <g className="cred-p2" filter="url(#sh-glow)">
                <rect x="168" y="46" width="30" height="30" rx="9" fill="rgba(255,255,255,0.92)" stroke="rgba(0,119,182,0.22)" strokeWidth="1" />
                <circle cx="183" cy="61" r="8" fill="url(#sh-body)" opacity="0.9" />
                <path d="M178.5 61l3 3 6-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
              <g className="cred-p3" filter="url(#sh-glow)">
                <rect x="6" y="126" width="28" height="28" rx="8" fill="rgba(255,255,255,0.88)" stroke="rgba(0,119,182,0.18)" strokeWidth="1" />
                <circle cx="20" cy="140" r="7" fill="url(#sh-body)" opacity="0.85" />
                <path d="M16 140l2.8 2.8 5.4-5.4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
              <g className="cred-p1" filter="url(#sh-glow)" style={{ animationDelay: "1.6s" }}>
                <rect x="176" y="120" width="28" height="28" rx="8" fill="rgba(255,255,255,0.88)" stroke="rgba(0,119,182,0.18)" strokeWidth="1" />
                <circle cx="190" cy="134" r="7" fill="url(#sh-body)" opacity="0.85" />
                <path d="M186 134l2.8 2.8 5.4-5.4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
              <circle cx="52" cy="22" r="3" fill="#38BDF8" opacity="0.7" className="cred-p2" filter="url(#sh-glow)" />
              <circle cx="162" cy="18" r="2.5" fill="#7DD3FC" opacity="0.6" className="cred-p3" filter="url(#sh-glow)" />
              <circle cx="28" cy="98" r="2" fill="#0EA5E9" opacity="0.55" className="cred-p1" filter="url(#sh-glow)" />
              <circle cx="184" cy="92" r="2.5" fill="#3BA9F5" opacity="0.6" className="cred-p2" filter="url(#sh-glow)" />
            </svg>
            <div className="mt-3 flex flex-col items-center gap-1.5">
              <div className="px-4 py-1.5 rounded-full text-[11px] font-bold text-[#0055A5] tracking-wide"
                style={{ background: "linear-gradient(135deg,rgba(224,242,254,0.9),rgba(186,230,253,0.6))", border: "1px solid rgba(125,211,252,0.5)", boxShadow: "0 2px 8px rgba(0,119,182,0.12)" }}>
                ✦ Salesforce Certified
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-semibold text-[#0077B6]"
                style={{ background: "rgba(240,249,255,0.7)", border: "1px solid rgba(186,230,253,0.4)" }}>
                Partner Since 2022
              </div>
            </div>
          </div>

          {/* CENTER CARD: Company Credentials */}
          <div className="relative rounded-[22px] p-5 flex flex-col gap-4 overflow-hidden"
            style={{
              background: "radial-gradient(ellipse at 20% 0%, rgba(0,119,182,0.14) 0%, rgba(224,242,254,0.80) 100%)",
              border: "1px solid rgba(0,119,182,0.22)",
              boxShadow: "0 6px 28px rgba(0,90,160,0.10), 0 1px 0 rgba(255,255,255,0.75) inset",
            }}>
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            {/* Card header */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 50%, #38BDF8 100%)", boxShadow: "0 6px 18px rgba(0,119,182,0.22), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                <svg viewBox="0 0 24 24" className="w-5.5 h-5.5" fill="none">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="white" opacity="0.9" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-[900] text-[#0A1628] leading-tight">Company-Level</h3>
                <p className="text-[11px] text-[#0077B6] font-semibold mt-0.5">Verified partner credentials</p>
              </div>
            </div>

            {/* Credential badges */}
            <div className="flex flex-col gap-2.5 flex-1">
              {[
                { icon: "🏅", label: "Salesforce Registered Partner", sub: "Official partner network member" },
                { icon: "🌐", label: "Active Partner Community Member", sub: "AppExchange ecosystem" },
                { icon: "⭐", label: "AppExchange Listed · 5-Star Rating", sub: "Verified customer reviews" },
                { icon: "🎓", label: "Trailhead Ranger & Superbadges", sub: "Team-wide Trailhead achievements" },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="cred-badge flex items-center gap-3 rounded-[14px] px-3.5 py-2.5 cursor-default"
                  style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(240,249,255,0.75) 100%)", border: "1px solid rgba(125,211,252,0.4)", boxShadow: "0 2px 10px rgba(0,119,182,0.07), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                  {/* Checkmark circle */}
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#0077B6,#3BA9F5)", boxShadow: "0 3px 10px rgba(0,119,182,0.30)" }}>
                    <svg viewBox="0 0 16 16" className="w-3.5 h-3.5"><path d="M3 8l3.5 3.5 6.5-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11.5px] font-[800] text-[#0A1628] leading-tight">{label}</div>
                    <div className="text-[10px] text-[#64748B] font-medium mt-0.5">{sub}</div>
                  </div>
                  <span className="text-[15px] flex-shrink-0">{icon}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CARD: Team Certifications */}
          <div className="relative rounded-[22px] p-5 flex flex-col gap-4 overflow-hidden"
            style={{
              background: "radial-gradient(ellipse at 80% 0%, rgba(59,169,245,0.14) 0%, rgba(224,242,254,0.80) 100%)",
              border: "1px solid rgba(0,119,182,0.22)",
              boxShadow: "0 6px 28px rgba(0,90,160,0.10), 0 1px 0 rgba(255,255,255,0.75) inset",
            }}>
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            {/* Card header */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #BAE6FD 0%, #7DD3FC 50%, #38BDF8 100%)", boxShadow: "0 6px 18px rgba(0,119,182,0.22), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.7" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-[17px] font-[900] text-[#0A1628] leading-tight">Team Certifications</h3>
                <p className="text-[11px] text-[#0077B6] font-semibold mt-0.5">Individual Salesforce credentials</p>
              </div>
            </div>

            {/* Cert badge grid */}
            <div className="grid grid-cols-2 gap-2 flex-1">
              {[
                { label: "Technical Architect", tier: "Architect" },
                { label: "AI Specialist", tier: "AI" },
                { label: "Agentforce Specialist", tier: "Agent" },
                { label: "Data Cloud Consultant", tier: "Data" },
                { label: "Sales Cloud Consultant", tier: "Sales" },
                { label: "Marketing Cloud", tier: "Marketing" },
                { label: "Service Cloud Consultant", tier: "Service" },
                { label: "Platform Developer", tier: "Dev" },
                { label: "Platform Administrator", tier: "Admin" },
              ].map(({ label, tier }) => (
                <div key={label} className="cred-badge flex items-center gap-2 rounded-[12px] px-3 py-2 cursor-default"
                  style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.85) 0%,rgba(240,249,255,0.75) 100%)", border: "1px solid rgba(125,211,252,0.4)", boxShadow: "0 2px 8px rgba(0,119,182,0.06), 0 1px 0 rgba(255,255,255,0.8) inset" }}>
                  {/* Mini cert medallion */}
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[8px] font-[900] text-white"
                    style={{ background: "linear-gradient(135deg,#0077B6,#3BA9F5)", boxShadow: "0 2px 8px rgba(0,119,182,0.28)" }}>
                    {tier.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-[10.5px] font-[700] text-[#0A1628] leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TRUST STRIP ── */}
        <div className="flex-shrink-0 z-10 rounded-[16px] px-6 py-3 flex items-center justify-between gap-4"
          style={{ background: "linear-gradient(135deg, rgba(0,119,182,0.10) 0%, rgba(59,169,245,0.07) 100%)", border: "1px solid rgba(0,119,182,0.18)", boxShadow: "0 2px 10px rgba(0,119,182,0.07)" }}>
          {[
            { value: "Salesforce Partner", label: "Official Program", dot: "#0077B6" },
            { value: "AppExchange", label: "5-Star Listed", dot: "#F59E0B" },
            { value: "9 Certs", label: "Across the team", dot: "#10B981" },
            { value: "100%", label: "On-time delivery", dot: "#3BA9F5" },
          ].map(({ value, label, dot }) => (
            <div key={value} className="flex items-center gap-3 flex-1 justify-center">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />
              <div className="flex flex-col">
                <span className="text-[13px] font-[900] text-[#0A1628] leading-tight">{value}</span>
                <span className="text-[10px] text-[#64748B] font-medium">{label}</span>
              </div>
            </div>
          ))}
          <div className="h-8 w-[1px] bg-[#BAE6FD]/60 hidden md:block" />
          <p className="text-[11px] text-[#475569] font-medium leading-snug max-w-[260px] text-center hidden lg:block">
            Our team collectively holds certifications across Sales, Marketing, Platform, and Service tracks.
          </p>
        </div>

        {/* Bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-6px_30px_rgba(116,203,244,0.9)] opacity-90 rounded-full pointer-events-none" />
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
              <p className="mt-1 text-xs leading-relaxed text-[#475569] font-medium">{it.body}</p>
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

interface ProductTemplateCardProps {
  productKey: string;
}

function ProductTemplateCard({ productKey }: ProductTemplateCardProps) {
  const productData: Record<string, {
    logo: string;
    title: string;
    tagline: string;
    problem: string;
    does: string;
    builtFor: string;
    architecture: string;
    pricing: string;
    liveWith: string;
    capabilities: string[];
  }> = {
    "cascade-connect": {
      logo: "/clients/casecadeconnect.png",
      title: "Cascade Connect",
      tagline: "Omnichannel Communication, Inside Salesforce",
      problem: "Customer conversations are scattered across WhatsApp, email and calls, leaving no unified CRM visibility or management oversight.",
      does: "Unifies WhatsApp, Email and SMS inside Salesforce with automatic activity logging and a real-time customer communication timeline.",
      builtFor: "Sales Teams\nMarketing Teams\nCRM Managers",
      architecture: "Salesforce Native\nOfficial WhatsApp API\nNo Middleware",
      pricing: "One-time License\nAMC Support\nNo Per-message Charges",
      liveWith: "Kohinoor Group\nRaunak Group\nNaiknavare",
      capabilities: [
        "WhatsApp Business API Integration",
        "Bulk Personalized Messaging",
        "Smart Conversation Routing",
        "Compliance & Audit Logs",
        "Workflow-based Follow-ups",
        "Delivery & Read Receipt Tracking"
      ]
    },
    "cx-prism": {
      logo: "/clients/cxprism.png",
      title: "CX Prism",
      tagline: "Converting Customer Feedback Into Revenue Intelligence",
      problem: "Most developers send an NPS survey after possession and file it in a spreadsheet no one reads. The detractor about to post a bad review, or the customer quietly unhappy about delays, stays invisible until it's too late.",
      does: "CX Prism™ is an AI-powered CX intelligence platform built natively in Salesforce. It collects NPS and open-text feedback, runs AI emotion and theme analysis, scores churn probability per account, and surfaces revenue-risk alerts — without any data leaving your org.",
      builtFor: "CRM heads, CX managers, project directors, leadership",
      architecture: "100% native Salesforce · Apex, Flow & Einstein AI",
      pricing: "One-time fee · no recurring AI or per-response cost",
      liveWith: "Kohinoor Group",
      capabilities: [
        "NPS automation triggered by booking, possession or milestone events",
        "AI open-text analysis — keyword extraction, emotion & negative-theme detection",
        "Detractor auto-flagging with escalation to the relevant manager",
        "Health-band classification — Green / Amber / Red — per account",
        "Churn scoring across Opportunity, Account and Contact data",
        "Revenue-risk dashboard by project, manager and segment",
        "AI-generated management summaries — no manual data crunching"
      ]
    },
    "caseflow": {
      logo: "/clients/caseflow.png",
      title: "CaseFlow",
      tagline: "Email-to-Case & Customer Ticketing Automation",
      problem: "Customer issues arrive in emails from multiple inboxes but get lost, delayed or misassigned. Without a unified system, agents waste time, SLAs get missed and customers experience inconsistent service.",
      does: "CaseFlow automatically converts customer emails into trackable cases (tickets) inside Salesforce. It routes them to the right team or agent, enforces SLAs, enables seamless collaboration and gives managers complete real-time visibility across the entire case lifecycle.",
      builtFor: "Customer support teams; IT helpdesk; operations; service departments",
      architecture: "Salesforce-native, official APIs — no middleware",
      pricing: "One-time fee + AMC · no per-message markup",
      liveWith: "Naiknavare",
      capabilities: [
        "Email-to-Case automation — capture, create & log cases instantly in Salesforce",
        "Smart routing & assignment — by rules, skills, queues or round-robin",
        "Multi-channel support — email, reply tracking and full conversation history",
        "SLA & escalation management — never miss a committed response",
        "Rich case collaboration — @mentions, internal notes and team updates",
        "Real-time dashboards & reports — case aging, SLA status, agent performance",
        "Custom fields & workflows — designed to fit your business processes"
      ]
    },
    "nexora": {
      logo: "/clients/nexora.png",
      title: "Nexora",
      tagline: "Empowering Sourcing Teams to Manage Partners, Activities & Growth Intelligence",
      problem: "Sourcing teams manage multiple channel partners, daily meetings, field visits, follow-ups, and relationship activities across different platforms. Without a centralized sourcing management system, teams struggle with missed follow-ups, untracked meetings, incomplete activity visibility, and lack of insights into sourcing manager productivity.",
      does: "The platform provides real-time visibility into sourcing operations, automates follow-ups, and helps leadership improve sourcing efficiency through structured workflows and actionable insights.",
      builtFor: "Sourcing Managers, Channel Partner Teams, Sales Heads, CRM Heads, Operations leader,",
      architecture: "100% native Salesforce · Apex · Flow · Lightning Web Components · Reports",
      pricing: "Flexible licensing model · One-time implementation + customized-pricing",
      liveWith: "Nandivardhan · Raunak",
      capabilities: [
        "Smart Sourcing Activity Management",
        "Partner 360° View",
        "Location-Based Field Tracking",
        "Channel Partner (CP) Management",
        "Partner Onboarding Journey",
        "Task & Follow-Up Automation",
        "Communication History Tracking"
      ]
    }
  };

  const placeholders = productData[productKey] || {
    logo: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23EFF8FF' rx='20'/><circle cx='50' cy='50' r='20' fill='%230077B6' opacity='0.2'/></svg>",
    title: "Product Title Placeholder",
    tagline: "Product tagline placeholder",
    problem: "Problem details placeholder",
    does: "What it does details placeholder",
    builtFor: "Built For",
    architecture: "Architecture",
    pricing: "Pricing",
    liveWith: "Live With",
    capabilities: ["Capability 1", "Capability 2", "Capability 3"]
  };

  return (
    <div
      className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-hidden flex flex-col pt-5 pb-4 px-6 md:px-10 gap-4 border border-white/30"
      style={{
        background: "radial-gradient(ellipse at 50% 0%, rgba(0,119,182,0.06) 0%, transparent 60%), rgba(247,250,253,0.98)",
        backdropFilter: "blur(28px)",
        boxShadow: "0 32px 80px rgba(0,90,160,0.10), 0 2px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,119,182,0.08) inset",
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes subtlePulse { 0%,100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.03); opacity: 1; } }
        .glass-card-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .glass-card-hover:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 16px 45px rgba(37,99,235,0.12), 0 4px 12px rgba(37,99,235,0.06) !important;
          border-color: rgba(59,130,246,0.30) !important;
          background: linear-gradient(135deg, #FFFFFF 0%, #F5F9FF 100%) !important;
        }
        .spec-tile-hover { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .spec-tile-hover:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 12px 30px rgba(59,130,246,0.15) !important;
          border-color: rgba(59,130,246,0.30) !important;
          background: linear-gradient(135deg, #FFFFFF 0%, #E6F3FF 100%) !important;
        }
        `
      }} />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(#0077B6 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-5 flex-shrink-0 border-b border-slate-100 pb-4">
        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white border border-sky-100 flex items-center justify-center flex-shrink-0 relative"
          style={{
            boxShadow: "0 12px 30px rgba(0,119,182,0.08), 0 0 20px rgba(59,169,245,0.12) inset",
          }}
        >
          {/* Subtle blue glow behind logo */}
          <div className="absolute inset-0 bg-[#3BA9F5] opacity-[0.04] blur-lg rounded-full" />
          <img src={placeholders.logo} alt="Logo Placeholder" className="w-14 h-14 md:w-16 md:h-16 object-contain relative z-10" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-1.5 bg-[#EFF8FF] border border-[#BFDBFE]/80 rounded-full px-2.5 py-0.5 text-[9px] font-black tracking-widest text-[#0077B6] mb-1.5 shadow-[0_2px_6px_rgba(0,119,182,0.05)]">
            <span className="size-1 bg-[#0077B6] rounded-full animate-pulse" />
            PROPRIETARY PRODUCT
          </div>
          <h2 className="text-[32px] md:text-[48px] lg:text-[52px] font-[950] leading-none tracking-tight text-[#0A1628]">
            {placeholders.title}
          </h2>
          <div className="mt-2.5">
            <span className="inline-flex items-center text-[12px] md:text-[13px] font-extrabold text-[#0077B6] bg-[#EFF8FF] border border-[#BFDBFE]/60 rounded-full px-3.5 py-1 shadow-[0_2px_8px_rgba(0,119,182,0.04)]">
              {placeholders.tagline}
            </span>
          </div>
        </div>
      </div>

      {/* ── CONTENT CONTAINER ── */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">

        {/* Left Column (60%) */}
        <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
          {/* Business Challenge Card */}
          <div
            className="glass-card-hover p-2.5 rounded-[16px] border border-[rgba(59,130,246,0.12)] flex flex-col gap-1 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #F6FAFF 100%)",
              boxShadow: "0 4px 15px rgba(37,99,235,0.03), 0 1px 3px rgba(37,99,235,0.02), inset 0 1px 0 rgba(255,255,255,0.8)"
            }}
          >
            {/* Left Accent gradient strip */}
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#F43F5E] to-[#FDA4AF]" />
            <div className="flex items-center gap-2 text-rose-500 pl-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#3B82F6]/75">Business Challenge</span>
            </div>
            <p className="text-[11.5px] md:text-[12px] font-semibold leading-relaxed text-slate-500 pl-2">
              {placeholders.problem}
            </p>
          </div>

          {/* Our Solution Card */}
          <div
            className="glass-card-hover p-2.5 rounded-[16px] border border-[rgba(59,130,246,0.12)] flex flex-col gap-1 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #F3F9FF 100%)",
              boxShadow: "0 4px 15px rgba(37,99,235,0.03), 0 1px 3px rgba(37,99,235,0.02), inset 0 1px 0 rgba(255,255,255,0.8)"
            }}
          >
            {/* Left Accent gradient strip */}
            <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#3B82F6] to-[#93C5FD]" />
            <div className="flex items-center gap-2 text-sky-500 pl-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9.5px] font-black uppercase tracking-wider text-[#3B82F6]/75">Our Solution</span>
            </div>
            <p className="text-[11.5px] md:text-[12px] font-semibold leading-relaxed text-slate-500 pl-2">
              {placeholders.does}
            </p>
          </div>

          {/* Section 3: Four Separate Specification Cards */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Specifications</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { label: "Built For", value: placeholders.builtFor, icon: Users },
                { label: "Architecture", value: placeholders.architecture, icon: Workflow },
                { label: "Pricing", value: placeholders.pricing, icon: Wallet },
                { label: "Live With", value: placeholders.liveWith, icon: Landmark }
              ].map((spec, i) => {
                const Icon = spec.icon;

                // Parse values by splitting on common separators (new lines, commas, bullets, semicolons)
                const items = spec.value
                  .split(/[\n,·;]+/)
                  .map(v => v.trim())
                  .filter(v => v.length > 0);

                return (
                  <div
                    key={i}
                    className="spec-tile-hover p-2.5 rounded-[16px] border border-[rgba(59,130,246,0.12)] flex flex-col gap-1.5 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #FFFFFF 0%, #F6FAFF 100%)",
                      boxShadow: "0 4px 15px rgba(37,99,235,0.03), 0 1px 3px rgba(37,99,235,0.02)"
                    }}
                  >
                    {/* Left Accent gradient strip */}
                    <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#3B82F6] to-[#93C5FD]" />

                    <div className="flex items-center gap-1.5 text-slate-400 pl-1">
                      <Icon className="w-3 h-3 text-[#3B82F6]" />
                      <span className="text-[8.5px] font-black uppercase tracking-wider text-[#3B82F6]/75">{spec.label}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 pl-1">
                      {items.map((val, idx) => (
                        <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#EFF8FF] border border-[#BFDBFE]/45 text-[#0077B6] text-[9.5px] font-bold">
                          {val}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (40%) */}
        <div className="lg:col-span-5 flex flex-col min-h-0">
          <div
            className="p-3.5 rounded-[20px] border border-[rgba(59,130,246,0.15)] flex flex-col h-full shadow-[0_6px_20px_rgba(37,99,235,0.04)] relative overflow-hidden"
            style={{ background: "linear-gradient(180deg, #F6FBFF, #EEF7FF)" }}
          >
            {/* Blueprint bg dots for capability card */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#0077B6 1px, transparent 1px)", backgroundSize: "16px 16px" }} />

            <h3 className="text-[11px] font-black text-[#0A1628] uppercase tracking-wider mb-2 relative z-10">Key Capabilities</h3>
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col relative z-10 justify-between">
              {placeholders.capabilities.map((cap, i) => (
                <div key={i} className="flex flex-col">
                  <div className="flex items-start gap-2.5 py-2 px-2.5 rounded-lg transition-all duration-200 hover:bg-[#F4F9FF]">
                    <div className="w-5 h-5 rounded-full bg-white border border-[#BFDBFE] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_6px_rgba(59,130,246,0.12)]">
                      <Check className="w-3 h-3 text-[#0077B6] stroke-[3.5]" />
                    </div>
                    <span className="text-[13px] md:text-[14px] font-extrabold text-[#0A1628] leading-tight">{cap}</span>
                  </div>
                  {i < placeholders.capabilities.length - 1 && (
                    <div className="h-[1px] w-full bg-[#3B82F6]/5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-6px_30px_rgba(116,203,244,0.9)] opacity-90 rounded-full pointer-events-none" />
    </div>
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
      quote:
        "From lead to booking to possession — Kohinoor's entire customer journey now runs through a single Salesforce environment built by Cascade Tech.",
      challenge:
        "Pre-sales ran across spreadsheets, broker WhatsApp groups and disconnected calling tools. No single view of a prospect's journey and Meta ad attribution was guesswork.",
      whatWeBuilt:
        "Full Sales Cloud covering lead capture, source tracking, site-visit scheduling, opportunity management and dashboards — plus a native Meta Conversions API integration in Apex and Flow with zero middleware. CX Prism™ now deploying for post-possession NPS.",
      outcome:
        "Live in production. End-to-end marketing attribution active for the first time — which campaigns drive site visits, bookings and true CAC.",
      oneLineOutcome: "Active end-to-end marketing attribution sync for true CAC and site visits.",
      metrics: [
        { value: "+40%", label: "Lead Visibility", icon: TrendingUp },
        { value: "+65%", label: "Process Automation", icon: Zap },
        { value: "100%", label: "Salesforce Adoption", icon: ShieldCheck },
        { value: "Real-Time", label: "Attribution Sync", icon: RefreshCw },
      ],
      dashboardType: "kohinoor",
      businessImpact: [
        { icon: Users, text: "More qualified leads captured accurately" },
        { icon: TrendingUp, text: "Clear visibility from ad spend to booking" },
        { icon: Wallet, text: "Lower cost per acquisition with true attribution" },
        { icon: HeartHandshake, text: "Better customer experience with CX Prism™" },
      ],
    },
    {
      id: 2,
      companyName: "Ashwin Sheth Group",
      subtitle: "REAL ESTATE",
      solutionStack: "Enterprise Salesforce Implementation",
      specialBadge: "₹57,74,000 + GST • 138-day roadmap",
      quote:
        "A ground-up Salesforce transformation across pre-sales, bookings, incentives and channel partners — delivered on time and on budget.",
      challenge:
        "A comprehensive CRM transformation across multiple projects and teams at once. Existing setup had no channel-partner visibility, no incentive management, no tele-calling integration and no unified booking workflow.",
      whatWeBuilt:
        "Five-module Salesforce rollout: pre-sales, bookings, incentives, channel-partner onboarding and tele-calling — delivered as one cohesive program.",
      outcome:
        "One of our largest, most complex implementations to date. All five modules delivered within the committed timeline; channel-partner onboarding time reduced significantly.",
      oneLineOutcome:
        "Complex 5-module Salesforce CRM transformation delivered on time and budget.",
      metrics: [
        { value: "138 Days", label: "Roadmap Delivery", icon: Clock },
        { value: "5 Modules", label: "CRM Integration", icon: Layers },
        { value: "100%", label: "On Time & Budget", icon: ShieldCheck },
        { value: "Reduced", label: "Onboarding Cycle", icon: TrendingUp },
      ],
      dashboardType: "ashwin",
      businessImpact: [
        { icon: Users, text: "Unified view across multiple project sales teams" },
        { icon: TrendingUp, text: "Accelerated channel-partner onboarding cycle" },
        { icon: BadgeCheck, text: "Automated incentive calculations and audit trails" },
        { icon: ShieldCheck, text: "Zero booking slip-ups or pipeline dead-ends" },
      ],
    },
    {
      id: 3,
      companyName: "Naiknavare Developers",
      subtitle: "REAL ESTATE",
      solutionStack: "Marketing Cloud + Cascade Connect",
      quote:
        "From unstructured campaign activity to a properly configured Marketing Cloud setup — with a clear roadmap for WhatsApp automation next.",
      challenge:
        "Marketing team ran email and SMS through Marketing Cloud but lacked campaign structure, reporting visibility and channel-level data. Lead follow-up was manual, inconsistent and untracked.",
      whatWeBuilt:
        "Restructured Marketing Cloud setup with proper journeys, governance and reporting. Cascade Connect proposed for Phase 2 WhatsApp automation.",
      outcome:
        "Campaign reporting now active and used weekly by the marketing team. Clear roadmap for WhatsApp automation in place.",
      oneLineOutcome:
        "Configured clean Campaign Reporting dashboards used weekly by marketing teams.",
      metrics: [
        { value: "+24.8%", label: "Email Open Rate", icon: Mail },
        { value: "Phase 2", label: "WhatsApp Ready", icon: MessageSquare },
        { value: "Weekly", label: "Attribution Reports", icon: LineChart },
        { value: "Active", label: "Campaign Attrib.", icon: RefreshCw },
      ],
      dashboardType: "naiknavare",
      businessImpact: [
        { icon: Megaphone, text: "Structured marketing journeys and clean reporting" },
        { icon: TrendingUp, text: "24.8% open rate achieved on primary campaigns" },
        { icon: Layers, text: "Clean database segmentation and governance" },
        { icon: MessageSquare, text: "Ready for automated Phase 2 WhatsApp journeys" },
      ],
    },
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
      <div
        className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)",
        }}
      />

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
              <svg
                className="absolute -bottom-0.5 left-0 w-full h-[4px]"
                viewBox="0 0 200 5"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 3.5 C 60 1.5, 140 1.5, 198 3.5"
                  stroke="#0EA5E9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
        </div>
        <div className="w-full md:max-w-[40%] flex flex-col justify-start text-left pt-0 md:pt-4">
          <p className="text-[11px] md:text-[12.5px] text-slate-500 font-semibold leading-normal">
            Real Salesforce implementations, AI automations and marketing transformations delivering
            measurable business outcomes.
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
            className="premium-glass-card premium-glass-card-hover rounded-[20px] p-4 md:p-4.5 flex flex-col justify-between text-left relative group cursor-pointer"
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
              <div className="w-full h-[110px] bg-white/40 backdrop-blur-sm border border-white/50 rounded-xl my-2.5 p-2.5 overflow-hidden relative flex flex-col justify-center select-none shadow-[inset_0_1px_3px_rgba(2,132,199,0.02)]">
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
                        <div
                          key={i}
                          className="h-1 bg-emerald-100 border border-emerald-200 rounded-xs"
                        />
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
                  <div
                    key={mIdx}
                    className="premium-glass-card rounded-lg p-2 text-left flex flex-col justify-between min-h-[56px]"
                  >
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
          className="absolute inset-0 z-50 bg-[#f8fafc] overflow-y-auto flex flex-col justify-start pointer-events-auto rounded-[32px] shadow-2xl"
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
              <span className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight">
                {selectedCaseStudy.companyName}
              </span>
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
                    <div
                      key={mIdx}
                      className="premium-glass-card rounded-2xl p-2.5 flex flex-col justify-between min-h-[76px]"
                    >
                      <div className="text-sky-500 flex items-center justify-start">
                        <MetricIcon className="size-4" />
                      </div>
                      <div className="flex flex-col gap-0.5 mt-1.5">
                        <span className="text-[#0ea5e9] text-base md:text-lg font-black tracking-tight font-display leading-none">
                          <CountUpText text={m.value} />
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider leading-none mt-1 block overflow-hidden text-ellipsis whitespace-nowrap">
                          {m.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Split Details Section */}
            <div className="flex flex-col lg:flex-row gap-5 items-stretch w-full mt-1.5">
              {/* Left column details (Timeline Layout) */}
              <motion.div
                key={`left-article-${selectedIdx}`}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="w-full lg:w-[48%] flex flex-col gap-3.5 relative pl-12 justify-center py-0.5"
              >
                {/* Vertical Timeline Line */}
                <div className="absolute left-[20px] top-6 bottom-6 w-[2px] bg-slate-200" />

                {[
                  { label: "Challenge", body: selectedCaseStudy.challenge, icon: AlertTriangle },
                  { label: "What We Built", body: selectedCaseStudy.whatWeBuilt, icon: Workflow },
                  { label: "Outcome", body: selectedCaseStudy.outcome, icon: BadgeCheck },
                ].map((item, subIdx) => (
                  <div key={subIdx} className="relative flex flex-col">
                    {/* Circle Node */}
                    <div className="absolute left-[-44px] top-2 size-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-400 shadow-sm z-10 hover:border-sky-500 hover:text-sky-500 transition-colors duration-300">
                      <div className="size-6.5 rounded-full bg-sky-50 flex items-center justify-center text-sky-500">
                        <item.icon className="size-3.5" />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="premium-glass-card rounded-2xl p-3.5 md:p-4 flex flex-col justify-start text-left">
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
                <div className="w-full flex-grow flex flex-col justify-between bg-white/40 backdrop-blur-md border border-white/50 rounded-xl p-4 relative overflow-hidden min-h-[300px] lg:min-h-[330px] shadow-[inset_0_1px_3px_rgba(2,132,199,0.02)] select-none">
                  <div className="flex items-center justify-between border-b border-slate-200/40 pb-2 mb-3">
                    <div className="flex items-center gap-1">
                      <div className="size-2 rounded-full bg-[#EF4444]/90" />
                      <div className="size-2 rounded-full bg-[#F59E0B]/90" />
                      <div className="size-2 rounded-full bg-[#10B981]/90" />
                    </div>
                    <span className="text-[8px] font-bold text-slate-400 tracking-wider font-mono">
                      {selectedCaseStudy.companyName.toLowerCase().replace(/[^a-z0-9]/g, "")}
                      .salesforce / console
                    </span>
                  </div>

                  <div className="flex-grow flex flex-col justify-center gap-3">
                    {selectedCaseStudy.dashboardType === "kohinoor" && (
                      <>
                        <div className="flex flex-col gap-1.5 w-full text-left">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                            Conversion Funnel
                          </span>
                          <div className="flex flex-col gap-1 mt-0.5 text-[10px] font-bold text-slate-600">
                            <div className="w-full premium-glass-card rounded-lg p-2 flex justify-between items-center leading-none">
                              <span>1. Leads</span>
                              <span className="text-[#0EA5E9] font-black">12,400</span>
                            </div>
                            <div className="w-[82%] premium-glass-card rounded-lg p-2 flex justify-between items-center leading-none">
                              <span>2. Contacted</span>
                              <span className="text-[#0EA5E9] font-black">8,680</span>
                            </div>
                            <div className="w-[62%] premium-glass-card rounded-lg p-2 flex justify-between items-center leading-none">
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
                          <div className="premium-glass-card rounded-lg p-2 text-left flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                              Weekly Visits
                            </span>
                            <div className="flex items-end justify-between h-9 mt-1 px-1">
                              {[25, 45, 60, 75, 95].map((h, i) => (
                                <div
                                  key={i}
                                  className="w-[12%] bg-[#0EA5E9] rounded-t-xs"
                                  style={{ height: `${h}%` }}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="premium-glass-card rounded-lg p-2 text-left flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                              Meta Attribution
                            </span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <svg className="size-8 flex-shrink-0" viewBox="0 0 32 32">
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="14"
                                  fill="transparent"
                                  stroke="#E2E8F0"
                                  strokeWidth="4"
                                />
                                <circle
                                  cx="16"
                                  cy="16"
                                  r="14"
                                  fill="transparent"
                                  stroke="#0EA5E9"
                                  strokeWidth="4"
                                  strokeDasharray="60 100"
                                  strokeDashoffset="0"
                                  transform="rotate(-90 16 16)"
                                />
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
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                            Implementation Progress
                          </span>
                          <div className="flex items-center justify-between w-full premium-glass-card p-2.5 rounded-lg mt-0.5">
                            {[
                              { label: "Pre-Sales", status: "completed" },
                              { label: "Bookings", status: "completed" },
                              { label: "Incentives", status: "completed" },
                              { label: "Partners", status: "completed" },
                              { label: "Tele-Calls", status: "completed" },
                            ].map((step, sIdx) => (
                              <div
                                key={sIdx}
                                className="flex flex-col items-center flex-1 relative"
                              >
                                <div className="size-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                                  <Check className="size-2.5" />
                                </div>
                                <span className="text-[7.5px] font-bold text-slate-600 mt-1 leading-none truncate w-full text-center">
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-0.5">
                          <div className="premium-glass-card rounded-lg p-2 text-left flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                              Incentives Tracked
                            </span>
                            <p className="text-lg font-[900] text-[#8B5CF6] mt-1.5 font-display leading-none">
                              ₹57.7L
                            </p>
                            <span className="text-[7px] text-slate-400 font-bold leading-none mt-1">
                              100% Audit Verified
                            </span>
                          </div>
                          <div className="premium-glass-card rounded-lg p-2 text-left flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                              Partner Sync
                            </span>
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
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
                            WhatsApp Lead Journey
                          </span>
                          <div className="flex items-center justify-between w-full premium-glass-card px-3 py-2 rounded-lg mt-0.5">
                            <div className="flex flex-col items-center">
                              <div className="size-5.5 rounded bg-sky-50 text-[#0EA5E9] border border-sky-100 flex items-center justify-center shadow-xs">
                                <Users className="size-2.5" />
                              </div>
                              <span className="text-[7.5px] font-bold text-slate-500 mt-1 leading-none">
                                Ad Click
                              </span>
                            </div>
                            <div className="h-[1px] bg-slate-200 flex-grow mx-1 border-dashed border-t" />
                            <div className="flex flex-col items-center">
                              <div className="size-6.5 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-xs animate-pulse">
                                <MessageSquare className="size-3 text-white" />
                              </div>
                              <span className="text-[7.5px] font-black text-[#0EA5E9] mt-1 leading-none">
                                Opt-In Msg
                              </span>
                            </div>
                            <div className="h-[1px] bg-slate-200 flex-grow mx-1 border-dashed border-t" />
                            <div className="flex flex-col items-center">
                              <div className="size-5.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs">
                                <Cloud className="size-2.5" />
                              </div>
                              <span className="text-[7.5px] font-bold text-slate-500 mt-1 leading-none">
                                CRM Update
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-0.5">
                          <div className="premium-glass-card rounded-lg p-2 text-left flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                              Campaign Stats
                            </span>
                            <div className="flex flex-col gap-1 mt-1.5">
                              <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-700">
                                <span className="text-slate-400 text-[7px] font-bold">
                                  Open Rate
                                </span>
                                <span>24.8%</span>
                              </div>
                              <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-700">
                                <span className="text-slate-400 text-[7px] font-bold">
                                  Click Rate
                                </span>
                                <span>4.2%</span>
                              </div>
                            </div>
                          </div>
                          <div className="premium-glass-card rounded-lg p-2 text-left flex flex-col justify-between min-h-[70px]">
                            <span className="text-[8px] font-black text-slate-400 uppercase leading-none">
                              Engagement Trend
                            </span>
                            <div className="h-7 mt-1.5 relative">
                              <svg
                                className="w-full h-full"
                                viewBox="0 0 100 30"
                                preserveAspectRatio="none"
                              >
                                <path
                                  d="M 0 25 C 20 5, 40 30, 60 10 T 100 8"
                                  fill="none"
                                  stroke="#2563EB"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M 0 25 C 20 5, 40 30, 60 10 T 100 8 L 100 30 L 0 30 Z"
                                  fill="rgba(37,99,235,0.06)"
                                />
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
              className="premium-glass-card rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between w-full mt-4 text-left gap-4"
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
      iconEmoji: "🔍",
      teamInvolved: "Lead Consultant, Business Analyst",
      desc: "Aligning operational workflows and requirements with zero assumptions.",
      challenge: "Fragmented processes, undocumented spreadsheets, and lack of real-time pipeline visibility.",
      whatWeBuild: "Detailed operational audit, systems map, and technical architecture definition.",
      deliverables: [
        "Lead Flow Audit Map",
        "API/CRM Integration Specs",
        "Success Metric Benchmarks",
      ],
      outcome: "Aligned timeline, budget, and system architecture design document.",
      challengeBullets: [
        "Fragmented operational workflows",
        "Undocumented spreadsheets & tracking",
        "Lack of real-time pipeline visibility",
      ],
      architectureBullets: [
        "Detailed operational process audit",
        "Comprehensive systems integration map",
        "Salesforce technical architecture design",
      ],
      outcomeBullets: [
        "Aligned timeline & phase budget",
        "Approved system design blueprints",
        "Defined metrics for project success",
      ],
      technologies: ["Jira", "Confluence", "Miro", "Lucidchart"],
      successCriteria: "100% client sign-off on the final requirements specification document.",
      icon: Search,
      illustration: () => (
        <svg
          viewBox="0 0 200 120"
          className="w-full h-24 text-[#0EA5E9]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="30"
            cy="30"
            r="6"
            className="fill-[#0EA5E9]/10 stroke-[#0EA5E9]"
            strokeWidth="1.5"
          />
          <circle
            cx="30"
            cy="60"
            r="6"
            className="fill-slate-100 stroke-slate-400"
            strokeWidth="1.5"
          />
          <circle
            cx="30"
            cy="90"
            r="6"
            className="fill-[#3B82F6]/10 stroke-[#3B82F6]"
            strokeWidth="1.5"
          />
          <path
            d="M36 30 H100"
            className="stroke-slate-300"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <path d="M36 60 Q70 60 100 60" className="stroke-slate-300" strokeWidth="1.5" />
          <path
            d="M36 90 Q70 90 100 60"
            className="stroke-slate-300"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <circle
            cx="106"
            cy="60"
            r="12"
            className="fill-sky-50 stroke-[#0EA5E9]"
            strokeWidth="2"
          />
          <path
            d="M101 60 L104 63 L111 56"
            className="stroke-[#0EA5E9]"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M118 60 H164" className="stroke-[#0EA5E9]" strokeWidth="2" />
          <polygon points="164,57 170,60 164,63" className="fill-[#0EA5E9]" />
          <circle
            cx="176"
            cy="60"
            r="8"
            className="fill-[#0EA5E9]/10 stroke-[#0EA5E9]"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      id: "02",
      title: "Blueprint",
      duration: "Week 2",
      iconEmoji: "📐",
      teamInvolved: "Technical Architect, Solutions Designer",
      desc: "Designing database schemas and automation workflows.",
      challenge: "Data model conflicts, security schema holes, and duplicate contact profiles.",
      whatWeBuild: "Custom Entity Relationship Diagram (ERD) and object schema configuration blueprints.",
      deliverables: [
        "Entity Relationship Diagrams (ERDs)",
        "Field-Level Security Matrix",
        "Sandbox Initialization Plans",
      ],
      outcome: "Technical blueprint signed off and sandbox environments provisioned.",
      challengeBullets: [
        "Data model conflicts & inconsistency",
        "Security schema vulnerabilities",
        "Duplicate contact & account profiles",
      ],
      architectureBullets: [
        "Entity Relationship Diagrams (ERDs)",
        "Field-level security matrices",
        "Sandbox environment initialization",
      ],
      outcomeBullets: [
        "Approved Salesforce architectural design",
        "Initialized development sandboxes",
        "Complete field mappings signed off",
      ],
      technologies: ["Salesforce Schema Builder", "draw.io", "ERD Tools"],
      successCriteria: "Schema design approval and environment deployment checklist sign-off by client.",
      icon: Layers,
      illustration: () => (
        <svg
          viewBox="0 0 200 120"
          className="w-full h-24 text-[#10B981]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="50"
            height="35"
            rx="4"
            className="fill-white stroke-[#10B981]"
            strokeWidth="1.5"
          />
          <line x1="20" y1="32" x2="70" y2="32" className="stroke-[#10B981]" strokeWidth="1" />
          <rect x="25" y="38" width="15" height="4" rx="1" className="fill-slate-200" />
          <rect x="25" y="46" width="25" height="4" rx="1" className="fill-[#10B981]/30" />
          <rect
            x="130"
            y="40"
            width="50"
            height="45"
            rx="4"
            className="fill-white stroke-slate-400"
            strokeWidth="1.5"
          />
          <line x1="130" y1="52" x2="180" y2="52" className="stroke-slate-400" strokeWidth="1" />
          <rect x="135" y="58" width="20" height="4" rx="1" className="fill-slate-200" />
          <rect x="135" y="66" width="25" height="4" rx="1" className="fill-slate-200" />
          <rect x="135" y="74" width="15" height="4" rx="1" className="fill-[#10B981]/30" />
          <path
            d="M70 37 H95 V62 H130"
            className="stroke-[#10B981]"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <path d="M125 58 L130 62 L125 66" className="stroke-[#10B981]" strokeWidth="1.5" />
          <circle cx="120" cy="62" r="2" className="fill-white stroke-[#10B981]" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: "03",
      title: "Build",
      duration: "Weeks 3–10",
      iconEmoji: "⚙️",
      teamInvolved: "Apex/LWC Developers, Integration Engineers",
      desc: "Developing custom Apex, LWC, and CRM flow triggers.",
      challenge: "Unreliable manual actions, sluggish data processing, and lack of automated alerts.",
      whatWeBuild: "Robust custom apex coding, lightning web components (LWC), and API flows.",
      deliverables: [
        "Apex & Flow Automations",
        "WhatsApp API Integration",
        "Migration scripts & runs",
      ],
      outcome: "Fully integrated and custom-coded CRM platform ready in staging.",
      challengeBullets: [
        "Unreliable manual task dependencies",
        "Sluggish database transaction processing",
        "Lack of real-time automated alerts",
      ],
      architectureBullets: [
        "Custom Apex controllers & triggers",
        "Lightning Web Components (LWC) UI",
        "High-speed automation flows & rules",
      ],
      outcomeBullets: [
        "Fully integrated Apex code base",
        "Custom WhatsApp API connection",
        "CRM workflows configured in staging",
      ],
      technologies: ["Apex", "LWC", "Flow Builder", "Git", "VS Code"],
      successCriteria: "75%+ Apex unit test code coverage and successful sandboxed workflow verification.",
      icon: Code,
      illustration: () => (
        <svg
          viewBox="0 0 200 120"
          className="w-full h-24 text-[#6366F1]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="15"
            width="160"
            height="90"
            rx="6"
            className="fill-slate-900 stroke-slate-800"
            strokeWidth="2"
          />
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
      ),
    },
    {
      id: "04",
      title: "Train & UAT",
      duration: "Weeks 11–12",
      iconEmoji: "✅",
      teamInvolved: "QA Engineer, Enablement Specialist, PM",
      desc: "Enabling teams and addressing feedback loops.",
      challenge: "Low user adoption rates, administrative skill gaps, and transition friction.",
      whatWeBuild: "Custom role-based training programs, UAT cycles, and transition playbooks.",
      deliverables: [
        "UAT Testing Cycles",
        "Role-Based Training Manuals",
        "Administrator Enablement Guides",
      ],
      outcome: "Stakeholder sign-off and adoption readiness verified.",
      challengeBullets: [
        "Low client user adoption rates",
        "Salesforce admin skill gaps",
        "Launch transition friction & confusion",
      ],
      architectureBullets: [
        "Customized role-based UAT scenarios",
        "Live interactive training workshops",
        "Platform administration playbooks",
      ],
      outcomeBullets: [
        "Official UAT stakeholder sign-off",
        "Operations team training complete",
        "Documented transition handbook",
      ],
      technologies: ["Salesforce Sandbox", "WalkMe", "Loom", "Trailhead"],
      successCriteria: "90%+ user pass rate on defined UAT scenarios and administrator training completion.",
      icon: GraduationCap,
      illustration: () => (
        <svg
          viewBox="0 0 200 120"
          className="w-full h-24 text-[#8B5CF6]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="60" cy="60" r="35" className="stroke-slate-200" strokeWidth="6" />
          <circle
            cx="60"
            cy="60"
            r="35"
            className="stroke-[#8B5CF6]"
            strokeWidth="6"
            strokeDasharray="220"
            strokeDashoffset="55"
            strokeLinecap="round"
          />
          <text
            x="60"
            y="66"
            className="fill-[#8B5CF6] font-extrabold text-[18px]"
            textAnchor="middle"
          >
            85%
          </text>
          <g transform="translate(135, 35)">
            <rect
              x="0"
              y="0"
              width="45"
              height="20"
              rx="4"
              className="fill-violet-50 stroke-[#8B5CF6]"
              strokeWidth="1"
            />
            <text
              x="22.5"
              y="13"
              className="fill-[#8B5CF6] text-[8px] font-bold"
              textAnchor="middle"
            >
              Training
            </text>
          </g>
          <g transform="translate(135, 65)">
            <rect
              x="0"
              y="0"
              width="45"
              height="20"
              rx="4"
              className="fill-emerald-50 stroke-[#10B981]"
              strokeWidth="1"
            />
            <text
              x="22.5"
              y="13"
              className="fill-[#10B981] text-[8px] font-bold"
              textAnchor="middle"
            >
              UAT Sign-off
            </text>
          </g>
          <path
            d="M96 50 C 110 50, 110 45, 135 45"
            className="stroke-slate-300"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <path
            d="M96 70 C 110 70, 110 75, 135 75"
            className="stroke-slate-300"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
        </svg>
      ),
    },
    {
      id: "05",
      title: "Go Live",
      duration: "Post Week 12",
      iconEmoji: "🚀",
      teamInvolved: "DevOps Engineer, Support Lead, AM",
      desc: "Deploying to production and supporting adoption.",
      challenge: "Deployment downtime, cutover synchronization, and post-launch bugs.",
      whatWeBuild: "Safe production package migration, 30-day hypercare, and ongoing annual maintenance (AMC).",
      deliverables: [
        "Production Cutover Checklist",
        "30-Day Hypercare Support",
        "Long-term AMC Setup",
      ],
      outcome: "Live system deployed with zero downtime and continuous support.",
      challengeBullets: [
        "Production cutover downtime risk",
        "Multi-system synchronization",
        "Unresolved post-launch software bugs",
      ],
      architectureBullets: [
        "Safe production package migration",
        "30-day post-launch hypercare",
        "Long-term AMC SLA framework setup",
      ],
      outcomeBullets: [
        "Zero-downtime production cutover",
        "Hypercare monitoring active",
        "Long-term support SLA active",
      ],
      technologies: ["Salesforce DX", "Jenkins", "Copado", "Hypercare Monitoring"],
      successCriteria: "Production deployment verification completed with zero high-severity issues in 30 days.",
      icon: Rocket,
      illustration: () => (
        <svg
          viewBox="0 0 200 120"
          className="w-full h-24 text-[#EC4899]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 100 Q 80 85 105 55"
            className="stroke-[#EF4444]"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
          <path
            d="M20 110 Q 70 95 120 110"
            className="stroke-slate-300"
            strokeWidth="3"
            fill="none"
          />
          <rect
            x="135"
            y="70"
            width="45"
            height="35"
            rx="4"
            className="fill-slate-50 stroke-slate-300"
            strokeWidth="1.5"
          />
          <circle cx="145" cy="80" r="3" className="fill-[#10B981]" />
          <line x1="154" y1="80" x2="172" y2="80" className="stroke-slate-400" strokeWidth="1.5" />
          <circle cx="145" cy="90" r="3" className="fill-[#10B981]" />
          <line x1="154" y1="90" x2="172" y2="90" className="stroke-slate-400" strokeWidth="1.5" />
          <g transform="translate(100, 30) rotate(35)">
            <path
              d="M0 -15 C 6 -10, 6 10, 0 15 C -6 10, -6 -10, 0 -15"
              className="fill-[#0EA5E9] stroke-[#0284C7]"
              strokeWidth="1"
            />
            <path d="M-5 5 L-10 12 L-4 12 Z" className="fill-rose-500" />
            <path d="M5 5 L10 12 L4 12 Z" className="fill-rose-500" />
            <circle cx="0" cy="-2" r="2.5" className="fill-white" />
            <path d="M-3 15 L0 23 L3 15 Z" className="fill-amber-500" />
          </g>
        </svg>
      ),
    },
  ];

  const currentStage = expandedStageIdx !== null ? stages[expandedStageIdx] : null;

  return (
    <div
      className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-4 pb-4 px-4 md:px-5 justify-center gap-4 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)] animate-in fade-in duration-500"
      style={{
        background: "rgba(248, 250, 252, 0.95)",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Ambient glows */}
      <div
        className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)",
        }}
      />

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

      <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-stretch justify-between w-full h-full relative z-10 max-w-[1340px] mx-auto px-1">
        {/* LEFT COLUMN: 30% width */}
        <div className="w-full md:w-[28%] flex flex-col text-left h-full py-2 flex-shrink-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE]/80 rounded-full px-2.5 py-0.5 text-[9px] md:text-[10px] font-bold tracking-wider text-[#0284C7] w-fit mb-3">
            <span className="size-1.5 rounded-full bg-[#0284C7] animate-pulse" />
            ENGAGEMENT MODEL
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-[34px] lg:text-[38px] font-[900] leading-[1.1] tracking-tight text-[#0F172A] mb-3">
            How We Work With You
          </h2>

          {/* Supporting Text */}
          <p className="text-[12.5px] text-slate-500 font-semibold leading-relaxed mb-4">
            We believe in structured delivery, complete alignment, and deep operational understanding. From initial discovery to production launch, here is our roadmap.
          </p>

          {/* Divider */}
          <div className="border-t border-slate-200/80 my-4" />

          {/* Metadata Stack */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Typical Duration
              </span>
              <span className="text-[14.5px] font-black text-slate-800 block mt-0.5">
                8–14 Weeks
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Engagement Type
              </span>
              <span className="text-[14.5px] font-black text-slate-800 block mt-0.5">
                Fixed Scope
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Dedicated Team
              </span>
              <span className="text-[14.5px] font-black text-[#0284C7] block mt-0.5">
                Architect • PM • DevOps
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-200/80 my-4" />

          {/* View Full Implementation Guide Text Link */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setExpandedStageIdx(activeStage);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-black text-[#0284C7] hover:text-[#2563EB] transition-colors w-fit pointer-events-auto"
          >
            <span>View Full Implementation Guide →</span>
          </a>
        </div>

        {/* RIGHT COLUMN: 72% width */}
        <div className="w-full md:w-[72%] flex flex-col justify-between h-full py-1 relative z-10">
          
          {/* Detail Panel */}
          <div className="w-full bg-white/95 border border-slate-200/60 rounded-2xl flex flex-col justify-between flex-grow shadow-[0_12px_45px_rgba(0,0,0,0.04)] relative z-10 overflow-hidden min-h-[360px]">
            
            {/* Timeline Stage Navigation Header (Spacious with equal widths, no icons) */}
            <div className="relative w-full border-b border-slate-100 bg-slate-50/40 py-5 px-6 flex flex-col gap-2">
              
              {/* Thin animated progress line behind the cards */}
              <div className="absolute left-[10%] right-[10%] top-[50%] -translate-y-1/2 h-[2px] pointer-events-none hidden md:block z-0">
                <div className="absolute inset-0 bg-slate-200/70 rounded-full h-full w-full" />
                <div
                  className="absolute left-0 top-0 bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(14,165,233,0.8)]"
                  style={{ width: `${(activeStage / 4) * 100}%` }}
                />
                <div
                  className="absolute size-2.5 bg-white border-2 border-[#0EA5E9] rounded-full shadow-[0_0_10px_rgba(14,165,233,1)] pointer-events-none -translate-y-[4.5px] -translate-x-[5px] transition-all duration-500"
                  style={{
                    left: `${(activeStage / 4) * 100}%`,
                  }}
                />
              </div>

              {/* Desktop Stage Pills Flex */}
              <div className="hidden md:flex flex-row items-center justify-between gap-4 w-full relative z-10">
                {stages.map((stage, idx) => {
                  const isActive = activeStage === idx;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveStage(idx)}
                      className={`flex-1 flex flex-col items-center justify-center py-2.5 px-4 rounded-xl transition-all duration-300 pointer-events-auto border outline-none ${isActive
                        ? "bg-white border-[#0EA5E9] shadow-[0_8px_25px_rgba(14,165,233,0.12)] scale-[1.03] z-20"
                        : "bg-white border-slate-200/60 hover:border-slate-300 hover:scale-[1.01] z-10"
                        }`}
                    >
                      <span className={`text-[9.5px] font-black uppercase tracking-wider ${isActive ? "text-[#0EA5E9]" : "text-slate-400"}`}>
                        Stage {stage.id}
                      </span>
                      <span className="text-[13.5px] font-black text-slate-800 mt-0.5">
                        {stage.title}
                      </span>
                      <span className={`text-[8.5px] font-bold mt-1 px-2 py-0.5 rounded-full border ${isActive ? "text-[#0EA5E9] bg-sky-50 border-sky-100" : "text-slate-500 bg-slate-50 border-slate-100"}`}>
                        {stage.duration}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Content Grid wrapped in Framer Motion for smooth transitions */}
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col flex-grow text-left p-5 md:p-6 justify-between gap-4"
            >
              {/* Header Title Row */}
              <div className="flex items-center justify-between gap-4 w-full border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-[24px] md:text-[28px] font-[900] text-slate-900 leading-tight tracking-tight">
                    {stages[activeStage].title}
                  </h3>
                  <p className="text-slate-500 text-[13.5px] font-semibold mt-0.5">
                    {stages[activeStage].desc}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedStageIdx(activeStage)}
                  className="flex-shrink-0 inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-[#F0F9FF] border border-[#E0F2FE] text-[11.5px] font-black text-[#0284C7] hover:bg-[#E0F2FE] hover:scale-[1.02] active:scale-[0.98] transition-all pointer-events-auto"
                >
                  <span>Explore Case Study →</span>
                </button>
              </div>

              {/* Dashboard Content Grid (Row 1 & Row 2 & Row 3) */}
              <div className="grid grid-cols-12 gap-3.5 flex-grow">
                {/* ROW 1: Challenge (50%) & Deliverables (50%) */}
                <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-red-50/40 to-rose-50/30 border border-red-100/50 rounded-xl p-5 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="size-5 rounded-lg bg-red-100/80 flex items-center justify-center text-red-600">
                        <AlertTriangle className="size-3" />
                      </div>
                      <span className="text-[9.5px] font-black text-red-600/70 uppercase tracking-widest">
                        Business Challenge
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-slate-600 text-[13px] font-semibold">
                      {stages[activeStage].challengeBullets.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-red-400" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-emerald-50/40 to-emerald-50/30 border border-emerald-100/50 rounded-xl p-5 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="size-5 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-600">
                        <CheckSquare className="size-3" />
                      </div>
                      <span className="text-[9.5px] font-black text-emerald-600/70 uppercase tracking-widest">
                        Key Deliverables
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-slate-700 text-[13px] font-bold">
                      {stages[activeStage].deliverables.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-emerald-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ROW 2: Architecture (50%) & Outcomes (50%) */}
                <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-sky-50/40 to-blue-50/30 border border-sky-100/50 rounded-xl p-5 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="size-5 rounded-lg bg-sky-100/80 flex items-center justify-center text-[#0EA5E9]">
                        <Cpu className="size-3" />
                      </div>
                      <span className="text-[9.5px] font-black text-sky-600/70 uppercase tracking-widest">
                        Solution Architecture
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-slate-600 text-[13px] font-semibold">
                      {stages[activeStage].architectureBullets.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-sky-400" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 bg-gradient-to-br from-violet-50/40 to-violet-50/30 border border-violet-100/50 rounded-xl p-5 flex flex-col justify-between hover:shadow-sm transition-all duration-200">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <div className="size-5 rounded-lg bg-violet-100/80 flex items-center justify-center text-violet-600">
                        <Target className="size-3" />
                      </div>
                      <span className="text-[9.5px] font-black text-violet-600/70 uppercase tracking-widest">
                        Expected Outcomes
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-slate-700 text-[13px] font-extrabold">
                      {stages[activeStage].outcomeBullets.map((bullet, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-violet-400" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ROW 3: Compact Metadata Row */}
                <div className="col-span-12 md:col-span-6 bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0EA5E9] flex-shrink-0">
                    <Clock className="size-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Duration</span>
                    <span className="text-[13px] font-extrabold text-slate-700 mt-0.5 block">{stages[activeStage].duration}</span>
                  </div>
                </div>

                <div className="col-span-12 md:col-span-6 bg-slate-50/80 border border-slate-100 rounded-xl p-3.5 flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Users className="size-4" />
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Team Involved</span>
                    <span className="text-[12px] font-extrabold text-slate-700 mt-0.5 block leading-tight">{stages[activeStage].teamInvolved}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Navigation List (renders preview lists vertically) */}
          <div className="md:hidden flex flex-col gap-3.5 w-full max-h-[52vh] overflow-y-auto pr-1 relative z-10">
            {stages.map((stage, idx) => {
              const Icon = stage.icon;
              const isActive = activeStage === idx;

              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div
                    onClick={() => setActiveStage(idx)}
                    className={`flex gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${isActive
                      ? "bg-white border border-[#0EA5E9] shadow-sm"
                      : "premium-glass-card"
                      }`}
                  >
                    {/* Icon Node */}
                    <div
                      className={`size-9 rounded-full flex items-center justify-center border flex-shrink-0 mt-0.5 transition-all ${isActive
                        ? "border-[#0EA5E9] text-[#0EA5E9] bg-sky-50"
                        : "border-slate-200 text-slate-400"
                        }`}
                    >
                      <Icon className="size-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[8px] font-bold text-[#0EA5E9] uppercase tracking-wider">
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
                    </div>
                  </div>

                  {/* Inline detailed UAT previews on Mobile */}
                  {isActive && (
                    <div className="p-4 rounded-2xl bg-white/97 border border-slate-200/60 shadow-sm flex flex-col gap-3.5 text-left animate-in fade-in slide-in-from-top duration-300">
                      <div className="bg-red-50/50 border border-red-100/60 rounded-xl p-3">
                        <span className="text-[8px] font-extrabold text-red-500 uppercase tracking-widest block mb-0.5">Business Challenge</span>
                        <p className="text-slate-600 text-[11px] font-semibold leading-normal">{stage.challenge}</p>
                      </div>
                      <div className="bg-sky-50/50 border border-sky-100/60 rounded-xl p-3">
                        <span className="text-[8px] font-extrabold text-[#0EA5E9] uppercase tracking-widest block mb-0.5">Solution Architecture</span>
                        <p className="text-slate-600 text-[11px] font-semibold leading-normal">{stage.whatWeBuild}</p>
                      </div>
                      <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-3">
                        <span className="text-[8px] font-extrabold text-emerald-600 uppercase tracking-widest block mb-1">Key Deliverables</span>
                        <div className="flex flex-col gap-1.5">
                          {stage.deliverables.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="size-3.5 rounded-full bg-emerald-100/60 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                                <Check className="size-2" />
                              </span>
                              <span className="text-slate-700 text-[11px] font-bold mt-0.5">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-violet-50/50 border border-violet-100/60 rounded-xl p-3">
                        <span className="text-[8px] font-extrabold text-violet-600 uppercase tracking-widest block mb-0.5">Expected Outcomes</span>
                        <p className="text-slate-700 text-[11px] font-extrabold leading-normal">{stage.outcome}</p>
                      </div>
                      <button
                        onClick={() => setExpandedStageIdx(idx)}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-gradient-to-r from-[#0EA5E9] to-[#2563EB] text-white font-extrabold text-[11px] transition-all"
                      >
                        <span>Explore Complete Stage</span>
                        <ArrowRight className="size-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Centered Large Modal (Detailed Case Study View) */}
      {expandedStageIdx !== null && currentStage && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-10 pointer-events-auto">
          {/* Backdrop Blur Overlay */}
          <div
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setExpandedStageIdx(null)}
          />

          {/* Modal Container */}
          <div className="bg-white rounded-[32px] border border-slate-200/80 shadow-[0_30px_100px_rgba(15,23,42,0.25)] w-full max-w-5xl h-[85vh] md:h-[80vh] flex flex-col overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#0EA5E9] uppercase block">
                  STAGE {currentStage.id} • IMPLEMENTATION CASE STUDY
                </span>
                <h3 className="text-2xl md:text-3xl font-[900] text-slate-900 leading-tight mt-1">
                  {currentStage.title}
                </h3>
              </div>

              <div className="flex items-center gap-4">
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-black text-[#0EA5E9] bg-sky-50 border border-sky-100/50">
                  {currentStage.duration}
                </span>
                <button
                  onClick={() => setExpandedStageIdx(null)}
                  className="size-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors pointer-events-auto"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Content: 2 columns */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col md:flex-row gap-8 text-left">
              {/* Main Reading Column (70%) */}
              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Stage Overview</h4>
                  <p className="text-slate-600 text-[15px] font-medium leading-relaxed">
                    {currentStage.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Challenge */}
                  <div className="bg-rose-50/30 border border-rose-100/50 rounded-2xl p-5">
                    <h5 className="text-[11px] font-black text-red-500 uppercase tracking-widest mb-2">Business Challenge</h5>
                    <p className="text-slate-600 text-[13.5px] font-semibold leading-relaxed">
                      {currentStage.challenge}
                    </p>
                  </div>

                  {/* Solution Architecture */}
                  <div className="bg-sky-50/30 border border-sky-100/50 rounded-2xl p-5">
                    <h5 className="text-[11px] font-black text-[#0EA5E9] uppercase tracking-widest mb-2">Solution Architecture</h5>
                    <p className="text-slate-600 text-[13.5px] font-semibold leading-relaxed">
                      {currentStage.whatWeBuild}
                    </p>
                  </div>
                </div>

                {/* Key Deliverables */}
                <div>
                  <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Key Deliverables</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStage.deliverables.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-100 rounded-xl p-3">
                        <span className="size-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                          <Check className="size-3" />
                        </span>
                        <span className="text-slate-700 text-[13px] font-bold mt-0.5">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Outcomes */}
                <div>
                  <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-2">Expected Outcomes</h4>
                  <div className="bg-emerald-50/20 border border-emerald-100/50 rounded-2xl p-5">
                    <p className="text-slate-700 text-[14px] font-extrabold leading-relaxed">
                      {currentStage.outcome}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Info Column (30%) */}
              <div className="w-full md:w-1/3 space-y-6 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                {/* Visual Illustration */}
                <div className="premium-glass-card rounded-2xl p-4 flex items-center justify-center min-h-[140px] relative overflow-hidden bg-slate-50/50 border border-slate-100">
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                    <svg width="100%" height="100%">
                      <pattern id="grid-ill-modal" width="16" height="16" patternUnits="userSpaceOnUse">
                        <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#000" strokeWidth="0.5" />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid-ill-modal)" />
                    </svg>
                  </div>
                  <div className="relative z-10 w-full max-w-[200px]">
                    {currentStage.illustration()}
                  </div>
                </div>

                {/* Metadata details */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Duration</span>
                    <span className="text-[13px] font-extrabold text-slate-800 mt-1 block">{currentStage.duration}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Team Involved</span>
                    <span className="text-[13px] font-extrabold text-slate-800 mt-1 block leading-relaxed">{currentStage.teamInvolved}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Technologies Used</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {currentStage.technologies.map((tech, i) => (
                        <span key={i} className="text-[11px] font-bold text-slate-600 bg-slate-100 border border-slate-200/60 rounded-md px-2 py-0.5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Success Criteria</span>
                    <span className="text-[12.5px] font-bold text-[#0EA5E9] bg-sky-50 border border-sky-100/50 rounded-xl p-3.5 mt-1.5 block leading-normal">
                      {currentStage.successCriteria}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
              <button
                onClick={() => {
                  if (expandedStageIdx > 0) {
                    const newIdx = expandedStageIdx - 1;
                    setExpandedStageIdx(newIdx);
                    setActiveStage(newIdx);
                  }
                }}
                disabled={expandedStageIdx === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors pointer-events-auto"
              >
                <ChevronLeft className="size-4" />
                <span>Previous Stage</span>
              </button>

              <span className="text-xs font-black text-slate-400">
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
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors pointer-events-auto"
              >
                <span>Next Stage</span>
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Glow reflection element */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-[3px] bg-gradient-to-r from-transparent via-[#74CBF4] to-transparent shadow-[0_-4px_30px_rgba(116,203,244,0.95),0_0_15px_rgba(116,203,244,1)] opacity-95 rounded-full pointer-events-none" />
    </div>
  );
}

function ClientCard({ clientName, isFeatured }: { clientName: string; isFeatured?: boolean }) {
  const [imgError, setImgError] = useState(false);

  const normalizedName = clientName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  const nameLength = clientName.length;
  let fontSizeClass = "text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px]";
  if (nameLength > 15) {
    fontSizeClass = "text-[11.5px] sm:text-[13px] md:text-[14.5px] lg:text-[16px]";
  } else if (nameLength > 11) {
    fontSizeClass = "text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]";
  } else if (nameLength > 8) {
    fontSizeClass = "text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px]";
  }

  const isWideLogo = normalizedName === "nandivardhan" || normalizedName === "ashwin_sheth";

  return (
    <div className={`w-full aspect-[2.6/1] md:aspect-[2.8/1] min-h-[82px] md:min-h-[105px] rounded-[22px] p-0 flex items-center justify-center text-center overflow-hidden group/card border transition-all duration-300 hover:-translate-y-1 ${isFeatured
      ? "border-blue-400 bg-white shadow-[0_4px_20px_rgba(0,112,210,0.08)] hover:shadow-[0_10px_28px_rgba(0,112,210,0.18)]"
      : "border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.08)] hover:border-slate-300"
      }`}>
      {!imgError ? (
        <img
          src={`/clients/${normalizedName}.png?v=4`}
          alt={clientName}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-2 bg-white transition-transform duration-300 group-hover/card:scale-105"
        />
      ) : (
        <span className={`${fontSizeClass} font-black text-[#03045E]/90 tracking-wider px-1.5 select-none`}>
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
      {scene.subtitle && <p className="mt-3 text-base text-muted-foreground">{scene.subtitle}</p>}
    </div>
  );
}
export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [initStage, setInitStage] = useState(0);
  const [active, setActive] = useState(0);
  const [activeCardIdx, setActiveCardIdx] = useState(0);

  const activeCardIdxRef = useRef(activeCardIdx);
  const targetActiveRef = useRef(active);

  useEffect(() => {
    activeCardIdxRef.current = activeCardIdx;
  }, [activeCardIdx]);



  useEffect(() => {
    if (active !== 1) {
      setActiveCardIdx(0);
    }
  }, [active]);

  // Stage 1: mounted
  useLayoutEffect(() => {
    if (initStage === 0) {
      console.log("mounted");
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
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
      console.log("layout ready");
      setInitStage(2);
    }
  }, [initStage]);

  // Stage 3: gsap initialized
  useLayoutEffect(() => {
    if (initStage === 2) {
      console.log("gsap initialized");
      setInitStage(3);
    }
  }, [initStage]);

  // Stage 4: scrolltrigger initialized
  useLayoutEffect(() => {
    if (initStage === 3) {
      ScrollTrigger.refresh();
      console.log("scrolltrigger initialized");
      setInitStage(4);
    }
  }, [initStage]);

  // Stage 5: camera initialized
  useLayoutEffect(() => {
    if (initStage === 4) {
      console.log("camera initialized");
      setInitStage(5);
    }
  }, [initStage]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    progressRef.current = v;
    const currentActive = Math.min(N - 1, Math.round(v * (N - 1)));
    setActive(currentActive);
    targetActiveRef.current = currentActive;
  });

  const barScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const scrollTween = useRef<gsap.core.Tween | null>(null);

  const scrollToScene = (sceneIndex: number) => {
    targetActiveRef.current = sceneIndex;
    const targetScrollTop = sceneIndex * window.innerHeight;

    if (scrollTween.current) {
      scrollTween.current.kill();
    }

    const scrollObj = { y: window.scrollY };
    scrollTween.current = gsap.to(scrollObj, {
      y: targetScrollTop,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => {
        window.scrollTo(0, scrollObj.y);
      },
      onComplete: () => {
        scrollTween.current = null;
      },
    });
  };

  const handleNextSection = () => {
    if (targetActiveRef.current < N - 1) {
      targetActiveRef.current += 1;
      scrollToScene(targetActiveRef.current);
    }
  };

  const handlePrevSection = () => {
    if (targetActiveRef.current > 0) {
      targetActiveRef.current -= 1;
      scrollToScene(targetActiveRef.current);
    }
  };

  // Expose navigation methods on the window object to serve as a unified navigation controller
  useEffect(() => {
    (window as any).__experienceNavigateToScene = (sceneIndex: number) => {
      scrollToScene(sceneIndex);
    };
    (window as any).__experienceNavigateNext = () => {
      handleNextSection();
    };
    (window as any).__experienceNavigatePrev = () => {
      handlePrevSection();
    };
    (window as any).__experienceActiveIndex = active;
    (window as any).__experienceTotalScenes = N;

    return () => {
      delete (window as any).__experienceNavigateToScene;
      delete (window as any).__experienceNavigateNext;
      delete (window as any).__experienceNavigatePrev;
      delete (window as any).__experienceActiveIndex;
      delete (window as any).__experienceTotalScenes;
    };
  }, [active, N]);

  // Turn off manual scroll events and implement smooth, debounced wheel scroll navigation
  useEffect(() => {
    let lastWheelTime = 0;
    const scrollCooldown = 800; // ms to wait between transitions

    const handleWheel = (e: WheelEvent) => {
      // Allow scrolling inside elements with overflow-y-auto or overflow-y-scroll
      const path = e.composedPath();
      for (const el of path) {
        if (el instanceof HTMLElement) {
          const style = window.getComputedStyle(el);
          if (
            el.scrollHeight > el.clientHeight &&
            (style.overflowY === "auto" || style.overflowY === "scroll")
          ) {
            return;
          }
        }
      }
      
      e.preventDefault();

      // Check cooldown and active tween state
      const now = Date.now();
      if (now - lastWheelTime < scrollCooldown || scrollTween.current) {
        return;
      }

      const threshold = 18; // ignore micro-scroll variations
      if (Math.abs(e.deltaY) > threshold) {
        lastWheelTime = now;
        if (e.deltaY > 0) {
          handleNextSection();
        } else {
          handlePrevSection();
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const path = e.composedPath();
      for (const el of path) {
        if (el instanceof HTMLElement) {
          const style = window.getComputedStyle(el);
          if (
            el.scrollHeight > el.clientHeight &&
            (style.overflowY === "auto" || style.overflowY === "scroll")
          ) {
            return;
          }
        }
      }
      e.preventDefault();
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [active, N]);

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

      const isSpace = key === " " || code === 32;
      const isPageUp = key === "PageUp" || code === 33;
      const isPageDown = key === "PageDown" || code === 34;
      const isEnd = key === "End" || code === 35;
      const isHome = key === "Home" || code === 36;

      if (isSpace || isPageUp || isPageDown || isEnd || isHome) {
        e.preventDefault();
      }

      if (isDown || isRight) {
        e.preventDefault();
        handleNextSection();
      } else if (isUp || isLeft) {
        e.preventDefault();
        handlePrevSection();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setMounted(true);

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Force scroll to top immediately and reset active section state
    window.scrollTo(0, 0);
    setActive(0);

    // Repeatedly force scroll position at multiple intervals to override asynchronous browser restoration
    const intervals = [50, 150, 300, 500];
    const timers = intervals.map((delay) =>
      setTimeout(() => {
        window.scrollTo(0, 0);
        setActive(0);
      }, delay),
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
            camera={{ position: [26, 42, 115], fov: 52, near: 0.1, far: 600 }}
            gl={{ antialias: true, alpha: false }}
          >
            <CityScene progress={progressRef} isCameraReady={initStage >= 5} />
          </Canvas>
        )}
      </div>


      {/* Scene overlays */}
      {SCENES.map((scene, i) => (
        <SceneOverlay
          key={scene.id}
          scene={scene}
          index={i}
          progress={scrollYProgress}
          active={active}
          activeCardIdx={activeCardIdx}
        />
      ))}

      {/* Floating dot navigation on the right side */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3.5 select-none pointer-events-auto hidden sm:flex">
        {SCENES.map((scene, i) => {
          const isActive = active === i;
          return (
            <button
              key={scene.id}
              onClick={() => scrollToScene(i)}
              className="group relative flex items-center justify-center p-1 bg-transparent border-0 cursor-pointer focus:outline-none"
              aria-label={`Go to section ${i + 1}: ${scene.kicker}`}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-7 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 bg-white/95 backdrop-blur-md border border-slate-200/50 rounded-xl px-3 py-1.5 text-[11px] font-bold text-[#03045E] whitespace-nowrap shadow-md pointer-events-none tracking-tight">
                {scene.kicker}
              </span>

              {/* Dot visual */}
              {isActive ? (
                <span className="size-3.5 rounded-full bg-[#48CAE4] ring-4 ring-[#48CAE4]/20 shadow-[0_0_12px_rgba(72,202,228,0.85)] scale-110 transition-all duration-300" />
              ) : (
                <span className="size-2 rounded-full bg-[#03045E]/25 group-hover:bg-[#0077B6] group-hover:scale-125 transition-all duration-300" />
              )}
            </button>
          );
        })}
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
