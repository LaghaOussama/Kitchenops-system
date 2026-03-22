import { useState } from "react";
import API from "../services/api";

function Register({ onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Email and password required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        email,
        password,
      });

      console.log("Registration successful:", res.data);
      alert("Compte créé! Veuillez vous connecter.");
      setEmail("");
      setPassword("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Registration error:", err);

      // Extraire le meilleur message d'erreur disponible
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Registration failed";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      register();
    }
  };

  return (
    <div style={{ padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
      <h2>Register</h2>

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
        placeholder="Password (min 6 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={loading}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />

      <button
        onClick={register}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: loading ? "#ccc" : "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating account..." : "Créer compte"}
      </button>
    </div>
  );
}

export default Register;
