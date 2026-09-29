export default function StatsCard({ label, value }) {
  return <div className="stat"><small>{label}</small><b>{value}</b></div>;
}
