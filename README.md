# Staffly AI — Your AI Workforce

> **Tagline:** Your AI workforce. More work, less effort.

Staffly AI is a full-stack web application designed for small businesses and entrepreneurs (with primary focus on African & Nigerian SMEs, and adaptable globally) to manage customer support inquiries, sales conversions, orders, and daily business operations using specialized autonomous digital employees.

---

## 🌟 Product Overview

Running a small business often means answering repetitive questions on WhatsApp or Instagram, managing orders across notes and chats, and struggling to follow up with leads. Staffly AI provides a ready-to-work digital workforce operating 24/7 directly from your business knowledge base:

1. **AI Customer Support (Amina)**
   - Answers inquiries on product specs, operating hours, delivery logistics, and store policies.
   - **Grounding Mandate:** Answers strictly from the business knowledge base. If information is not listed, politely informs the customer rather than hallucinating prices or policies.

2. **AI Sales Assistant (Chidi)**
   - Consultative seller that helps customers pick matching products and answers pre-purchase questions.
   - **Grounding Mandate:** Recommends genuine catalog items and never invents products or out-of-stock inventory.

3. **AI Order Manager (Tunde)**
   - Collects customer name, phone number, delivery address, and line items.
   - Computes accurate pricing and delivery fees in Nigerian Naira (₦) or selected workspace currency.
   - **Grounding Mandate:** Never claims an order is placed until the customer confirms; generates actionable order cards for 1-click database logging.

4. **AI Business Assistant (Kola)**
   - Executive advisor for the business owner.
   - Analyzes active leads, pending fulfillment, revenue volume, and drafts marketing promos or operational improvements.

---

## 🚀 Key Features

- **Login-Style Welcome Screen (No Auth Friction):** Professional enterprise welcome screen featuring a one-click **"Continue as Guest"** button. No email, password, or verification required.
- **Main Dashboard:** Live KPI cards for Total Customers, Active Leads, Orders, and AI Tasks Automated, alongside quick actions and recent activity feeds.
- **Dynamic AI Employee Workspace:** Interactive chat interface with persona switching, suggested conversation starters, live knowledge base context inspector, and interactive order draft approval cards.
- **Business Knowledge Base:** Single source of truth for business overview, product catalog with pricing and stock toggles, delivery fees by region, operating hours, FAQs, and return/refund policies.
- **Customers & Leads Pipeline:** Complete contact management with lead stage transitions (New ➔ Contacted ➔ Converted) and product interest tracking.
- **Orders Management:** Order creation modal with catalog item selector, automatic subtotal/delivery calculation, and status progression (`Pending`, `Confirmed`, `Processing`, `Completed`, `Cancelled`).
- **Activity & Performance Reports:** Clear metrics on workforce productivity, task distributions, conversion rates, and audit logs. All sample data is explicitly labeled.
- **Workspace Settings:** Switch currency (₦ NGN default, $ USD, £ GBP, € EUR, GH₵ GHS, KES), test multiple SME profiles (Skincare & Beauty vs. Tech Gadgets), or reset data anytime.

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **Backend / Proxy:** Node.js, Express, tsx
- **AI Engine:** Google Gemini API (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK
- **Architecture:** Server-side proxy (`/api/chat`) ensures `GEMINI_API_KEY` is never exposed to the client bundle. Includes a built-in knowledge engine fallback for offline/preview resilience.
- **Persistence:** High-reliability browser storage abstraction (`StorageService`) with preloaded sample SME data ready for export or migration to PostgreSQL / Cloud SQL.

---

## 📋 Getting Started Locally

### Prerequisites

- Node.js (v20 or higher recommended)
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/your-username/staffly-ai.git
cd staffly-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and configure your Google Gemini API key:

```env
GEMINI_API_KEY="your-gemini-api-key-here"
PORT=3000
```

> **Note on Security:** Your Gemini API key is loaded only by the Express server on `process.env.GEMINI_API_KEY` and is never bundled or sent to the client browser.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Production Build & Deployment

### Build the frontend

```bash
npm run build
```

This compiles optimized client assets into the `dist/` directory.

### Run in production mode

```bash
NODE_ENV=production npm start
```

The Express server serves the static assets from `dist/` and hosts the `/api/chat` and `/api/health` endpoints on port 3000.

### Docker / Cloud Run Deployment

You can containerize Staffly AI with the following standard Dockerfile:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

---

## 🔒 Security & Grounding Rules

- **Strict Knowledge Grounding:** Each digital employee has specialized system instructions injected with the business profile. They are explicitly constrained to state lack of information rather than inventing policies, products, or prices.
- **No Mock Auth / Fake Credentials:** The guest flow transparently launches a sandbox session stored in local persistence.
- **No Client-side Secrets:** All AI API calls flow through the backend proxy.

---

## 📄 License

Apache-2.0. Built for small business owners and entrepreneurs.
