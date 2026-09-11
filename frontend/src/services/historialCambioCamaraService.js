import axios from "axios";

const API_URL = "http://localhost:8081/api/historial-cambios-camara";

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

export const listarHistorialCambiosCamara = async () => {
  const response = await axios.get(API_URL, headersAuth());
  return response.data;
};

export const listarHistorialCambiosCamaraPaginado = async (
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

export const listarHistorialCambiosPorCamara = async (idCamara) => {
  const response = await axios.get(
    `${API_URL}/camara/${idCamara}`,
    headersAuth()
  );

  return response.data;
};

export const obtenerHistorialCambioCamaraPorId = async (idCambio) => {
  const response = await axios.get(`${API_URL}/${idCambio}`, headersAuth());
  return response.data;
};

export const crearHistorialCambioCamara = async (datosCambio) => {
  const response = await axios.post(API_URL, datosCambio, headersAuth());
  return response.data;
};

export const eliminarHistorialCambioCamara = async (idCambio) => {
  const response = await axios.delete(`${API_URL}/${idCambio}`, headersAuth());
  return response.data;
};