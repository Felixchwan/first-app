export default function Stats({
  total,
  completed,
  pending,
  percentage,
  overdue,
  dueToday,
  withDueDate,
}) {
  if (total === 0) {
    return (
      <div className="stats">
        <p>No tasks yet. Add one to get started.</p>
      </div>
    );
  }

  return (
  <div className="stats-grid">
    <div className="stat-card">
      <span className="stat-value">{total}</span>
      <span className="stat-label">Total</span>
    </div>

    <div className="stat-card">
      <span className="stat-value">{completed}</span>
      <span className="stat-label">Completed</span>
    </div>

    <div className="stat-card">
      <span className="stat-value">{pending}</span>
      <span className="stat-label">Pending</span>
    </div>

    <div className="stat-card stat-warning">
      <span className="stat-value">{overdue}</span>
      <span className="stat-label">Overdue</span>
    </div>

    <div className="stat-card">
      <span className="stat-value">{dueToday}</span>
      <span className="stat-label">Due Today</span>
    </div>

    <div className="stat-card">
      <span className="stat-value">{withDueDate}</span>
      <span className="stat-label">With Due Date</span>
    </div>

    <div className="progress-block">
      <span className="progress-title">Completion Rate</span>

      <div className="progress-container">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="progress-percent">{percentage}%</span>
    </div>
  </div>
  );
}