export const convertirTexto = (valor) => {
  if (valor === null || valor === undefined) return "";
  return String(valor);
};

export const normalizarTexto = (valor) =>
  convertirTexto(valor).toLowerCase().trim();

export const obtenerValor = (objeto, campos, valorDefecto = "Sin dato") => {
  for (const campo of campos) {
    const valor = objeto?.[campo];

    if (valor !== null && valor !== undefined && valor !== "") {
      return valor;
    }
  }

  return valorDefecto;
};

export const formatearFechaHora = (fecha) => {
  if (
    !fecha ||
    fecha === "No registrado" ||
    fecha === "Sin fecha" ||
    fecha === "Sin dato"
  ) {
    return fecha || "No registrado";
  }

  try {
    const fechaConvertida = new Date(fecha);

    if (Number.isNaN(fechaConvertida.getTime())) {
      return fecha;
    }

    return fechaConvertida.toLocaleString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return fecha;
  }
};

/* ================================
   AUDITORÍA GENERAL
================================ */

export const obtenerIdAuditoria = (auditoria) => {
  return auditoria.idAuditoria || auditoria.id_auditoria || auditoria.id || "";
};

export const obtenerIdRegistro = (auditoria) => {
  return (
    auditoria.idRegistro ||
    auditoria.id_registro ||
    auditoria.idRegistroAfectado ||
    auditoria.id_registro_afectado ||
    "—"
  );
};

export const obtenerFechaHora = (auditoria) => {
  return (
    auditoria.fechaHora ||
    auditoria.fecha_hora ||
    auditoria.fecha ||
    "No registrado"
  );
};

export const obtenerUsername = (auditoria) => {
  return (
    auditoria.username ||
    auditoria.usuario ||
    auditoria.nombreUsuario ||
    auditoria.nombre_usuario ||
    "No registrado"
  );
};

export const obtenerNombreUsuarioAuditoria = (auditoria) => {
  return obtenerValor(
    auditoria,
    ["nombreUsuario", "nombre_usuario"],
    "Sin nombre"
  );
};

export const obtenerNombreAnalistaAuditoria = (auditoria) => {
  return obtenerValor(
    auditoria,
    ["nombreAnalista", "nombre_analista"],
    "Sin analista"
  );
};

export const obtenerGrupoOperativoAuditoria = (auditoria) => {
  return obtenerValor(
    auditoria,
    ["grupoOperativo", "grupo_operativo"],
    "Sin grupo"
  );
};

export const obtenerRol = (auditoria) => {
  return auditoria.rol || "No registrado";
};

export const obtenerAccion = (auditoria) => {
  return auditoria.accion || "No registrado";
};

export const obtenerEntidad = (auditoria) => {
  return auditoria.entidad || "No registrado";
};

export const obtenerDetalle = (auditoria) => {
  return auditoria.detalle || auditoria.descripcion || "Sin detalle";
};

export const obtenerClaseAccion = (accion) => {
  const accionNormalizada = normalizarTexto(accion);

  if (accionNormalizada.includes("crear")) return "crear";
  if (accionNormalizada.includes("actualizar")) return "actualizar";
  if (accionNormalizada.includes("eliminar")) return "eliminar";
  if (accionNormalizada.includes("consultar")) return "consultar";

  return "general";
};

export const esAuditoriaCambioCamara = (auditoria) => {
  const entidad = normalizarTexto(obtenerEntidad(auditoria));
  const detalle = normalizarTexto(obtenerDetalle(auditoria));

  return (
    entidad.includes("historial_cambio_camara") ||
    detalle.includes("cambio de cámara") ||
    detalle.includes("cambio de camara") ||
    detalle.includes("cambio técnico") ||
    detalle.includes("cambio tecnico")
  );
};

