// ============================================================================
// SINGLE SOURCE OF TRUTH for all portfolio content.
// Edit this file to update what appears on each floating island.
// `position` is the island's location in 3D space; `accent` is its theme color.
// ============================================================================

import { mulberry32 } from '../lib/prng';

export type StationId =
  | 'hero'
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'education'
  | 'certifications'
  | 'contact';

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  location: string;
  stack: string;
  highlights: string[];
}

export interface ProjectItem {
  name: string;
  tagline: string;
  period: string;
  stack: string;
  link?: string;
  highlights: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface CertItem {
  text: string;
}

export interface AchievementItem {
  platform: string;
  detail: string;
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
}

/** Multilingual greetings cycled in the hero island speech bubble. */
export const greetings = ['Hello', 'Namaste', 'Hola', 'Bonjour', 'Konnichiwa', 'Ciao'] as const;

export const profile = {
  name: 'SK Sahil Parvez',
  title: 'Software Engineer',
  tagline: 'Building analytics platforms, observability systems & scalable backends.',
  summary:
    'Software Engineer with experience building analytics platforms, observability ' +
    'systems, and distributed backend services using React.js, GraphQL, Node.js, ' +
    'Java Spring Boot, and OpenTelemetry. Skilled in CI/CD automation, telemetry ' +
    'pipelines, and scalable microservices architecture.',
};

export const experience: ExperienceItem[] = [
  {
    company: 'Highspot',
    role: 'Software Development Engineer',
    period: '08/2025 – Present',
    location: 'Hyderabad',
    stack: 'React.js, GraphQL, TypeScript, Ruby, MongoDB',
    highlights: [
      'Created 25+ tiles, charts, and tables with drilldowns using React, GraphQL and Ruby for a team analytics scorecard.',
      'Implemented Blueprint-Based Visualizations to generate charts from reports, covering 90% of existing bar charts.',
      'Built an end-to-end RolePlay Scorecard from scaffold to dataviews, featuring advanced CRM filter integration.',
      'Migrated 2 legacy scorecards to a new blueprint-based scorecard with charts and an enhanced People filter.',
    ],
  },
  {
    company: 'Zscaler, Inc',
    role: 'Software Development Engineer Intern',
    period: '02/2025 – 08/2025',
    location: 'Bangalore',
    stack: 'Java Spring Boot, Python, Bash, OpenTelemetry, Pytest, CI/CD',
    highlights: [
      'Architected a complete pytest automation framework integrated with GitLab CI/CD, covering 50+ test cases.',
      'Developed a sampling mechanism using Java Spring Boot and OTel v0.128.0 to efficiently collect and monitor performance.',
      'Implemented PII masking to redact sensitive data in system logs and traces.',
      'Achieved 91% data compression by evaluating 5 compression algorithms and implementing the most efficient one.',
    ],
  },
  {
    company: 'Fractal.ai',
    role: 'Software Development Engineer Intern',
    period: '05/2024 – 07/2024',
    location: 'Remote',
    stack: 'React.js, JavaScript, Node.js, MySQL',
    highlights: [
      'Architected automated test scripts using Codecept.js and Mocha.js to ensure a bug-free user experience.',
      'Contributed to 2 projects utilizing React.js, Node.js and MySQL, enhancing front-end interfaces.',
      'Tuned prompt engineering for 4 LLMs to achieve significant improvements in model outputs.',
    ],
  },
];

export const projects: ProjectItem[] = [
  {
    name: 'GameVault',
    tagline: 'Distributed Gaming Platform',
    period: '01/2026 – 04/2026',
    stack: 'TypeScript, React, Express, PostgreSQL, Prisma, MongoDB, Redis, Observability',
    link: undefined,
    highlights: [
      'Built a containerized gaming platform with a 10-service Docker Compose core stack and an 8-container observability overlay.',
      'Exposed the system through a React SPA and an Nginx API gateway routing to 5 independent Express backend services.',
      'Integrated 3 data stores: PostgreSQL (users/auth via Prisma), Redis (token rotation & leaderboard cache), MongoDB (game state).',
      'Instrumented services with OpenTelemetry, Prometheus, Loki, Tempo, and 6 Grafana dashboards for full metrics/logs/traces correlation.',
    ],
  },
  {
    name: 'PriceTrackEr',
    tagline: 'Automated price-drop alerts',
    period: '11/2024 – 01/2025',
    stack: 'Next.js, Tailwind CSS, Node.js, MongoDB, Cron Jobs',
    link: undefined,
    highlights: [
      'Developed a price tracking website with automated price-drop alert functionality.',
      'Integrated cron jobs for scheduled (7am daily) data scraping from Amazon, providing users with morning alerts.',
      'Implemented AI-generated product descriptions (under 200 words each) for clarity and consistency.',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Frontend & Backend',
    items: ['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Express.js', 'Java Spring Boot', 'REST APIs'],
  },
  {
    label: 'Databases',
    items: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Prisma'],
  },
  {
    label: 'DevOps & Observability',
    items: ['Docker', 'CI/CD', 'OpenTelemetry', 'Prometheus', 'Grafana', 'Loki', 'Tempo'],
  },
  {
    label: 'Languages',
    items: ['C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'Bash'],
  },
  {
    label: 'Concepts',
    items: ['Data Structures', 'OOP', 'Operating Systems', 'DBMS', 'System Design', 'Distributed Systems'],
  },
];

export const education = {
  institution: 'Indian Institute of Information Technology, Allahabad',
  degree: 'B.Tech in Information Technology',
  period: '07/2021 – 06/2025',
  marks: '8.53 / 10',
};

export const certifications: CertItem[] = [
  { text: 'Pursuing PG Certification in Forward Deployed Engineering (FDE) — IIT Roorkee.' },
  { text: "Skillsoft's Bash Scripting (Track 2) — automating common tasks with bash." },
  { text: "Google's Foundations of Project Management — Agile & risk analysis." },
];

export const achievements: AchievementItem[] = [
  { platform: 'Overall', detail: 'Solved 1600+ DSA & competitive programming problems.' },
  { platform: 'CodeChef', detail: 'Pir0_Coder (4★) — Global ranks 50, 89, 212, 370, 398.' },
  { platform: 'Codeforces', detail: 'foolcoder (Specialist) — Global ranks 1260, 1770, 2081, 2110.' },
  { platform: 'LeetCode', detail: 'Fibonacci_lc (Knight) — Global ranks 560, 570, 776.' },
];

export const contactLinks: ContactLink[] = [
  { label: 'Email', value: 'sksahilparvez2000@gmail.com', href: 'mailto:sksahilparvez2000@gmail.com' },
  { label: 'Phone', value: '+91 98744 35806', href: 'tel:+919874435806' },
  { label: 'LinkedIn', value: 'sk-sahil-parvez-iiita', href: 'https://linkedin.com/in/sk-sahil-parvez-iiita' },
  { label: '2D Portfolio', value: 'sksportfolio2d.netlify.app', href: 'https://sksportfolio2d.netlify.app' },
];

// ----------------------------------------------------------------------------
// Layout: island metadata in voyage order. Positions are generated from a fixed
// seed so the archipelago is scattered (varied gaps + side-to-side weave) yet
// deterministic — the boat sails forward (−Z) discovering islands. Tweak
// ISLAND_LAYOUT to change spacing/spread.
// ----------------------------------------------------------------------------
export interface StationLayout {
  id: StationId;
  label: string;
  position: [number, number, number];
  accent: string;
  /** Optional island radius override (defaults by station in Experience). */
  radius?: number;
}

const ISLAND_LAYOUT = {
  seed: 21,
  /** Forward (−Z) gap between consecutive islands: base + up to jitter. */
  gap: 26,
  gapJitter: 14,
  /** Sideways spread (±x). Consecutive islands lean to opposite sides. */
  spread: 13,
} as const;

const stationMeta: Omit<StationLayout, 'position'>[] = [
  { id: 'hero', label: 'Home', accent: '#ff8fab' },
  { id: 'about', label: 'About', accent: '#ffd166' },
  { id: 'experience', label: 'Experience', accent: '#06d6a0' },
  { id: 'projects', label: 'Projects', accent: '#4cc9f0' },
  { id: 'skills', label: 'Skills', accent: '#b5179e' },
  { id: 'education', label: 'Education', accent: '#f4a261', radius: 9.5 },
  { id: 'certifications', label: 'Certs', accent: '#90be6d' },
  { id: 'contact', label: 'Contact', accent: '#9b5de5' },
];

function buildStations(): StationLayout[] {
  const rng = mulberry32(ISLAND_LAYOUT.seed);
  const round = (n: number) => Math.round(n * 10) / 10;
  let z = 0;
  return stationMeta.map((m, i) => {
    if (i === 0) return { ...m, position: [0, 0, 0] };
    z -= ISLAND_LAYOUT.gap + rng() * ISLAND_LAYOUT.gapJitter;
    // Weave: alternate sides each step, with a random magnitude.
    const side = i % 2 === 0 ? 1 : -1;
    const x = side * (0.35 + rng() * 0.65) * ISLAND_LAYOUT.spread;
    return { ...m, position: [round(x), 0, round(z)] };
  });
}

export const stations: StationLayout[] = buildStations();
