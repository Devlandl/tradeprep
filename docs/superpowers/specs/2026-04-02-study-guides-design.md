# TradePrep Study Guides - Design Spec

**Date:** 2026-04-02

## Overview

Add a study guide page before each quiz in TradePrep's Study Mode. Each guide is a quick cheat sheet (~200-300 words) covering key terms and concepts for a specific chapter/difficulty combo. Users read the guide, then click "Start Quiz" to proceed to the existing quiz.

## Flow Change

**Before:** Chapter card → Click difficulty → Quiz starts immediately
**After:** Chapter card → Click difficulty → Study Guide page → "Start Quiz" → Quiz starts

## New Route

`/[trade]/study/[chapter]/[difficulty]/guide`

Sits alongside the existing quiz at `/[trade]/study/[chapter]/[difficulty]`. The chapter card's difficulty links change to point to `/guide` instead of the quiz directly.

## Study Guide Page Layout

- Header: trade name breadcrumb + chapter name + difficulty badge (Beginner/Intermediate/Advanced)
- Content section: bullet-point cheat sheet with key terms and short definitions
- "Start Quiz" button at bottom (links to existing quiz page at `/[trade]/study/[chapter]/[difficulty]`)
- "Skip to Quiz" text link for users who want to jump straight to testing

## Data Format

Static JSON files in `lib/lessons/`, one per trade — same pattern as the question banks.

**Files:**
- `lib/lessons/plumbing.json` — 18 lessons (6 chapters x 3 difficulties)
- `lib/lessons/hvac.json` — 18 lessons (6 chapters x 3 difficulties)
- `lib/lessons/electrical.json` — 21 lessons (7 chapters x 3 difficulties)

**57 lessons total.**

Each lesson object:
```json
{
  "chapter": "pipe-types",
  "difficulty": "beginner",
  "title": "Pipe Types & Materials",
  "subtitle": "Common pipe materials and their uses in residential plumbing",
  "points": [
    {
      "term": "PVC",
      "definition": "Lightweight plastic pipe used for drain lines and venting. Joined with solvent cement (glue). Not rated for hot water."
    },
    {
      "term": "Copper",
      "definition": "Metal pipe used for water supply lines. Joined by soldering (sweat) or compression fittings. Resists corrosion."
    }
  ]
}
```

Each lesson has 8-12 bullet points covering the key terms and rules for that section.

**Difficulty progression within each chapter:**
- **Beginner:** Basic definitions and identification — "what is this?"
- **Intermediate:** Application and relationships — "when and why do you use this?"
- **Advanced:** Code requirements, edge cases, troubleshooting — "what does the code say?"

## Lesson Content Scope

### Plumbing (6 chapters x 3 difficulties = 18 lessons)
1. **pipe-types** — PVC, copper, PEX, cast iron, galvanized, CPVC, joining methods
2. **fixtures** — Sinks, toilets, tubs, valves, faucets, traps, rough-in dimensions
3. **drainage** — DWV systems, venting types, trap requirements, cleanouts, slope/grade
4. **water-supply** — Hot/cold distribution, pressure regulation, backflow prevention
5. **codes** — IPC, UPC, permit process, inspection requirements
6. **safety** — PPE, soldering safety, tool safety, confined spaces, trenching

### HVAC (6 chapters x 3 difficulties = 18 lessons)
1. **heating** — Furnaces, boilers, heat pumps, radiant heat, BTU calculations
2. **cooling** — AC units, refrigerants, compressors, condensers, evaporators
3. **ventilation** — Duct design, airflow (CFM), dampers, returns, fresh air
4. **electrical-hvac** — Wiring, circuits, thermostats, controls, transformers
5. **refrigerant** — EPA 608, recovery, charging, leak detection, refrigerant types
6. **hvac-codes** — Mechanical codes, gas codes, PPE, combustion air

### Electrical (7 chapters x 3 difficulties = 21 lessons)
1. **theory** — Ohm's law, voltage, amperage, resistance, watts, series/parallel
2. **wiring** — NM cable, conduit types, boxes, connectors, grounding conductors
3. **circuits** — Branch circuits, feeders, panel sizing, load calculations
4. **nec** — NEC article references, code calculations, clearances, fill calculations
5. **motors** — Motor types, starters, VFDs, overloads, nameplate data
6. **elec-safety** — GFCI, AFCI, grounding, bonding, lockout/tagout
7. **transformers** — Single/three phase, transformer types, kVA sizing, switchgear

## Files to Create/Modify

### New Files
- `lib/lessons/plumbing.json` — 18 lesson objects
- `lib/lessons/hvac.json` — 18 lesson objects
- `lib/lessons/electrical.json` — 21 lesson objects
- `components/study-guide.tsx` — renders lesson content (term/definition list)
- `app/[trade]/study/[chapter]/[difficulty]/guide/page.tsx` — study guide route page

### Modified Files
- `components/chapter-card.tsx` — change difficulty links from `/[trade]/study/[chapter]/[difficulty]` to `/[trade]/study/[chapter]/[difficulty]/guide`

## Unlock Logic

No changes. The guide page uses the same unlock rules as the quiz:
- First chapter beginner is always available
- Must pass previous difficulty to unlock next within a chapter
- Must pass all 3 difficulties of a chapter to unlock next chapter
- Guide page checks progress and redirects to study index if section is locked

## Component: `study-guide.tsx`

Props:
```typescript
interface StudyGuideProps {
  trade: string;        // "plumbing", "hvac", "electrical"
  chapter: string;      // "pipe-types", etc.
  difficulty: string;   // "beginner", "intermediate", "advanced"
  lesson: Lesson;       // The lesson data object
}
```

Renders:
- Trade/chapter breadcrumb
- Chapter title + difficulty badge
- Subtitle text
- List of term/definition pairs styled as cards or bordered rows
- "Start Quiz" primary button
- "Skip to Quiz" link (same destination)
