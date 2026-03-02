import { supabase } from "../lib/supabaseClient";
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
  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

      console.log("Fetched tasks:", data);

    if (error) {
  console.error("Error fetching tasks:", error.message);
  setLoadingTasks(false);
  return;
}

const formatted = (data || []).map(t => ({
  id: t.id,
  text: t.text,
  completed: t.completed,
  dueDate: t.due_date || "",
}));

setTasks(formatted);
setLoadingTasks(false);
  };

  fetchTasks();
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
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error("Auth getUser error:", authError.message);
    return;
  }

  const userId = authData?.user?.id;
  if (!userId) {
    console.error("No user session found.");
    return;
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        user_id: userId,
        text: taskText,
        completed: false,
        due_date: dueDate || null,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Insert error:", error.message);
    return;
  }

  setTasks((prev) => [
    {
      id: data.id,
      text: data.text,
      completed: data.completed,
      dueDate: data.due_date || "",
    },
    ...prev,
  ]);
};

const deleteTask = async (id) => {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete error:", error.message);
    return;
  }

  setTasks(prev => prev.filter(task => task.id !== id));
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
  const nextText = editText.trim();
  if (!nextText) return;

  const { error } = await supabase
    .from("tasks")
    .update({
      text: nextText,
      due_date: editDueDate || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Update error:", error.message);
    return;
  }

  setTasks((prev) =>
    prev.map((task) =>
      task.id === id ? { ...task, text: nextText, dueDate: editDueDate } : task
    )
  );

  setEditingId(null);
  setEditText("");
  setEditDueDate("");
};

const toggleTask = async (id) => {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const { error } = await supabase
    .from("tasks")
    .update({ completed: !task.completed })
    .eq("id", id);

  if (error) {
    console.error("Toggle error:", error.message);
    return;
  }

  setTasks(prev =>
    prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
  );
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