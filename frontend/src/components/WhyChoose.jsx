const ITEMS = [
  ['✔', 'High Quality Products', 'Durable & reliable products for your brand.'],
  ['✎', 'Customization Available', 'Logo printing & personalized gifts for your company.'],
  ['📦', 'Bulk Orders', 'Special rates for corporate and bulk orders.'],
  ['🛡', 'On-Time Delivery', 'We value your time and commitments.'],
  ['📍', 'Based in Chennai', 'Easily accessible and reliable service.'],
];

export default function WhyChoose() {
  return (
    <section className="why">
      <div className="wrap">
        <h2>Why Choose S.R.M. Traders?</h2>
        <div className="why-g">
          {ITEMS.map(([ic, t, d]) => (
            <div key={t} className="why-i"><span className="why-ic">{ic}</span><div><b>{t}</b><p>{d}</p></div></div>
          ))}
        </div>
      </div>
    </section>
  );
}
