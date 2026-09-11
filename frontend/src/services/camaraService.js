import axios from "axios";

import * as XLSX from "xlsx";


const API_URL = "http://localhost:8081/api/camaras";

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

export const obtenerCamarasPaginadas = async (page = 0, size = 10) => {
  const response = await axios.get(
    `${API_URL}/paginado?page=${page}&size=${size}&sort=idCamara,asc`,
    headersAuth()
  );

  return response.data;
};

export const obtenerCamarasFiltradas = async ({
    busqueda = "",
    idProvincia = "",
    idCanton = "",
    estado = "",
    plataforma = "",
    convenio = "",
    idMarca = "",
    idModelo = "",
    anchoBanda = "",
    pilotoCnt = "",
    tipoDanoSinServicio = "",
    tipoFallaTecnica = "",
    fechaInstalacion = "",
    page = 0,
    size = 10,
}) => {
  const token = localStorage.getItem("token");

  const params = {
    page,
    size,
  };

  if (busqueda.trim() !== "") params.busqueda = busqueda.trim();
  if (idProvincia !== "") params.idProvincia = idProvincia;
  if (idCanton !== "") params.idCanton = idCanton;
  if (estado !== "") params.estado = estado;
  if (plataforma !== "") params.plataforma = plataforma;
  if (convenio !== "") params.convenio = convenio;
  if (idMarca !== "") params.idMarca = idMarca;
  if (idModelo !== "") params.idModelo = idModelo;
  if (anchoBanda.trim() !== "") params.anchoBanda = anchoBanda.trim();
  if (pilotoCnt.trim() !== "") params.pilotoCnt = pilotoCnt.trim();
  if (tipoDanoSinServicio.trim() !== "") {
    params.tipoDanoSinServicio = tipoDanoSinServicio.trim();
  }
  if (tipoFallaTecnica.trim() !== "") {
    params.tipoFallaTecnica = tipoFallaTecnica.trim();
  }
  if (fechaInstalacion !== "") params.fechaInstalacion = fechaInstalacion;

  const response = await axios.get(`${API_URL}/filtrar`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;

};

export const exportarCamarasFiltradas = async ({
  busqueda = "",
  idProvincia = "",
  idCanton = "",
  estado = "",
  plataforma = "",
  convenio = "",
  idMarca = "",
  idModelo = "",
  anchoBanda = "",
  pilotoCnt = "",
  tipoDanoSinServicio = "",
  tipoFallaTecnica = "",
  fechaInstalacion = "",
}) => {
  const token = localStorage.getItem("token");

  const paramsBase = {};

  if (busqueda.trim() !== "") paramsBase.busqueda = busqueda.trim();
  if (idProvincia !== "") paramsBase.idProvincia = idProvincia;
  if (idCanton !== "") paramsBase.idCanton = idCanton;
  if (estado !== "") paramsBase.estado = estado;
  if (plataforma !== "") paramsBase.plataforma = plataforma;
  if (convenio !== "") paramsBase.convenio = convenio;
  if (idMarca !== "") paramsBase.idMarca = idMarca;
  if (idModelo !== "") paramsBase.idModelo = idModelo;
  if (anchoBanda.trim() !== "") paramsBase.anchoBanda = anchoBanda.trim();
  if (pilotoCnt.trim() !== "") paramsBase.pilotoCnt = pilotoCnt.trim();
  if (tipoDanoSinServicio.trim() !== "") {
    paramsBase.tipoDanoSinServicio = tipoDanoSinServicio.trim();
  }
  if (tipoFallaTecnica.trim() !== "") {
    paramsBase.tipoFallaTecnica = tipoFallaTecnica.trim();
  }
  if (fechaInstalacion !== "") paramsBase.fechaInstalacion = fechaInstalacion;

  const todasLasCamaras = [];
  const size = 1000;
  let pagina = 0;
  let totalPaginas;

  do {
    const response = await axios.get(`${API_URL}/filtrar`, {
      params: {
        ...paramsBase,
        page: pagina,
        size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    const contenido = Array.isArray(data) ? data : data.content || [];

    todasLasCamaras.push(...contenido);

    totalPaginas = data.totalPages || 1;
    pagina += 1;
  } while (pagina < totalPaginas);

  if (todasLasCamaras.length === 0) {
    alert("No hay cámaras para exportar con los filtros actuales.");
    return;
  }

  const obtenerValor = (objeto, campos) => {
    for (const campo of campos) {
      const valor = objeto?.[campo];

      if (valor !== null && valor !== undefined && valor !== "") {
        return valor;
      }
    }

    return "";
  };

  const datosExcel = todasLasCamaras.map((camara) => ({
    "ID punto": obtenerValor(camara, ["idPuntoOriginal", "id_punto_original"]),
    "Nombre cámara": obtenerValor(camara, ["nombreCamara", "nombre_camara"]),
    Provincia: obtenerValor(camara, ["provincia", "nombreProvincia"]),
    Cantón: obtenerValor(camara, ["canton", "nombreCanton"]),
    Dirección: obtenerValor(camara, ["direccion"]),
    "Dirección IP": obtenerValor(camara, ["direccionIp", "direccion_ip"]),
    Plataforma: obtenerValor(camara, ["plataforma", "nombrePlataforma"]),
    Marca: obtenerValor(camara, ["marca", "nombreMarca"]),
    Modelo: obtenerValor(camara, ["modelo", "nombreModelo"]),
    "Tipo dispositivo": obtenerValor(camara, ["tipoDispositivo", "tipo_dispositivo"]),
    "Fecha instalación": obtenerValor(camara, [
      "fechaInstalacion",
      "fecha_instalacion",
    ]),
    "Estado actual": obtenerValor(camara, ["estadoActual", "estado_actual"]),
    Convenio: obtenerValor(camara, ["convenio", "nombreConvenio"]),
    "A quién pertenece": obtenerValor(camara, [
      "aQuienPertenece",
      "a_quien_pertenece",
    ]),
    "Piloto CNT": obtenerValor(camara, ["pilotoCnt", "piloto_cnt"]),
    "Ancho banda": obtenerValor(camara, ["anchoBanda", "ancho_banda"]),
    Latitud: obtenerValor(camara, ["latitud"]),
    Longitud: obtenerValor(camara, ["longitud"]),
    Observaciones: obtenerValor(camara, ["observaciones"]),

    Conversor: obtenerValor(camara, ["conversor"]),

    Poste: obtenerValor(camara, ["poste"]),

    Brazo: obtenerValor(camara, ["brazo"]),

    "Descripción daño": obtenerValor(camara, [
      "descripcionDano",
      "descripcion_dano",
    ]),

    "Serie de la cámara": obtenerValor(camara, [
      "serieCamara",
      "serie_camara",
    ]),

    "Marca UPS": obtenerValor(camara, [
      "marcaUps",
      "marca_ups",
    ]),

    "Serie UPS": obtenerValor(camara, [
      "serieUps",
      "serie_ups",
    ]),

    "Estado UPS": obtenerValor(camara, [
      "estadoUps",
      "estado_ups",
    ]),

    Abejas: obtenerValor(camara, ["abejas"]),

    "Año": obtenerValor(camara, ["anio"]),

    "Cambio de cámara": obtenerValor(camara, [
      "cambioDeCamara",
      "cambio_de_camara",
    ]),

    "Estado convenio": obtenerValor(camara, [
      "estadoConvenio",
      "estado_convenio",
    ]),

    "Costo enlace": obtenerValor(camara, [
      "costoEnlace",
      "costo_enlace",
    ]),

    "Fecha convenio original": obtenerValor(camara, [
      "fechaConvenioOriginal",
      "fecha_convenio_original",
    ]),

    "Fecha convenio inicio": obtenerValor(camara, [
      "fechaConvenioInicio",
      "fecha_convenio_inicio",
    ]),

    "Fecha convenio referencia": obtenerValor(camara, [
      "fechaConvenioReferencia",
      "fecha_convenio_referencia",
    ]),

    "Fecha convenio fin": obtenerValor(camara, [
      "fechaConvenioFin",
      "fecha_convenio_fin",
    ]),

    "Estado fecha convenio": obtenerValor(camara, [
      "estadoFechaConvenio",
      "estado_fecha_convenio",
    ]),

    "Fecha inicial pago": obtenerValor(camara, [
      "fechaInicialPago",
      "fecha_inicial_pago",
    ]),

    "Fecha inicial pago original": obtenerValor(camara, [
      "fechaInicialPagoOriginal",
      "fecha_inicial_pago_original",
    ]),

    "Proveedor enlace": obtenerValor(camara, [
      "proveedorEnlace",
      "proveedor_enlace",
    ]),

    "Responsable pago": obtenerValor(camara, [
      "responsablePago",
      "responsable_pago",
    ]),

    "Reporte - Fecha revisión": obtenerValor(camara, [
      "ultimoReporteFechaRevision",
    ]),

    "Reporte - Estado operativo": obtenerValor(camara, [
      "ultimoReporteEstadoOperativo",
    ]),

    "Reporte - Ticket GLPI": obtenerValor(camara, [
      "ultimoReporteTicketGlpi",
    ]),

    "Reporte - Observaciones": obtenerValor(camara, [
      "ultimoReporteObservaciones",
    ]),

    "Reporte - Novedades": obtenerValor(camara, [
      "ultimoReporteNovedades",
    ]),

    "Reporte - Presenta daño": obtenerValor(camara, [
      "ultimoReportePresentaDano",
    ]),

    "Reporte - Descripción daño": obtenerValor(camara, [
      "ultimoReporteDescripcionDano",
    ]),

    "Reporte - Fecha seguimiento": obtenerValor(camara, [
      "ultimoReporteFechaSeguimiento",
    ]),

    "Reporte - Detalle seguimiento": obtenerValor(camara, [
      "ultimoReporteSeguimientoDetalle",
    ]),

    "Reporte - Resuelto GLPI": obtenerValor(camara, [
      "ultimoReporteResueltoGlpi",
    ]),

    "Reporte - Fecha solución": obtenerValor(camara, [
      "ultimoReporteFechaSolucion",
    ]),

    "Reporte - Analista": obtenerValor(camara, [
      "ultimoReporteAnalista",
    ]),
  }));

  const hoja = XLSX.utils.json_to_sheet(datosExcel);

  hoja["!cols"] = [
    { wch: 12 },
    { wch: 25 },
    { wch: 22 },
    { wch: 24 },
    { wch: 35 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 25 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 22 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 35 },
    { wch: 18 },
    { wch: 18 },
    { wch: 18 },
    { wch: 35 },
    { wch: 22 },
    { wch: 18 },
    { wch: 22 },
    { wch: 18 },
    { wch: 12 },
  ];

  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, "Cámaras");

  const fechaActual = new Date().toISOString().slice(0, 10);

  XLSX.writeFile(libro, `camaras_filtradas_${fechaActual}.xlsx`);
};

export const obtenerCamarasPorConvenio = async ({
  idProvincia = "",
  idCanton = "",
  estadoConvenio = "",
  fechaConvenioInicio = "",
  page = 0,
  size = 10,
}) => {
  const token = localStorage.getItem("token");

  const params = {
    page,
    size,
  };

  if (idProvincia !== "") params.idProvincia = idProvincia;
  if (idCanton !== "") params.idCanton = idCanton;
  if (estadoConvenio !== "") params.estadoConvenio = estadoConvenio;
  if (fechaConvenioInicio !== "") {
    params.fechaConvenioInicio = fechaConvenioInicio;
  }

  const response = await axios.get(`${API_URL}/convenios/filtrar`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const obtenerFechasInicioConvenio = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/convenios/fechas-inicio`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const obtenerFechasInstalacion = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/fechas-instalacion`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const actualizarCamara = async (idCamara, datosCamara) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${idCamara}`,
    datosCamara,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const crearCamara = async (datosCamara) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(API_URL, datosCamara, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const actualizarConvenioCamara = async (
  idCamara,
  idConvenio,
  datosConvenio = {}
) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/${idCamara}/convenio`,
    {
      idConvenio,
      ...datosConvenio,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const obtenerCamaraPorId = async (idCamara) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/${idCamara}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const buscarCamarasParaCambio = async ({
  busqueda = "",
  page = 0,
  size = 10,
}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/buscar-cambio`, {
    params: {
      busqueda,
      page,
      size,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const validarDuplicadosCamara = async ({
  idCamaraExcluir = "",
  idPuntoOriginal = "",
  nombreCamara = "",
  direccionIp = "",
}) => {
  const token = localStorage.getItem("token");

  const params = {};

  // Sirve para que el backend NO compare contra la misma cámara
  if (idCamaraExcluir !== "" && idCamaraExcluir !== null && idCamaraExcluir !== undefined) {
    params.idCamaraExcluir = idCamaraExcluir;
  }

  if (idPuntoOriginal !== "" && idPuntoOriginal !== null && idPuntoOriginal !== undefined) {
    params.idPuntoOriginal = idPuntoOriginal;
  }

  if (nombreCamara.trim() !== "") {
    params.nombreCamara = nombreCamara.trim();
  }

  if (direccionIp.trim() !== "") {
    params.direccionIp = direccionIp.trim();
  }

  const response = await axios.get(`${API_URL}/validar-duplicados`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const desactivarCamara = async (idCamara, motivo) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/${idCamara}/desactivar`,
    {
      motivo,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const buscarCamarasActivarDesactivar = async ({
  busqueda = "",
  activo = "",
  page = 0,
  size = 10,
}) => {
  const token = localStorage.getItem("token");

  const params = {
    page,
    size,
  };

  if (busqueda.trim() !== "") {
    params.busqueda = busqueda.trim();
  }

  if (activo !== "") {
    params.activo = activo;
  }

  const response = await axios.get(`${API_URL}/activar-desactivar/buscar`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const reactivarCamara = async (
  idCamara,
  { estadoActual = "OPERATIVA", motivo = "" }
) => {
  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API_URL}/${idCamara}/reactivar`,
    {
      estadoActual,
      motivo,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};