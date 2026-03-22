import API from "../services/api";

function CommandList({ commands }) {
  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/commands/${id}/status`, { status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const statusColors = {
    pending: "#FFA500",
    in_progress: "#007BFF",
    ready: "#4CAF50",
    served: "#808080",
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h2>Commandes</h2>
      {commands.length === 0 ? (
        <p>Aucune commande</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {commands.map((cmd) => (
            <li
              key={cmd._id}
              style={{
                padding: 10,
                marginBottom: 10,
                border: "1px solid #ddd",
                borderRadius: 5,
                backgroundColor: statusColors[cmd.status] || "#f9f9f9",
                color:
                  cmd.status === "served"
                    ? "white"
                    : cmd.status === "Ready"
                      ? "white"
                      : "black",
              }}
            >
              <div>
                <strong>Table {cmd.tableNumber}</strong> - Priorité:{" "}
                <span style={{ fontWeight: "bold" }}>{cmd.priority}</span>
              </div>
              <div>Items: {cmd.items.map((i) => i.name).join(", ")}</div>
              <div>
                Status:{" "}
                <select
                  value={cmd.status}
                  onChange={(e) => updateStatus(cmd._id, e.target.value)}
                  style={{ padding: 5, marginTop: 5 }}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="ready">Ready</option>
                  <option value="served">Served</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommandList;
