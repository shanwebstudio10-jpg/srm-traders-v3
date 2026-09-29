# Domain இணைக்கும் வழிகாட்டி

Code-ஐ மாற்ற வேண்டாம். கீழே உள்ள 3 இடங்களில் முகவரிகளை மட்டும் மாற்றினால் போதும்.

## 1. Domain வாங்குதல்
Cloudflare Registrar (எளிது, DNS தானாக அமையும்) அல்லது GoDaddy / BigRock / Hostinger.
வேறு இடத்தில் வாங்கினால்: Cloudflare -> **Add a site** -> domain கொடுக்கவும் -> Cloudflare தரும் 2 nameserver-களை அந்த registrar-ல் மாற்றவும்.

## 2. Pages projects-ல் Custom domain
- Website project -> **Custom domains** -> `srmtraders.in` மற்றும் `www.srmtraders.in`
- Admin project -> **Custom domains** -> `admin.srmtraders.in`

## 3. Environment variables (Cloudflare Pages -> Settings)
| Project | Variable | மதிப்பு |
|---|---|---|
| Website | `VITE_SITE_URL` | `https://srmtraders.in` |
| Website | `VITE_API_URL` | உங்கள் worker URL |
| Website | `VITE_GA_ID` | (விருப்பம்) Google Analytics ID |
| Admin | `VITE_SITE_URL` | `https://srmtraders.in` |
| Admin | `VITE_API_URL` | உங்கள் worker URL |

மாற்றிய பிறகு **Deployments -> Retry deployment** அழுத்தவும். Sitemap.xml மற்றும் robots.txt தானாக உருவாகும்.

## 4. Worker அனுமதி (CORS)
`worker/wrangler.toml`-ல்:
```
ALLOWED_ORIGIN = "https://srmtraders.in,https://www.srmtraders.in,https://admin.srmtraders.in"
```
பிறகு `cd worker` -> `npx wrangler deploy`. (Local சோதனைக்கு localhost தானாக அனுமதிக்கப்படும்.)

## 5. விருப்பம்: API-க்கும் சொந்த முகவரி
Workers & Pages -> `srm-traders-api` -> Settings -> **Domains & Routes** -> Add custom domain -> `api.srmtraders.in`.
பிறகு இரண்டு Pages projects-லும் `VITE_API_URL=https://api.srmtraders.in` மாற்றி Retry செய்யவும்.

## 6. Domain இணைத்த பிறகு
- Google Search Console-ல் site சேர்த்து `https://srmtraders.in/sitemap.xml` submit செய்யவும்.
- Google Business Profile உருவாக்கி website முகவரி கொடுக்கவும்.
- `frontend/index.html`-ல் உள்ள LocalBusiness விவரங்களில் `"url": "https://srmtraders.in"` சேர்க்கலாம்.
- Razorpay live mode-க்கு KYC-ல் இந்த domain-ஐ கொடுக்கவும்.

## ஏற்கனவே deploy செய்திருந்தால்
புதிய `messages` table-க்காக ஒரு முறை ஓட்டவும் (பாதுகாப்பானது, பழைய data அழியாது):
```
cd worker
npm run db:init:remote
npx wrangler deploy
```
