export type DeviceType = 'iphone' | 'macbook' | 'imac'

export interface CaseSection {
  label: string
  heading: string
  body: string
}

export interface Project {
  id: string
  name: string
  year: string
  desc: string
  device: DeviceType
  caseStudy: CaseSection[]
}

export const EXPANDED_WIDTHS: Record<DeviceType, number> = {
  iphone: 360,
  macbook: 560,
  imac: 680,
}

// height/width ratios from actual image dimensions (iphone 350×350, macbook 882×1920, imac 600×800)
export const DEVICE_ASPECT_HW: Record<DeviceType, number> = {
  iphone:  1.0,
  macbook: 882 / 1920,
  imac:    600 / 800,
}

export const MOBILE_EXPANDED_WIDTHS: Record<DeviceType, number> = {
  iphone:  200,
  macbook: 280,
  imac:    300,
}

export const projects: Project[] = [
  {
    id: 'process-9',
    name: 'Process 9',
    year: '2024',
    desc: 'Enterprise translation tool. Redesigned end-to-end for complex B2B workflows.',
    device: 'macbook',
    caseStudy: [
      {
        label: 'Overview',
        heading: 'Enterprise translation, rethought',
        body: 'Process 9 serves translation teams at scale across twelve languages and four continents. The platform had accumulated seven years of feature layering with no systemic redesign. We started from the actor map, not the UI.',
      },
      {
        label: 'Problem',
        heading: 'Seven steps to do one thing',
        body: 'Core translation tasks required navigating through seven discrete screens. Context was lost at every handoff. Translators were spending more time managing the tool than translating.',
      },
      {
        label: 'Process',
        heading: 'Mapping before designing',
        body: 'Twelve stakeholder interviews, four role types, two weeks of shadowing in production environments. The design system emerged from the workflow, not the other way around. Every component traces back to a specific actor need.',
      },
      {
        label: 'Outcome',
        heading: '40% reduction in task time',
        body: 'Usability testing with fourteen participants showed a 40% reduction in task completion time for the primary workflow. Handoff friction dropped by two full steps. The platform shipped in Q3 2024.',
      },
    ],
  },
  {
    id: 'quick-translate',
    name: 'Quick Translate',
    year: '2024',
    desc: 'Feature sprint inside Process 9. Rapid translation with zero friction.',
    device: 'iphone',
    caseStudy: [
      {
        label: 'Overview',
        heading: 'One gesture, one translation',
        body: 'Quick Translate is a feature sprint within Process 9 targeting field translators who need to process short strings in high-volume, time-pressured contexts. The brief: reduce to a single gesture.',
      },
      {
        label: 'Problem',
        heading: 'Mobile was an afterthought',
        body: 'The existing mobile experience was a compressed version of the desktop — same information hierarchy, same navigation model. Field users were abandoning mobile entirely and returning to desktop.',
      },
      {
        label: 'Process',
        heading: 'Sprint with constraints',
        body: 'Two-week sprint. Three rounds of prototype testing with field translators in Istanbul and Mumbai. The gesture model emerged from watching how users held the phone, not from the design brief.',
      },
      {
        label: 'Outcome',
        heading: 'Mobile retention up 3×',
        body: 'Post-launch data showed mobile session length tripled among field translators. The swipe-to-translate gesture became the most-used action in the entire Process 9 platform within sixty days.',
      },
    ],
  },
  {
    id: 'dashboard-modal',
    name: 'Dashboard Modal',
    year: '2023',
    desc: 'Admin action patterns for a SaaS platform. Role-based control surfaces.',
    device: 'imac',
    caseStudy: [
      {
        label: 'Overview',
        heading: 'Power actions at the right moment',
        body: 'The Dashboard Modal system defines how admin-level actions surface in a SaaS platform serving three distinct user roles. The challenge was making powerful actions accessible without exposing them to the wrong role at the wrong time.',
      },
      {
        label: 'Problem',
        heading: 'One modal did everything, badly',
        body: 'A single monolithic modal handled every admin action regardless of context or role. Super admins saw options irrelevant to their task. Regular users saw locked options that created confusion about their own access level.',
      },
      {
        label: 'Process',
        heading: 'Role mapping as design input',
        body: 'Audited 47 distinct admin actions across the platform. Mapped each to role, context, and frequency. Built a decision tree that the modal system could evaluate at render time to surface exactly the right actions.',
      },
      {
        label: 'Outcome',
        heading: 'Support tickets dropped 60%',
        body: 'Admin-related support tickets dropped 60% in the quarter following launch. Role confusion errors (users attempting actions outside their permission scope) dropped to near zero.',
      },
    ],
  },
  {
    id: 'research-system',
    name: 'Research System',
    year: '2023',
    desc: 'Modular interview and synthesis framework built for a product team.',
    device: 'macbook',
    caseStudy: [
      {
        label: 'Overview',
        heading: 'Research that scales with the team',
        body: 'A modular research infrastructure built for a twelve-person product team running continuous discovery. The system needed to work for designers, product managers, and engineers with different synthesis needs.',
      },
      {
        label: 'Problem',
        heading: 'Insights lived in silos',
        body: 'Interview notes were scattered across four tools. Synthesis happened informally in Slack threads. Insights were rediscovered — or worse, contradicted — in every new sprint cycle.',
      },
      {
        label: 'Process',
        heading: 'Templates as conversation starters',
        body: 'Built a library of interview frameworks tuned to specific question types: jobs-to-be-done, friction mapping, concept testing. Each template generates a structured synthesis artifact that feeds directly into sprint planning.',
      },
      {
        label: 'Outcome',
        heading: 'One source of truth',
        body: 'The team consolidated from four tools to one within six weeks. Cross-sprint insight referencing became a standard part of the planning ritual. New team members reach research fluency in half the previous time.',
      },
    ],
  },
  {
    id: 'brand-direction',
    name: 'Brand Direction',
    year: '2022',
    desc: 'Visual identity exploration for a US-based MNC design team.',
    device: 'iphone',
    caseStudy: [
      {
        label: 'Overview',
        heading: 'Identity for a design team within a corporation',
        body: 'A design team inside a large US-based multinational wanted a distinct visual identity that worked within the parent brand constraints while establishing the team as a design-forward practice, not just a production function.',
      },
      {
        label: 'Problem',
        heading: 'Invisible within the organization',
        body: 'The team produced excellent work but had no recognizable presence internally. Design work was attributed to product or engineering in internal comms. The team had no visual language of its own.',
      },
      {
        label: 'Process',
        heading: 'Moodboards as strategy documents',
        body: 'Three identity directions developed in parallel, each representing a different strategic posture: craft-forward, systems-forward, and culture-forward. Presented to the team as strategic choices, not just aesthetic ones.',
      },
      {
        label: 'Outcome',
        heading: 'Internal recognition and external reach',
        body: 'The chosen direction launched across internal comms, design reviews, and a public case study page. Within a year, the team had received three unsolicited inbound partnership requests from other internal business units.',
      },
    ],
  },
]
