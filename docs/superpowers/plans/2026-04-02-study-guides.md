# TradePrep Study Guides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a study guide cheat sheet page before each quiz in TradePrep's Study Mode, covering key terms and concepts for that chapter/difficulty.

**Architecture:** New guide route at `/[trade]/study/[chapter]/[difficulty]/guide` that loads lesson content from static JSON files (`lib/lessons/*.json`) and renders a term/definition list. Chapter card links updated to point to guide page instead of quiz directly. Guide page links to quiz via "Start Quiz" button.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, static JSON data

---

### Task 1: Create lesson data type and loader

**Files:**
- Create: `lib/lessons/types.ts`

- [ ] **Step 1: Create the lesson type definition and loader function**

```typescript
// lib/lessons/types.ts

export interface LessonPoint {
  term: string;
  definition: string;
}

export interface Lesson {
  chapter: string;
  difficulty: string;
  title: string;
  subtitle: string;
  points: LessonPoint[];
}

export async function loadLesson(
  tradeId: string,
  chapter: string,
  difficulty: string
): Promise<Lesson | null> {
  try {
    const mod = await import(`@/lib/lessons/${tradeId}.json`);
    const lessons: Lesson[] = mod.default;
    return (
      lessons.find(
        (l) => l.chapter === chapter && l.difficulty === difficulty
      ) ?? null
    );
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/lessons/types.ts
git commit -m "feat: add lesson data types and loader"
```

---

### Task 2: Create plumbing lesson data

**Files:**
- Create: `lib/lessons/plumbing.json`

- [ ] **Step 1: Create plumbing.json with 18 lessons**

Create `lib/lessons/plumbing.json` with an array of 18 lesson objects (6 chapters x 3 difficulties). Each lesson has 8-12 bullet points.

**Difficulty guidelines:**
- **beginner:** Basic definitions — "what is this thing?"
- **intermediate:** Application and relationships — "when and why do you use it?"
- **advanced:** Code requirements, edge cases, troubleshooting — "what does the code say?"

**Chapters and content to cover:**

1. **pipe-types** (Pipe Types & Materials)
   - beginner: Define PVC, copper, PEX, cast iron, galvanized, CPVC. What each looks like and basic use.
   - intermediate: Joining methods (solvent cement, soldering, crimp/clamp, hub, threaded). When to pick each pipe type. Temperature/pressure ratings.
   - advanced: Code-required materials by application. Transition fittings. Underground vs above-ground requirements. Prohibited materials.

2. **fixtures** (Fixtures & Fittings)
   - beginner: Define sink, toilet, tub, shower, faucet, valve, trap. Basic function of each.
   - intermediate: Rough-in dimensions. Fixture unit ratings. Trap sizing. Supply line sizing. Shut-off valve types.
   - advanced: ADA compliance. Cross-connection prevention. Anti-scald requirements. Fixture spacing codes.

