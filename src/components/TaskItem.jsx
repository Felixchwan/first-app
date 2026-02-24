function TaskItem({ task, deleteTask, toggleTask }) {
  return (
    <div style={{ marginBottom: "10px" }}>
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

      <button onClick={() => deleteTask(task.id)}>
        Delete
      </button>
    </div>
  );
}

export default TaskItem;