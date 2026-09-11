import axios from "axios";

const API_URL = "http://localhost:8081/api/convenios";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${obtenerToken()}`,
  },
});

export const obtenerConvenios = async () => {
  const response = await axios.get(API_URL, authHeaders());
  return response.data;
};

export const obtenerConvenioPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, authHeaders());
  return response.data;
};

export const obtenerResumenConvenios = async () => {
  const response = await axios.get(`${API_URL}/resumen`, authHeaders());
  return response.data;
};

export const obtenerConsultaConvenios = async () => {
  const response = await axios.get(`${API_URL}/consulta`, authHeaders());
  return response.data;
};

export const crearConvenio = async (convenio) => {
  const response = await axios.post(API_URL, convenio, authHeaders());
  return response.data;
};

export const actualizarConvenio = async (id, convenio) => {
  const response = await axios.put(`${API_URL}/${id}`, convenio, authHeaders());
  return response.data;
};

export const eliminarConvenio = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, authHeaders());
  return response.data;
};