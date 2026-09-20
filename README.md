# FareFinder India ✈️🇮🇳

> Production-Quality Flight Meta-Search & Real-Time Price Comparison Engine for India.

**FareFinder India** is an independent flight meta-search engine built specifically for the Indian domestic aviation market. It enables travelers to compare airfares across leading Indian airlines (**Air India**, **IndiGo**, **Akasa Air**, **Air India Express**) and certified online travel agencies (**MakeMyTrip**, **Goibibo**, **Cleartrip**, **EaseMyTrip**, **Yatra**, **ixigo**) simultaneously in real-time, highlighting true comparable pricing with mandatory airport taxes, transparent fees, baggage allowances, student concessions, and zero booking markups.

---

## 🌟 Core Features

- ⚡ **Parallel Concurrent Meta-Search**: Simultaneously queries all enabled airlines and OTAs using `Promise.allSettled()` with strict per-provider timeout boundaries.
- 🔀 **Flight Deduplication & Multi-Provider Comparison**: Automatically detects identical physical flights operated by an airline and aggregates all airline and OTA ticket offers into a single grouped card with transparent price breakdowns.
- 🏆 **Cheapest Available Highlight**: Prominently showcases the lowest comparable fare (`Base Fare + Mandatory Taxes [GST/UDF/PSF] + Fees`).
- ⚖️ **Transparent Sorting & "Best Value" Algorithm**: Transparent composite formula balancing price (55%), flight duration (35%), and stop penalties (10%).
- 🛡️ **Live Price Verification Flow**: Pre-flight verification modal revalidates real-time seat fares before handoff, warning users if prices change.
- 🔗 **Outbound Affiliate Redirect & Click Tracking**: Routes traffic through `/go/provider/[flightId]` with comprehensive click telemetry.
- 🎓 **Student Fare Support**: Dedicated toggle for student fares, including 10% base fare concessions and +10 kg extra check-in baggage allowances.
- 📈 **30-Day Historical Price Trends**: Interactive SVG price charts tracking route volatility and booking window trends.
- 🔔 **Route Price Alerts**: Email notification alerts when route fares fall below a specified threshold (`POST /api/alerts`).
- 💱 **Multi-Currency Engine**: Live currency conversion across **INR (₹)**, **USD ($)**, **EUR (€)**, **GBP (£)**, **AED**, and **SGD (S$)**.
- 🛠️ **Admin Operations Portal (`/admin`)**: Telemetry metrics, search volume, click rates, latency monitoring, and runtime enable/disable toggles for any provider.
- 🌐 **SEO Corridors**: High-traffic landing pages (`/flights/bengaluru-to-mumbai`, `/flights/delhi-to-bengaluru`, `/flights/mumbai-to-delhi`), dynamic sitemap, and robots.txt.

---

## 🏗️ Architecture Overview

```text
                                 ┌───────────────────────┐
                                 │     User Browser      │
                                 └──────────┬────────────┘
                                            │ Search Request
                                            ▼
                                 ┌───────────────────────┐
                                 │ POST /api/flights/    │
                                 │       search          │
                                 └──────────┬────────────┘
                                            │ Zod Validation
                                            ▼
                           ┌──────────────────────────────────┐
                           │      Provider Registry           │
                           │ (Parallel Promise.allSettled)    │
                           └──┬──────┬──────┬──────┬───────┬───┘
                              │      │      │      │       │
              ┌───────────────┘      │      │      │       └──────────────┐
              ▼                      ▼      ▼      ▼                      ▼
       ┌──────────────┐       ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
       │  Air India   │       │   IndiGo     │   │  Akasa Air   │  │  AI Express  │
       │ (Airline)    │       │ (Airline)    │   │ (Airline)    │  │ (Airline)    │
       └──────────────┘       └──────────────┘   └──────────────┘  └──────────────┘
              │                      │                  │                 │
              ├──────────────────────┴──────────────────┴─────────────────┤
              │                      │                  │                 │
       ┌──────────────┐       ┌──────────────┐   ┌──────────────┐  ┌──────────────┐
       │  MakeMyTrip  │       │   Goibibo    │   │  Cleartrip   │  │  EaseMyTrip  │
       │ (OTA)        │       │ (OTA)        │   │ (OTA)        │  │ (OTA)        │
       └──────────────┘       └──────────────┘   └──────────────┘  └──────────────┘
              │                      │                  │                 │
              └──────────────────────┼──────────────────┼─────────────────┘
                                     ▼
                      ┌──────────────────────────────┐
                      │    Normalization Engine      │
                      └──────────────┬───────────────┘
                                     ▼
                      ┌──────────────────────────────┐
                      │    Deduplication Engine      │
                      │  (Group by Flight & Route)   │
                      └──────────────┬───────────────┘
                                     ▼
                      ┌──────────────────────────────┐
                      │  Sorting & Filtering Engine  │
                      └──────────────┬───────────────┘
                                     ▼
                      ┌──────────────────────────────┐
                      │   Persist Search to DB       │
                      │   (Prisma / Resilient Store) │
                      └──────────────────────────────┘
```

