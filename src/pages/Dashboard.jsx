import { useState, useEffect } from "react";
import TaskItem from "../components/TaskItem";
import Stats from "../components/Stats";
import "../App.css";
import "../index.css";
import { useTasks } from "../hooks/useTasks";

function Dashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const {
    tasks,
    loadingTasks,
    uiError,
    adding,
    updatingId,
    deletingId,
    addTask,
    deleteTask,
    toggleTask,
    saveTaskUpdate,
  } = useTasks();

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [clicks, setClicks] = useState(0);
  const [filter, setFilter] = useState("all");
  const [newTaskText, setNewTaskText] = useState("");
  const [newDueDate, setNewDueDate] = useState("");

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

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

  const overdueTasks = tasks.filter((t) => isOverdue(t)).length;
  const dueTodayTasks = tasks.filter((t) => isDueToday(t)).length;
  const withDueDateTasks = tasks.filter((t) => !!t.dueDate).length;

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
    await saveTaskUpdate(
      id,
      editText,
      editDueDate,
      setEditingId,
      setEditText,
      setEditDueDate
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;

    const aHasDue = !!a.dueDate;
    const bHasDue = !!b.dueDate;
    if (aHasDue !== bHasDue) return aHasDue ? -1 : 1;

    if (aHasDue && bHasDue && a.dueDate !== b.dueDate) {
      return a.dueDate.localeCompare(b.dueDate);
    }

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

      <h2>TaskFlow Realtime</h2>

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
              await addTask(
                newTaskText.trim(),
                newDueDate,
                setNewTaskText,
                setNewDueDate
              );
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
            await addTask(
              newTaskText.trim(),
              newDueDate,
              setNewTaskText,
              setNewDueDate
            );
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

      <button onClick={() => setClicks(clicks + 1)}>Test State</button>

      <div style={{ marginBottom: "15px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
      </div>

      <div>
        {sortedTasks.map((task) => (
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
            updatingId={updatingId}
            deletingId={deletingId}
            handleEdit={handleEdit}
            handleUpdate={handleUpdate}
            handleCancelEdit={handleCancelEdit}
            deleteTask={deleteTask}
            toggleTask={toggleTask}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;