import axios from "axios";

const API_URL = "http://localhost:8081/api/marcas";

const headersAuth = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const obtenerMarcas = async () => {
  const response = await axios.get(API_URL, {
    headers: headersAuth(),
  });

  return response.data;
};