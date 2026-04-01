# NG Classic Frontend

Next.js 16 storefront using local API routes plus PostgreSQL. This setup fits Aiven PostgreSQL directly.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy envs:
   ```bash
   cp .env.local.example .env.local
   ```
3. Fill in:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `DATABASE_SSL`
   - `NEXT_PUBLIC_PAYSTACK_KEY`
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
4. Run the SQL in [database/schema.sql](/home/ythug/Desktop/NG-Classic/ng-classic-frontend/database/schema.sql) against your Aiven PostgreSQL database.
5. Start the app:
   ```bash
   npm run dev
   ```

## Admin Setup

Create your account through the app, then promote it manually:

```sql
update users
set role = 'admin'
where email = 'your-admin@email.com';
```

## Data Model

- `users`: app-owned auth table with `role`
- `products`: catalog
- `orders`: checkout and order history
- `reviews`: product reviews

## Notes

- The frontend talks only to local `app/api/*` route handlers.
- Product images are stored as public URLs in `image_urls`.
- Production builds use webpack because Turbopack was failing in this environment.
