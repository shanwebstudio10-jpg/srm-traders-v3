import { CATEGORIES } from '../api.js';

export default function ProductFilter({ value, onChange }) {
  return (
    <div className="chips">
      <button className={!value ? 'chip on' : 'chip'} onClick={() => onChange('')}>All</button>
      {CATEGORIES.map((c) => (
        <button key={c.slug} className={value === c.slug ? 'chip on' : 'chip'} onClick={() => onChange(c.slug)}>{c.label}</button>
      ))}
    </div>
  );
}