export const perteneceAlModuloAuditoria = (auditoria, moduloActivo) => {
  if (moduloActivo === "GENERAL") {
    return true;
  }

  const accion = normalizarTexto(obtenerAccion(auditoria));
  const entidad = normalizarTexto(obtenerEntidad(auditoria));
  const detalle = normalizarTexto(obtenerDetalle(auditoria));

  if (moduloActivo === "CAMBIO_CAMARA") {
    return esAuditoriaCambioCamara(auditoria);
  }

  if (moduloActivo === "EDICION_CAMARA") {
    return (
      entidad.includes("camara") &&
      accion.includes("actualizar") &&
      !detalle.includes("cambio técnico") &&
      !detalle.includes("cambio tecnico")
    );
  }

  if (moduloActivo === "NUEVA_CAMARA") {
    return entidad.includes("camara") && accion.includes("crear");
  }

  if (moduloActivo === "HISTORICO_CAMARA") {
    return (
      entidad.includes("camara") ||
      entidad.includes("reporte") ||
      entidad.includes("historial") ||
      detalle.includes("cámara") ||
      detalle.includes("camara") ||
      detalle.includes("glpi")
    );
  }

  if (moduloActivo === "ELIMINADAS_DESACTIVADAS") {
    return (
      accion.includes("eliminar") ||
      accion.includes("reactivar") ||
      detalle.includes("elimin") ||
      detalle.includes("desactiv") ||
      detalle.includes("reactiv") ||
      detalle.includes("baja")
    );
  }

  return true;
};

export const obtenerResumenAuditorias = (auditorias) => {
  return {
    total: auditorias.length,

    usuarios: auditorias.filter((item) =>
      normalizarTexto(obtenerEntidad(item)).includes("usuario")
    ).length,

    camaras: auditorias.filter((item) =>
      normalizarTexto(obtenerEntidad(item)).includes("camara")
    ).length,

    reportes: auditorias.filter((item) => {
      const entidad = normalizarTexto(obtenerEntidad(item));
      const detalle = normalizarTexto(obtenerDetalle(item));

      return entidad.includes("reporte") || detalle.includes("reporte");
    }).length,

    eliminadas: auditorias.filter((item) => {
      const accion = normalizarTexto(obtenerAccion(item));
      const detalle = normalizarTexto(obtenerDetalle(item));

      return accion.includes("eliminar") || detalle.includes("desactiv");
    }).length,
  };
};

export const filtrarAuditorias = ({
  auditorias,
  moduloActivo,
  textoBusqueda,
}) => {
  return auditorias.filter((auditoria) => {
    if (!perteneceAlModuloAuditoria(auditoria, moduloActivo)) {
      return false;
    }

    if (!textoBusqueda) {
      return true;
    }

    const usernameAuditoria = normalizarTexto(obtenerUsername(auditoria));
    const nombreUsuarioAuditoria = normalizarTexto(
      obtenerNombreUsuarioAuditoria(auditoria)
    );
    const nombreAnalistaAuditoria = normalizarTexto(
      obtenerNombreAnalistaAuditoria(auditoria)
    );
    const grupoOperativoAuditoria = normalizarTexto(
      obtenerGrupoOperativoAuditoria(auditoria)
    );
    const rolAuditoria = normalizarTexto(obtenerRol(auditoria));
    const accionAuditoria = normalizarTexto(obtenerAccion(auditoria));
    const entidadAuditoria = normalizarTexto(obtenerEntidad(auditoria));
    const detalleAuditoria = normalizarTexto(obtenerDetalle(auditoria));
    const idRegistroAuditoria = normalizarTexto(obtenerIdRegistro(auditoria));

    return (
      usernameAuditoria.includes(textoBusqueda) ||
      nombreUsuarioAuditoria.includes(textoBusqueda) ||
      nombreAnalistaAuditoria.includes(textoBusqueda) ||
      grupoOperativoAuditoria.includes(textoBusqueda) ||
      rolAuditoria.includes(textoBusqueda) ||
      accionAuditoria.includes(textoBusqueda) ||
      entidadAuditoria.includes(textoBusqueda) ||
      detalleAuditoria.includes(textoBusqueda) ||
      idRegistroAuditoria.includes(textoBusqueda)
    );
  });
};

/* ================================
  REPORTES OPERACIONES
================================ */

export const obtenerIdReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    ["idNovedad", "id_novedad", "idHistorial", "id_historial", "id"],
    ""
  );
};

export const obtenerIdCamaraReporteOperacion = (reporte) => {
  return obtenerValor(reporte, ["idCamara", "id_camara"], "—");
};

export const obtenerNombreCamaraReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    ["nombreCamara", "nombre_camara", "camara", "nombre"],
    "Sin cámara"
  );
};

