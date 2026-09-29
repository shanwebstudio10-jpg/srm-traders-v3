# Business Setup (உங்கள் கடை விவரங்கள்)

## 1. Admin-ல் Settings
1. Admin panel-ல் login செய்யவும்.
2. **Settings** page திறக்கவும்.
3. இவற்றை நிரப்பி **Save settings** அழுத்தவும்:
   - Business name, Phone, Email, Address
   - WhatsApp number (எ.கா. `919876543210` - `+` இல்லாமல், 91 உடன்)
   - UPI ID (எ.கா. `srmtraders@okhdfcbank`)
   - Default GST %

## 2. Products சேர்க்க
1. **Products -> Add product**.
2. பெயர், category, ஒரு piece விலை, minimum quantity, விளக்கம் கொடுக்கவும்.
3. Photo: phone/PC-லிருந்து தேர்ந்தெடுக்கலாம் (browser தானாக சிறிதாக்கும்).
4. **Show on website** tick இருந்தால் மட்டுமே customer-க்கு தெரியும்.

## 3. Photos folder வழியாக
பெரிய photos-ஐ `frontend/public/products/<category>/` folder-ல் போட்டு, Add product-ல் photo link ஆக `/products/diary/1.jpg` என்று கொடுக்கலாம்.

## 4. Logo
உங்கள் logo-வை `frontend/public/logo/` folder-ல் வைக்கவும். Navbar-ல் காட்ட `frontend/src/components/Navbar.jsx`-ஐ மாற்றவும்.

## 5. Order status
Pending -> Confirmed -> Paid -> Shipped -> Completed. **Orders** page-ல் dropdown மூலம் மாற்றலாம். "Paid" ஆக மாற்றினால் payment-உம் Paid ஆகும்.

## 6. Quotation PDF
**Quotations** page-ல் customer, items, rate கொடுத்து **Save and create PDF** அழுத்தவும். திறக்கும் print window-ல் **Save as PDF** தேர்ந்தெடுக்கவும்.
