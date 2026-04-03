# TradePrep: Real Estate Exam Prep - Design Spec

**Date:** 2026-04-02

## Overview

Add a Real Estate trade to TradePrep. 6 active chapters covering the national real estate exam content, plus 3 placeholder state exam chapters locked as "Coming Soon." Same study guide → quiz → final exam → certificate flow. Separate $10 store listing.

## Store Listing

- **Name:** TradePrep: Real Estate Exam Prep
- **Slug:** `tradeprep-real-estate`
- **Price:** $10
- **Category:** Productivity
- **Creator:** MrHarmony
- **Description:** "Pass your real estate exam. 180 questions across 6 chapters with study mode, timed practice exams, and a printable certificate."
- **Long Description:** "TradePrep Real Estate is a complete national real estate exam prep tool. Study mode covers property ownership, land use regulations, valuation, financing, agency and contracts, and real estate math — you can't advance until you master each section. When ready, take a timed practice exam that simulates the real test. Pass and earn a printable certificate. 180 questions at beginner, intermediate, and advanced levels. State-specific exams for Texas, Florida, and California coming soon."
- **App URL:** `https://tradeprep.tvrapp.app/real-estate`

## Trade Definition

```typescript
{
  id: "real-estate",
  name: "Real Estate",
  slug: "real-estate",
  description: "Prepare for your national real estate licensing exam. Covers property ownership, land use, valuation, financing, agency, and math. State exams coming soon.",
  color: "text-violet-500",
  bgColor: "bg-violet-50",
  icon: "Building2",
  storeSlug: "tradeprep-real-estate",
  storeUrl: "https://tvrapp.app/store/tradeprep-real-estate",
  chapters: [
    { id: "property-ownership", name: "Property Ownership", description: "Types of ownership, estates, rights, encumbrances" },
    { id: "land-use", name: "Land Use & Regulations", description: "Zoning, environmental, building codes, fair housing" },
    { id: "valuation", name: "Valuation & Market Analysis", description: "Appraisal methods, CMA, market value" },
    { id: "financing", name: "Financing", description: "Mortgages, loan types, qualifying, closing costs" },
    { id: "agency-contracts", name: "Agency & Contracts", description: "Agent relationships, listings, purchase contracts" },
    { id: "real-estate-math", name: "Real Estate Math", description: "Commission, prorations, area calculations, loan-to-value" },
    { id: "texas-state", name: "Texas State Exam", description: "Texas-specific real estate law and regulations", comingSoon: true },
    { id: "florida-state", name: "Florida State Exam", description: "Florida-specific real estate law and regulations", comingSoon: true },
    { id: "california-state", name: "California State Exam", description: "California-specific real estate law and regulations", comingSoon: true },
  ],
}
```

## Active Chapters

### 1. property-ownership (Property Ownership)
- beginner: Fee simple, life estate, leasehold, tenancy in common, joint tenancy, community property, condominium, cooperative
- intermediate: Bundle of rights, easements, liens, encroachments, deed restrictions, homestead exemption, riparian/littoral rights
- advanced: Legal descriptions (metes and bounds, rectangular survey, lot and block), title transfer, recording statutes, adverse possession, eminent domain

### 2. land-use (Land Use & Regulations)
- beginner: Zoning basics, residential/commercial/industrial zones, building permits, variances, fair housing basics
- intermediate: Fair Housing Act protected classes, ADA requirements, environmental hazards (lead, asbestos, radon, mold), wetlands, flood zones
- advanced: Comprehensive plans, nonconforming use, spot zoning, taking/inverse condemnation, environmental impact statements, CERCLA/Superfund liability

### 3. valuation (Valuation & Market Analysis)
- beginner: Market value vs price, appraisal basics, CMA, listing price, assessed value, appreciation/depreciation
- intermediate: Three appraisal approaches (sales comparison, cost, income), adjustments, GRM, comparable selection, reconciliation
- advanced: Cap rate calculations, NOI, cost approach (reproduction vs replacement), accrued depreciation types (physical, functional, external), USPAP standards

### 4. financing (Financing)
- beginner: Mortgage basics, principal/interest, down payment, closing costs, pre-approval, credit score
- intermediate: Conventional vs FHA vs VA loans, fixed vs adjustable rate, points, PMI, escrow, PITI, amortization
- advanced: RESPA/TILA disclosure requirements, Truth in Lending, Regulation Z, qualified mortgage rules, loan-to-value calculations, secondary mortgage market (Fannie Mae, Freddie Mac)

### 5. agency-contracts (Agency & Contracts)
- beginner: Agent, principal, client, customer, fiduciary duties (OLDCAR), listing agreement, buyer agency
- intermediate: Exclusive right to sell vs exclusive agency vs open listing, dual agency, designated agency, offer/counteroffer, contingencies
- advanced: Statute of frauds, valid contract elements (competent parties, offer/acceptance, consideration, legal purpose), breach remedies, option contracts, land contracts

### 6. real-estate-math (Real Estate Math)
- beginner: Commission calculation, sale price × rate, split commissions, area (length × width), square feet to acres
- intermediate: Prorations (taxes, rent, interest), per diem calculations, transfer tax, loan origination fees, discount points
- advanced: Loan-to-value ratio, debt-to-income ratio, cap rate (NOI/price), GRM (price/gross rent), net proceeds calculation, appreciation/depreciation over time

## Data Files

- `lib/questions/real-estate.json` — ~180 questions (6 chapters × ~30 per chapter, split across 3 difficulties)
- `lib/lessons/real-estate.json` — 18 lessons (6 chapters × 3 difficulties)

## Files to Create/Modify

### New Files
- `lib/questions/real-estate.json`
- `lib/lessons/real-estate.json`

### Modified Files
- `lib/trades.ts` — Add real estate trade definition
- `components/trade-card.tsx` — Add Building2 icon mapping
- tvr-app-store `convex/seed.ts` — Add seedRealEstatePrep mutation
- tvr-app-store `lib/product-images.ts` — Add image mapping
