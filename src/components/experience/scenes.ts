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
  MessageSquare,
  Ticket,
  Layers,
  Home,
  Landmark,
  Zap,
  Search,
  Code,
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
    kicker: "District 03 · Product Ecosystem",
    title: "Real Problems. Purpose-Built Products.",
    subtitle: "Most Salesforce partners implement what Salesforce sells. We went further.",
    variant: "grid",
    items: [
      {
        icon: MessageSquare,
        title: "Cascade Connect",
        body: "Omnichannel communication, inside Salesforce.",
      },
      {
        icon: Layers,
        title: "CX Prism™",
        body: "Customer feedback into revenue intelligence.",
      },
      {
        icon: PhoneCall,
        title: "AI Voice Platform",
        body: "AI-driven conversations and voice intelligence inside CRM.",
      },
    ],
  },
  {
    id: 4,
    kicker: "District 04 · Cloud Skyline",
    title: "The Full Salesforce Cloud Stack",
    subtitle:
      "Deep, certified expertise across the Salesforce clouds that matter most to enterprise growth and customer experience.",
    align: "center",
    variant: "grid",
    items: [
      {
        icon: Target,
        title: "Sales Cloud",
        body: "Pipeline visibility, forecasting and AI-assisted selling that closes faster.",
      },
      {
        icon: Megaphone,
        title: "Marketing Cloud",
        body: "Personalized journeys, segmentation and analytics across every touchpoint.",
      },
      {
        icon: Globe,
        title: "Experience Cloud",
        body: "Branded portals and communities that scale customer and partner engagement.",
      },
      {
        icon: HeartPulse,
        title: "Health Cloud",
        body: "Patient-360 workflows that connect care teams, records and outcomes.",
      },
      {
        icon: GraduationCap,
        title: "Education Cloud",
        body: "Recruit, engage and retain learners across the full education lifecycle.",
      },
      {
        icon: ShoppingCart,
        title: "Commerce Cloud",
        body: "Unified B2B and B2C commerce experiences powered by data and AI.",
      },
    ],
  },

  {
    id: 7,
    kicker: "District 07 · Industries We Serve",
    title: "Built for Real Estate. Ready for Enterprise.",
    variant: "grid",
    items: [
      {
        icon: Home,
        title: "Real Estate & PropTech",
        body: "Specialized lead pipelines, developer workflows, builder-broker portals, and automated booking engines.",
      },
      {
        icon: Building2,
        title: "Commercial Real Estate",
        body: "Custom transaction pipelines, tenant onboarding automation, lease management, and portfolio tracking.",
      },
      {
        icon: Landmark,
        title: "Financial Services",
        body: "Highly secure investor onboarding, loan processing checklists, pipeline management, and wealth portals.",
      },
      {
        icon: HeartPulse,
        title: "Healthcare",
        body: "Patient care coordination, provider portals, unified referral tracking, and automated appointment scheduling.",
      },
      {
        icon: GraduationCap,
        title: "Education",
        body: "Automated student acquisition, enrollment pipelines, academic advisory portals, and alumni engagement.",
      },
      {
        icon: ShoppingCart,
        title: "D2C & Retail",
        body: "Automated support ticketing, loyalty management, customer 360 profiles, and behavioral journey building.",
      },
    ],
  },
  {
    id: 5,
    kicker: "District 05 · Our Services",
    title: "Our Services",
    subtitle: "From strategy to go-live to long-term support — we cover the full Salesforce journey.",
    variant: "grid",
    items: [
      {
        icon: CloudCog,
        title: "CRM Implementation",
        body: "Sales Cloud, Service Cloud & custom orgs — config, Apex/LWC, migration, training, full lead-to-booking lifecycle.",
      },
      {
        icon: Megaphone,
        title: "Marketing Automation",
        body: "Marketing Cloud journeys across email, SMS & WhatsApp, with live Meta CAPI ad-attribution integrations.",
      },
      {
        icon: Code,
        title: "Custom Dev & Integrations",
        body: "Apex, LWC and REST integrations connecting ERP, payment, and broker portals — middleware-free.",
      },
      {
        icon: Layers,
        title: "Proprietary Products",
        body: "Deploy Cascade Connect & CX Prism™ — pre-built, tested products that solve gaps Salesforce alone can't.",
      },
      {
        icon: Search,
        title: "Audit & Optimisation",
        body: "Full org audits of config, automation, data hygiene & adoption, with a prioritised fix-and-grow roadmap.",
      },
      {
        icon: HeartHandshake,
        title: "Managed Support & AMC",
        body: "Post go-live AMC: bug fixes, enhancements, user support and quarterly health check-ins.",
      },
    ],
  },
  {
    id: 8,
    kicker: "District 08 · Why Cascade Tech",
    title: "Why Developers & Enterprises Choose Cascade",
    subtitle:
      "We combine Salesforce expertise, AI innovation, product thinking and real-world industry execution to deliver measurable business outcomes.",
    variant: "grid",
    items: [
      {
        icon: Workflow,
        title: "We Know Your Sales Process",
        body: "Site visits, token collections, unit blocking, channel partners and post-booking workflows — built and optimized before.",
      },
      {
        icon: ShieldCheck,
        title: "We Build What We Promise",
        body: "The same team that designs the solution delivers and supports it. No handoffs. No disconnects.",
      },
      {
        icon: BadgeCheck,
        title: "Live Products In Production",
        body: "Real Salesforce implementations, AI automations and customer-facing products actively used by clients.",
      },
      {
        icon: Zap,
        title: "Built For Scale",
        body: "Solutions designed to grow from startup operations to enterprise-grade business processes.",
      },
      {
        icon: Layers,
        title: "Products From Real Projects",
        body: "Cascade Connect and CX Prism were created from real client challenges and proven in production environments.",
      },
      {
        icon: HeartHandshake,
        title: "Long-Term Partnership",
        body: "We continue supporting, optimizing and enhancing solutions long after go-live.",
      },
    ],
  },

  {
    id: 9,
    kicker: "District 09 · Clients",
    title: "Organizations That Trust Cascade Tech",
    subtitle:
      "From Mumbai's leading real estate developers to growing enterprise organizations, Cascade Tech powers Salesforce, AI and automation initiatives across multiple industries.",
    variant: "grid",
    stats: [
      { label: "Clients Served", value: "8+" },
      { label: "Cities", value: "5" },
      { label: "Industries", value: "5" },
    ],
    items: [
      { title: "Kohinoor", icon: Building2 },
      { title: "Creative Cloud", icon: Sparkles },
      { title: "Cannext", icon: Zap },
      { title: "EKA Life", icon: HeartPulse },
      { title: "Clearpack", icon: Database },
      { title: "Naiknavare", icon: Home },
      { title: "Gayatri Constructors", icon: Landmark },
      { title: "Automatenhandel24", icon: Workflow },
      { title: "Nandivardhan", icon: Building2 },
      { title: "Ashwin Sheth", icon: Users },
    ],
  },
  {
    id: 10,
    kicker: "District 10 · Case Studies",
    title: "Work In Production. Outcomes That Compound.",
    subtitle:
      "Real Salesforce implementations, AI automations and marketing transformations delivering measurable business outcomes across real estate organizations.",
    variant: "grid",
    items: [
      { title: "Kohinoor Group", icon: Building2 },
      { title: "Ashwin Sheth Group", icon: Users },
      { title: "Naiknavare Developers", icon: Home },
    ],
  },
  {
    id: 14,
    kicker: "PROPRIETARY PRODUCT",
    title: "Cascade Connect",
    subtitle: "Omnichannel Communication, Inside Salesforce",
  },
  {
    id: 15,
    kicker: "PROPRIETARY PRODUCT",
    title: "CX Prism",
    subtitle: "Converting Customer Feedback Into Revenue Intelligence",
  },
  {
    id: 16,
    kicker: "PROPRIETARY PRODUCT",
    title: "CaseFlow",
    subtitle: "Email-to-Case & Customer Ticketing Automation",
  },
  {
    id: 17,
    kicker: "PROPRIETARY PRODUCT",
    title: "Nexora",
    subtitle: "Partner & Sourcing Management Platform",
  },
  {
    id: 11,
    kicker: "District 11 · Engagement Model",
    title: "How We Work With You",
    subtitle:
      "From the first conversation to long-term partnership — here is what working with Cascade looks like.",
    variant: "final",
    items: [
      {
        icon: Search,
        title: "Discovery",
        body: "We learn how leads come in and how your team works today — before suggesting anything. No assumptions.",
      },
      {
        icon: Layers,
        title: "Blueprint",
        body: "We design the org architecture, data model and automation map. You see exactly what we'll build and why.",
      },
      {
        icon: Code,
        title: "Build",
        body: "Configuration, Apex/LWC, integrations and migration — delivered in sprints with weekly demos.",
      },
      {
        icon: GraduationCap,
        title: "Train & UAT",
        body: "Role-based training, UAT cycles and adoption playbooks — your team is ready on day one.",
      },
      {
        icon: Rocket,
        title: "Go-Live & Support",
        body: "We go live with you. First 30 days covered; our AMC keeps us your ongoing Salesforce partner.",
      },
    ],
  },
  {
    id: 13,
    kicker: "Leadership & Team",
    title: "The Architects Of Growth & Execution.",
    subtitle:
      "From strategy and architecture to implementation and client success — meet the team behind every Cascade Tech delivery.",
    variant: "grid",
  },
  {
    id: 12,
    kicker: "District 12 · Conclusion",
    title: "Let's Build Something That Actually Works.",
    subtitle:
      "Whether you're implementing Salesforce, building AI-powered automation, launching digital products, or transforming customer operations — let's discuss what success looks like for your business.",
    variant: "final",
  },
];


