# TradePrep CDL Course Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CDL (Commercial Driver's License) trade to TradePrep with 3 active chapters, 5 "Coming Soon" placeholder chapters, study guides, questions, and a store listing.

**Architecture:** Add CDL as a new trade in `lib/trades.ts` with a `comingSoon` flag on placeholder chapters. Add question bank and lesson data as static JSON. Update chapter card and study page to handle the coming-soon state. Add store listing via seed mutation.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS, static JSON, Convex (seed mutation in tvr-app-store repo)

---

### Task 1: Update Chapter interface and trades.ts with CDL trade

**Files:**
- Modify: `lib/trades.ts`

- [ ] **Step 1: Add `comingSoon` flag to Chapter interface and add CDL trade**

In `lib/trades.ts`, update the `Chapter` interface to add an optional `comingSoon` field, then add the CDL trade to the `trades` array:

Update the interface at the top of the file:

```typescript
export interface Chapter {
  id: string;
  name: string;
  description: string;
  comingSoon?: boolean;
}
```

Then add this trade object to the end of the `trades` array (before the closing `]`):

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/trades.ts
git commit -m "feat: add CDL trade definition with coming-soon endorsement placeholders"
```

---

### Task 2: Update chapter card to handle Coming Soon state

**Files:**
- Modify: `components/chapter-card.tsx`

- [ ] **Step 1: Add Coming Soon rendering to ChapterCard**

In `components/chapter-card.tsx`, add an import for `Clock` from lucide-react (line 3):

Change:
```typescript
import { Lock, Check, Circle } from "lucide-react";
```
To:
```typescript
import { Lock, Check, Circle, Clock } from "lucide-react";
```

Then inside the `ChapterCard` component, add a check at the beginning of the return — right after the opening `<div>` with chapter header and before `<div className="space-y-2">`. Replace the entire `<div className="space-y-2">` block:

```typescript
      {chapter.comingSoon ? (
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-amber-50 text-amber-600">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Coming Soon</span>
          </div>
          <span className="text-xs font-medium">Upgrade</span>
        </div>
      ) : (
        <div className="space-y-2">
          {difficulties.map((diff, diffIndex) => {
            const status = getDifficultyStatus(
              chapterIndex,
              diffIndex,
              chapter,
              trade.chapters,
              progressMap
            );
            const entry = progressMap.get(`${chapter.id}-${diff}`);

            if (status === "locked") {
              return (
                <div
                  key={diff}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 text-trade-muted"
                >
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">{diffLabels[diff]}</span>
                  </div>
                  <span className="text-xs">Locked</span>
                </div>
              );
            }

            if (status === "passed") {
              return (
                <Link
                  key={diff}
                  href={`/${trade.slug}/study/${chapter.id}/${diff}/guide`}
                  className="flex items-center justify-between py-2 px-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-trade-success" />
                    <span className={`text-sm font-medium ${diffColors[diff]}`}>
                      {diffLabels[diff]}
                    </span>
                  </div>
                  <span className="text-xs text-trade-success font-medium">
                    {entry?.score}%
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={diff}
                href={`/${trade.slug}/study/${chapter.id}/${diff}/guide`}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-trade-blue" />
                  <span className={`text-sm font-medium ${diffColors[diff]}`}>
                    {diffLabels[diff]}
                  </span>
                </div>
                <span className="text-xs text-trade-blue font-medium">Start</span>
              </Link>
            );
          })}
        </div>
      )}
```

- [ ] **Step 2: Commit**

```bash
git add components/chapter-card.tsx
git commit -m "feat: add Coming Soon state to chapter card for placeholder chapters"
```

---

### Task 3: Update study page to exclude Coming Soon chapters from progress

**Files:**
- Modify: `app/[trade]/study/page.tsx`

- [ ] **Step 1: Filter out comingSoon chapters from progress calculation**

In `app/[trade]/study/page.tsx`, change lines 44-49 from:

```typescript
  const totalSections = trade.chapters.length * difficulties.length;
  const passedSections = progress
    ? progress.filter((p) => p.passed).length
    : 0;
```

To:

```typescript
  const activeChapters = trade.chapters.filter((c) => !c.comingSoon);
  const totalSections = activeChapters.length * difficulties.length;
  const passedSections = progress
    ? progress.filter((p) => p.passed && activeChapters.some((c) => c.id === p.chapter)).length
    : 0;
```

This ensures only active chapters count toward progress and exam unlock. Placeholder chapters are displayed but don't block the final exam.

- [ ] **Step 2: Commit**

```bash
git add app/\[trade\]/study/page.tsx
git commit -m "feat: exclude Coming Soon chapters from progress and exam unlock"
```

---

### Task 4: Add CDL trade card to home page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Check what the home page looks like and add CDL**

Read `app/page.tsx` to see how trade cards are rendered. The home page imports `trades` from `lib/trades.ts` and maps over them to render `TradeCard` components. Since we added CDL to the trades array, it should appear automatically. If the home page hard-codes specific trades instead of mapping, add CDL.

Also check `components/trade-card.tsx` to see if it handles the "Truck" icon. If trade cards render icons dynamically, add Truck to the icon mapping.

Read both files, add the Truck icon if needed, and verify CDL shows up.

- [ ] **Step 2: Commit (if changes needed)**

```bash
git add app/page.tsx components/trade-card.tsx
git commit -m "feat: add CDL trade card to home page"
```

---

### Task 5: Create CDL question bank

**Files:**
- Create: `lib/questions/cdl.json`

- [ ] **Step 1: Create cdl.json with ~180 questions**

Create `lib/questions/cdl.json` — a JSON array of question objects. ~60 questions per chapter, distributed across 3 difficulty levels (~30 beginner, ~20 intermediate, ~10 advanced per chapter).

**Question format:**
```json
{
  "id": "cdl-general-knowledge-b-001",
  "question": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0,
  "explanation": "Explanation of why the correct answer is right.",
  "chapter": "general-knowledge",
  "difficulty": "beginner"
}
```

**ID format:** `cdl-{chapter}-{b|i|a}-{number}`

**Chapter 1: general-knowledge**
- beginner (~30): Pre-trip inspection items, vehicle parts identification, dashboard gauges, mirrors, basic controls, emergency equipment, when to use hazard flashers, what to check before driving, seatbelt rules, fire extinguisher location
- intermediate (~20): Safe following distance, speed management for conditions, space management, night driving tips, hazard perception, railroad crossing rules, mountain driving, skid recovery, hydroplaning, fatigue management
- advanced (~10): Cargo securement rules (FMCSA), weight distribution, axle weight limits (12K steer, 34K tandem), 80K gross weight, HOS rules (11-hour driving, 14-hour window, 70-hour/8-day), DOT inspection items, accident reporting thresholds

**Chapter 2: air-brakes**
- beginner (~30): Air compressor, air storage tanks, governor, brake chambers, slack adjusters, push rods, brake drums, brake shoes, s-cam, foundation brakes, supply pressure gauge, application pressure gauge, low air warning, spring brakes
- intermediate (~20): Dual air brake system, primary vs secondary, tractor protection valve, trailer air supply control, brake lag (0.4 seconds), total stopping distance formula, brake fade causes, proper braking technique downhill, stab braking vs controlled braking
- advanced (~10): Governor cut-in (100 psi) and cut-out (125 psi), air loss rate test (max 3 psi/min single, 4 psi/min combination), applied stroke limits, automatic adjusters, brake inspection steps, out-of-service criteria, spring brake release bolt

**Chapter 3: combination**
- beginner (~30): Tractor-trailer definition, fifth wheel, kingpin, landing gear (dollies), glad hands (air line couplers), pigtail (electrical cable), apron, locking jaws, trailer height for coupling, safety chains
- intermediate (~20): Coupling procedure (8 steps), uncoupling procedure (7 steps), rollover risk factors (speed, load height, curves, steering), trailer swing, tractor jackknife, off-tracking, turning clearance, backing techniques
- advanced (~10): Crack-the-whip effect, rearward amplification in doubles/triples, bridge formula basics, 5th wheel inspection points, air line color codes (blue=service, red=emergency), no-zone areas, proper following distance (1 sec per 10 ft + 1 sec over 40 mph)

Write all questions with accurate CDL exam content. Each explanation should teach why the answer is correct.

- [ ] **Step 2: Commit**

```bash
git add lib/questions/cdl.json
git commit -m "feat: add CDL question bank (180 questions across 3 chapters)"
```

---

### Task 6: Create CDL study guide lessons

**Files:**
- Create: `lib/lessons/cdl.json`

- [ ] **Step 1: Create cdl.json with 9 lessons**

Create `lib/lessons/cdl.json` — a JSON array of 9 lesson objects (3 active chapters x 3 difficulties). 8-12 term/definition points per lesson.

**Format:**
```json
{
  "chapter": "general-knowledge",
  "difficulty": "beginner",
  "title": "General Knowledge",
  "subtitle": "Basic CDL concepts, vehicle parts, and pre-trip inspection essentials",
  "points": [
    { "term": "Pre-Trip Inspection", "definition": "Required check of your vehicle before every trip. Cover engine, tires, lights, mirrors, brakes, coupling, cargo, and emergency equipment." },
    ...
  ]
}
```

**Difficulty progression:**
- **beginner:** "What is this?" — basic parts, definitions, identification
- **intermediate:** "When and why?" — procedures, safe driving techniques, when things matter
- **advanced:** "What are the rules?" — FMCSA regulations, specific numbers, HOS rules, out-of-service criteria

**Chapter content:**

1. **general-knowledge**
   - beginner: Vehicle parts, dashboard gauges, mirrors, emergency equipment, basic controls, pre-trip inspection overview
   - intermediate: Safe following distance, speed management, night driving, railroad crossings, mountain driving, hazard perception
   - advanced: FMCSA cargo rules, axle weight limits (12K/34K/80K), HOS rules (11/14/70), DOT inspection, accident reporting thresholds ($5,200 or injury/fatality)

2. **air-brakes**
   - beginner: Compressor, tanks, governor, brake chambers, slack adjusters, s-cam, foundation brakes, supply/application gauges, low air warning
   - intermediate: Dual air system (primary/secondary), tractor protection valve, brake lag, total stopping distance, brake fade, proper downhill braking, stab vs controlled braking
   - advanced: Governor cut-in/cut-out (100/125 psi), air loss rates (3 psi single, 4 psi combo), applied stroke limits, spring brake release, out-of-service criteria, inspection steps

3. **combination**
   - beginner: Fifth wheel, kingpin, landing gear, glad hands, pigtail, apron, locking jaws, safety chains, trailer height
   - intermediate: Coupling steps, uncoupling steps, rollover factors, trailer swing vs jackknife, off-tracking, turning clearance, backing techniques
   - advanced: Crack-the-whip, rearward amplification, bridge formula, air line colors (blue=service, red=emergency), no-zones, following distance formula

Each definition should be 1-2 sentences, factual, exam-relevant.

- [ ] **Step 2: Commit**

```bash
git add lib/lessons/cdl.json
git commit -m "feat: add CDL study guide lessons (9 lessons)"
```

---

### Task 7: Add CDL store listing seed mutation and product image

**Files:**
- Modify: `C:\Users\devla\OneDrive\Desktop\claud\tvr-app-store\convex\seed.ts` (append)
- Modify: `C:\Users\devla\OneDrive\Desktop\claud\tvr-app-store\lib\product-images.ts`

- [ ] **Step 1: Add seedCdlPrep mutation to tvr-app-store seed.ts**

Append to the bottom of `C:\Users\devla\OneDrive\Desktop\claud\tvr-app-store\convex\seed.ts`:

```typescript
export const seedCdlPrep = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", "tradeprep-cdl"))
      .first();
    if (existing) return "TradePrep CDL already exists";

    const creator = await ctx.db
      .query("creators")
      .withIndex("by_handle", (q) => q.eq("handle", "mrharmony"))
      .first();
    if (!creator) return "Creator not found - run seedData first";

    await ctx.db.insert("products", {
      name: "TradePrep: CDL Exam Prep",
      slug: "tradeprep-cdl",
      description: "Pass your CDL exam. 180 questions across 3 chapters with study mode, timed practice exams, and a printable certificate.",
      longDescription:
        "TradePrep CDL is a complete Class A CDL exam prep tool. Study mode drills you on general knowledge, air brakes, and combination vehicles — you can't advance until you master each section. When ready, take a timed practice exam that simulates the real test. Pass and earn a printable certificate. 180 questions at beginner, intermediate, and advanced levels. Hazmat, tanker, doubles/triples, passenger, and school bus endorsements coming soon.",
      type: "web_app",
      price: 10,
      isFree: false,
      isExternal: false,
      category: "productivity",
      creatorId: creator._id,
      appUrl: "https://tradeprep.tvrapp.app/cdl",
      version: "1.0.0",
      status: "live",
      downloadCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    console.log("TradePrep CDL product added!");
    return "TradePrep CDL added";
  },
});
```

- [ ] **Step 2: Add CDL image mapping**

In `C:\Users\devla\OneDrive\Desktop\claud\tvr-app-store\lib\product-images.ts`, add:

```typescript
"tradeprep-cdl": "/tradeprepcdl.jpg",
```

- [ ] **Step 3: Deploy seed function and run it on production**

```bash
cd C:\Users\devla\OneDrive\Desktop\claud\tvr-app-store
npx convex deploy --yes
npx convex run --prod seed:seedCdlPrep
```

- [ ] **Step 4: Commit tvr-app-store changes**

```bash
cd C:\Users\devla\OneDrive\Desktop\claud\tvr-app-store
git add convex/seed.ts lib/product-images.ts
git commit -m "feat: add TradePrep CDL store listing ($10)"
git push origin master
```

---

### Task 8: Verify, build, deploy TradePrep

- [ ] **Step 1: Build TradePrep**

```bash
cd C:\Users\devla\OneDrive\Desktop\claud\tradeprep
npx next build
```

Expected: All routes compile, including CDL routes.

- [ ] **Step 2: Push and deploy**

```bash
git push origin master
npx vercel --prod --yes
```

- [ ] **Step 3: Test in browser**

- Visit `tradeprep.tvrapp.app` — CDL should appear as a trade option
- Visit `tradeprep.tvrapp.app/cdl/study` — should show 3 active chapters + 5 "Coming Soon" placeholders
- Click Beginner on General Knowledge — should show study guide
- Click "Start Quiz" — should start quiz with CDL questions
- Verify progress bar only counts active chapters (9 sections, not 24)
- Verify "Coming Soon" chapters show amber badge, not difficulty levels
