import axios from "axios";

const API_URL = "http://localhost:8081/api/provincias";

const headersAuth = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const obtenerProvincias = async () => {
  const response = await axios.get(API_URL, headersAuth());
  return response.data;
};