import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    const res =
      mode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (res.error) setError(res.error.message);
  };

  return (
    <div className="auth-card" style={{ display: "grid", gap: 10, maxWidth: 380 }}>
      <h3>{mode === "signup" ? "Create account" : "Sign in"}</h3>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />

      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />

      <button onClick={submit}>
        {mode === "signup" ? "Sign up" : "Sign in"}
      </button>

      <button onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>
        Switch to {mode === "signup" ? "Sign in" : "Sign up"}
      </button>

      {error && <p style={{ margin: 0 }}>{error}</p>}
    </div>
  );
}