export const obtenerIdPuntoReporteOperacion = (reporte) => {
  return obtenerValor(reporte, ["idPuntoOriginal", "id_punto_original"], "—");
};

export const obtenerFechaRevisionReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    ["fechaRevision", "fecha_revision", "fecha"],
    "No registrado"
  );
};

export const obtenerEstadoReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    ["estadoOperativo", "estado_operativo", "estadoActual", "estado_actual"],
    "Sin estado"
  );
};

export const obtenerTicketReporteOperacion = (reporte) => {
  return obtenerValor(reporte, ["ticketGlpi", "ticket_glpi"], "Sin ticket");
};

export const obtenerAnalistaReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    [
      "nombreAnalista",
      "nombre_analista",
      "analistaResponsable",
      "analista_responsable",
      "analista",
    ],
    "Sin analista"
  );
};

export const obtenerPresentaDanoReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    ["presentaDano", "presenta_dano", "presentaDaño", "presenta_daño"],
    "Sin dato"
  );
};

export const obtenerNovedadesReporteOperacion = (reporte) => {
  return obtenerValor(reporte, ["novedades", "novedad"], "Sin novedades");
};

export const obtenerObservacionesReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    ["observaciones", "observacion", "observacionVideoVigilancia"],
    "Sin observaciones"
  );
};

export const obtenerDescripcionDanoReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    [
      "descripcionDano",
      "descripcion_dano",
      "descripcionDaño",
      "descripcion_daño",
    ],
    "Sin descripción"
  );
};

export const obtenerFechaSeguimientoReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    ["fechaSeguimiento", "fecha_seguimiento"],
    "Sin fecha"
  );
};

export const obtenerDetalleSeguimientoReporteOperacion = (reporte) => {
  return obtenerValor(
    reporte,
    ["detalleSeguimiento", "detalle_seguimiento", "seguimientoDetalle"],
    "Sin seguimiento"
  );
};

export const mostrarResueltoGlpi = (valor) => {
  if (valor === true || valor === "true" || valor === "SI" || valor === "SÍ") {
    return "Sí";
  }

  if (valor === false || valor === "false" || valor === "NO") {
    return "No";
  }

  return "Sin dato";
};

export const obtenerResueltoGlpiReporteOperacion = (reporte) => {
  return mostrarResueltoGlpi(
    obtenerValor(reporte, ["resueltoGlpi", "resuelto_glpi"], null)
  );
};

export const filtrarReportesOperaciones = ({
  reportesOperaciones,
  moduloActivo,
  textoBusqueda,
}) => {
  return reportesOperaciones.filter((reporte) => {
    if (moduloActivo !== "REPORTES_OPERACIONES") {
      return false;
    }

    if (!textoBusqueda) {
      return true;
    }

    const textoReporte = [
      obtenerIdReporteOperacion(reporte),
      obtenerIdCamaraReporteOperacion(reporte),
      obtenerIdPuntoReporteOperacion(reporte),
      obtenerNombreCamaraReporteOperacion(reporte),
      obtenerFechaRevisionReporteOperacion(reporte),
      obtenerEstadoReporteOperacion(reporte),
      obtenerTicketReporteOperacion(reporte),
      obtenerAnalistaReporteOperacion(reporte),
      obtenerNovedadesReporteOperacion(reporte),
      obtenerObservacionesReporteOperacion(reporte),
      obtenerPresentaDanoReporteOperacion(reporte),
      obtenerDescripcionDanoReporteOperacion(reporte),
      obtenerFechaSeguimientoReporteOperacion(reporte),
      obtenerDetalleSeguimientoReporteOperacion(reporte),
      obtenerResueltoGlpiReporteOperacion(reporte),
    ]
      .join(" ")
      .toLowerCase();

    return textoReporte.includes(textoBusqueda);
  });
};

/* ================================
   REPORTES TECNOLOGÍA
================================ */

export const obtenerIdReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["idTecnico", "id_tecnico", "id"], "");
};

export const obtenerIdCamaraReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["idCamara", "id_camara"], "—");
};

export const obtenerIdPuntoReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["idPuntoOriginal", "id_punto_original"], "—");
};