3. **drainage** (Drainage & Waste Systems)
   - beginner: Define DWV, drain, waste, vent. What a trap does. What a cleanout is. Direction of flow.
   - intermediate: Venting types (individual, common, wet, loop, AAV). Trap arm length rules. Pipe sizing by fixture units.
   - advanced: Grade/slope requirements (1/4" per foot). Stack sizing. Horizontal branch limits. Code violations to watch for.

4. **water-supply** (Water Supply Systems)
   - beginner: Hot vs cold lines. What a water heater does. What a pressure regulator does. What backflow means.
   - intermediate: Supply pipe sizing. Pressure loss calculations. Expansion tanks. Recirculation systems. Water hammer.
   - advanced: Backflow preventer types and when required. Cross-connection code. RPZ vs double-check. Thermal expansion code.

5. **codes** (Plumbing Codes & Regulations)
   - beginner: What IPC and UPC are. What a permit is. What an inspection checks. Why codes exist.
   - intermediate: Permit process steps. Common inspection checkpoints. Rough-in vs final inspection. Code book structure.
   - advanced: Code calculation methods. Fixture unit tables. Pipe sizing tables. Common code violations and penalties.

6. **safety** (Safety & Best Practices)
   - beginner: PPE basics (gloves, goggles, boots). What soldering lead-free means. Tool safety basics.
   - intermediate: Confined space awareness. Trenching safety. Hot work permits. Chemical handling (flux, solvents).
   - advanced: OSHA requirements. Lockout/tagout for water systems. Asbestos/lead pipe identification. Excavation depth rules.

Each lesson object format:
```json
{
  "chapter": "pipe-types",
  "difficulty": "beginner",
  "title": "Pipe Types & Materials",
  "subtitle": "Common pipe materials used in residential and commercial plumbing",
  "points": [
    { "term": "PVC", "definition": "White plastic pipe used for drain, waste, and vent lines. Lightweight, cheap, joined with solvent cement (glue). Not rated for hot water above 140°F." },
    { "term": "Copper", "definition": "Metal pipe used for water supply lines (hot and cold). Types L (standard) and M (thin wall). Joined by soldering (sweating) or compression fittings." },
    ...8-12 total points
  ]
}
```

Write all 18 lessons with accurate trade content. Each point's definition should be 1-2 sentences max.

- [ ] **Step 2: Commit**

```bash
git add lib/lessons/plumbing.json
git commit -m "feat: add plumbing study guide lessons (18 lessons)"
```

---

### Task 3: Create HVAC lesson data

**Files:**
- Create: `lib/lessons/hvac.json`

- [ ] **Step 1: Create hvac.json with 18 lessons**

Same format as plumbing.json. 6 chapters x 3 difficulties = 18 lessons.

**Chapters and content to cover:**

1. **heating** (Heating Systems)
   - beginner: Define furnace, boiler, heat pump, radiant heat. How each heats a space. BTU basics.
   - intermediate: Furnace stages (single, two-stage, modulating). Heat pump operation (heating vs cooling mode). AFUE ratings. Sizing rules of thumb.
   - advanced: Combustion air requirements. Venting categories (I-IV). Heat loss calculations. Gas pressure testing. Ignition systems.

2. **cooling** (Cooling Systems)
   - beginner: Define compressor, condenser, evaporator, refrigerant. Basic refrigeration cycle. What SEER means.
   - intermediate: Split system vs package unit. Metering devices (TXV, piston). Subcooling and superheat concepts. Proper airflow (400 CFM per ton).
   - advanced: SEER2 vs SEER. Refrigerant charge by method (subcooling, superheat, weigh-in). Compressor diagnosis. Condenser/evaporator coil matching.

3. **ventilation** (Ventilation & Ductwork)
   - beginner: Define supply, return, duct, register, grille, damper. What CFM means. Why ventilation matters.
   - intermediate: Duct sizing methods. Static pressure basics. Flex vs hard duct pros/cons. Balancing dampers. Fresh air requirements.
   - advanced: Manual D duct design. Duct leakage testing. Total external static pressure. Equivalent length method. Code-required ventilation rates.

4. **electrical-hvac** (Electrical for HVAC)
   - beginner: Define voltage, amperage, resistance, watt. What a thermostat does. What a contactor does. What a capacitor does.
   - intermediate: Reading wiring diagrams. 24V control circuits. Run vs start capacitors. Relay vs contactor. Transformer basics.
   - advanced: Amp draw diagnosis (LRA, RLA, FLA). Compressor terminal identification (C, R, S). Troubleshooting with multimeter. Motor wiring (single phase).

5. **refrigerant** (Refrigerant Handling)
   - beginner: Define refrigerant. Common types (R-410A, R-22, R-32). What EPA 608 certification is. Why recovery matters.
   - intermediate: Recovery equipment operation. Manifold gauge reading. Charging procedures. Leak detection methods. Evacuation requirements.
   - advanced: EPA 608 fine amounts. Section 608 vs 609. Refrigerant reclaim vs recovery vs recycling. Pressure-temperature charts. Blend refrigerant rules.

6. **hvac-codes** (Codes & Safety)
   - beginner: Define mechanical code, gas code. What PPE to wear. What clearance means. Why combustion air matters.
   - intermediate: Minimum clearances for equipment. Gas line sizing basics. Disconnect requirements. Condensate drain requirements.
   - advanced: IMC vs UMC code. NFPA 54 gas code requirements. Equipment nameplate data interpretation. CO detector requirements. Duct smoke detector rules.

- [ ] **Step 2: Commit**

```bash
git add lib/lessons/hvac.json
git commit -m "feat: add HVAC study guide lessons (18 lessons)"
```

---

### Task 4: Create electrical lesson data

**Files:**
- Create: `lib/lessons/electrical.json`

- [ ] **Step 1: Create electrical.json with 21 lessons**

Same format. 7 chapters x 3 difficulties = 21 lessons.

**Chapters and content to cover:**

1. **theory** (Electrical Theory)
   - beginner: Define voltage, amperage, resistance, watt, Ohm's law (V=IR). Series vs parallel circuits. AC vs DC.
   - intermediate: Power formula (P=VI). Kirchhoff's laws. Impedance vs resistance. Power factor basics. Single phase vs three phase.
   - advanced: Three-phase power calculations. Delta vs wye configurations. Apparent vs true power. kVA vs kW. Demand factor vs diversity factor.

2. **wiring** (Wiring Methods)
   - beginner: Define NM cable (Romex), conduit (EMT, PVC), wire gauge (AWG). What a junction box is. What grounding means.
   - intermediate: Wire ampacity by gauge (14AWG=15A, 12AWG=20A, 10AWG=30A). Conduit fill rules. Box fill calculations. Wire color codes.
   - advanced: NEC Article 334 (NM cable), 358 (EMT). Derating for multiple conductors. Ambient temperature correction. Continuous load rule (125%).

3. **circuits** (Circuit Design)
   - beginner: Define branch circuit, feeder, panel, breaker, GFCI, AFCI. What a dedicated circuit is. Standard residential circuits.
   - intermediate: Load calculations for dwelling. Kitchen/bath circuit requirements. General lighting load (3 VA per sq ft). Appliance circuit requirements.
   - advanced: NEC Article 220 load calculations. Service entrance sizing. Panel schedule layout. Voltage drop calculations (max 3% branch, 5% total).

4. **nec** (NEC Code Requirements)
   - beginner: What the NEC is. How articles are organized. What a code cycle is. Why the NEC exists.
   - intermediate: Key NEC articles (210 branch circuits, 220 calculations, 250 grounding). Working space requirements (Art 110). Receptacle spacing rules.
   - advanced: NEC calculation examples. Conduit fill tables (Chapter 9). Wire ampacity tables (310.16). Overcurrent protection sizing. Tap rules (240.21).

5. **motors** (Motors & Controls)
   - beginner: Define motor, starter, overload, VFD. What nameplate data shows. Single phase vs three phase motors.
   - intermediate: Motor protection sizing (125% FLC). Starter types (across-the-line, reduced voltage). Overload relay types. Motor circuit components.
   - advanced: NEC Article 430 motor calculations. Branch circuit protection tables. Feeder sizing for multiple motors. VFD bypass wiring. Motor control center layout.

6. **elec-safety** (Safety & Grounding)
   - beginner: Define GFCI (ground fault), AFCI (arc fault), grounding, bonding. Why these protect people. Where GFCIs are required.
   - intermediate: Grounding electrode system components. Equipment grounding conductor sizing. GFCI locations (kitchen, bath, garage, outdoor). AFCI locations (bedrooms).
   - advanced: NEC Article 250 grounding system. Ground fault path impedance. Lockout/tagout (OSHA). Arc flash boundaries. NFPA 70E PPE categories.

7. **transformers** (Transformers & Power Distribution)
   - beginner: Define transformer, primary, secondary. Step-up vs step-down. What kVA means. Common voltages (120, 208, 240, 277, 480).
   - intermediate: Transformer sizing (kVA = VA / 1000). Single phase vs three phase transformers. Buck-boost applications. Voltage tap adjustment.
   - advanced: Three-phase transformer connections (delta-wye, wye-wye). kVA sizing calculations. Impedance percentage. Switchgear ratings. Overcurrent protection for transformers (NEC 450).

- [ ] **Step 2: Commit**

```bash
git add lib/lessons/electrical.json
git commit -m "feat: add electrical study guide lessons (21 lessons)"
```

---

### Task 5: Create the StudyGuide component

**Files:**
- Create: `components/study-guide.tsx`

- [ ] **Step 1: Create the study guide component**

```typescript
// components/study-guide.tsx
"use client";

import Link from "next/link";
import { BookOpen, ArrowRight, ChevronRight } from "lucide-react";
import type { Lesson } from "@/lib/lessons/types";

const diffBadgeColors: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced: "bg-red-100 text-red-700",
};

export function StudyGuide({
  lesson,
  tradeName,
  quizUrl,
}: {
  lesson: Lesson;
  tradeName: string;
  quizUrl: string;
}) {
  const diffLabel =
    lesson.difficulty.charAt(0).toUpperCase() + lesson.difficulty.slice(1);

  return (
    <div className="max-w-3xl mx-auto px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-sm text-trade-muted mb-6">
        <span>{tradeName}</span>
        <ChevronRight className="w-3 h-3" />
        <span>{lesson.title}</span>
        <ChevronRight className="w-3 h-3" />
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffBadgeColors[lesson.difficulty] ?? ""}`}>
          {diffLabel}
        </span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-trade-blue" />
          <h1 className="text-2xl font-bold text-trade-dark">Study Guide</h1>
        </div>
        <p className="text-trade-muted">{lesson.subtitle}</p>
      </div>

      {/* Key Terms */}
      <div className="space-y-3 mb-10">
        {lesson.points.map((point, i) => (
          <div
            key={i}
            className="bg-trade-card border border-trade-border rounded-lg p-4 card-shadow"
          >
            <span className="text-sm font-bold text-trade-blue">
              {point.term}
            </span>
            <p className="text-sm text-trade-muted mt-1">{point.definition}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-3 pb-12">
        <Link
          href={quizUrl}
          className="inline-flex items-center gap-2 px-8 py-3 bg-trade-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
        >
          Start Quiz
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={quizUrl}
          className="text-sm text-trade-muted hover:text-trade-blue transition-colors"
        >
          Skip to Quiz →
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/study-guide.tsx
git commit -m "feat: add StudyGuide component"
```

---

### Task 6: Create the study guide route page

**Files:**
- Create: `app/[trade]/study/[chapter]/[difficulty]/guide/page.tsx`

- [ ] **Step 1: Create the guide page**

```typescript
// app/[trade]/study/[chapter]/[difficulty]/guide/page.tsx
"use client";

import { useParams, notFound } from "next/navigation";
import { getTrade, getChapter, difficulties } from "@/lib/trades";
import type { Difficulty } from "@/lib/trades";
import { loadLesson } from "@/lib/lessons/types";
import type { Lesson } from "@/lib/lessons/types";
import { PurchaseGate } from "@/components/purchase-gate";
import { StudyGuide } from "@/components/study-guide";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function GuidePage() {
  const params = useParams();
  const tradeSlug = params.trade as string;
  const chapterId = params.chapter as string;
  const difficulty = params.difficulty as string;

  const trade = getTrade(tradeSlug);
  const chapter = trade ? getChapter(trade, chapterId) : undefined;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trade) return;

    loadLesson(trade.id, chapterId, difficulty).then((data) => {
      setLesson(data);
      setLoading(false);
    });
  }, [trade, chapterId, difficulty]);

  if (!trade || !chapter) return notFound();
  if (!difficulties.includes(difficulty as Difficulty)) return notFound();

  const quizUrl = `/${trade.slug}/study/${chapterId}/${difficulty}`;

  return (
    <PurchaseGate
      storeSlug={trade.storeSlug}
      storeUrl={trade.storeUrl}
      tradeName={trade.name}
    >
      <div className="max-w-5xl mx-auto py-12">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-trade-blue animate-spin" />
          </div>
        )}

        {!loading && !lesson && (
          <div className="text-center py-12 px-4">
            <p className="text-trade-muted mb-4">
              No study guide available for this section yet.
            </p>
            <a href={quizUrl} className="text-trade-blue hover:underline">
              Go to Quiz
            </a>
          </div>
        )}

        {lesson && (
          <StudyGuide
            lesson={lesson}
            tradeName={trade.name}
            quizUrl={quizUrl}
          />
        )}
      </div>
    </PurchaseGate>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\[trade\]/study/\[chapter\]/\[difficulty\]/guide/page.tsx
