# Deployment (Cloudflare)

முன்தேவை: Cloudflare account (இலவசம்), Node.js, GitHub.

## 1. Worker + D1
```
cd worker
npm install
npx wrangler login
npx wrangler d1 create srm-traders-db
```
வரும் `database_id`-ஐ `worker/wrangler.toml`-ல் `REPLACE_WITH_YOUR_D1_DATABASE_ID` இடத்தில் ஒட்டவும்.
```
npm run db:init:remote
npm run db:seed:remote
npx wrangler secret put ADMIN_PASSWORD
npx wrangler secret put JWT_SECRET
npx wrangler deploy
```
`JWT_SECRET` = நீளமான random எழுத்துக்கள். Deploy முடிந்ததும் `https://srm-traders-api.<உங்கள்-பெயர்>.workers.dev` URL கிடைக்கும்.

## 2. Frontend (Cloudflare Pages)
1. Project-ஐ GitHub-ல் push செய்யவும்.
2. Cloudflare -> Workers & Pages -> Create -> Pages -> GitHub repo தேர்வு.
3. Frontend settings:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `VITE_API_URL` = உங்கள் worker URL (கடைசியில் `/` இல்லாமல்)

## 3. Admin (இன்னொரு Pages project)
- Root directory: `admin`, Build: `npm run build`, Output: `dist`
- Environment variable: `VITE_API_URL` = worker URL

## 4. CORS பாதுகாப்பு (Domain இணைக்கும் விவரங்கள்: DOMAIN_SETUP.md)
`worker/wrangler.toml`-ல் `ALLOWED_ORIGIN`-ஐ `*` லிருந்து உங்கள் website URL ஆக மாற்றி மீண்டும் `npx wrangler deploy`. (இரண்டு URL இருந்தால் பின்னர் code-ல் list ஆக்கவும்.)

## 5. Backup
GitHub-ல் code. D1 backup: `npx wrangler d1 export srm-traders-db --remote --output=backup.sql`

## சோதனை பட்டியல்
- [ ] Website-ல் products தெரிகின்றன
- [ ] Test order போட்டு Admin -> Orders-ல் தெரிகிறது
- [ ] Admin password மாற்றப்பட்டது
- [ ] UPI QR மற்றும் WhatsApp எண் சரியானவை
