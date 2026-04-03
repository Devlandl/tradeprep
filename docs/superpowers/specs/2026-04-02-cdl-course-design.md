# TradePrep: CDL Exam Prep - Design Spec

**Date:** 2026-04-02

## Overview

Add a CDL (Commercial Driver's License) trade to TradePrep. 3 active chapters covering the core Class A CDL exam content, plus 5 placeholder endorsement chapters locked as "Coming Soon." Same study guide → quiz → final exam → certificate flow as Plumbing/HVAC/Electrical. Separate $10 store listing.

## Store Listing

- **Name:** TradePrep: CDL Exam Prep
- **Slug:** `tradeprep-cdl`
- **Price:** $10
- **Category:** Productivity
- **Creator:** MrHarmony
- **Description:** "Pass your CDL exam. 180 questions across 3 chapters with study mode, timed practice exams, and a printable certificate."
- **Long Description:** "TradePrep CDL is a complete Class A CDL exam prep tool. Study mode drills you on general knowledge, air brakes, and combination vehicles — you can't advance until you master each section. When ready, take a timed practice exam that simulates the real test. Pass and earn a printable certificate. 180 questions at beginner, intermediate, and advanced levels. Hazmat, tanker, doubles/triples, passenger, and school bus endorsements coming soon."
- **App URL:** `https://tradeprep.tvrapp.app/cdl`

## Trade Definition

Add to `lib/trades.ts`:

```typescript
{
  id: "cdl",
  name: "CDL",
  slug: "cdl",
  description: "Prepare for your Class A CDL exam. Covers general knowledge, air brakes, and combination vehicles. Endorsements coming soon.",
  color: "text-emerald-500",
  bgColor: "bg-emerald-50",
  icon: "Truck",
  storeSlug: "tradeprep-cdl",
  storeUrl: "https://tvrapp.app/store/tradeprep-cdl",
  chapters: [
    { id: "general-knowledge", name: "General Knowledge", description: "Vehicle inspection, basic control, safe driving, cargo, emergencies" },
    { id: "air-brakes", name: "Air Brakes", description: "System components, dual air systems, inspection, stopping distance" },
    { id: "combination", name: "Combination Vehicles", description: "Coupling/uncoupling, rollover, jackknifing, trailer skids" },
    { id: "hazmat", name: "Hazmat", description: "Coming soon — hazardous materials endorsement" },
    { id: "tanker", name: "Tanker", description: "Coming soon — tanker endorsement" },
    { id: "doubles-triples", name: "Doubles/Triples", description: "Coming soon — doubles and triples endorsement" },
    { id: "passenger", name: "Passenger", description: "Coming soon — passenger endorsement" },
    { id: "school-bus", name: "School Bus", description: "Coming soon — school bus endorsement" },
  ],
}
```

## Placeholder Handling

Placeholder chapters (hazmat, tanker, doubles-triples, passenger, school-bus) have no questions or lessons. The chapter card should show a "Coming Soon" badge instead of difficulty levels. The chapter card component needs a small update to detect chapters with no questions and render the placeholder state.

Detection: if a chapter has no matching questions in the question bank, show "Coming Soon" instead of beginner/intermediate/advanced rows.

## Active Chapters (3 chapters x 3 difficulties = 9 sections)

### 1. general-knowledge (General Knowledge)

**Beginner:** Pre-trip inspection basics, vehicle parts identification, dashboard gauges, mirrors, basic controls, emergency equipment.

**Intermediate:** Safe driving practices, speed management, space management, night driving, hazard perception, railroad crossings, mountain driving.

**Advanced:** Cargo securement rules (FMCSA), weight distribution, axle weight limits, logbook/HOS rules, accident procedures, DOT inspection items.

### 2. air-brakes (Air Brakes)

**Beginner:** Air brake system parts (compressor, tanks, governor, brake chambers, slack adjusters). What each part does. How air brakes stop the truck.

**Intermediate:** Dual air brake system, supply vs service side, low air pressure warning, spring brakes, brake lag distance, stopping distance formula.

**Advanced:** Air brake inspection steps (applied stroke test, governor cut-in/cut-out pressures, leak rate tests), brake fade causes, adjustment limits, out-of-service criteria.

### 3. combination (Combination Vehicles)

**Beginner:** What a combination vehicle is (tractor-trailer, doubles, triples). Fifth wheel, kingpin, landing gear, glad hands, pigtail. Coupling basics.

**Intermediate:** Coupling/uncoupling step-by-step procedures. Rollover risk factors (speed, load height, curves). Trailer swing vs tractor jackknife.

**Advanced:** Crack-the-whip effect, off-tracking calculations, bridge formula basics, air line connections (emergency vs service), no-zone awareness, rearward amplification.

## Question Bank

`lib/questions/cdl.json` — ~180 questions total across 3 chapters x 3 difficulties.

Distribution per chapter:
- ~30 beginner
- ~20 intermediate
- ~10 advanced
- Total per chapter: ~60 questions

Same format as existing question banks:
```json
{
  "id": "cdl-general-knowledge-b-001",
  "question": "During a pre-trip inspection, you should check...",
  "options": ["Only the engine", "Tires, lights, and mirrors", "Only the brakes", "Nothing if the truck looks fine"],
  "correctIndex": 1,
  "explanation": "A proper pre-trip inspection covers tires, lights, mirrors, fluid levels, and all safety equipment.",
  "chapter": "general-knowledge",
  "difficulty": "beginner"
}
```

## Study Guide Lessons

`lib/lessons/cdl.json` — 9 lessons (3 active chapters x 3 difficulties).

Same format as existing lessons: 8-12 term/definition points per lesson.

No lessons for placeholder chapters.

## Final Exam

50 random questions from the 3 active chapters, 60-minute timer. Same as other trades. 80% to pass.

## Files to Create/Modify

### New Files
- `lib/questions/cdl.json` — 180 questions
- `lib/lessons/cdl.json` — 9 lessons
- Seed mutation in tvr-app-store `convex/seed.ts`

### Modified Files
- `lib/trades.ts` — Add CDL trade definition
- `components/chapter-card.tsx` — Add "Coming Soon" state for chapters with no questions
- `lib/product-images.ts` (tvr-app-store) — Add CDL image mapping
