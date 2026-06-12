export default function DashboardCard({ icon, title, value, sub, color = 'purple' }) {
  return (
    <div className={`dash-card dash-card-${color}`}>
      <div className="dash-icon">{icon}</div>
      <div className="dash-info">
        <p className="dash-value">{value}</p>
        <p className="dash-title">{title}</p>
        {sub && <p className="dash-sub">{sub}</p>}
      </div>
    </div>
  );
}
