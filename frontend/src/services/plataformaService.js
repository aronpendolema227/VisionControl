import axios from "axios";

const API_URL = "http://localhost:8081/api/plataformas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerPlataformas = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};