export const obtenerNombreCamaraReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["nombreCamara", "nombre_camara", "camara", "nombre"],
    "Sin cámara"
  );
};

export const obtenerFechaIntervencionReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["fechaIntervencion", "fecha_intervencion", "fecha"],
    "No registrado"
  );
};

export const obtenerTipoIntervencionReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["tipoIntervencion", "tipo_intervencion"],
    "Sin tipo"
  );
};

export const obtenerEstadoAnteriorReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["estadoAnterior", "estado_anterior"], "Sin estado");
};

export const obtenerEstadoNuevoReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["estadoNuevo", "estado_nuevo"], "Sin estado");
};

export const obtenerTicketReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["ticketGlpi", "ticket_glpi"], "Sin ticket");
};

export const obtenerAnalistaReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["nombreAnalista", "nombre_analista", "analista"],
    "Sin analista"
  );
};

export const obtenerDescripcionTecnicaReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["descripcionTecnica", "descripcion_tecnica"],
    "Sin descripción técnica"
  );
};

export const obtenerDiagnosticoReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["diagnostico", "diagnóstico"], "Sin diagnóstico");
};

export const obtenerAccionRealizadaReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["accionRealizada", "accion_realizada"],
    "Sin acción registrada"
  );
};

export const obtenerResultadoReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["resultado"], "Sin resultado");
};

export const obtenerFechaSeguimientoReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["fechaSeguimiento", "fecha_seguimiento"],
    "Sin fecha"
  );
};

export const obtenerObservacionSeguimientoReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["observacionSeguimiento", "observacion_seguimiento"],
    "Sin observación de seguimiento"
  );
};

export const obtenerUsuarioRegistroReporteTecnologia = (reporte) => {
  return obtenerValor(
    reporte,
    ["usuarioRegistro", "usuario_registro"],
    "Sin usuario"
  );
};

export const obtenerRolRegistroReporteTecnologia = (reporte) => {
  return obtenerValor(reporte, ["rolRegistro", "rol_registro"], "Sin rol");
};

export const obtenerResueltoGlpiReporteTecnologia = (reporte) => {
  return mostrarResueltoGlpi(
    obtenerValor(reporte, ["resueltoGlpi", "resuelto_glpi"], null)
  );
};

export const filtrarReportesTecnologia = ({
  reportesTecnologia,
  moduloActivo,
  textoBusqueda,
}) => {
  return reportesTecnologia.filter((reporte) => {
    if (moduloActivo !== "REPORTES_TECNOLOGIA") {
      return false;
    }

    if (!textoBusqueda) {
      return true;
    }

    const textoReporte = [
      obtenerIdReporteTecnologia(reporte),
      obtenerIdCamaraReporteTecnologia(reporte),
      obtenerIdPuntoReporteTecnologia(reporte),
      obtenerNombreCamaraReporteTecnologia(reporte),
      obtenerTipoIntervencionReporteTecnologia(reporte),
      obtenerEstadoAnteriorReporteTecnologia(reporte),
      obtenerEstadoNuevoReporteTecnologia(reporte),
      obtenerTicketReporteTecnologia(reporte),
      obtenerAnalistaReporteTecnologia(reporte),
      obtenerDescripcionTecnicaReporteTecnologia(reporte),
      obtenerDiagnosticoReporteTecnologia(reporte),
      obtenerResultadoReporteTecnologia(reporte),
    ]
      .join(" ")
      .toLowerCase();

    return textoReporte.includes(textoBusqueda);
  });
};

/* ================================
   EDICIÓN DE CÁMARA
================================ */

export const obtenerIdEdicionCamara = (edicion) => {
  return obtenerValor(edicion, ["idEdicion", "id_edicion", "id"], "");
};

export const obtenerIdCamaraEdicion = (edicion) => {
  return obtenerValor(edicion, ["idCamara", "id_camara"], "—");
};

export const obtenerIdPuntoEdicion = (edicion) => {
  return obtenerValor(edicion, ["idPuntoOriginal", "id_punto_original"], "—");
};

export const obtenerNombreCamaraEdicion = (edicion) => {
  return obtenerValor(
    edicion,
    ["nombreCamara", "nombre_camara", "camara", "nombre"],
    "Sin cámara"
  );
};

