import { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";
import Stats from "../components/Stats";
import "../App.css";
import "../index.css";
import {
  fetchTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTaskById
} from "../services/tasksService";
import { supabase } from "../lib/supabaseClient";

function Dashboard() {

  const [darkMode, setDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem("theme");
  return savedTheme === "dark";
});
useEffect(() => {
  localStorage.setItem("theme", darkMode ? "dark" : "light");
}, [darkMode]);

const [uiError, setUiError] = useState("");
const showError = (message) => {
  setUiError(message);
  setTimeout(() => setUiError(""), 4000);
};

const [adding, setAdding] = useState(false);
const [updatingId, setUpdatingId] = useState(null); // for toggle + save
const [deletingId, setDeletingId] = useState(null);

const [tasks, setTasks] = useState([]);
const [loadingTasks, setLoadingTasks] = useState(true);

const totalTasks = tasks.length;

const completedTasks = tasks.filter(task => task.completed).length;

const pendingTasks = totalTasks - completedTasks;

const completionPercentage =
  totalTasks === 0
    ? 0
    : Math.round((completedTasks / totalTasks) * 100);

const [editingId, setEditingId] = useState(null);
const [editText, setEditText] = useState("");
const [editDueDate, setEditDueDate] = useState("");
const [clicks, setClicks] = useState(0);
const [filter, setFilter] = useState ("all");

useEffect(() => {
  const load = async () => {
    try {
      const results = await fetchTasks();
      setTasks(results);
    } catch (e) {
      showError(e?.message || "Failed to fetch tasks.");
    } finally {
      setLoadingTasks(false);
    }
  };

  load();
}, []);

useEffect(() => {
  const channel = supabase
    .channel("tasks-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks" },
      (payload) => {
        console.log("✅ Realtime event:", payload);
        // simplest reliable approach: refetch
        fetchTasks()
          .then(setTasks)
          .catch((e) => showError(e?.message || "Realtime sync failed."));
      }
    )
    .subscribe((status) => {
      console.log("📡 Realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

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

  const overdueTasks = tasks.filter(t => isOverdue(t)).length;
  const dueTodayTasks = tasks.filter(t => isDueToday(t)).length;
  const withDueDateTasks = tasks.filter(t => !!t.dueDate).length;
  const [newTaskText, setNewTaskText] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

const addTask = async (taskText, dueDate = "") => {
  if (adding) return;
  setAdding(true);

  try {
    const newTask = await createTask(taskText, dueDate);
    setTasks((prev) => [newTask, ...prev]);

    setNewTaskText("");
    setNewDueDate("");
  } catch (e) {
    showError(e?.message || "Failed to add task.");
  } finally {
    setAdding(false);
  }
};

const deleteTask = async (id) => {
  if (deletingId) return;
  setDeletingId(id);

  try {
    await deleteTaskById(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  } catch (e) {
    showError(e?.message || "Failed to delete task.");
  } finally {
    setDeletingId(null);
  }
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

const handleUpdate = async (id) => {
  if (updatingId) return;

  const nextText = editText.trim();
  if (!nextText) return;

  setUpdatingId(id);

  try {
    await updateTask(id, nextText, editDueDate);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, text: nextText, dueDate: editDueDate } : t
      )
    );

    setEditingId(null);
    setEditText("");
    setEditDueDate("");
  } catch (e) {
    showError(e?.message || "Failed to save changes.");
  } finally {
    setUpdatingId(null);
  }
};

const toggleTask = async (id) => {
  if (updatingId) return;

  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  setUpdatingId(id);

  try {
    await toggleTaskStatus(id, task.completed);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  } catch (e) {
    showError(e?.message || "Failed to update task.");
  } finally {
    setUpdatingId(null);
  }
};

const filteredTasks = tasks.filter(task => {
  if (filter === "active") return !task.completed;
  if (filter === "completed") return task.completed;
  return true;
});

const sortedTasks = [...filteredTasks].sort((a, b) => {
  // Incomplete first
  if (a.completed !== b.completed) return a.completed ? 1 : -1;

  // Tasks with due dates first
  const aHasDue = !!a.dueDate;
  const bHasDue = !!b.dueDate;
  if (aHasDue !== bHasDue) return aHasDue ? -1 : 1;

  // Earlier due date first
  if (aHasDue && bHasDue && a.dueDate !== b.dueDate) {
    return a.dueDate.localeCompare(b.dueDate);
  }

  // fallback (stable)
return 0;
});

if (loadingTasks) {
  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <p>Loading tasks...</p>
    </div>
  );
}

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      {uiError && (
  <div
    style={{
      background: "#ff4d4f",
      color: "white",
      padding: "8px",
      borderRadius: "6px",
      marginBottom: "10px",
    }}
  >
    {uiError}
  </div>
)}
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
          onKeyDown={async (e) => {
          if (e.key === "Enter" && newTaskText.trim() !== "" && !adding) {
          await addTask(newTaskText.trim(), newDueDate);
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
  disabled={adding}
  onClick={async () => {
    if (!newTaskText.trim() || adding) return;
    await addTask(newTaskText.trim(), newDueDate);
  }}
>
  {adding ? "Adding..." : "Add"}
</button>
      </div>

<div className="stats">
<Stats
  total={totalTasks}
  completed={completedTasks}
  pending={pendingTasks}
  percentage={completionPercentage}
  overdue={overdueTasks}
  dueToday={dueTodayTasks}
  withDueDate={withDueDateTasks}
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
{sortedTasks.map(task => (
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