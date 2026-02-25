import { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";

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

  const toggleTask = (id) => {
  setTasks(
    tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    )
  );
};

  return (
    <div className="app-container">
      <h2>Task Dashboard</h2>

      <input
      className="task-input"
        placeholder="Add a new task..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim() !== "") {
            addTask(e.target.value);
            e.target.value = "";
          }
        }}
      />

      {tasks.map(task => (
  <TaskItem
    key={task.id}
    task={task}
    editingId={editingId}
    editText={editText}
    setEditText={setEditText}
    handleEdit={handleEdit}
    handleUpdate={handleUpdate}
    deleteTask={deleteTask}
    toggleTask={toggleTask}
  />
))}
    </div>
  );
}

export default Dashboard;