import axios from "axios";

const API_URL = "http://localhost:8081/api";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${obtenerToken()}`,
  },
});

export const obtenerNotificacionesPorRol = async (rol) => {
  const response = await axios.get(`${API_URL}/notificaciones`, {
    ...authHeaders(),
    params: {
      rol,
    },
  });

  return response.data;
};