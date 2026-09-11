import axios from "axios";

const API_URL = "http://localhost:8081/api/analistas";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

/* Listar todos los analistas */
export const listarAnalistas = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

/* Obtener un analista por ID */
export const obtenerAnalistaPorId = async (idAnalista) => {
  const response = await axios.get(
    `${API_URL}/${idAnalista}`,
    getAuthHeaders()
  );

  return response.data;
};

/* Crear un nuevo analista */
export const crearAnalista = async (analista) => {
  const response = await axios.post(
    API_URL,
    analista,
    getAuthHeaders()
  );

  return response.data;
};

/* Actualizar un analista existente */
export const actualizarAnalista = async (idAnalista, analista) => {
  const response = await axios.put(
    `${API_URL}/${idAnalista}`,
    analista,
    getAuthHeaders()
  );

  return response.data;
};

/* Eliminar un analista */
export const eliminarAnalista = async (idAnalista) => {
  const response = await axios.delete(
    `${API_URL}/${idAnalista}`,
    getAuthHeaders()
  );

  return response.data;
};

/* Exportación por defecto opcional */
export default {
  listarAnalistas,
  obtenerAnalistaPorId,
  crearAnalista,
  actualizarAnalista,
  eliminarAnalista,
};