export const obtenerIdAnalistaEdicion = (edicion) => {
  return obtenerValor(edicion, ["idAnalista", "id_analista"], "—");
};

export const obtenerNombreAnalistaEdicion = (edicion) => {
  return obtenerValor(
    edicion,
    ["nombreAnalista", "nombre_analista", "analista"],
    "Sin analista"
  );
};

export const obtenerCampoModificadoEdicion = (edicion) => {
  return obtenerValor(
    edicion,
    ["campoModificado", "campo_modificado"],
    "Sin campo"
  );
};

export const obtenerValorAnteriorEdicion = (edicion) => {
  return obtenerValor(
    edicion,
    ["valorAnterior", "valor_anterior"],
    "Sin valor anterior"
  );
};

export const obtenerValorNuevoEdicion = (edicion) => {
  return obtenerValor(
    edicion,
    ["valorNuevo", "valor_nuevo"],
    "Sin valor nuevo"
  );
};

export const obtenerDetalleEdicionCamara = (edicion) => {
  return obtenerValor(edicion, ["detalle"], "Sin detalle");
};

export const obtenerUsuarioRegistroEdicion = (edicion) => {
  return obtenerValor(
    edicion,
    ["usuarioRegistro", "usuario_registro"],
    "Sin usuario"
  );
};

export const obtenerRolRegistroEdicion = (edicion) => {
  return obtenerValor(edicion, ["rolRegistro", "rol_registro"], "Sin rol");
};

export const obtenerFechaEdicionCamara = (edicion) => {
  return obtenerValor(
    edicion,
    ["fechaEdicion", "fecha_edicion"],
    "No registrado"
  );
};

export const filtrarEdicionesCamara = ({
  edicionesCamara,
  moduloActivo,
  textoBusqueda,
}) => {
  return edicionesCamara.filter((edicion) => {
    if (moduloActivo !== "EDICION_CAMARA") {
      return false;
    }

    if (!textoBusqueda) {
      return true;
    }

    const textoEdicion = [
      obtenerIdEdicionCamara(edicion),
      obtenerIdCamaraEdicion(edicion),
      obtenerIdPuntoEdicion(edicion),
      obtenerNombreCamaraEdicion(edicion),
      obtenerNombreAnalistaEdicion(edicion),
      obtenerCampoModificadoEdicion(edicion),
      obtenerValorAnteriorEdicion(edicion),
      obtenerValorNuevoEdicion(edicion),
      obtenerUsuarioRegistroEdicion(edicion),
      obtenerRolRegistroEdicion(edicion),
      obtenerDetalleEdicionCamara(edicion),
    ]
      .join(" ")
      .toLowerCase();

    return textoEdicion.includes(textoBusqueda);
  });
};

/* ================================
   ELIMINADAS / DESACTIVADAS
================================ */

export const obtenerIdEliminacionCamara = (eliminacion) => {
  return obtenerValor(
    eliminacion,
    ["idEliminacion", "id_eliminacion", "id"],
    ""
  );
};

export const obtenerIdCamaraEliminacion = (eliminacion) => {
  return obtenerValor(eliminacion, ["idCamara", "id_camara"], "—");
};

export const obtenerIdPuntoEliminacion = (eliminacion) => {
  return obtenerValor(
    eliminacion,
    ["idPuntoOriginal", "id_punto_original"],
    "—"
  );
};

export const obtenerNombreCamaraEliminacion = (eliminacion) => {
  return obtenerValor(
    eliminacion,
    ["nombreCamara", "nombre_camara"],
    "Sin cámara"
  );
};

export const obtenerEstadoAnteriorEliminacion = (eliminacion) => {
  return obtenerValor(
    eliminacion,
    ["estadoAnterior", "estado_anterior"],
    "Sin estado"
  );
};

export const obtenerMotivoEliminacion = (eliminacion) => {
  return obtenerValor(eliminacion, ["motivo"], "Sin motivo");
};

export const obtenerUsuarioRegistroEliminacion = (eliminacion) => {
  return obtenerValor(
    eliminacion,
    ["usuarioRegistro", "usuario_registro"],
    "Sin usuario"
  );
};

