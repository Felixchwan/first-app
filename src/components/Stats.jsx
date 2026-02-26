export default function Stats({ total, completed, pending, percentage }) {
  if (total === 0) {
    return (
      <div className="stats">
        <p>No tasks yet. Add one to get started.</p>
      </div>
    );
  }

  return (
    <div className="stats">
      <p>Total: {total}</p>
      <p>Completed: {completed}</p>
      <p>Pending: {pending}</p>
      <p>Completion Rate: {percentage}%</p>

      <div className="progress-container">
        <div
          className="progress-fill"
          style={{ width: percentage + '%' }}
        ></div>
      </div>
    </div>
  );
}