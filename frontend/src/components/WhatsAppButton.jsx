import { useSettings } from '../api.js';

export default function WhatsAppButton() {
  const s = useSettings();
  const href = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hi, I want to enquire about bulk products.')}`;
  return <a className="wa" href={href} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">WhatsApp</a>;
}