export const obtenerRolRegistroEliminacion = (eliminacion) => {
  return obtenerValor(
    eliminacion,
    ["rolRegistro", "rol_registro"],
    "Sin rol"
  );
};

export const obtenerFechaEliminacionCamara = (eliminacion) => {
  return obtenerValor(
    eliminacion,
    ["fechaEliminacion", "fecha_eliminacion"],
    "No registrado"
  );
};

export const obtenerIdAnalistaEliminacion = (eliminacion) => {
  return obtenerValor(eliminacion, ["idAnalista", "id_analista"], "—");
};

export const obtenerNombreAnalistaEliminacion = (eliminacion) => {
  return obtenerValor(
    eliminacion,
    ["nombreAnalista", "nombre_analista"],
    "Sin analista"
  );
};

export const filtrarEliminacionesCamara = ({
  eliminacionesCamara,
  moduloActivo,
  textoBusqueda,
}) => {
  return eliminacionesCamara.filter((eliminacion) => {
    if (moduloActivo !== "ELIMINADAS_DESACTIVADAS") {
      return false;
    }

    if (!textoBusqueda) {
      return true;
    }

    const textoEliminacion = [
      obtenerIdEliminacionCamara(eliminacion),
      obtenerIdCamaraEliminacion(eliminacion),
      obtenerIdPuntoEliminacion(eliminacion),
      obtenerNombreCamaraEliminacion(eliminacion),
      obtenerEstadoAnteriorEliminacion(eliminacion),
      obtenerMotivoEliminacion(eliminacion),
      obtenerUsuarioRegistroEliminacion(eliminacion),
      obtenerRolRegistroEliminacion(eliminacion),
      obtenerNombreAnalistaEliminacion(eliminacion),
    ]
      .join(" ")
      .toLowerCase();

    return textoEliminacion.includes(textoBusqueda);
  });
};

/* ================================
   ACTIVACIONES / DESACTIVACIONES
================================ */

export const esAuditoriaReactivacionCamara = (auditoria) => {
  const accion = normalizarTexto(obtenerAccion(auditoria));
  const entidad = normalizarTexto(obtenerEntidad(auditoria));
  const detalle = normalizarTexto(obtenerDetalle(auditoria));

  return (
    entidad.includes("camara") &&
    (accion.includes("reactivar") ||
      detalle.includes("reactivó") ||
      detalle.includes("reactivo") ||
      detalle.includes("reactivar"))
  );
};

export const filtrarReactivacionesCamara = ({
  auditorias,
  moduloActivo,
  textoBusqueda,
}) => {
  return auditorias.filter((auditoria) => {
    if (moduloActivo !== "ELIMINADAS_DESACTIVADAS") {
      return false;
    }

    if (!esAuditoriaReactivacionCamara(auditoria)) {
      return false;
    }

    if (!textoBusqueda) {
      return true;
    }

    const textoAuditoria = [
      obtenerIdAuditoria(auditoria),
      obtenerIdRegistro(auditoria),
      obtenerFechaHora(auditoria),
      obtenerUsername(auditoria),
      obtenerRol(auditoria),
      obtenerAccion(auditoria),
      obtenerEntidad(auditoria),
      obtenerDetalle(auditoria),
    ]
      .join(" ")
      .toLowerCase();

    return textoAuditoria.includes(textoBusqueda);
  });
};

const extraerNombreCamaraDesdeDetalle = (detalle) => {
  const texto = convertirTexto(detalle);

  const coincidencia = texto.match(/c[aá]mara:\s*([^.]*)/i);

  if (coincidencia && coincidencia[1]) {
    return coincidencia[1].trim();
  }

  return "Sin cámara";
};

const extraerEstadoDesdeDetalle = (detalle) => {
  const texto = convertirTexto(detalle);

  const coincidencia = texto.match(/Estado asignado:\s*([^.]*)/i);

  if (coincidencia && coincidencia[1]) {
    return coincidencia[1].trim();
  }

  return "ACTIVA";
};