git commit -m "feat: add study guide route page"
```

---

### Task 7: Update chapter card links to point to guide

**Files:**
- Modify: `components/chapter-card.tsx`

- [ ] **Step 1: Change difficulty links from quiz to guide**

In `components/chapter-card.tsx`, change the two `Link` `href` props that currently point to `/${trade.slug}/study/${chapter.id}/${diff}` to instead point to `/${trade.slug}/study/${chapter.id}/${diff}/guide`.

There are two instances to change:

**Line 116 (passed state):** Change:
```typescript
href={`/${trade.slug}/study/${chapter.id}/${diff}`}
```
To:
```typescript
href={`/${trade.slug}/study/${chapter.id}/${diff}/guide`}
```

**Line 135 (available state):** Change:
```typescript
href={`/${trade.slug}/study/${chapter.id}/${diff}`}
```
To:
```typescript
href={`/${trade.slug}/study/${chapter.id}/${diff}/guide`}
```

Both links should now go to the guide page. The quiz page remains at its existing URL and is reached via the "Start Quiz" button on the guide.

- [ ] **Step 2: Commit**

```bash
git add components/chapter-card.tsx
git commit -m "feat: update chapter card links to go through study guide"
```

---

### Task 8: Verify and push

- [ ] **Step 1: Run build to verify no errors**

```bash
cd C:\Users\devla\OneDrive\Desktop\claud\tradeprep
npx next build
```

Expected: All routes compile including the new `/[trade]/study/[chapter]/[difficulty]/guide` route.

- [ ] **Step 2: Push to GitHub**

```bash
git push origin master
```

- [ ] **Step 3: Deploy to production**

```bash
npx vercel --prod --yes
```

- [ ] **Step 4: Deploy Convex functions if needed**

```bash
npx convex deploy --yes
```

- [ ] **Step 5: Test in browser**

Navigate to `tradeprep.tvrapp.app/plumbing/study`, click "Beginner" on "Pipe Types & Materials". Should land on the study guide page with key terms. Click "Start Quiz" to confirm it links to the quiz.
