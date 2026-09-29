# Payment Setup

மூன்று வழிகள்: WhatsApp, UPI, Razorpay.

## WhatsApp
கூடுதல் setup தேவையில்லை. `WHATSAPP_SETUP.md` பார்க்கவும்.

## UPI (QR code)
1. உங்கள் UPI app-ல் (PhonePe / GPay / Paytm) "My QR code" -> screenshot எடுக்கவும்.
2. அதை `frontend/public/payment/upi-qr.png` என்ற பெயரில் மாற்றி (replace) வைக்கவும்.
3. Admin -> Settings -> **UPI ID** நிரப்பவும்.
4. Customer UPI தேர்ந்தெடுத்தால் QR + "Open UPI app" button + WhatsApp-ல் screenshot அனுப்பும் link காட்டும்.
5. பணம் வந்ததும் Admin -> **Payments -> Mark as paid**.

## Razorpay
1. https://razorpay.com-ல் account திறந்து KYC முடிக்கவும். முதலில் **Test mode** பயன்படுத்தவும்.
2. Dashboard -> Settings -> API Keys -> **Key Id** மற்றும் **Key Secret** எடுக்கவும்.
3. Local test: `worker/.dev.vars` file-ல்
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxx
   ```
4. Live server-க்கு (worker folder-ல்):
   ```
   npx wrangler secret put RAZORPAY_KEY_ID
   npx wrangler secret put RAZORPAY_KEY_SECRET
   ```
5. Test payment வெற்றி பெற்றால் order தானாக **Paid** ஆகும். Signature server-ல் சரிபார்க்கப்படும்.

முக்கியம்: Key Secret-ஐ GitHub-ல் போடாதீர்கள். `.dev.vars` ஏற்கனவே `.gitignore`-ல் உள்ளது.
