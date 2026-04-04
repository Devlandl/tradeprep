# TradePrep: GED Exam Prep - Design Spec

**Date:** 2026-04-03

## Overview

Add a GED (General Educational Development) course to TradePrep. 4 active chapters covering all 4 GED test subjects. Same study guide → quiz → final exam → certificate flow. Separate $10 store listing.

## Store Listing

- **Name:** TradePrep: GED Exam Prep
- **Slug:** `tradeprep-ged`
- **Price:** $10
- **Category:** Productivity
- **Creator:** MrHarmony
- **Description:** "Pass your GED exam. 240 questions across 4 subjects with study mode, timed practice exams, and a printable certificate."
- **Long Description:** "TradePrep GED is a complete GED exam prep tool. Study mode covers math, science, social studies, and reasoning through language arts — you can't advance until you master each section. When ready, take a timed practice exam that simulates the real test. Pass and earn a printable certificate. 240 questions at beginner, intermediate, and advanced levels."
- **App URL:** `https://tradeprep.tvrapp.app/ged`

## Trade Definition

```typescript
{
  id: "ged",
  name: "GED",
  slug: "ged",
  description: "Prepare for your GED exam. Covers math, science, social studies, and reasoning through language arts.",
  color: "text-sky-500",
  bgColor: "bg-sky-50",
  icon: "GraduationCap",
  storeSlug: "tradeprep-ged",
  storeUrl: "https://tvrapp.app/store/tradeprep-ged",
  chapters: [
    { id: "math", name: "Mathematical Reasoning", description: "Number operations, algebra, geometry, data analysis, word problems" },
    { id: "science", name: "Science", description: "Life science, physical science, earth/space science, scientific reasoning" },
    { id: "social-studies", name: "Social Studies", description: "US history, civics/government, economics, geography" },
    { id: "rla", name: "Reasoning Through Language Arts", description: "Reading comprehension, grammar, writing structure, vocabulary in context" },
  ],
}
```

## Chapters

### 1. math (Mathematical Reasoning)
- beginner: Whole numbers, fractions, decimals, percentages, order of operations, number line, rounding, estimation
- intermediate: Algebra (variables, expressions, equations, inequalities), ratios/proportions, slope, linear equations, coordinate plane
- advanced: Geometry (area, perimeter, volume, Pythagorean theorem), data analysis (mean/median/mode, probability, graphs/charts), quadratics, functions

### 2. science (Science)
- beginner: Scientific method, cell structure, ecosystems, states of matter, energy types, earth layers, water cycle
- intermediate: Genetics/heredity, evolution/natural selection, chemical reactions, force/motion/Newton's laws, plate tectonics, weather/climate
- advanced: Photosynthesis/respiration, atomic structure, periodic table trends, electromagnetic spectrum, experimental design, data interpretation from graphs/tables

### 3. social-studies (Social Studies)
- beginner: US Constitution basics, branches of government, Bill of Rights, American Revolution, Civil War, basic economics (supply/demand)
- intermediate: Civil rights movement, World Wars, Cold War, types of government, election process, GDP/inflation/unemployment, maps/geography skills
- advanced: Constitutional amendments, Supreme Court landmark cases, foreign policy, fiscal/monetary policy, primary source analysis, cause-and-effect in history

### 4. rla (Reasoning Through Language Arts)
- beginner: Main idea, supporting details, context clues, parts of speech, sentence structure, subject-verb agreement, punctuation basics
- intermediate: Author's purpose, tone/mood, compare/contrast, thesis statements, paragraph structure, comma rules, pronoun-antecedent agreement, commonly confused words
- advanced: Argument analysis, evidence evaluation, logical fallacies, essay structure (intro/body/conclusion), transitions, parallel structure, citation/source credibility

## Data Files

- `lib/questions/ged.json` — ~240 questions (4 chapters x ~60, split across 3 difficulties)
- `lib/lessons/ged.json` — 12 lessons (4 chapters x 3 difficulties)

## Files to Create/Modify

### New Files
- `lib/questions/ged.json`
- `lib/lessons/ged.json`

### Modified Files
- `lib/trades.ts` — Add GED trade definition
- `components/trade-card.tsx` — Add GraduationCap icon mapping
- tvr-app-store `convex/seed.ts` — Add seedGedPrep mutation
- tvr-app-store `lib/product-images.ts` — Add image mapping
