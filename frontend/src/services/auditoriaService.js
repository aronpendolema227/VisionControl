import axios from "axios";

const API_URL = "http://localhost:8081/api/auditorias";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${obtenerToken()}`,
  },
});

export const obtenerAuditorias = async () => {
  const response = await axios.get(API_URL, authHeaders());
  return response.data;
};

export const obtenerAuditoriaPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, authHeaders());
  return response.data;
};

export const obtenerAuditoriasPaginadas = async (
  page = 0,
  size = 20,
  busquedaGeneral = ""
) => {
  const params = {
    page,
    size,
  };

  if (busquedaGeneral && busquedaGeneral.trim() !== "") {
    params.busquedaGeneral = busquedaGeneral.trim();
  }

  const response = await axios.get(`${API_URL}/paginado`, {
    ...authHeaders(),
    params,
  });

  return response.data;
};