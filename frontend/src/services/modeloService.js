import axios from "axios";

const API_URL = "http://localhost:8081/api/modelos";

const headersAuth = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const obtenerModelos = async () => {
  const response = await axios.get(API_URL, {
    headers: headersAuth(),
  });

  return response.data;
};

export const obtenerModelosPorMarca = async (idMarca) => {
  const response = await axios.get(`${API_URL}/marca/${idMarca}`, {
    headers: headersAuth(),
  });

  return response.data;
};