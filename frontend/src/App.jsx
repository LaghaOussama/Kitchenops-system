import { useEffect, useState } from "react";
import API from "./services/api";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const fetchCommands = async () => {
    const res = await API.get("/commands");
    setCommands(res.data);
  };

  const [commands, setCommands] = useState([]);

  useEffect(() => {
    fetchCommands();

    socket.on("newCommand", (data) => {
      setCommands((prev) => [data, ...prev]);
    });

    socket.on("updateCommand", (data) => {
      setCommands((prev) =>
        prev.map((cmd) => (cmd._id === data._id ? data : cmd)),
      );
    });

    return () => {
      socket.off();
    };
  }, []);

  const createCommand = async () => {
    await API.post("/commands", {
      tableNumber: Math.floor(Math.random() * 10),
      items: [{ name: "Pizza", quantity: 1 }],
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>KitchenOps</h1>

      <button onClick={createCommand}>Créer commande</button>

      <ul>
        {commands.map((cmd) => (
          <li key={cmd._id}>
            Table {cmd.tableNumber} - {cmd.status} (prio: {cmd.priority})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
