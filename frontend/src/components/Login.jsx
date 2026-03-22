import { useState } from "react";
import API from "../services/api";

function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password required");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("Login successful, token:", res.data.token);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error("Login error:", err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div style={{ padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
      <h2>Login</h2>

      {error && (
        <p style={{ color: "red", fontSize: 14, marginBottom: 10 }}>
          ❌ {error}
        </p>
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <button
        onClick={login}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: loading ? "#ccc" : "#007BFF",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}

export default Login;
