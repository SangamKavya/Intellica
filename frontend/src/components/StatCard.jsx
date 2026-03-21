function StatCard({ title, count }) {
  return (
    <div className="card stat-card fade-in">
      <h4 style={{ margin: 0, color: "var(--muted)" }}>{title}</h4>
      <h2 style={{ margin: 0 }}>{count}</h2>
    </div>
  );
}

export default StatCard;
