interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "primary" | "success" | "danger" | "info";
  badge?: string;
}

export default function StatsCard({ title, value, icon, color, badge }: StatsCardProps) {
  return (
    <div className={`stats-card stats-card--${color}`}>
      <div className="stats-card-icon">{icon}</div>
      <div className="stats-card-body">
        <p className="stats-card-title">{title}</p>
        <p className="stats-card-value">{value}</p>
        {badge && <span className="stats-card-badge">{badge}</span>}
      </div>
    </div>
  );
}