export const normalizarDesactivacionesCamara = (eliminaciones) => {
  return eliminaciones.map((eliminacion) => ({
    ...eliminacion,
    tipoMovimiento: "DESACTIVACION",
    idMovimiento: obtenerIdEliminacionCamara(eliminacion),
    fechaMovimiento: obtenerFechaEliminacionCamara(eliminacion),
    idCamaraMovimiento: obtenerIdCamaraEliminacion(eliminacion),
    idPuntoMovimiento: obtenerIdPuntoEliminacion(eliminacion),
    nombreCamaraMovimiento: obtenerNombreCamaraEliminacion(eliminacion),
    estadoAnteriorMovimiento: obtenerEstadoAnteriorEliminacion(eliminacion),
    estadoNuevoMovimiento: "DESACTIVADA",
    motivoMovimiento: obtenerMotivoEliminacion(eliminacion),
    usuarioMovimiento: obtenerUsuarioRegistroEliminacion(eliminacion),
    rolMovimiento: obtenerRolRegistroEliminacion(eliminacion),
  }));
};

export const normalizarReactivacionesCamara = (auditorias) => {
  return auditorias.map((auditoria) => {
    const detalle = obtenerDetalle(auditoria);

    return {
      ...auditoria,
      tipoMovimiento: "REACTIVACION",
      idMovimiento: obtenerIdAuditoria(auditoria),
      fechaMovimiento: obtenerFechaHora(auditoria),
      idCamaraMovimiento: obtenerIdRegistro(auditoria),
      idPuntoMovimiento: "—",
      nombreCamaraMovimiento: extraerNombreCamaraDesdeDetalle(detalle),
      estadoAnteriorMovimiento: "DESACTIVADA",
      estadoNuevoMovimiento: extraerEstadoDesdeDetalle(detalle),
      motivoMovimiento: detalle,
      usuarioMovimiento: obtenerUsername(auditoria),
      rolMovimiento: obtenerRol(auditoria),
    };
  });
};

export const ordenarActivacionesDesactivaciones = (movimientos) => {
  return [...movimientos].sort((a, b) => {
    const fechaA = new Date(a.fechaMovimiento || 0).getTime();
    const fechaB = new Date(b.fechaMovimiento || 0).getTime();

    return fechaB - fechaA;
  });
};

export const obtenerTipoMovimientoCamara = (movimiento) => {
  return obtenerValor(movimiento, ["tipoMovimiento"], "DESACTIVACION");
};

export const obtenerEtiquetaMovimientoCamara = (movimiento) => {
  const tipo = obtenerTipoMovimientoCamara(movimiento);

  if (tipo === "REACTIVACION") {
    return "REACTIVACIÓN";
  }

  return "DESACTIVACIÓN";
};

export const obtenerIdMovimientoCamara = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["idMovimiento", "idEliminacion", "id_eliminacion", "idAuditoria", "id"],
    ""
  );
};

export const obtenerFechaMovimientoCamara = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["fechaMovimiento", "fechaEliminacion", "fecha_eliminacion", "fechaHora"],
    "No registrado"
  );
};

export const obtenerIdCamaraMovimiento = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["idCamaraMovimiento", "idCamara", "id_camara", "idRegistro"],
    "—"
  );
};

export const obtenerIdPuntoMovimiento = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["idPuntoMovimiento", "idPuntoOriginal", "id_punto_original"],
    "—"
  );
};

export const obtenerNombreCamaraMovimiento = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["nombreCamaraMovimiento", "nombreCamara", "nombre_camara"],
    "Sin cámara"
  );
};

export const obtenerEstadoAnteriorMovimiento = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["estadoAnteriorMovimiento", "estadoAnterior", "estado_anterior"],
    "Sin estado"
  );
};

export const obtenerEstadoNuevoMovimiento = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["estadoNuevoMovimiento", "estadoNuevo", "estado_nuevo"],
    "Sin estado"
  );
};

export const obtenerMotivoMovimiento = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["motivoMovimiento", "motivo", "detalle"],
    "Sin motivo"
  );
};

export const obtenerUsuarioMovimiento = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["usuarioMovimiento", "usuarioRegistro", "usuario_registro", "username"],
    "Sin usuario"
  );
};

export const obtenerRolMovimiento = (movimiento) => {
  return obtenerValor(
    movimiento,
    ["rolMovimiento", "rolRegistro", "rol_registro", "rol"],
    "Sin rol"
  );
};