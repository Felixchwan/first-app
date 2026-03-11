import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";
import Dashboard from "./pages/Dashboard";
import Auth from "./components/Auth";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fatalError, setFatalError] = useState("");

  useEffect(() => {
    let subscription;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        setSession(data.session);
        setLoading(false);

        const { data: listener } = supabase.auth.onAuthStateChange(
          (_event, session) => {
            setSession(session);
          }
        );

        subscription = listener?.subscription;
      } catch (e) {
        setFatalError(e?.message || String(e));
        setLoading(false);
      }
    })();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (fatalError) {
    return (
      <div className="app-container">
        <h3>App Error</h3>
        <p>{fatalError}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="app-container">
        <Auth />
      </div>
    );
  }

  return <Dashboard />;
}

export default App;