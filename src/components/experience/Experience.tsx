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
    opacityRange = getSafeRange3(center - w * 0.45, center, center + w * 0.45);
    opacityOutput = [0, 1, 0];

    yRange = getSafeRange3(center - w * 0.45, center, center + w * 0.45);
    yOutput = [60, 0, -60];

    scaleRange = getSafeRange3(center - w * 0.45, center, center + w * 0.45);
    scaleOutput = [0.94, 1, 1.04];
  }

  const opacity = useTransform(progress, opacityRange, opacityOutput, { clamp: true });
  const y = useTransform(progress, yRange, yOutput, { clamp: true });
  const scale = useTransform(progress, scaleRange, scaleOutput, { clamp: true });
  const visibility = useTransform(opacity, (o) => (o > 0.01 ? "visible" : "hidden"));

  const shouldRender = Math.abs(active - index) <= 1;
  if (!shouldRender) return null;
  return (
    <motion.div
      style={{ opacity, y, scale, visibility }}
      className={`pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6 md:px-12 py-10`}
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
                    <path d="M14 17h3l2-4V7h-6v6h3zM3 13h3l2-4V7H2v6h3z"/>
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

              {/* Description - Slightly smaller space and font size */}
              <motion.p
                animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-4 text-xs sm:text-sm md:text-sm lg:text-[14.5px] text-[#475569] font-medium leading-relaxed max-w-2xl"
              >
                Whether you're implementing Salesforce, building AI-powered automation, launching
                digital products, or transforming customer operations — let's discuss what success
                looks like for your business.
              </motion.p>

              {/* Proven at Scale Label */}
              <div className="mt-2">
                <span className="text-[8.5px] md:text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest block mb-0.5">
                  Proven At Scale
                </span>
              </div>

              {/* Statistics Cards - Sized down to avoid overlaps and improve layout fit */}
              <div className="grid grid-cols-2 gap-2.5 w-full max-w-md mt-0.5">
                {statsItems.map((item, idx) => (
                  <motion.div
                    key={idx}
                    animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                    transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                    className="premium-glass-card premium-glass-card-hover rounded-xl p-1.5 px-3.5 flex items-center gap-3.5 cursor-default"
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
                {[
                  "Salesforce Partner",
                  "AI-Native Team",
                  "In-House Delivery",
                  "Enterprise Ready",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="glass-chip inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[#0284C7] text-[9.5px] md:text-[11px] font-black uppercase tracking-wider"
                  >
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
            <div className="premium-glass-card rounded-3xl p-5 md:p-6.5 flex flex-col gap-4 text-left relative overflow-hidden w-full max-w-[420px] mx-auto md:mx-0">
              {/* Subtle grid pattern in background */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <pattern
                    id="grid-card-contact-refined"
                    width="16"
                    height="16"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#000" strokeWidth="0.5" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid-card-contact-refined)" />
                </svg>
              </div>

              {/* Headline inside card */}
              <div className="border-b border-slate-200/40 pb-2">
                <span className="text-[10px] md:text-[11px] font-extrabold text-[#0284C7] uppercase tracking-widest block">
                  Speak Directly With Our Founders
                </span>
              </div>

              {/* Leadership Profiles - Vertically centered with larger photos */}
              <div className="flex flex-col gap-3">
                {/* Aashish */}
                <div className="flex items-center gap-4 premium-glass-card premium-glass-card-hover rounded-2xl p-2 px-3.5">
                  <div className="relative flex-shrink-0">
                    <img
                      src="/clients/Aashish Yadav.png"
                      className="w-13 h-13 rounded-full border border-sky-100 object-cover shadow-sm"
                      alt="Aashish Yadav"
                    />
                    <span className="absolute bottom-0 right-0 size-2.5 bg-emerald-500 ring-2 ring-white rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-none">
                      Aashish Yadav
                    </h4>
                    <p className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5 leading-none">
                      CEO & Founder
                    </p>
                    <span className="inline-flex items-center gap-1 mt-1.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full leading-none">
                      <span className="size-1 rounded-full bg-emerald-500" />
                      Active Online
                    </span>
                  </div>
                </div>

                {/* Yash */}
                <div className="flex items-center gap-4 premium-glass-card premium-glass-card-hover rounded-2xl p-2 px-3.5">
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
                    <p className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-wider mt-1.5 leading-none">
                      CTO & Co-Founder
                    </p>
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
                  {
                    label: "Website",
                    icon: Globe,
                    val: "cascadetech.ventures",
                    href: "https://cascadetech.ventures",
                  },
                  {
                    label: "Email",
                    icon: Mail,
                    val: "hello@cascadetech.ventures",
                    href: "mailto:hello@cascadetech.ventures",
                  },
                  {
                    label: "Phone",
                    icon: Phone,
                    val: "+91 98765 43210",
                    href: "tel:+919876543210",
                  },
                  {
                    label: "LinkedIn",
                    icon: Linkedin,
                    val: "linkedin.com/company/cascade-tech",
                    href: "https://linkedin.com",
                  },
                ].map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <a
                      key={chip.label}
                      href={chip.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-4 py-2.5 rounded-2xl premium-glass-card premium-glass-card-hover group/chip"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="size-4.5 text-[#0EA5E9] transition-transform duration-300 group-hover/chip:scale-110" />
                        <span className="text-xs md:text-[13px] font-bold text-slate-600 group-hover/chip:text-[#0EA5E9]">
                          {chip.val}
                        </span>
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
        <div
          className="absolute right-[-10%] top-[10%] w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(1,118,211,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[-5%] bottom-[-5%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(0,161,224,0.12) 0%, transparent 70%)",
          }}
        />

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
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
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

            <h2
              className="text-xl sm:text-[30px] md:text-[38px] lg:text-[48px] xl:text-[60px] 2xl:text-[72px] font-extrabold tracking-tight text-[#0F172A] font-display max-w-[600px] mb-2 md:mb-3"
              style={{ lineHeight: 0.95 }}
            >
              Close More Deals <br />
              with Intelligent <br />
              <span className="bg-gradient-to-r from-[#00A1E0] via-[#0176D3] to-[#0B5CAB] bg-clip-text text-transparent">
                Sales Cloud
              </span>
            </h2>

            <p
              className="text-sm sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[21px] 2xl:text-[25px] text-[#475569] font-medium max-w-[620px] mb-3 md:mb-4"
              style={{ lineHeight: 1.5 }}
            >
              Design Sales Cloud around your real sales process with AI-powered forecasting,
              opportunity management, lead automation and pipeline visibility.
            </p>

            {/* Checklist: Vertical Stack */}
            <div className="flex flex-col gap-2.5 md:gap-3.5 w-full">
              {[
                "End-to-end lead-to-cash architecture",
                "Einstein forecasting & opportunity scoring",
                "Custom CPQ, quoting and approvals",
                "Sales engagement and outreach automation",
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 group/item transition-transform duration-300 hover:translate-x-1 cursor-default"
                >
                  <div className="flex size-5 md:size-5.5 items-center justify-center rounded-full bg-[#0176D3]/10 border border-[#00A1E0]/20 text-[#0176D3] shadow-sm flex-shrink-0 group-hover/item:bg-[#0176D3] group-hover/item:text-white group-hover/item:shadow-md transition-all duration-300 mt-0.5">
                    <Check className="size-3 md:size-3.5 stroke-[3.5]" />
                  </div>
                  <span className="text-xs md:text-sm lg:text-[14px] xl:text-[15px] 2xl:text-[17px] text-[#475569] font-semibold group-hover/item:text-[#0F172A] transition-colors duration-300 leading-snug">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: CRM Pipeline Dashboard Card (60% width, h-fit, aligned & offset 20px upward relative to heading) */}
          <div className="w-full md:w-[58%] premium-glass-card rounded-[28px] p-5 md:p-6 flex flex-col justify-between h-fit md:mt-[16px] relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2.5">
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Salesforce Dashboard
                </span>
                <span className="text-sm md:text-base lg:text-[18px] font-black text-[#0F172A] leading-tight">
                  CRM Pipeline
                </span>
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
                  className="premium-glass-card premium-glass-card-hover rounded-xl p-2.5 md:p-3"
                >
                  <span className="block text-[8px] md:text-[9.5px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1 md:mb-1.5">
                    {card.label}
                  </span>
                  <span
                    className={`text-xs sm:text-sm md:text-[15px] lg:text-base font-black ${card.color}`}
                  >
                    {card.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Funnel chart (Salesforce brand blue gradient with thicker bars and hover scaling animations) */}
            <div className="flex flex-col gap-2 md:gap-2.5 flex-1 justify-center my-1 md:my-1.5">
              {funnelSteps.map((step) => (
                <div
                  key={step.label}
                  className="flex flex-col gap-0.5 md:gap-1 w-full group/bar cursor-pointer"
                >
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
                  <span className="text-xs md:text-sm font-black text-slate-800 leading-tight">
                    11.4%
                  </span>
                  <span className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    Win rate
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="size-8 md:size-8.5 rounded-full bg-[#0176D3]/10 text-[#0176D3] flex items-center justify-center border border-[#00A1E0]/20 shadow-sm flex-shrink-0">
                  <Target className="size-3.5 md:size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs md:text-sm font-black text-slate-800 leading-tight">
                    $32k
                  </span>
                  <span className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    Avg deal
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="size-8 md:size-8.5 rounded-full bg-[#0176D3]/10 text-[#0176D3] flex items-center justify-center border border-[#00A1E0]/20 shadow-sm flex-shrink-0">
                  <Calendar className="size-3.5 md:size-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs md:text-sm font-black text-slate-800 leading-tight">
                    28 days
                  </span>
                  <span className="text-[8px] md:text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    Sales cycle
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: Consolidated horizontal ribbon with a top accent blue border, positioned higher */}
        <div className="w-full border-t-[3px] border-t-[#0176D3] premium-glass-card rounded-2xl py-3 px-4 md:py-4 md:px-6 relative z-10 mt-4 md:mt-5 mb-1 md:mb-2">
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
                  <span className="text-[8px] md:text-[9.5px] text-[#475569] font-bold uppercase tracking-wider leading-none mb-1">
                    {card.label}
                  </span>
                  <span className="text-sm md:text-base lg:text-lg font-black text-[#0F172A] leading-none transition-colors duration-200 group-hover/kpi:text-[#0176D3]">
                    {card.val}
                  </span>
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
        <div
          className="absolute right-[-10%] top-[10%] w-[550px] h-[550px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(1,118,211,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[-5%] bottom-[-5%] w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(0,161,224,0.12) 0%, transparent 70%)",
          }}
        />

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
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
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

            <h2
              className="text-xl sm:text-[26px] md:text-[32px] lg:text-[40px] xl:text-[48px] 2xl:text-[56px] font-extrabold tracking-tight text-[#0F172A] font-display max-w-[500px] mb-1.5 md:mb-2.5"
              style={{ lineHeight: 0.95 }}
            >
              Create Personalized <br />
              Customer Journeys <br />
              <span className="bg-gradient-to-r from-[#00A1E0] via-[#0176D3] to-[#0B5CAB] bg-clip-text text-transparent">
                That Convert
              </span>
            </h2>

            <p
              className="text-xs sm:text-sm md:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[22px] text-[#475569] font-medium max-w-[520px] mb-1"
              style={{ lineHeight: 1.45 }}
            >
              Marketing Cloud helps businesses engage customers with personalized campaigns,
              automated journeys, audience segmentation, and AI-powered engagement across every
              channel.
            </p>
          </div>

          {/* RIGHT SIDE: Marketing Dashboard Card (50% width, compact size, shadow & grid) */}
          <div className="w-full md:w-[48%] premium-glass-card rounded-[24px] p-3 md:p-4 flex flex-col justify-between h-fit relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Marketing Performance Center
                </span>
                <span className="text-xs md:text-sm lg:text-[15px] font-black text-[#0F172A] leading-tight">
                  Campaign Performance
                </span>
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
                  className="premium-glass-card premium-glass-card-hover rounded-xl p-3 md:p-3 flex flex-col justify-between"
                >
                  <span className="block text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">
                    {card.label}
                  </span>
                  <span
                    className={`text-[11px] sm:text-xs md:text-[13px] lg:text-sm font-black ${card.color} leading-none`}
                  >
                    {card.val}
                  </span>
                </div>
              ))}
            </div>

            {/* Bar chart performance (Campaign Performance 7-day) */}
            <div className="pt-2 md:pt-2.5 border-t border-slate-100 mt-0.5">
              <div className="flex items-end justify-between h-10 md:h-12 lg:h-14 gap-1.5 my-0.5">
                {[35, 52, 42, 68, 78, 84, 92].map((h, i) => (
                  <div
                    key={i}
                    className="w-full bg-gradient-to-t from-[#0176D3] to-[#00A1E0] rounded-t-md hover:scale-y-[1.03] transition-all duration-200 cursor-pointer"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <p className="text-[7.5px] md:text-[8.5px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 text-center">
                Campaign Performance (7-day)
              </p>
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
                  className="premium-glass-card premium-glass-card-hover rounded-2xl p-3 flex items-start gap-3 h-[70px] md:h-[78px] lg:h-[84px] cursor-default"
                >
                  <div className="flex size-7 md:size-8 items-center justify-center rounded-full bg-[#0176D3]/10 border border-[#00A1E0]/20 text-[#0176D3] flex-shrink-0 mt-0.5 shadow-sm">
                    <IconComp className="size-4 stroke-[3.5]" />
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center h-full text-left">
                    <h4 className="font-bold text-xs md:text-sm lg:text-[14px] text-[#0F172A] leading-tight mb-0.5 truncate">
                      {it.title}
                    </h4>
                    <p className="text-[10px] md:text-xs lg:text-[12px] text-[#475569] font-medium leading-snug line-clamp-2">
                      {it.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM ROW: Consolidated horizontal ribbon with a top accent blue border */}
        <div className="w-full border-t-[3px] border-t-[#0176D3] premium-glass-card rounded-2xl py-2 px-3 md:py-2.5 md:px-5 relative z-10">
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
                  <span className="text-[7.5px] md:text-[8.5px] text-[#475569] font-bold uppercase tracking-wider leading-none mb-0.5">
                    {card.label}
                  </span>
                  <span className="text-xs sm:text-sm md:text-base font-black text-[#0F172A] leading-none transition-colors duration-200 group-hover/kpi:text-[#0176D3]">
                    {card.val}
                  </span>
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
    return (
      <div
        className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-3 pb-2.5 px-4 md:px-6 justify-between gap-2 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
        style={{
          background: "rgba(248, 250, 252, 0.95)",
          backdropFilter: "blur(24px)",
        }}
      >
        {/* Style injection for animations */}
        <style
          dangerouslySetInnerHTML={{
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
        `,
          }}
        />

        {/* Subtle geometric dot grid and blue ambient glows */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none -z-10"
          style={{
            backgroundImage: "radial-gradient(#0077B6 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
        <div
          className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(0,119,182,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(59,169,245,0.06) 0%, transparent 70%)",
          }}
        />

        {/* 2-Column main content layout */}
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 items-stretch w-full flex-1 min-h-0 relative z-10 my-1 overflow-y-auto lg:overflow-hidden">
          {/* LEFT SIDE (35% on lg screens) */}
          <div className="w-full lg:w-[35%] flex flex-col justify-start text-left lg:pr-4 flex-shrink-0 pt-2 lg:pt-6">
            <div className="inline-flex items-center gap-1.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1 text-[10px] md:text-[11px] font-bold tracking-wider text-[#0077B6] w-fit mb-3">
              <span className="size-1.5 rounded-full bg-[#0077B6] animate-pulse" />
              OUR PRODUCT ECOSYSTEM
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] xl:text-[42px] font-[900] leading-[1.1] tracking-tight text-[#0F172A] font-display">
              Real Problems.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0077B6] to-[#3BA9F5]">
                Purpose-Built Products.
              </span>
            </h2>

            <p className="mt-4 text-xs md:text-sm text-slate-500 font-medium leading-relaxed max-w-[360px]">
              Most Salesforce partners implement what Salesforce sells. We went further. Working with real estate developers and enterprise teams, we built products that solve real business problems. Every product is deployed, actively used, and continuously improved with real customers.
            </p>
          </div>

          {/* RIGHT SIDE (65% on lg screens) - 2x2 Grid of Premium Cards */}
          <div className="w-full lg:w-[65%] flex flex-col min-h-0 justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:gap-4 overflow-y-auto max-h-[50vh] lg:max-h-[56vh] xl:max-h-[60vh] pr-1.5 pb-2 scrollbar-thin">
              
              {/* Card 1: Cascade Connect */}
              <div className="bg-white/80 backdrop-blur-md border border-slate-100 hover:border-[#3BA9F5]/40 rounded-[24px] p-4 flex flex-col justify-between h-[250px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,169,245,0.08)] group relative overflow-hidden">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-[#0077B6] shadow-[0_4px_12px_rgba(0,119,182,0.08)] group-hover:scale-105 transition-transform duration-300">
                        <MessageSquare className="w-5 h-5 text-[#0077B6]" />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-[900] text-[#0F172A] leading-none tracking-tight">
                          Cascade Connect
                        </h3>
                        <p className="text-[10px] font-bold text-[#0077B6] mt-0.5 leading-tight">
                          Omnichannel communication platform inside Salesforce.
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-sky-100 bg-[#F0F9FF] text-[#0077B6] text-[9px] font-bold shadow-sm flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0077B6] animate-pulse"></span>
                      Live
                    </div>
                  </div>

                  {/* Custom visualization for Cascade Connect */}
                  <div className="border border-slate-100/60 rounded-xl p-1 bg-slate-50/50 mt-2.5 flex items-center justify-center h-[62px] relative overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-between px-2">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 15 25 C 40 25, 45 50, 50 50" fill="none" className="animated-flow-line stroke-[#0077B6]" strokeWidth="1.5" />
                        <path d="M 15 50 L 50 50" fill="none" className="animated-flow-line stroke-[#3BA9F5]" strokeWidth="1.5" />
                        <path d="M 15 75 C 40 75, 45 50, 50 50" fill="none" className="animated-flow-line stroke-[#6EC8FF]" strokeWidth="1.5" />
                        <path d="M 50 50 L 85 50" fill="none" className="animated-flow-line stroke-[#0077B6]" strokeWidth="1.5" />
                      </svg>
                      <div className="flex flex-col justify-between h-full py-0.5 z-10 w-[30%]">
                        <div className="flex items-center gap-0.5 bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs text-[7px] font-bold text-slate-600">
                          <MessageSquare className="w-2 h-2 text-[#0077B6]" /> WhatsApp
                        </div>
                        <div className="flex items-center gap-0.5 bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs text-[7px] font-bold text-slate-600">
                          <Mail className="w-2 h-2 text-[#3BA9F5]" /> Email
                        </div>
                        <div className="flex items-center gap-0.5 bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs text-[7px] font-bold text-slate-600">
                          <Phone className="w-2 h-2 text-[#6EC8FF]" /> SMS
                        </div>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white border border-[#0077B6] flex items-center justify-center shadow-sm z-10">
                        <div className="w-3 h-3 rounded-full bg-[#0077B6]" />
                      </div>
                      <div className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded p-1 shadow-sm z-10 w-[30%]">
                        <Cloud className="w-3 h-3 text-[#0077B6]" />
                        <span className="text-[7px] font-bold text-slate-700 mt-0.5">CRM Sync</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {["WhatsApp", "Email", "SMS", "History", "Read Receipts"].map((feature) => {
                      let IconComponent = MessageSquare;
                      if (feature === "Email") IconComponent = Mail;
                      if (feature === "SMS") IconComponent = Phone;
                      if (feature === "History") IconComponent = Clock;
                      if (feature === "Read Receipts") IconComponent = Check;
                      return (
                        <span key={feature} className="inline-flex items-center gap-0.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-1.5 py-0.5 text-[8.5px] font-bold text-[#0077B6]">
                          <IconComponent className="w-2 h-2 text-[#0077B6]" />
                          {feature}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom status metrics */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100/80 text-left">
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Sync Status</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">100% Native</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Response</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">&lt; 1s Real-time</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Delivery</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">99.9% Acc.</span>
                  </div>
                </div>
              </div>

              {/* Card 2: CX Prism™ */}
              <div className="bg-white/80 backdrop-blur-md border border-slate-100 hover:border-[#3BA9F5]/40 rounded-[24px] p-4 flex flex-col justify-between h-[250px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,169,245,0.08)] group relative overflow-hidden">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-[#0077B6] shadow-[0_4px_12px_rgba(0,119,182,0.08)] group-hover:scale-105 transition-transform duration-300">
                        <LineChart className="w-5 h-5 text-[#0077B6]" />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-[900] text-[#0F172A] leading-none tracking-tight">
                          CX Prism™
                        </h3>
                        <p className="text-[10px] font-bold text-[#0077B6] mt-0.5 leading-tight">
                          AI-powered customer intelligence platform.
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-blue-100 bg-[#F0F9FF] text-[#3BA9F5] text-[9px] font-bold shadow-sm flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3BA9F5] animate-pulse"></span>
                      Deployment
                    </div>
                  </div>

                  {/* Custom visualization for CX Prism */}
                  <div className="border border-slate-100/60 rounded-xl p-1 bg-slate-50/50 mt-2.5 flex items-center justify-center h-[62px] relative overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-between px-2 gap-2">
                      <div className="flex flex-col items-center justify-center w-[40%] h-full border-r border-slate-100 pr-2">
                        <span className="text-[6.5px] uppercase font-bold text-slate-400">Health</span>
                        <div className="relative w-10 h-7 flex items-center justify-center mt-0.5">
                          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#F1F5F9" strokeWidth="12" strokeLinecap="round" />
                            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#health-gauge-grad)" strokeWidth="12" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset="22" />
                            <defs>
                              <linearGradient id="health-gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#3BA9F5" />
                                <stop offset="100%" stopColor="#0077B6" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute top-2 flex flex-col items-center">
                            <span className="text-[10px] font-extrabold text-[#0F172A]">82</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between w-[60%] h-full pl-1 py-0.5">
                        <span className="text-[6.5px] uppercase font-bold text-slate-400 text-left">Sentiment Trend</span>
                        <div className="relative w-full h-6">
                          <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                            <path d="M 0 35 Q 20 15 40 28 T 80 10 T 100 5" fill="none" stroke="#0077B6" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M 0 35 Q 20 15 40 28 T 80 10 T 100 5 L 100 40 L 0 40 Z" fill="url(#trend-grad)" />
                            <defs>
                              <linearGradient id="trend-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#3BA9F5" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#3BA9F5" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <circle cx="100" cy="5" r="2" fill="#0077B6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {["NPS Analytics", "Churn Predict", "Health Score", "Revenue Intel"].map((feature) => {
                      let IconComponent = TrendingUp;
                      if (feature === "Churn Predict") IconComponent = AlertTriangle;
                      if (feature === "Health Score") IconComponent = HeartPulse;
                      if (feature === "Revenue Intel") IconComponent = LineChart;
                      return (
                        <span key={feature} className="inline-flex items-center gap-0.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-1.5 py-0.5 text-[8.5px] font-bold text-[#0077B6]">
                          <IconComponent className="w-2 h-2 text-[#0077B6]" />
                          {feature}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom status metrics */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100/80 text-left">
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Accuracy</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">94.5% AI Model</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Risk Alerts</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">Real-time Live</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">NPS Score</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">72 Avg. Score</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Case Flow */}
              <div className="bg-white/80 backdrop-blur-md border border-slate-100 hover:border-[#3BA9F5]/40 rounded-[24px] p-4 flex flex-col justify-between h-[250px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,169,245,0.08)] group relative overflow-hidden">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-[#0077B6] shadow-[0_4px_12px_rgba(0,119,182,0.08)] group-hover:scale-105 transition-transform duration-300">
                        <Workflow className="w-5 h-5 text-[#0077B6]" />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-[900] text-[#0F172A] leading-none tracking-tight">
                          Case Flow
                        </h3>
                        <p className="text-[10px] font-bold text-[#0077B6] mt-0.5 leading-tight">
                          AI Customer Case Management Platform.
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-sky-100 bg-[#F0F9FF] text-[#0077B6] text-[9px] font-bold shadow-sm flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0077B6] animate-pulse"></span>
                      Live
                    </div>
                  </div>

                  {/* Custom visualization for Case Flow */}
                  <div className="border border-slate-100/60 rounded-xl p-1 bg-slate-50/50 mt-2.5 flex items-center justify-center h-[62px] relative overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-between px-1">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 60" preserveAspectRatio="none">
                        <path d="M 30 30 L 170 30" fill="none" className="animated-flow-line stroke-[#3BA9F5]" strokeWidth="2" />
                      </svg>
                      <div className="flex flex-col items-center bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs z-10 w-[22%]">
                        <MessageSquare className="w-2.5 h-2.5 text-[#0077B6]" />
                        <span className="text-[6px] font-bold text-slate-500 uppercase mt-0.5">Inbound</span>
                      </div>
                      <div className="flex flex-col items-center bg-white border border-[#0077B6]/30 rounded px-1 py-0.5 shadow-xs z-10 w-[24%] ring-2 ring-[#0077B6]/5">
                        <Sparkles className="w-2.5 h-2.5 text-[#0077B6] animate-pulse" />
                        <span className="text-[6px] font-bold text-[#0077B6] uppercase mt-0.5">AI Route</span>
                      </div>
                      <div className="flex flex-col items-center bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs z-10 w-[22%]">
                        <Clock className="w-2.5 h-2.5 text-[#3BA9F5]" />
                        <span className="text-[6px] font-bold text-slate-500 uppercase mt-0.5">SLA Watch</span>
                      </div>
                      <div className="flex flex-col items-center bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs z-10 w-[22%]">
                        <ShieldCheck className="w-2.5 h-2.5 text-[#6EC8FF]" />
                        <span className="text-[6px] font-bold text-slate-500 uppercase mt-0.5">Resolve</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {["Auto Routing", "SLA Auto", "Escalation", "Resolution"].map((feature) => {
                      let IconComponent = RefreshCw;
                      if (feature === "SLA Auto") IconComponent = Clock;
                      if (feature === "Escalation") IconComponent = AlertTriangle;
                      if (feature === "Resolution") IconComponent = Check;
                      return (
                        <span key={feature} className="inline-flex items-center gap-0.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-1.5 py-0.5 text-[8.5px] font-bold text-[#0077B6]">
                          <IconComponent className="w-2 h-2 text-[#0077B6]" />
                          {feature}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom status metrics */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100/80 text-left">
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Auto-Route</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">92% Classified</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Avg SLA</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">12 min Target</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Resolved</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">98.6% Solved</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Nexora */}
              <div className="bg-white/80 backdrop-blur-md border border-slate-100 hover:border-[#3BA9F5]/40 rounded-[24px] p-4 flex flex-col justify-between h-[250px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(59,169,245,0.08)] group relative overflow-hidden">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/60 flex items-center justify-center text-[#0077B6] shadow-[0_4px_12px_rgba(0,119,182,0.08)] group-hover:scale-105 transition-transform duration-300">
                        <Users className="w-5 h-5 text-[#0077B6]" />
                      </div>
                      <div>
                        <h3 className="text-sm md:text-base font-[900] text-[#0F172A] leading-none tracking-tight">
                          Nexora
                        </h3>
                        <p className="text-[10px] font-bold text-[#0077B6] mt-0.5 leading-tight">
                          Partner & Sourcing Management Platform.
                        </p>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-sky-100 bg-[#F0F9FF] text-[#0077B6] text-[9px] font-bold shadow-sm flex-shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0077B6] animate-pulse"></span>
                      Live
                    </div>
                  </div>

                  {/* Custom visualization for Nexora */}
                  <div className="border border-slate-100/60 rounded-xl p-1 bg-slate-50/50 mt-2.5 flex items-center justify-center h-[62px] relative overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 60" preserveAspectRatio="none">
                        <path d="M 100 30 L 45 15" className="animated-flow-line stroke-[#0077B6]" strokeWidth="1.5" />
                        <path d="M 100 30 L 45 45" className="animated-flow-line stroke-[#3BA9F5]" strokeWidth="1.5" />
                        <path d="M 100 30 L 155 30" className="animated-flow-line stroke-[#6EC8FF]" strokeWidth="1.5" />
                      </svg>
                      <div className="absolute left-[88px] top-[18px] w-6 h-6 rounded-full bg-white border border-[#0077B6] flex items-center justify-center shadow-xs z-10">
                        <Database className="w-3 h-3 text-[#0077B6]" />
                      </div>
                      <div className="absolute left-[12px] top-[4px] flex items-center gap-0.5 bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs text-[6.5px] font-bold text-slate-600 z-10">
                        <Users className="w-2 h-2 text-[#0077B6]" /> Partner A
                      </div>
                      <div className="absolute left-[12px] bottom-[4px] flex items-center gap-0.5 bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs text-[6.5px] font-bold text-slate-600 z-10">
                        <Users className="w-2 h-2 text-[#3BA9F5]" /> Partner B
                      </div>
                      <div className="absolute right-[15px] top-[20px] flex items-center gap-0.5 bg-white border border-slate-100 rounded px-1 py-0.5 shadow-xs text-[6.5px] font-bold text-slate-600 z-10">
                        <Compass className="w-2 h-2 text-[#6EC8FF]" /> Supply Hub
                      </div>
                    </div>
                  </div>

                  {/* Feature chips */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {["Meeting Plan", "Activity Track", "Partner Mgmt", "Deal Pipeline"].map((feature) => {
                      let IconComponent = Calendar;
                      if (feature === "Activity Track") IconComponent = Gauge;
                      if (feature === "Partner Mgmt") IconComponent = Users;
                      if (feature === "Deal Pipeline") IconComponent = TrendingUp;
                      return (
                        <span key={feature} className="inline-flex items-center gap-0.5 bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-1.5 py-0.5 text-[8.5px] font-bold text-[#0077B6]">
                          <IconComponent className="w-2 h-2 text-[#0077B6]" />
                          {feature}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom status metrics */}
                <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-100/80 text-left">
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Partners</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">120+ Active</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Pipeline</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">₹4.2Cr Sourced</span>
                  </div>
                  <div>
                    <span className="text-[7.5px] uppercase font-bold text-slate-400 block leading-none">Activity</span>
                    <span className="text-[10px] font-black text-slate-800 leading-tight">High Index</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* PREMIUM METRIC STRIP: Slim unified glass ribbon */}
        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-3 md:gap-4 w-full max-w-5xl mx-auto py-2.5 px-6 rounded-2xl bg-white/80 backdrop-blur-md border border-[#0077B6]/15 shadow-[0_10px_30px_rgba(59,169,245,0.04)] z-10 relative">
          {[
            { value: "3+", label: "Live Products", emoji: "🚀" },
            { value: "100%", label: "Paying Clients", emoji: "✅" },
            { value: "8+", label: "Enterprise Clients", emoji: "🏢" },
            { value: "100%", label: "Built In-house", emoji: "🛠" },
          ].map((stat, idx) => (
            <div key={idx} className="flex items-center gap-3 px-2 py-0.5 group cursor-default">
              <span className="text-xl md:text-2xl">{stat.emoji}</span>
              <div className="flex flex-col text-left">
                <span className="text-base md:text-lg font-black text-slate-800 tracking-tight leading-none">
                  {stat.value}
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 mt-1 leading-none">
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

  if (scene.id === 7) {
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
        <div
          className="absolute right-[-10%] top-[10%] w-[450px] h-[450px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(1,118,211,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute left-[-5%] bottom-[-5%] w-[350px] h-[350px] rounded-full blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(0,161,224,0.06) 0%, transparent 70%)",
          }}
        />

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
          </div>

          {/* RIGHT SIDE: Description Paragraphs */}
          <div className="w-full md:flex-1 flex flex-col justify-start text-left max-w-[620px] pt-0 md:pt-[24px]">
            <p className="text-[14.5px] md:text-[18px] lg:text-[20px] font-[800] text-[#0F172A] leading-tight mb-1.5">
              Deep industry-specific solutions built on Salesforce.
              <br />
              We deploy AI where it matters.
            </p>
            <p className="text-[12.5px] md:text-[15px] lg:text-[16px] text-slate-500 font-semibold leading-relaxed">
              We design custom workflows, secure database architectures, and automated customer
              journeys designed specifically to solve the unique operational pressures of your
              industry vertical.
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
                className={`rounded-[20px] p-3.5 flex flex-row items-center gap-3.5 text-left relative overflow-hidden group min-h-[96px] md:min-h-[110px] w-full ${ind.highlight
                  ? "premium-glass-card-active"
                  : "premium-glass-card premium-glass-card-hover"
                  }`}
              >
                {/* Background brand color glow reflection */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-br opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10 ${ind.highlight
                    ? "from-[#0EA5E9]/10 to-transparent"
                    : "from-[#0EA5E9]/5 to-transparent"
                    }`}
                />

                {/* 64px Icon Wrapper */}
                <div
                  className={`w-[60px] md:w-[64px] h-[60px] md:h-[64px] flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 flex-shrink-0 ${ind.highlight
                    ? "bg-gradient-to-br from-[#0EA5E9] to-[#2563EB] text-white shadow-[0_6px_20px_rgba(14,165,233,0.25)]"
                    : "bg-[#F0F9FF] border border-[#E0F2FE]/50 text-[#0EA5E9] shadow-[0_4px_12px_rgba(14,165,233,0.08)]"
                    }`}
                >
                  <IconComp
                    className={`w-7 md:w-8 h-7 md:h-8 ${ind.highlight ? "text-white" : "text-[#0EA5E9]"}`}
                  />
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
          </div>

          {/* RIGHT SIDE: Subheading */}
          <div className="w-full md:max-w-[40%] lg:max-w-[450px] flex flex-col justify-center text-left">
            <p className="text-[11px] md:text-[13px] lg:text-[14.5px] text-slate-500 font-semibold leading-relaxed">
              We combine Salesforce expertise, AI innovation, product thinking and real-world
              industry execution to deliver measurable business outcomes.
            </p>
          </div>
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
        className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-5 pb-5 px-4 md:px-6 justify-center gap-4 md:gap-5 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)]"
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
              <p className="text-[11px] md:text-[12.5px] lg:text-[14px] text-slate-500 font-semibold leading-relaxed mb-4">
                From Mumbai's leading real estate developers to growing enterprise organizations,
                Cascade Tech powers Salesforce, AI and automation initiatives across multiple
                industries.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-2.5 mt-auto">
              {[
                { value: "8+", label: "Clients Served" },
                { value: "5", label: "Cities" },
                { value: "5", label: "Industries" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="premium-glass-card premium-glass-card-hover rounded-2xl p-3 text-left flex flex-col justify-center"
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

  if (scene.id === 10) {
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
        <div
          className="absolute top-12 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-radial-blue opacity-20 blur-3xl pointer-events-none -z-10"
          style={{
            background: "radial-gradient(circle, rgba(2,132,199,0.15) 0%, transparent 70%)",
          }}
        />

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
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-5"
            style={{ zIndex: 1 }}
          >
            <line
              x1="33%"
              y1="10%"
              x2="33%"
              y2="90%"
              stroke="#0284C7"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <line
              x1="67%"
              y1="10%"
              x2="67%"
              y2="90%"
              stroke="#0284C7"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
            <line
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="#0284C7"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
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
                  className={`group relative rounded-[24px] flex flex-col justify-between text-center flex-1 h-full overflow-hidden ${isSalesCloud
                    ? "premium-glass-card-active"
                    : "premium-glass-card premium-glass-card-hover"
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
                    <div
                      className={`relative flex items-center justify-center rounded-full text-white shadow-[0_8px_24px_rgba(2,132,199,0.35)] group-hover:shadow-[0_16px_40px_rgba(2,132,199,0.5)] group-hover:scale-110 transition-all duration-500 flex-shrink-0 size-16 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7]`}
                    >
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
                      className="premium-glass-card rounded-2xl p-3 flex flex-col justify-between min-h-[90px]"
                    >
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
                    <div className="premium-glass-card rounded-2xl p-4 md:p-5 flex flex-col justify-start text-left">
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
      desc: "Aligning operational workflows and requirements with zero assumptions.",
      challenge:
        "Fragmented processes, undocumented spreadsheets, and lack of real-time pipeline visibility.",
      whatWeBuild:
        "Detailed operational audit, systems map, and technical architecture definition.",
      deliverables: [
        "Lead Flow Audit Map",
        "API/CRM Integration Specs",
        "Success Metric Benchmarks",
      ],
      outcome: "Aligned timeline, budget, and system architecture design document.",
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
      desc: "Designing database schemas and automation workflows.",
      challenge: "Data model conflicts, security schema holes, and duplicate contact profiles.",
      whatWeBuild:
        "Custom Entity Relationship Diagram (ERD) and object schema configuration blueprints.",
      deliverables: [
        "Entity Relationship Diagrams (ERDs)",
        "Field-Level Security Matrix",
        "Sandbox Initialization Plans",
      ],
      outcome: "Technical blueprint signed off and sandbox environments provisioned.",
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
      desc: "Developing custom Apex, LWC, and CRM flow triggers.",
      challenge:
        "Unreliable manual actions, sluggish data processing, and lack of automated alerts.",
      whatWeBuild: "Robust custom apex coding, lightning web components (LWC), and API flows.",
      deliverables: [
        "Apex & Flow Automations",
        "WhatsApp API Integration",
        "Migration scripts & runs",
      ],
      outcome: "Fully integrated and custom-coded CRM platform ready in staging.",
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
      desc: "Enabling teams and addressing feedback loops.",
      challenge: "Low user adoption rates, administrative skill gaps, and transition friction.",
      whatWeBuild: "Custom role-based training programs, UAT cycles, and transition playbooks.",
      deliverables: [
        "UAT Testing Cycles",
        "Role-Based Training Manuals",
        "Administrator Enablement Guides",
      ],
      outcome: "Stakeholder sign-off and adoption readiness verified.",
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
      title: "Go-Live & Support",
      duration: "Post Week 12",
      desc: "Deploying to production and supporting adoption.",
      challenge: "Deployment downtime, cutover synchronization, and post-launch bugs.",
      whatWeBuild:
        "Safe production package migration, 30-day hypercare, and ongoing annual maintenance (AMC).",
      deliverables: [
        "Production Cutover Checklist",
        "30-Day Hypercare Support",
        "Long-term AMC Setup",
      ],
      outcome: "Live system deployed with zero downtime and continuous support.",
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
      className="pointer-events-auto who-we-are-glass-panel rounded-[32px] w-[92vw] md:w-[90vw] h-[88vh] md:h-[82vh] max-w-7xl relative overflow-y-auto md:overflow-hidden flex flex-col pt-5 pb-5 px-4 md:px-6 justify-center gap-4 md:gap-5 border border-white/20 shadow-[0_30px_100px_rgba(1,118,211,0.08)] shadow-[inset_0_0_20px_rgba(255,255,255,0.75)] animate-in fade-in duration-500"
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
            <p className="text-[10.5px] md:text-[12.5px] lg:text-[13.5px] text-slate-500 font-semibold leading-relaxed mb-3 md:mb-4 pr-2">
              We believe in structured delivery, complete alignment, and deep operational
              understanding. From the initial discovery to production launch, here is our roadmap
              for your project.
            </p>
          </div>

          {/* Timeline Summary Card */}
          <div className="premium-glass-card premium-glass-card-hover rounded-2xl p-3.5 md:p-4 flex items-start gap-3.5 mt-auto">
            <div className="size-9 rounded-xl bg-sky-50 flex items-center justify-center text-[#0284C7] border border-sky-100 flex-shrink-0 mt-0.5">
              <Clock className="size-5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
                TYPICAL TIMELINE
              </span>
              <span className="text-base md:text-lg lg:text-xl font-[900] text-slate-900 leading-tight block mt-0.5">
                8–14 Weeks
              </span>
              <p className="text-[9.5px] md:text-[11px] text-slate-500 font-semibold leading-relaxed mt-1">
                Complex multi-module projects for India's top developers — delivered on time and on
                budget.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN / CENTER: 68% width */}
        <div className="w-full md:w-[68%] flex flex-col justify-center h-full py-1 relative">
          {/* Background Visual Roadmap Illustration */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.06] md:opacity-[0.08] select-none z-0 overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circuit board pathways in background connecting nodes */}
              <path
                d="M120,180 Q250,80 400,150 T680,120"
                stroke="#0284C7"
                strokeWidth="2.5"
                strokeDasharray="5,5"
              />
              <path
                d="M120,320 Q250,420 400,350 T680,380"
                stroke="#0EA5E9"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <path
                d="M280,120 L280,380"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />
              <path
                d="M520,120 L520,380"
                stroke="#6366F1"
                strokeWidth="1.5"
                strokeDasharray="4,4"
              />

              {/* Node definitions */}
              <g transform="translate(120, 180)">
                <circle r="22" fill="#F0F9FF" stroke="#0EA5E9" strokeWidth="1.5" />
                <text fill="#0284C7" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">
                  Salesforce
                </text>
              </g>
              <g transform="translate(280, 120)">
                <circle r="22" fill="#ECFDF5" stroke="#10B981" strokeWidth="1.5" />
                <text fill="#047857" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">
                  AI Engine
                </text>
              </g>
              <g transform="translate(280, 380)">
                <circle r="22" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1.5" />
                <text fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">
                  CRM
                </text>
              </g>
              <g transform="translate(420, 200)">
                <circle r="22" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="1.5" />
                <text fill="#BE123C" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">
                  WhatsApp
                </text>
              </g>
              <g transform="translate(520, 120)">
                <circle r="22" fill="#F5F3FF" stroke="#8B5CF6" strokeWidth="1.5" />
                <text fill="#6D28D9" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">
                  Integrations
                </text>
              </g>
              <g transform="translate(520, 380)">
                <circle r="22" fill="#EFF6FF" stroke="#3B82F6" strokeWidth="1.5" />
                <text fill="#1D4ED8" fontSize="8" fontWeight="bold" textAnchor="middle" y="3">
                  Deployment
                </text>
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
                  <div
                    className={`size-10 rounded-full flex items-center justify-center border transition-all duration-500 z-20 bg-white relative ${isActive
                      ? "border-[#0EA5E9] text-[#0EA5E9] shadow-[0_0_15px_rgba(14,165,233,0.25)] scale-110"
                      : "border-slate-200 text-slate-400 group-hover:border-[#0EA5E9]/50 group-hover:text-[#0EA5E9]/70"
                      }`}
                  >
                    <Icon
                      className={`size-4.5 transition-transform duration-500 ${isActive ? "scale-110 rotate-3" : "group-hover:scale-105"}`}
                    />
                    {isActive && (
                      <span className="absolute inset-0 rounded-full bg-[#0EA5E9]/10 animate-ping pointer-events-none" />
                    )}
                  </div>

                  {/* Card Container */}
                  <div
                    className={`mt-4 rounded-2xl p-4 flex-1 flex flex-col justify-between transition-all duration-500 w-full relative z-10 ${isActive
                      ? "premium-glass-card-active -translate-y-1.5"
                      : "premium-glass-card premium-glass-card-hover"
                      }`}
                  >
                    <div>
                      {/* Step & Duration */}
                      <div className="flex flex-col items-center">
                        <span
                          className={`text-[8.5px] font-bold tracking-widest uppercase transition-colors duration-300 ${isActive ? "text-[#0EA5E9]" : "text-slate-400"
                            }`}
                        >
                          STAGE {stage.id}
                        </span>

                        <span className="mt-0.5 text-xs lg:text-[13px] font-[800] text-slate-800 leading-tight">
                          {stage.title}
                        </span>

                        <span
                          className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-extrabold border transition-all ${isActive
                            ? "text-[#0EA5E9] bg-sky-50 border-sky-100"
                            : "text-slate-500 bg-slate-50 border-slate-100/80"
                            }`}
                        >
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
                  className={`flex gap-3.5 p-3.5 rounded-2xl cursor-pointer ${isActive
                    ? "premium-glass-card-active scale-[1.01]"
                    : "premium-glass-card premium-glass-card-hover"
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
          <div className="absolute inset-y-0 right-0 w-full sm:w-[460px] bg-white border-l border-slate-200/80 shadow-[0_0_80px_rgba(15,23,42,0.15)] flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
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
              <div className="premium-glass-card rounded-2xl p-4 flex items-center justify-center min-h-[120px] relative overflow-hidden">
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
                <div className="flex flex-col gap-2 premium-glass-card rounded-xl p-3.5">
                  {currentStage.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="size-4.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0 mt-0.5">
                        <Check className="size-2.5" />
                      </span>
                      <span className="text-slate-600 text-[11px] font-bold mt-0.5">{item}</span>
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
    <div className="premium-glass-card premium-glass-card-hover rounded-xl p-1 md:p-1.5 flex items-center justify-center text-center min-h-[58px] md:min-h-[72px] overflow-hidden group/card">
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
    setActive(Math.min(N - 1, Math.round(v * (N - 1))));
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
      duration: 1.0,
      ease: "power2.inOut",
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

  // Turn off manual scroll events
  useEffect(() => {
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    window.addEventListener("wheel", preventDefault, { passive: false });
    window.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      window.removeEventListener("wheel", preventDefault);
      window.removeEventListener("touchmove", preventDefault);
    };
  }, []);

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
        if (targetActiveRef.current < N - 1) {
          targetActiveRef.current += 1;
          scrollToScene(targetActiveRef.current);
        }
      } else if (isUp || isLeft) {
        e.preventDefault();
        if (targetActiveRef.current > 0) {
          targetActiveRef.current -= 1;
          scrollToScene(targetActiveRef.current);
        }
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
