import axios from "axios";

const API_URL = "http://localhost:8081/api/historial-novedades";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${obtenerToken()}`,
  },
});

export const listarHistorialNovedades = async () => {
  const response = await axios.get(API_URL, authHeaders());
  return response.data;
};

export const listarHistorialNovedadesPaginado = async (page = 0, size = 20) => {
  const response = await axios.get(`${API_URL}/paginado`, {
    ...authHeaders(),
    params: {
      page,
      size,
    },
  });

  return response.data;
};

export const obtenerHistorialNovedadPorId = async (idNovedad) => {
  const response = await axios.get(`${API_URL}/${idNovedad}`, authHeaders());
  return response.data;
};

export const crearHistorialNovedad = async (datosHistorial) => {
  const response = await axios.post(API_URL, datosHistorial, authHeaders());
  return response.data;
};

export const actualizarHistorialNovedad = async (
  idNovedad,
  datosHistorial
) => {
  const response = await axios.put(
    `${API_URL}/${idNovedad}`,
    datosHistorial,
    authHeaders()
  );

  return response.data;
};

export const obtenerUltimoHistorialPorCamara = async (idCamara) => {
  const historial = await listarHistorialNovedades();

  const historialCamara = historial
    .filter((item) => String(item.idCamara) === String(idCamara))
    .sort((a, b) => {
      const fechaA = a.fechaRevision ? new Date(a.fechaRevision) : new Date(0);
      const fechaB = b.fechaRevision ? new Date(b.fechaRevision) : new Date(0);

      if (fechaB - fechaA !== 0) {
        return fechaB - fechaA;
      }

      return (b.idNovedad || 0) - (a.idNovedad || 0);
    });

  return historialCamara[0] || null;
};