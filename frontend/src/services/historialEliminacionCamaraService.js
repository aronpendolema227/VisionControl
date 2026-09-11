import axios from "axios";

const API_URL = "http://localhost:8081/api/historial-eliminacion-camara";

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

export const listarHistorialEliminacionCamara = async () => {
  const response = await axios.get(API_URL, headersAuth());
  return response.data;
};

export const listarHistorialEliminacionCamaraPaginado = async (
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

export const obtenerHistorialEliminacionCamaraPorId = async (idEliminacion) => {
  const response = await axios.get(
    `${API_URL}/${idEliminacion}`,
    headersAuth()
  );

  return response.data;
};

export const listarHistorialEliminacionPorCamara = async (idCamara) => {
  const response = await axios.get(
    `${API_URL}/camara/${idCamara}`,
    headersAuth()
  );

  return response.data;
};