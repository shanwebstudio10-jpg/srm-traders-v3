import { useSettings } from '../api.js';

export default function About() {
  const s = useSettings();
  return (
    <section className="wrap section narrow">
      <h1>About {s.business_name}</h1>
      <p>{s.business_name} supplies diaries, calendars, jute bags, net bags, travel bags, files, corporate gifts and promotional items to businesses, schools and shops.</p>
      <p>Every item can carry your logo. Send us the quantity, and we reply with a clear price and delivery date.</p>
      <p className="muted">Edit this page in frontend/src/pages/About.jsx to add your own story.</p>
    </section>
  );
}
