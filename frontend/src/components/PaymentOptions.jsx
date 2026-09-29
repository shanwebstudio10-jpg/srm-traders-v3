const OPTIONS = [
  { id: 'whatsapp', title: 'Send on WhatsApp', text: 'We confirm price and payment details on chat' },
  { id: 'upi', title: 'Pay by UPI', text: 'Scan the QR code or open your UPI app' },
  { id: 'razorpay', title: 'Card / Net banking (Razorpay)', text: 'Secure online payment' },
];

export default function PaymentOptions({ value, onChange }) {
  return (
    <fieldset className="pay">
      <legend>Payment method</legend>
      {OPTIONS.map((o) => (
        <label key={o.id} className={value === o.id ? 'pay-o on' : 'pay-o'}>
          <input type="radio" name="pay" checked={value === o.id} onChange={() => onChange(o.id)} />
          <span><b>{o.title}</b><small>{o.text}</small></span>
        </label>
      ))}
    </fieldset>
  );
}
