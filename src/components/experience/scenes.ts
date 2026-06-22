import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Sparkles,
  Workflow,
  Users,
  Lightbulb,
  HeartHandshake,
  CloudCog,
  Megaphone,
  Globe,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Target,
  TrendingUp,
  LineChart,
  Route as RouteIcon,
  BrainCircuit,
  PhoneCall,
  RefreshCw,
  Gauge,
  Wallet,
  Server,
  Mic,
  Database,
  Network,
  Flag,
  Rocket,
  PlugZap,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

export type SceneItem = {
  icon: LucideIcon;
  title: string;
  body?: string;
};

export type Scene = {
  id: number;
  kicker: string;
  title: string;
  subtitle?: string;
  /** color accent in oklch tokens: primary | secondary */
  items?: SceneItem[];
  /** optional special stat row */
  stats?: { label: string; value: string }[];
  /** layout hint */
  variant?: "hero" | "grid" | "duo" | "flow" | "final";
  align?: "left" | "center";
};

export const SCENES: Scene[] = [
  {
    id: 1,
    kicker: "Cascade Tech Ventures",
    title: "Empowering Growth Through Salesforce Expertise & AI Innovation",
    subtitle:
      "Unlocking potential through strategic Salesforce solutions and next-generation AI voice technology.",
    variant: "hero",
    align: "center",
    items: [
      { icon: Building2, title: "Salesforce Core" },
      { icon: BrainCircuit, title: "AI Innovation Hub" },
      { icon: LineChart, title: "Analytics" },
      { icon: Users, title: "CRM Towers" },
    ],
  },
  {
    id: 2,
    kicker: "District 02 · Foundations",
    title: "Who We Are",
    variant: "grid",
    items: [
      {
        icon: Sparkles,
        title: "Tailored Digital Transformation",
        body: "We facilitate transformation with tailored, data-driven strategies built around specific business needs.",
      },
      {
        icon: Workflow,
        title: "Enhanced Operational Efficiency",
        body: "Automated workflows simplify complex processes and minimize manual, repetitive tasks.",
      },
      {
        icon: Users,
        title: "CRM Expertise for Success",
        body: "We empower organizations to manage relationships and elevate customer satisfaction.",
      },
    ],
  },
  {
    id: 3,
    kicker: "District 03 · Principles",
    title: "Our Values",
    variant: "duo",
    items: [
      {
        icon: Lightbulb,
        title: "Innovation",
        body: "Innovation drives us to develop forward-thinking solutions.",
      },
      {
        icon: HeartHandshake,
        title: "Client Commitment",
        body: "Your success defines our success.",
      },
    ],
  },
  {
    id: 4,
    kicker: "District 04 · Cloud Skyline",
    title: "Specializations Overview",
    variant: "grid",
    items: [
      { icon: Target, title: "Sales Cloud" },
      { icon: Megaphone, title: "Marketing Cloud" },
      { icon: Globe, title: "Experience Cloud" },
      { icon: HeartPulse, title: "Health Cloud" },
      { icon: GraduationCap, title: "Education Cloud" },
      { icon: ShoppingCart, title: "Commerce Cloud" },
    ],
  },
  {
    id: 5,
    kicker: "District 05 · Sales Cloud",
    title: "Boosting Sales Productivity with Sales Cloud",
    variant: "flow",
    items: [
      {
        icon: Users,
        title: "Enhanced Lead Management",
        body: "Capture, qualify and route leads intelligently.",
      },
      {
        icon: Target,
        title: "Strategic Opportunity Tracking",
        body: "Visualize every deal across the pipeline.",
      },
      {
        icon: TrendingUp,
        title: "Accurate Sales Forecasting",
        body: "Predict revenue with confidence.",
      },
    ],
    stats: [
      { label: "Lead", value: "01" },
      { label: "Opportunity", value: "02" },
      { label: "Proposal", value: "03" },
      { label: "Conversion", value: "04" },
    ],
  },
  {
    id: 6,
    kicker: "District 06 · Marketing Cloud",
    title: "Marketing Cloud Solutions",
    variant: "flow",
    items: [
      {
        icon: LineChart,
        title: "Data-Driven Campaigns",
        body: "Every send backed by real signals.",
      },
      {
        icon: RouteIcon,
        title: "Personalized Customer Journeys",
        body: "Right message, right moment, every channel.",
      },
      {
        icon: BrainCircuit,
        title: "AI-Powered Insights",
        body: "An intelligence layer above every journey.",
      },
    ],
    stats: [
      { label: "Awareness", value: "→" },
      { label: "Engagement", value: "→" },
      { label: "Conversion", value: "→" },
      { label: "Loyalty", value: "★" },
    ],
  },
  {
    id: 7,
    kicker: "District 07 · Flagship Build",
    title: "Introducing Our Flagship Build: AI Voice Platform",
    subtitle: "AI Voice Platform with Salesforce Integration.",
    variant: "grid",
    items: [
      {
        icon: PhoneCall,
        title: "AI-Driven Calls",
        body: "Intelligent outbound and inbound voice conversations.",
      },
      {
        icon: RefreshCw,
        title: "Automatic CRM Updates",
        body: "Every call syncs back to Salesforce in real time.",
      },
      {
        icon: Gauge,
        title: "Real-Time Pipeline Intelligence",
        body: "Live dashboards reveal momentum as it happens.",
      },
    ],
  },
  {
    id: 8,
    kicker: "District 08 · Economics",
    title: "Cost Strategy: Build for Free, Pay to Scale",
    variant: "grid",
    items: [
      {
        icon: Wallet,
        title: "Phase 1–2",
        body: "$0–50 / month — validate and prototype at near-zero cost.",
      },
      {
        icon: TrendingUp,
        title: "Phase 3",
        body: "$50–200 / month — integrate and expand connectors.",
      },
      {
        icon: Rocket,
        title: "Phase 4",
        body: "$500–2,000 / month — production scale on demand.",
      },
    ],
  },
  {
    id: 9,
    kicker: "District 09 · Architecture",
    title: "Technology Stack Overview",
    variant: "grid",
    items: [
      { icon: PhoneCall, title: "Telephony" },
      { icon: Mic, title: "Speech-to-Text" },
      { icon: BrainCircuit, title: "LLM" },
      { icon: Server, title: "Text-to-Speech" },
      { icon: Network, title: "Voice Infrastructure" },
      { icon: Database, title: "Database" },
      { icon: CloudCog, title: "CRM" },
    ],
  },
  {
    id: 10,
    kicker: "District 10 · Comparison",
    title: "Total Project Cost Comparison",
    subtitle: "Cascade Tech delivers enterprise capability at a fraction of legacy cost.",
    variant: "duo",
    stats: [
      { label: "Legacy Enterprise", value: "$$$$" },
      { label: "Cascade Tech", value: "$" },
    ],
    items: [
      {
        icon: ShieldCheck,
        title: "70–90% Savings",
        body: "Comparable enterprise outcomes, dramatically lower spend.",
      },
      {
        icon: LineChart,
        title: "Enterprise Dashboard",
        body: "Transparent, real-time cost visibility across phases.",
      },
    ],
  },
  {
    id: 11,
    kicker: "District 11 · Roadmap",
    title: "Revised Phased Roadmap",
    variant: "flow",
    items: [
      { icon: Flag, title: "Phase 1 — Foundation" },
      { icon: PlugZap, title: "Phase 2 — Salesforce Integration" },
      { icon: Network, title: "Phase 3 — Connectors + Analytics" },
      { icon: Rocket, title: "Phase 4 — Production Launch" },
    ],
  },
  {
    id: 12,
    kicker: "District 12 · The Ecosystem",
    title: "Why Cascade Tech",
    subtitle: "Salesforce. AI. Analytics. Automation — one connected ecosystem.",
    variant: "final",
    items: [
      { icon: Lightbulb, title: "Innovation" },
      { icon: BadgeCheck, title: "CRM Expertise" },
      { icon: HeartHandshake, title: "Client Commitment" },
    ],
  },
];
