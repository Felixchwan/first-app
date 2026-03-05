import { supabase } from "../lib/supabaseClient";

export const fetchTasks = async () => {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(t => ({
    id: t.id,
    text: t.text,
    completed: t.completed,
    dueDate: t.due_date || "",
  }));
};

export const createTask = async (text, dueDate) => {
  const { data: authData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("tasks")
    .insert([
      {
        user_id: authData.user.id,
        text,
        completed: false,
        due_date: dueDate || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    text: data.text,
    completed: data.completed,
    dueDate: data.due_date || "",
  };
};

export const updateTask = async (id, text, dueDate) => {
  const { error } = await supabase
    .from("tasks")
    .update({
      text,
      due_date: dueDate || null,
    })
    .eq("id", id);

  if (error) throw error;
};

export const toggleTaskStatus = async (id, completed) => {
  const { error } = await supabase
    .from("tasks")
    .update({ completed: !completed })
    .eq("id", id);

  if (error) throw error;
};

export const deleteTaskById = async (id) => {
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id);

  if (error) throw error;
};