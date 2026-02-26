import { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";
import Stats from "../components/Stats";
import "../App.css";
import "../index.css";


function Dashboard() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const totalTasks = tasks.length;

const completedTasks = tasks.filter(task => task.completed).length;

const pendingTasks = totalTasks - completedTasks;

const completionPercentage =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [clicks, setClicks] = useState(0);
  const [filter, setFilter] = useState ("all");

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

const filteredTasks = tasks.filter(task => {
  if (filter === "active") return !task.completed;
  if (filter === "completed") return task.completed;
  return true;
});

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
<p>Clicks: {clicks}</p>

<div className="stats">
  <Stats
  total={totalTasks}
  completed={completedTasks}
  pending={pendingTasks}
  percentage={completionPercentage}
/>
</div>

<button onClick={() => setClicks(clicks + 1)}>
  Test State
</button>

<div style={{ marginBottom: "15px" }}>
  <button onClick={() => setFilter("all")}>All</button>
  <button onClick={() => setFilter("active")}>Active</button>
  <button onClick={() => setFilter("completed")}>Completed</button>
</div>
      {filteredTasks.map(task => (
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