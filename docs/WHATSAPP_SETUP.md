# WhatsApp Setup

இந்த project WhatsApp **click-to-chat link** (`wa.me`) பயன்படுத்துகிறது. API கட்டணம் இல்லை.

## Setup
1. Admin -> Settings -> **WhatsApp number** = `91` + 10 இலக்க எண் (எ.கா. `919876543210`).
2. Save செய்யவும்.

## எப்படி வேலை செய்கிறது
- Customer "WhatsApp" தேர்ந்தெடுத்து order போட்டால், items, total, பெயர், phone அடங்கிய message தயாராக WhatsApp திறக்கும்.
- Customer "Send" அழுத்த வேண்டும். அதற்குள் order database-ல் சேமிக்கப்பட்டிருக்கும்.
- Floating **WhatsApp button** எல்லா pages- லும் இருக்கும்.
- Admin -> Customers page-ல் phone எண்ணை அழுத்தினால் அந்த customer-உடன் chat திறக்கும்.

## Message மாற்ற
`worker/src/whatsapp.js` -> `buildOrderMessage`.

## பின்னாளில் (Future)
தானியங்கி messages (order confirm, payment reminder) வேண்டுமென்றால் WhatsApp Business Cloud API சேர்க்கலாம். அதற்கு `whatsapp.js`-ல் function சேர்க்கவும்.
