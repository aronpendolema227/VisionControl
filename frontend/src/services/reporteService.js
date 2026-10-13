import axios from "axios";


const API_URL = "http://localhost:8081/api";

const obtenerToken = () => {
  return localStorage.getItem("token");
};

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${obtenerToken()}`,
  },
});

export const obtenerResumenOperativo = async () => {
  const response = await axios.get(`${API_URL}/dashboard/resumen`, authHeaders());
  return response.data;
};

export const obtenerConveniosReporte = async () => {
  const response = await axios.get(`${API_URL}/convenios`, authHeaders());
  return response.data;
};

export const obtenerReporteCamaras = async (filtros = {}, page = 0, size = 20) => {
  const params = {
    page,
    size,
  };

  if (filtros.idProvincia) {
    params.idProvincia = filtros.idProvincia;
  }

  if (filtros.idCanton) {
    params.idCanton = filtros.idCanton;
  }

  if (filtros.estadoActual) {
    params.estadoActual = filtros.estadoActual;
  }

  if (filtros.idMarca) {
    params.idMarca = filtros.idMarca;
  }

  if (filtros.fechaInstalacion) {
    params.fechaInstalacion = filtros.fechaInstalacion;
  }

  if (filtros.busquedaGeneral) {
    params.busquedaGeneral = filtros.busquedaGeneral.trim();
  }

  if (filtros.soloGlpiActivos) {
    params.soloGlpiActivos = true;
  }

  const response = await axios.get(`${API_URL}/reportes/camaras`, {
    ...authHeaders(),
    params,
  });

  return response.data;
};

export const descargarReporteCamaras = async () => {
  const response = await axios.get(`${API_URL}/camaras/exportar`, {
    ...authHeaders(),
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");

  link.href = url;
  link.setAttribute("download", "reporte_camaras.csv");
  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};