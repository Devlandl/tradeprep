export interface Chapter {
  id: string;
  name: string;
  description: string;
  comingSoon?: boolean;
}

export interface Trade {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  storeSlug: string;
  storeUrl: string;
  chapters: Chapter[];
}

export const trades: Trade[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    slug: "plumbing",
    description:
      "Prepare for your plumbing certification exam. Covers pipe types, fixtures, drainage, water supply, codes, and safety.",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    icon: "Wrench",
    storeSlug: "tradeprep-plumbing",
    storeUrl: "https://tvrapp.app/store/tradeprep-plumbing",
    chapters: [
      {
        id: "pipe-types",
        name: "Pipe Types & Materials",
        description: "PVC, copper, PEX, cast iron, galvanized, CPVC",
      },
      {
        id: "fixtures",
        name: "Fixtures & Fittings",
        description: "Sinks, toilets, tubs, valves, faucets, traps",
      },
      {
        id: "drainage",
        name: "Drainage & Waste Systems",
        description: "DWV, venting, traps, cleanouts, grades",
      },
      {
        id: "water-supply",
        name: "Water Supply Systems",
        description:
          "Hot/cold distribution, pressure, backflow prevention",
      },
      {
        id: "codes",
        name: "Plumbing Codes & Regulations",
        description: "IPC, UPC, permits, inspections",
      },
      {
        id: "safety",
        name: "Safety & Best Practices",
        description: "PPE, soldering, tool safety, confined spaces",
      },
    ],
  },
  {
    id: "hvac",
    name: "HVAC",
    slug: "hvac",
    description:
      "Prepare for your HVAC certification exam. Covers heating, cooling, ventilation, refrigerants, electrical, and codes.",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    icon: "Thermometer",
    storeSlug: "tradeprep-hvac",
    storeUrl: "https://tvrapp.app/store/tradeprep-hvac",
    chapters: [
      {
        id: "heating",
        name: "Heating Systems",
        description: "Furnaces, boilers, heat pumps, radiant",
      },
      {
        id: "cooling",
        name: "Cooling Systems",
        description: "AC units, refrigerants, compressors, condensers",
      },
      {
        id: "ventilation",
        name: "Ventilation & Ductwork",
        description: "Duct design, airflow, dampers, returns",
      },
      {
        id: "electrical-hvac",
        name: "Electrical for HVAC",
        description: "Wiring, circuits, thermostats, controls",
      },
      {
        id: "refrigerant",
        name: "Refrigerant Handling",
        description: "EPA 608, recovery, charging, leak detection",
      },
      {
        id: "hvac-codes",
        name: "Codes & Safety",
        description: "Mechanical codes, gas codes, PPE, combustion",
      },
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    slug: "electrical",
    description:
      "Prepare for your electrical certification exam. Covers theory, wiring, circuits, NEC codes, motors, and safety.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: "Zap",
    storeSlug: "tradeprep-electrical",
    storeUrl: "https://tvrapp.app/store/tradeprep-electrical",
    chapters: [
      {
        id: "theory",
        name: "Electrical Theory",
        description: "Ohm's law, voltage, amperage, resistance, power",
      },
      {
        id: "wiring",
        name: "Wiring Methods",
        description: "NM cable, conduit, boxes, connectors, grounding",
      },
      {
        id: "circuits",
        name: "Circuit Design",
        description:
          "Branch circuits, feeders, panel sizing, load calculations",
      },
      {
        id: "nec",
        name: "NEC Code Requirements",
        description: "Article references, code calculations, clearances",
      },
      {
        id: "motors",
        name: "Motors & Controls",
        description: "Motor types, starters, VFDs, overloads",
      },
      {
        id: "elec-safety",
        name: "Safety & Grounding",
        description: "GFCI, AFCI, grounding, bonding, lockout/tagout",
      },
      {
        id: "transformers",
        name: "Transformers & Power Distribution",
        description: "Single/three phase, transformers, switchgear",
      },
    ],
  },
  {
    id: "cdl",
    name: "CDL",
    slug: "cdl",
    description:
      "Prepare for your Class A CDL exam. Covers general knowledge, air brakes, and combination vehicles. Endorsements coming soon.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50",
    icon: "Truck",
    storeSlug: "tradeprep-cdl",
    storeUrl: "https://tvrapp.app/store/tradeprep-cdl",
    chapters: [
      {
        id: "general-knowledge",
        name: "General Knowledge",
        description: "Vehicle inspection, basic control, safe driving, cargo, emergencies",
      },
      {
        id: "air-brakes",
        name: "Air Brakes",
        description: "System components, dual air systems, inspection, stopping distance",
      },
      {
        id: "combination",
        name: "Combination Vehicles",
        description: "Coupling/uncoupling, rollover, jackknifing, trailer skids",
      },
      {
        id: "hazmat",
        name: "Hazmat",
        description: "Hazardous materials endorsement",
        comingSoon: true,
      },
      {
        id: "tanker",
        name: "Tanker",
        description: "Tanker vehicle endorsement",
        comingSoon: true,
      },
      {
        id: "doubles-triples",
        name: "Doubles/Triples",
        description: "Doubles and triples endorsement",
        comingSoon: true,
      },
      {
        id: "passenger",
        name: "Passenger",
        description: "Passenger vehicle endorsement",
        comingSoon: true,
      },
      {
        id: "school-bus",
        name: "School Bus",
        description: "School bus endorsement",
        comingSoon: true,
      },
    ],
  },
];

export const difficulties = ["beginner", "intermediate", "advanced"] as const;
export type Difficulty = (typeof difficulties)[number];

export function getTrade(slug: string): Trade | undefined {
  return trades.find((t) => t.slug === slug);
}

export function getChapter(
  trade: Trade,
  chapterId: string
): Chapter | undefined {
  return trade.chapters.find((c) => c.id === chapterId);
}
