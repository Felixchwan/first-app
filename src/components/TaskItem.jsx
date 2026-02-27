import { useState } from "react";

function TaskItem({
  task,
  editingId,
  editText,
  setEditText,
  handleEdit,
  handleUpdate,
  handleCancelEdit,
  deleteTask,
  toggleTask,
}) {
  const isEditing = editingId === task.id;

  return (
    <div className="task-item">
      {isEditing ? (
  <>
    <input
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
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