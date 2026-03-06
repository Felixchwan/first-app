function TaskItem({
  task,
  editingId,
  editText,
  setEditText,
  editDueDate,
  setEditDueDate,
  isOverdue,
  isDueToday,
  updatingId,
  deletingId,
  handleEdit,
  handleUpdate,
  handleCancelEdit,
  deleteTask,
  toggleTask,
}) {
  const isEditing = editingId === task.id;

  const overdue = isOverdue(task);
  const dueToday = isDueToday(task);

  const isUpdatingThisTask = updatingId === task.id;
  const isDeletingThisTask = deletingId === task.id;

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
            <button
              onClick={() => handleUpdate(task.id)}
              disabled={isUpdatingThisTask}
            >
              {isUpdatingThisTask ? "Saving..." : "Save"}
            </button>
            <button onClick={handleCancelEdit} disabled={isUpdatingThisTask}>
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <span
            className="task-text"
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              cursor: isUpdatingThisTask ? "not-allowed" : "pointer",
              marginRight: "10px",
              opacity: isUpdatingThisTask ? 0.6 : 1,
            }}
            onClick={() => {
              if (!isUpdatingThisTask) toggleTask(task.id);
            }}
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
            <button
              onClick={() => handleEdit(task)}
              disabled={isDeletingThisTask || isUpdatingThisTask}
            >
              Edit
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              disabled={isDeletingThisTask}
            >
              {isDeletingThisTask ? "Deleting..." : "Delete"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;