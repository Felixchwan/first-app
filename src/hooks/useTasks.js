import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  fetchTasks,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTaskById,
} from "../services/tasksService";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [uiError, setUiError] = useState("");
  const [adding, setAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const showError = (message) => {
    setUiError(message);
    setTimeout(() => setUiError(""), 4000);
  };

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
          const { eventType, new: newRow, old: oldRow } = payload;

          if (eventType === "INSERT") {
            setTasks((prev) => [
              {
                id: newRow.id,
                text: newRow.text,
                completed: newRow.completed,
                dueDate: newRow.due_date || "",
              },
              ...prev,
            ]);
          }

          if (eventType === "UPDATE") {
            setTasks((prev) =>
              prev.map((task) =>
                task.id === newRow.id
                  ? {
                      ...task,
                      text: newRow.text,
                      completed: newRow.completed,
                      dueDate: newRow.due_date || "",
                    }
                  : task
              )
            );
          }

          if (eventType === "DELETE") {
            setTasks((prev) => prev.filter((task) => task.id !== oldRow.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addTask = async (taskText, dueDate = "", setNewTaskText, setNewDueDate) => {
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

  const saveTaskUpdate = async (
    id,
    editText,
    editDueDate,
    setEditingId,
    setEditText,
    setEditDueDate
  ) => {
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

  return {
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
  };
}