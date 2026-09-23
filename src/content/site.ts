/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH FOR ALL PORTFOLIO CONTENT
 * ─────────────────────────────────────────────────────────────────────────────
 *  Nothing here has been invented. Anything not confirmed by you is either:
 *    • wrapped in square brackets  → "[Add …]"   (renders as a styled placeholder)
 *    • marked `// VERIFY`          → taken from your reference mockups; confirm it
 *
 *  Search this file for "[" and "VERIFY" before publishing.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Anooj Jilladwar",
  initials: "AJ",
  roles: ["Robotics Engineer", "Mechanical Engineer", "AI Developer", "New Product Developer"],
  tagline: "From ideas to intelligent machines.",
  intro:
    "I design and build intelligent machines — bringing together robotics, AI, mechanical design and embedded systems to take products from concept to working hardware.",
  location: "Pune, India", // VERIFY — from reference mockup
  availability: "Open to opportunities",
  email: "anoojjilladwar@gmail.com",
  socials: {
    linkedin: "https://www.linkedin.com/in/anoojjilladwar", // VERIFY — from reference mockup
    github: "https://github.com/[your-github-username]", // ADD your GitHub handle
  },
  /** Place your résumé at /public/resume.pdf — buttons auto-enable when the file exists. */
  resumePath: "/resume.pdf",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** The six domains you listed — these are facts you provided. */
export const expertise = [
  {
    id: "robotics-ai",
    title: "Robotics & AI",
    blurb: "Intelligent robots that perceive, decide and act in the real world.",
    code: "RBT",
  },
  {
    id: "mechanical",
    title: "Mechanical Design & CAD",
    blurb: "Mechanisms, structures and assemblies engineered for manufacture.",
    code: "MCH",
  },
  {
    id: "embedded",
    title: "Embedded Systems",
    blurb: "Microcontrollers, sensors and control firmware close to the metal.",
    code: "EMB",
  },
  {
    id: "product",
    title: "Product Development",
    blurb: "Concept → prototype → test → iterate, with the end user in mind.",
    code: "NPD",
  },
  {
    id: "emobility",
    title: "Electric Mobility",
    blurb: "Electric drivetrains, vehicle platforms and energy systems.",
    code: "EMO",
  },
  {
    id: "ros2",
    title: "ROS2 & Autonomous Systems",
    blurb: "Navigation, localization and autonomy stacks built on ROS2.",
    code: "ROS",
  },
] as const;

export type SkillGroup = { title: string; items: string[] };

/**
 * Tools shown in your reference mockups. VERIFY each one — delete anything you
 * don't actively use and add what's missing.
 */
export const toolGroups: SkillGroup[] = [
  { title: "Design & Simulation", items: ["SolidWorks", "Fusion 360", "AutoCAD", "Ansys", "MATLAB"] }, // VERIFY
  { title: "Robotics & AI", items: ["ROS2", "Python", "C++"] }, // VERIFY (ROS2 confirmed)
  { title: "Embedded & Electronics", items: ["[Add microcontrollers / boards]", "[Add sensors & interfaces]"] },
  { title: "Product & Prototyping", items: ["[Add fabrication methods]", "[Add testing / validation tools]"] },
];

export type ProjectKind = "quadruped" | "manipulator" | "rover" | "vehicle";

export type Project = {
  slug: string;
  title: string;
  kind: ProjectKind; // drives the blueprint illustration
  tags: string[];
  summary: string;
  year: string;
  role: string;
  status: string;
  problem: string;
  approach: string[];
  outcomes: string[];
  stack: string[];
  links?: { label: string; href: string }[];
};

/**
 * Project titles + tags come from your reference mockups — VERIFY that each is a
 * real project of yours, then replace every "[…]" with real details.
 */