---

## 📁 Project Structure

```text
├── app/
│   ├── admin/page.tsx               # Admin operations dashboard
│   ├── api/
│   │   ├── admin/metrics/route.ts   # Real-time telemetry API
│   │   ├── alerts/route.ts          # Price alert creation & listing
│   │   ├── flights/[id]/verify/route.ts # Pre-booking price verification
│   │   ├── flights/search/route.ts  # Consolidated parallel search API
│   │   ├── providers/route.ts       # Provider metadata list
│   │   ├── providers/toggle/route.ts# Runtime provider toggle API
│   │   └── track-click/route.ts     # Outbound click tracking API
│   ├── booking-simulator/page.tsx   # Provider checkout simulation environment
│   ├── flights/[route]/page.tsx     # Dynamic SEO route landing pages
│   ├── go/provider/[flightId]/route.ts # Outbound affiliate redirect handler
│   ├── layout.tsx                   # Root layout with CurrencyProvider, Navbar, Footer
│   ├── page.tsx                     # Homepage with SearchWidget, Popular Routes, Trust Cards
│   ├── robots.ts                    # SEO robots.txt generator
│   ├── search/page.tsx              # Results page with filters, sorting & comparison
│   └── sitemap.ts                   # Dynamic XML sitemap generator
├── components/
│   ├── currency/CurrencyContext.tsx # Currency provider & live calculation hook
│   ├── filters/
│   │   ├── FilterSidebar.tsx        # Multi-dimensional filter sidebar
│   │   └── SortBar.tsx              # Sorting tabs with Best Value formula popover
│   ├── flights/
│   │   ├── CheapestHeroCard.tsx     # Lowest comparable fare hero highlight card
│   │   ├── FlightCard.tsx           # Multi-provider comparison flight card
│   │   └── ProviderStatusTracker.tsx# Progressive provider status bar
│   ├── modals/
│   │   ├── PriceAlertModal.tsx      # Set flight price alert modal
│   │   ├── PriceHistoryModal.tsx    # Interactive 30-day SVG price trend modal
│   │   └── PriceVerificationModal.tsx # Pre-flight fare revalidation dialog
│   ├── search/SearchWidget.tsx      # Airport combobox, swap button, student toggle
│   └── ui/
│       ├── Footer.tsx               # Compliance notice & footer links
│       └── Navbar.tsx               # Brand header, currency picker, demo indicator
├── lib/
│   ├── currency/index.ts            # Currency exchange rates and formatting
│   ├── data/airports.ts             # 25+ Indian airport IATA database & lookup utilities
│   ├── db/repository.ts             # Resilient persistence layer (Prisma + Memory fallback)
│   ├── flights/
│   │   ├── deduplicator.ts          # Physical flight grouping & comparison engine
│   │   ├── filter.ts                # Multi-criteria flight filtering
│   │   └── sorter.ts                # Cheapest, Fastest, and Best Value sorter
│   ├── providers/
│   │   ├── airlines/                # Airline adapters (AI, 6E, QP, IX)
│   │   ├── otas/                    # OTA adapters (MMT, Goibibo, Cleartrip, EMT, Yatra, ixigo)
│   │   ├── mock/generator.ts        # Realistic Indian flight schedule & fare generator
│   │   ├── base.ts                  # Base Flight Provider abstract class
│   │   └── registry.ts              # Parallel provider orchestrator & manager
│   └── validation/search.ts         # Zod schemas for query, alerts, and clicks
├── prisma/
│   ├── schema.prisma                # PostgreSQL Prisma schema (User, Search, Click, Alert)
│   └── prisma.config.ts             # Prisma configuration
├── tests/
│   ├── currency.test.ts             # Currency conversion test suite
│   ├── deduplication.test.ts        # Flight deduplication test suite
│   ├── providers.test.ts            # All 10 provider adapters test suite
│   ├── registry.test.ts             # Provider registry & concurrent execution suite
│   ├── sorting-filtering.test.ts    # Sorter & filter logic test suite
│   └── validation.test.ts           # Zod schema validation test suite
└── .env.example                     # Environment template with API placeholders
```

