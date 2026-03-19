# NG Classic — Frontend

Next.js 14 + TailwindCSS frontend for the NG Classic hair store.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your values:
   - `NEXT_PUBLIC_STRAPI_URL` — your Strapi backend URL
   - `NEXT_PUBLIC_PAYSTACK_KEY` — Paystack public key
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp number with country code (e.g. `2348012345678`)

3. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero + featured products |
| `/shop` | Product catalogue with category filter |
| `/product/[id]` | Product detail, images, reviews |
| `/cart` | Cart with qty management |
| `/checkout` | Paystack payment + WhatsApp order |
| `/login` | Sign in |
| `/register` | Create account |
| `/account` | Order history |
| `/admin` | Admin: manage products + orders |

## Strapi Enum Values

Use these exact values in Strapi (capitalised, underscores for spaces):

**Product category:** `Wigs`, `Bundles`, `Closures_Frontals`, `Hair_Care`

**Order orderStatus:** `Pending`, `Confirmed`, `Delivered`

## Deploy

- **Frontend:** Push to GitHub → import on [Vercel](https://vercel.com)
- **Backend:** Push Strapi to GitHub → deploy on [Railway](https://railway.app) with a PostgreSQL addon
