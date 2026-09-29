# SRM Traders v3

Diaries, calendars, bags, files, corporate gifts and promotional items - customer website, owner admin panel and Cloudflare backend.

| Folder | என்ன | Local port |
|---|---|---|
| `frontend/` | Customer website (React + Vite) | 5173 |
| `admin/` | Owner dashboard (React + Vite) | 5174 |
| `worker/` | API (Cloudflare Worker + D1) | 8787 |
| `database/` | D1 schema | - |
| `docs/` | Setup guides (தமிழ்) | - |

## Local-ல் ஓட்ட (Windows / VS Code)

```
npm run install:all
npm run db:local
```
மூன்று terminal திறந்து:
```
npm run dev:worker
npm run dev:frontend
npm run dev:admin
```
- Website: http://localhost:5173
- Admin: http://localhost:5174  (user: `admin`, password: `admin123` - `worker/.dev.vars` file-ல் மாற்றவும்)

Worker ஓடாமல் இருந்தாலும் website sample products காட்டும்.

## Order flow
Customer -> Product -> Enquiry cart -> Customer details -> WhatsApp / UPI / Razorpay -> Worker -> D1 -> Admin panel

விரிவான வழிகாட்டிகள்: `docs/BUSINESS_SETUP.md`, `PAYMENT_SETUP.md`, `WHATSAPP_SETUP.md`, `DEPLOYMENT.md`

Domain இணைக்க: `docs/DOMAIN_SETUP.md`. புதிய வசதிகள்: `docs/FUTURE_FEATURES.md`.