---

## 🚀 Quick Start (Local Run)

The application is engineered to work out of the box with zero external setup required.

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client
npx prisma generate

# 3. (Optional) Run Prisma migrations if PostgreSQL is running locally
npx prisma migrate dev

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run the automated test suite:
```bash
npm run test
```

To create a production build:
```bash
npm run build
npm run start
```

---

## 🔌 Adding Real Provider API Keys

When authorized API access (NDC, GDS, Skyscanner, Duffel, or OTA partner feeds) is obtained, configure your keys in `.env`:

```env
# Production API Keys
AIRLINE_API_KEY=your_airline_key
SKYSCANNER_API_KEY=your_skyscanner_key
DUFFEL_API_KEY=your_duffel_key
CLEARTRIP_API_KEY=your_cleartrip_key
MAKEMYTRIP_API_KEY=your_makemytrip_partner_key
INDIGO_NDC_API_KEY=your_indigo_ndc_key
AIRINDIA_NDC_API_KEY=your_airindia_ndc_key

# Database & Cache
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/farefinder?schema=public"
REDIS_URL="redis://localhost:6379"
```

---

## ➕ How to Add a New Provider

To add another airline (e.g. SpiceJet `SG`, Star Air `S5`) or OTA:

1. Create an adapter class in `lib/providers/airlines/` or `lib/providers/otas/` extending `BaseFlightProvider`:
```ts
import { BaseFlightProvider } from '../base';
import { FlightSearchRequest, FlightSearchResult } from '@/types/flights';

export class SpiceJetProvider extends BaseFlightProvider {
  constructor() {
    super('spicejet', 'SpiceJet', 'airline', 'SG');
  }

  async searchFlights(request: FlightSearchRequest): Promise<FlightSearchResult[]> {
    // If API Key is present: Call official SpiceJet API
    // Else: return realistic fallback / mock data
  }

  async getBookingUrl(result: FlightSearchResult): Promise<string> {
    return `https://www.spicejet.com/...`;
  }
}
```

2. Register the adapter in `lib/providers/registry.ts`:
```ts
this.providers.push(new SpiceJetProvider());
```

The new provider will immediately participate in concurrent searches, deduplication, price comparisons, and the admin dashboard without any UI changes needed!

## 🚀 Deploying to GitHub & Netlify

FareFinder India is configured for 1-click deployment on **Netlify** with native Next.js 16 App Router support.

### Option 1: Deploy via Netlify Dashboard (Recommended)

1. Push your repository to **GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit: FareFinder India flight meta-search"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
2. Log in to [Netlify](https://app.netlify.com) and click **Add new site** → **Import an existing project**.
3. Select **GitHub** and pick your repository.
4. Netlify will automatically detect the settings from `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Plugin**: `@netlify/plugin-nextjs`
5. Click **Deploy Site**!

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build & Deploy
netlify init
netlify deploy --prod
```

> **Note on Demo Flight Search Mode**:
> By default, the application runs in **Demo Flight Search Mode** using our realistic provider abstraction layer. Anyone visiting your deployed URL can search flights, apply filters, compare fares across 10 providers, verify prices, and test the booking simulator out-of-the-box with zero initial API keys needed.

---

## ⚖️ Legal & Compliance Notice

FareFinder India strictly adheres to legitimate data access standards:
- **No Scraping**: No web scrapers or unauthorized automated parsers are implemented.
- **No CAPTCHA Bypass**: No bot circumvention or credential harvesting tools are used.
- **Zero Booking/Payment Handling**: FareFinder India never collects passenger credit card data or executes bookings. Booking transactions occur exclusively on the authorized provider's platform.
- **Transparent Pricing**: All displayed prices reflect comparable totals including base fare, government GST, and mandatory airport user development fees (UDF/PSF).
