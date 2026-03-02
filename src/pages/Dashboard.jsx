import { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";
import Stats from "../components/Stats";
import "../App.css";
import "../index.css";

function Dashboard() {

  const [darkMode, setDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark";
});
useEffect(() => {
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);

  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    const parsed = savedTasks ? JSON.parse(savedTasks) : [];

    // Migration: ensure dueDate exists on old tasks
    return parsed.map((t) => ({
      ...t,
      dueDate: typeof t.dueDate === "string" ? t.dueDate : "",
    }));
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
  const [editDueDate, setEditDueDate] = useState("");
  const [clicks, setClicks] = useState(0);
  const [filter, setFilter] = useState ("all");

    const todayStr = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const isOverdue = (task) => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    return task.dueDate < todayStr();
  };

  const isDueToday = (task) => {
    if (task.completed) return false;
    if (!task.dueDate) return false;
    return task.dueDate === todayStr();
  };

  const [newTaskText, setNewTaskText] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const addTask = (taskText, dueDate = "") => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
      dueDate,
    };
    setTasks([...tasks, newTask]);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
    setEditDueDate(task.dueDate || "");
  };

const handleCancelEdit = () => {
  setEditingId(null);
  setEditText("");
  setEditDueDate("");
};

const handleUpdate = (id) => {
  const nextText = editText.trim();
  if (!nextText) return;

  setTasks(prev =>
    prev.map(task =>
      task.id === id
        ? { ...task, text: nextText, dueDate: editDueDate }
        : task
    )
  );

  setEditingId(null);
  setEditText("");
  setEditDueDate("");
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
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <h2>Task Dashboard</h2>
    <button
  onClick={() => setDarkMode(!darkMode)}
  className="theme-toggle"
>
  {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
</button>

      <div className="add-task-row">
        <input
          className="task-input"
          placeholder="Add a new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && newTaskText.trim() !== "") {
              addTask(newTaskText.trim(), newDueDate);
              setNewTaskText("");
              setNewDueDate("");
            }
          }}
        />

        <input
          className="due-input"
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />

        <button
          className="add-button"
          onClick={() => {
            if (!newTaskText.trim()) return;
            addTask(newTaskText.trim(), newDueDate);
            setNewTaskText("");
            setNewDueDate("");
          }}
        >
          Add
        </button>
      </div>

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
    editDueDate={editDueDate}
    setEditDueDate={setEditDueDate}
    isOverdue={isOverdue}
    isDueToday={isDueToday}
    handleEdit={handleEdit}
    handleUpdate={handleUpdate}
    handleCancelEdit={handleCancelEdit}
    deleteTask={deleteTask}
    toggleTask={toggleTask}
  />
))}
    </div>
  );
}

export default Dashboard;