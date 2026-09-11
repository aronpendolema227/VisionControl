import axios from "axios";

const API_URL = "http://localhost:8081/api/historial-edicion-camara";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const headersAuth = () => {
  const token = obtenerToken();

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const listarHistorialEdicionCamara = async () => {
  const response = await axios.get(API_URL, headersAuth());
  return response.data;
};

export const listarHistorialEdicionCamaraPaginado = async (
  page = 0,
  size = 20
) => {
  const response = await axios.get(`${API_URL}/paginado`, {
    ...headersAuth(),
    params: {
      page,
      size,
    },
  });

  return response.data;
};

export const obtenerHistorialEdicionCamaraPorId = async (idEdicion) => {
  const response = await axios.get(`${API_URL}/${idEdicion}`, headersAuth());
  return response.data;
};

export const listarHistorialEdicionPorCamara = async (idCamara) => {
  const response = await axios.get(
    `${API_URL}/camara/${idCamara}`,
    headersAuth()
  );

  return response.data;
};