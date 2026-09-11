import axios from "axios";

const API_URL = "http://localhost:8081/api/historial-tecnico-camara";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const headersAuth = () => ({
  headers: {
    Authorization: `Bearer ${obtenerToken()}`,
  },
});

export const listarHistorialTecnicoCamara = async () => {
  const response = await axios.get(API_URL, headersAuth());
  return response.data;
};

export const listarHistorialTecnicoCamaraPaginado = async (
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

export const obtenerHistorialTecnicoCamaraPorId = async (idTecnico) => {
  const response = await axios.get(`${API_URL}/${idTecnico}`, headersAuth());
  return response.data;
};

export const listarHistorialTecnicoPorCamara = async (idCamara) => {
  const response = await axios.get(
    `${API_URL}/camara/${idCamara}`,
    headersAuth()
  );

  return response.data;
};

export const crearHistorialTecnicoCamara = async (datosTecnicos) => {
  const response = await axios.post(API_URL, datosTecnicos, headersAuth());
  return response.data;
};

export const actualizarHistorialTecnicoCamara = async (
  idTecnico,
  datosTecnicos
) => {
  const response = await axios.put(
    `${API_URL}/${idTecnico}`,
    datosTecnicos,
    headersAuth()
  );

  return response.data;
};

export const eliminarHistorialTecnicoCamara = async (idTecnico) => {
  const response = await axios.delete(`${API_URL}/${idTecnico}`, headersAuth());
  return response.data;
};