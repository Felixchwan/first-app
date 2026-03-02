function TaskItem({
  task,
  editingId,
  editText,
  setEditText,
  editDueDate,
  setEditDueDate,
  isOverdue,
  isDueToday,
  handleEdit,
  handleUpdate,
  handleCancelEdit,
  deleteTask,
  toggleTask,
}) {
  const isEditing = editingId === task.id;

  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);

  return (
    <div className={`task-item ${overdue ? "task-overdue" : ""}`}>
      {isEditing ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />

          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />

          <div className="task-buttons">
            <button onClick={() => handleUpdate(task.id)}>Save</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <span
            className="task-text"
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={() => toggleTask(task.id)}
          >
            {task.text}
          </span>

          <div className="task-meta">
            {task.dueDate ? (
              <>
                <span className="task-due">Due: {task.dueDate}</span>
                {overdue && <span className="badge badge-overdue">Overdue</span>}
                {!overdue && dueToday && (
                  <span className="badge badge-today">Due today</span>
                )}
              </>
            ) : (
              <span className="task-due task-due-none">No due date</span>
            )}
          </div>

          <div className="task-buttons">
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;