export const projects: Project[] = [
  {
    slug: "autonomous-quadruped-robot",
    title: "Autonomous Quadruped Robot", // VERIFY
    kind: "quadruped",
    tags: ["Mechanical Design", "ROS2", "AI"], // VERIFY
    summary: "[Add a one-line summary: what it is and why it matters]",
    year: "[Year]",
    role: "[Your role]",
    status: "[Status — e.g. Prototype / Completed]",
    problem: "[Describe the problem this robot solves and the constraints you worked within.]",
    approach: [
      "[Leg mechanism / actuator selection]",
      "[Control & gait approach]",
      "[Perception & autonomy stack]",
    ],
    outcomes: ["[Measured result or key learning]", "[Measured result or key learning]"],
    stack: ["ROS2", "[Add tools]"],
  },
  {
    slug: "robotic-manipulator",
    title: "Robotic Manipulator", // VERIFY
    kind: "manipulator",
    tags: ["Design", "Control", "Perception"], // VERIFY
    summary: "[Add a one-line summary: DOF, payload, application]",
    year: "[Year]",
    role: "[Your role]",
    status: "[Status]",
    problem: "[Describe the task the manipulator was built for.]",
    approach: ["[Kinematic design & link sizing]", "[Drive / actuation choice]", "[Control & perception]"],
    outcomes: ["[Measured result — e.g. repeatability, reach]", "[Key learning]"],
    stack: ["[Add tools]"],
  },
  {
    slug: "autonomous-navigation-robot",
    title: "Autonomous Navigation Robot", // VERIFY
    kind: "rover",
    tags: ["ROS2", "SLAM", "Path Planning"], // VERIFY
    summary: "[Add a one-line summary: environment, sensors, autonomy level]",
    year: "[Year]",
    role: "[Your role]",
    status: "[Status]",
    problem: "[Describe the navigation problem and operating environment.]",
    approach: ["[Sensor suite]", "[SLAM / localization approach]", "[Planner & controller]"],
    outcomes: ["[Measured result]", "[Key learning]"],
    stack: ["ROS2", "[Add tools]"],
  },
  {
    slug: "electric-mobility-platform",
    title: "Electric Mobility Platform", // VERIFY
    kind: "vehicle",
    tags: ["Mechanical", "Electrical", "Prototyping"], // VERIFY
    summary: "[Add a one-line summary: vehicle type, powertrain, goal]",
    year: "[Year]",
    role: "[Your role]",
    status: "[Status]",
    problem: "[Describe the mobility problem and design targets.]",
    approach: ["[Chassis & structural design]", "[Powertrain, battery & BMS]", "[Build & testing]"],
    outcomes: ["[Measured result — e.g. range, top speed, mass]", "[Key learning]"],
    stack: ["[Add tools]"],
  },
];

export type ExperienceItem = {
  period: string;
  role: string;
  org: string;
  summary: string;
  highlights: string[];
};

/** Add your real roles. Reference-mockup entries were not used because dates & titles are factual claims. */
export const experience: ExperienceItem[] = [
  {
    period: "[20XX – Present]",
    role: "[Role title]",
    org: "[Company / Organisation]",
    summary: "[One sentence on what you owned and delivered.]",
    highlights: ["[Quantified achievement]", "[Quantified achievement]"],
  },
  {
    period: "[20XX – 20XX]",
    role: "[Role title]",
    org: "[Company / Organisation]",
    summary: "[One sentence on what you owned and delivered.]",
    highlights: ["[Quantified achievement]"],
  },
  {
    period: "[20XX – 20XX]",
    role: "[Degree / Programme]",
    org: "[University]",
    summary: "[Focus areas, thesis or major projects.]",
    highlights: ["[Relevant coursework or distinction]"],
  },
];

export type Achievement = { title: string; detail: string; year: string; type: string };

export const achievements: Achievement[] = [
  { type: "Competition", title: "[Competition / Award name]", detail: "[Result and what you built]", year: "[Year]" },
  { type: "Publication", title: "[Paper / Patent title]", detail: "[Venue or patent office]", year: "[Year]" },
  { type: "Certification", title: "[Certification]", detail: "[Issuing body]", year: "[Year]" },
];

export const nav = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export const isPlaceholder = (s: string) => /^\[.*\]$/.test(s.trim()) || s.includes("[your-");
