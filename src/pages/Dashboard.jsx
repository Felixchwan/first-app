import { useState, useEffect } from "react";

function Dashboard() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTask = (taskText) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const handleUpdate = () => {
    setTasks(
      tasks.map(task =>
        task.id === editingId
          ? { ...task, text: editText }
          : task
      )
    );
    setEditingId(null);
    setEditText("");
  };

  return (
    <div>
      <h2>Task Dashboard</h2>

      <input
        placeholder="Add a new task..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim() !== "") {
            addTask(e.target.value);
            e.target.value = "";
          }
        }}
      />

      {tasks.map(task => (
        <div key={task.id}>
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
              <span>{task.text}</span>
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;