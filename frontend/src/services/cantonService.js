import axios from "axios";

const API_URL = "http://localhost:8081/api/cantones";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerCantonesPorProvincia = async (idProvincia) => {
  const response = await axios.get(
    `${API_URL}/provincia/${idProvincia}`,
    getAuthHeaders()
  );

  return response.data;
};