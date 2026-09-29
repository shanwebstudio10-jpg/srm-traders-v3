export default function ProductSearch({ value, onChange }) {
  return <input className="input" type="search" placeholder="Search diaries, bags, gifts..." value={value} onChange={(e) => onChange(e.target.value)} />;
}
