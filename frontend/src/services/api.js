import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Intercepteur de requête
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Intercepteur de réponse pour mieux gérer les erreurs
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      return Promise.reject(error);
    } else if (error.request) {
      // La requête a été faite mais pas de réponse
      console.error("No response from server:", error.request);
    } else {
      // Autre erreur
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default API;
