import axios from "axios";

const API_URL = "http://localhost:8081/api/usuarios";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const listarUsuarios = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const crearUsuario = async (usuario) => {
  const response = await axios.post(API_URL, usuario, getAuthHeaders());
  return response.data;
};

export const actualizarUsuario = async (idUsuario, usuario) => {
  const response = await axios.put(
    `${API_URL}/${idUsuario}`,
    usuario,
    getAuthHeaders()
  );

  return response.data;
};

export const eliminarUsuario = async (idUsuario) => {
  const response = await axios.delete(
    `${API_URL}/${idUsuario}`,
    getAuthHeaders()
  );

  return response.data;
};

// Alias opcionales por compatibilidad si en algún archivo se usan otros nombres.
export const obtenerUsuarios = listarUsuarios;
export const guardarUsuario = crearUsuario;
export const editarUsuario = actualizarUsuario;
export const borrarUsuario = eliminarUsuario;

export default {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  guardarUsuario,
  editarUsuario,
  borrarUsuario,
};