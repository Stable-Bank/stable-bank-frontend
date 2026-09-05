# StableBank Frontend

> **Direct Stablecoin Settlement & Lifestyle Banking**  
> A high-performance Web3 x FinTech interface built with Next.js 15, React 19, and Tailwind CSS v4.

---

## 🌟 Overview

StableBank bridges global fiat banking with chain-abstracted stablecoin infrastructure. Users can manage virtual bank accounts (USD ACH/Wire and EUR SEPA), spend funds via virtual Visa cards, access curated lifestyle partner applications, and monitor multi-chain balances (Solana, Base EVM, Tron) with 0% bank FX markups.

---

## 🚀 Key Features

### 1. Chain-Abstracted Banking & Virtual Accounts
- **Unified Balances**: Real-time aggregation of USDT/USDC across Solana, Base, and Tron.
- **Virtual Bank Accounts**: Direct USD (Routing & Account Number) and EUR (IBAN & BIC) accounts powered by Bridge.xyz.
- **Deposit & Transfer Simulation**: Sandbox testing for ACH, Wire, and SEPA funding flows.

### 2. Virtual Visa Cards (`/dashboard/vcard`)
- **Instant Card Provisioning**: Issue virtual debit cards linked directly to stablecoin accounts.
- **Card Controls**: Real-time card locking/unlocking, spending limits, and masked PAN reveal.
- **Digital Wallet Ready**: Supports Apple Pay and Google Pay tokenization.

### 3. Lifestyle Apps Marketplace (`/dashboard/apps`)
- **Curated Partner Directory**: 10 purpose-built lifestyle and financial applications designed according to strict UX laws:
  - **StableNet eSIM**: Instant 5G roaming across 160+ countries.
  - **SkyPass Flights**: International flight bookings with zero FX surcharge.
  - **StableStays & Villas**: 2.2M+ hotel rooms and private villas worldwide.
  - **CityRide Cabs**: On-demand city taxis and airport transfers in 70+ global hubs.
  - **Global Utility Hub**: Airtime, power, water, and broadband bill settlement in 120+ countries.
  - **GiftCard SuperMall**: Digital vouchers for Amazon, Apple, Steam, Netflix, and Uber.
  - **VIP Concierge & Dining**: Michelin reservations and private yacht charters.
  - **StableYield Vaults**: Audited stablecoin yield opportunities up to 8.4% APY.
  - **Global Invoicing & Payroll**: B2B invoices and instant international contractor payouts.
  - **TaxLedger Pro**: Audit-grade capital gains reporting and CSV/PDF export.

### 4. Overhauled Notifications Feed (`/dashboard/notifications`)
- Built strictly following the 18 design laws in `UX rules.md`:
  - **Chronological Grouping**: Date chunking (**Today**, **Yesterday**, **Earlier This Week**, **Older**).
  - **Instant Search**: Real-time filtering by keywords, transaction amounts, references, or types.
  - **1-Tap Unread Filter**: Quickly isolate unreviewed alerts.
  - **44px+ Touch Targets**: Thumb-friendly interaction areas for marking as read and deleting.
  - **Error Recovery (Undo)**: Immediate Sonner toast action allowing 1-click restoration of deleted notifications.
  - **Interactive Details Modal**: Deep inspection of event metadata, amounts, and contextual shortcuts.
  - **Real-Time Stream**: Persistent Server-Sent Events (SSE) connection with live ping indicator.

### 5. High-Contrast Accessible Authentication
- Identity-verified OTP email verification.
- Password recovery flow with high-contrast, thumb-sized OTP input boxes and inline email editing.
- Modern dark luxury email templates dispatched for all lifecycle events.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack)
- **UI Runtime**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [tw-animate-css](https://www.npmjs.com/package/tw-animate-css)
- **Icons**: [Lucide React](https://lucide.dev/) & [@web3icons/react](https://web3icons.com/)
- **Primitives**: [@radix-ui/react-dialog](https://www.radix-ui.com/) & [@radix-ui/react-slot](https://www.radix-ui.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Client Networking**: [Axios](https://axios-http.com/)
- **Validation**: [Zod](https://zod.dev/)

---

## 📦 Project Structure

```
src/
├── app/
│   ├── (auth)/                 # Sign in, Sign up, Forgot Password, Reset Password, Verify OTP
│   ├── dashboard/              # Protected dashboard modules
│   │   ├── apps/               # Lifestyle Apps Marketplace
│   │   ├── notifications/      # Real-time Notifications Feed
│   │   ├── savings/            # Yield and savings accounts
│   │   ├── settings/           # User settings & security
│   │   ├── vcard/              # Virtual debit card management
│   │   └── page.tsx            # Dashboard home & quick actions
│   ├── globals.css             # Tailwind v4 theme variables and base layers
│   └── layout.tsx              # Root layout & providers
├── components/
│   ├── brand/                  # Logos and badge components
│   ├── modal/                  # Deposit, Send, Swap, and App preview modals
│   ├── navbar/                 # Desktop header & mobile bottom navigation
│   ├── sidebar/                # Desktop sidebar navigation
│   └── ui/                     # Button, Card, Dialog, Input, OtpInput primitives
├── contexts/                   # AuthContext, NotificationContext
├── lib/                        # Navigation routes, formatters, utilities
├── services/                   # Account, Card, Transfer, Notification API services
└── types/                      # TypeScript definitions & API models
```

---

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- pnpm (recommended) or npm / yarn

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Stable-Bank/stable-bank-frontend.git
   cd stable-bank-frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=https://api.stablebank.finance/api/v1
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔨 Building for Production

```bash
# Build the optimized production output
pnpm build

# Start production server
pnpm start
```

---

## 📄 License
Proprietary · All rights reserved by StableBank.
