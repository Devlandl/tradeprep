# TradePrep: SAT Exam Prep - Design Spec

**Date:** 2026-04-03

## Overview

Add an SAT course to TradePrep. 4 chapters covering both SAT sections (Math split into Algebra and Advanced, Reading & Writing split into Reading and Grammar). Same study guide → quiz → final exam → certificate flow. Separate $10 store listing.

## Store Listing

- **Name:** TradePrep: SAT Exam Prep
- **Slug:** `tradeprep-sat`
- **Price:** $10
- **Category:** Productivity
- **Creator:** MrHarmony
- **Description:** "Boost your SAT score. 240 questions across 4 chapters with study mode, timed practice exams, and score tracking."
- **Long Description:** "TradePrep SAT is a complete SAT exam prep tool. Study mode covers algebra, advanced math, reading comprehension, and grammar — you can't advance until you master each section. When ready, take a timed practice exam that simulates the real test. 240 questions at beginner, intermediate, and advanced levels covering the digital SAT format."
- **App URL:** `https://tradeprep.tvrapp.app/sat`

## Trade Definition

```typescript
{
  id: "sat",
  name: "SAT",
  slug: "sat",
  description: "Boost your SAT score. Covers algebra, advanced math, reading comprehension, and grammar/writing.",
  color: "text-indigo-500",
  bgColor: "bg-indigo-50",
  icon: "PenLine",
  storeSlug: "tradeprep-sat",
  storeUrl: "https://tvrapp.app/store/tradeprep-sat",
  chapters: [
    { id: "math-algebra", name: "Math: Algebra", description: "Linear equations, systems, inequalities, functions, absolute value" },
    { id: "math-advanced", name: "Math: Advanced", description: "Quadratics, polynomials, geometry, trigonometry, statistics" },
    { id: "reading-writing", name: "Reading & Writing", description: "Reading comprehension, evidence-based questions, vocabulary, text structure" },
    { id: "grammar-usage", name: "Grammar & Usage", description: "Sentence structure, punctuation, transitions, expression of ideas" },
  ],
}
```

## Chapters

### 1. math-algebra (Math: Algebra)
- beginner: Solving linear equations, variables, order of operations, substitution, combining like terms, distributive property, basic inequalities
- intermediate: Systems of equations (substitution, elimination), linear functions (slope, intercept, graphing), absolute value equations, literal equations, word problems with linear models
- advanced: Complex systems, linear inequality graphs, piecewise functions, function composition, domain/range, modeling real-world scenarios with equations

### 2. math-advanced (Math: Advanced)
- beginner: Exponent rules, polynomial basics, factoring (GCF, trinomials), quadratic formula introduction, basic geometry (angles, triangles, circles)
- intermediate: Quadratic equations (factoring, completing the square, formula), parabola properties (vertex, axis), circle equations, right triangle trigonometry (SOH-CAH-TOA), ratios in geometry
- advanced: Polynomial division, rational expressions, exponential growth/decay, complex numbers, statistics (standard deviation, normal distribution), probability, data interpretation from tables/scatterplots

### 3. reading-writing (Reading & Writing)
- beginner: Main idea, supporting details, summarizing, context clues for word meaning, identifying purpose of a text, text structure (chronological, cause-effect, compare-contrast)
- intermediate: Evidence-based answers (finding the best quote), author's tone and attitude, rhetorical strategies, paired passage analysis, inference, synthesizing information across texts
- advanced: Evaluating arguments and claims, analyzing data in informational texts, words/phrases in context (nuanced meanings), purpose of specific sentences within a passage, text complexity

### 4. grammar-usage (Grammar & Usage)
- beginner: Subject-verb agreement, pronoun clarity, verb tense consistency, sentence fragments, run-on sentences, comma usage basics, apostrophes
- intermediate: Parallel structure, modifier placement (dangling/misplaced), semicolons and colons, transitions between sentences, concision (eliminating wordiness), pronoun case
- advanced: Logical comparisons, sentence combining for clarity, rhetorical synthesis (choosing best revision), expression of ideas (adding/deleting sentences for purpose), data-driven writing choices, tone consistency

## Data Files

- `lib/questions/sat.json` — ~240 questions (4 chapters x ~60)
- `lib/lessons/sat.json` — 12 lessons (4 chapters x 3 difficulties)
