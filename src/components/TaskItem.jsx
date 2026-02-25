function TaskItem({
  task,
  editingId,
  editText,
  setEditText,
  handleEdit,
  handleUpdate,
  deleteTask,
  toggleTask
}) {
  return (
    <div style={{ marginBottom: "8px" }}>
      {editingId === task.id ? (
        <>
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
        </>
      ) : (
        <>
          <span
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              cursor: "pointer",
              marginRight: "10px"
            }}
            onClick={() => toggleTask(task.id)}
          >
            {task.text}
          </span>

          <button onClick={() => handleEdit(task)}>Edit</button>
          <button onClick={() => deleteTask(task.id)}>Delete</button>
        </>
      )}
    </div>
  );
}

export default TaskItem;