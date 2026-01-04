import "./StatCard.css"

const StatCard = ({ icon: Icon, label, value, trend, color = "primary" }) => {
  const isPositive = trend >= 0

  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {trend !== undefined && (
          <div className={`stat-trend ${isPositive ? "positive" : "negative"}`}>
            {isPositive ? "+" : ""}
            {trend}% from last month
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
