import { useEffect, useState } from "react";
import API from "./services/api";
import CommandList from "./components/CommandList.jsx";
import Login from "./components/Login";
import Register from "./components/Register";
import { io } from "socket.io-client";

// connexion socket
const socket = io("http://localhost:5000");

function App() {
  const [commands, setCommands] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);

  // 🔁 récupérer commandes + socket
  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const res = await API.get("/commands");
        setCommands(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) {
      fetchCommands();
    }
  }, [token]);

  // 📥 fetch commandes
  useEffect(() => {
    socket.on("newCommand", (cmd) => {
      setCommands((prev) => [cmd, ...prev]);
    });

    socket.on("updateCommand", (updated) => {
      setCommands((prev) =>
        prev.map((cmd) => (cmd._id === updated._id ? updated : cmd)),
      );
    });

    return () => {
      socket.off("newCommand");
      socket.off("updateCommand");
    };
  }, []);

  // ➕ créer commande
  const createCommand = async () => {
    try {
      await API.post("/commands", {
        tableNumber: Math.floor(Math.random() * 10) + 1,
        items: [{ name: "Pizza", quantity: 1 }],
      });
    } catch (err) {
      console.error("Erreur create:", err);
    }
  };

  // 🚪 logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // 🔐 si pas connecté
  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h1>KitchenOps</h1>

        {showRegister ? (
          <Register onSuccess={() => setShowRegister(false)} />
        ) : (
          <Login setToken={setToken} />
        )}

        <button onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? "Se connecter" : "Créer un compte"}
        </button>
      </div>
    );
  }

  // ✅ app principale
  return (
    <div style={{ padding: 20 }}>
      <h1>KitchenOps</h1>

      <button onClick={createCommand}>➕ Créer commande</button>

      <button onClick={logout} style={{ marginLeft: 10 }}>
        🚪 Logout
      </button>

      <CommandList commands={commands} />
    </div>
  );
}

export default App;
