import { useEffect, useMemo, useState } from "react";
import { obtenerAuditoriasPaginadas } from "../../services/auditoriaService";

import {
  obtenerCamarasFiltradas,
  obtenerCamaraPorId,
} from "../../services/camaraService";

import { listarHistorialCambiosPorCamara } from "../../services/historialCambioCamaraService";
import { listarHistorialNovedades } from "../../services/historialNovedadService";
import { listarHistorialTecnicoPorCamara } from "../../services/historialTecnicoCamaraService";
import { listarHistorialEdicionPorCamara } from "../../services/historialEdicionCamaraService";
import { listarHistorialEliminacionPorCamara } from "../../services/historialEliminacionCamaraService";

import {
  formatearFechaHora,
  obtenerValor,
} from "../../utils/auditoriasUtils";

const obtenerLista = (resultado) => {
  if (resultado.status !== "fulfilled") {
    return [];
  }

  const data = resultado.value;

  if (Array.isArray(data)) {
    return data;
  }

  return data?.content || [];
};

const obtenerIdCamara = (camara) => {
  return obtenerValor(camara, ["idCamara", "id_camara", "id"], "");
};

const obtenerIdPunto = (camara) => {
  return obtenerValor(camara, ["idPuntoOriginal", "id_punto_original"], "—");
};

const obtenerNombreCamara = (camara) => {
  return obtenerValor(
    camara,
    ["nombreCamara", "nombre_camara", "nombre"],
    "Sin cámara"
  );
};

const obtenerFechaEvento = (evento, campos) => {
  return obtenerValor(evento, campos, "");
};

const mostrarValorEdicion = (campo, valor) => {
  if (!valor) {
    return "Sin valor";
  }

  const campoNormalizado = String(campo || "").toLowerCase().trim();
  const valorLimpio = String(valor).trim();

  if (!valorLimpio.startsWith("OPCION_")) {
    return valorLimpio;
  }

  const opciones = {
    conversor: {
      OPCION_1: "GPON",
      OPCION_2: "FOT",
      OPCION_3: "SWITCH",
    },
    poste: {
      OPCION_1: "Metalico",
      OPCION_2: "Hormigon",
      OPCION_3: "Fibra",
    },
    brazo: {
      OPCION_1: "Fibra",
      OPCION_2: "Metalico",
    },
  };

  if (campoNormalizado.includes("conversor")) {
    return opciones.conversor[valorLimpio] || valorLimpio;
  }

  if (campoNormalizado.includes("poste")) {
    return opciones.poste[valorLimpio] || valorLimpio;
  }

  if (campoNormalizado.includes("brazo")) {
    return opciones.brazo[valorLimpio] || valorLimpio;
  }

  return valorLimpio;
};

const ordenarPorFechaDesc = (eventos) => {
  return eventos.sort((a, b) => {
    const fechaA = new Date(a.fecha || 0).getTime();
    const fechaB = new Date(b.fecha || 0).getTime();

    return fechaB - fechaA;
  });
};

const formatearDetalleEdicionReporte = (detalle) => {
  const texto = String(detalle || "").trim();

  if (!texto) {
    return "Detalle: Se editó el reporte operativo.";
  }

  const separador = "Cambios realizados:";
  const posicionCambios = texto.indexOf(separador);

  if (posicionCambios === -1) {
    return `Detalle: ${texto}`;
  }

  const cambiosTexto = texto
    .slice(posicionCambios + separador.length)
    .trim();

  if (!cambiosTexto) {
    return "Detalle: Se editó el reporte operativo.";
  }

  return cambiosTexto
    .split("|")
    .map((cambio) => cambio.trim())
    .filter(Boolean)
    .join("\n");
};

function HistoricoCamaraPanel({ busqueda }) {
  const [camarasEncontradas, setCamarasEncontradas] = useState([]);
  const [camaraSeleccionada, setCamaraSeleccionada] = useState(null);
  const [detalleCamara, setDetalleCamara] = useState(null);

  const [reportesOperaciones, setReportesOperaciones] = useState([]);
  const [reportesTecnologia, setReportesTecnologia] = useState([]);
  const [edicionesReportesOperaciones, setEdicionesReportesOperaciones] =
  useState([]);
  const [cambiosCamara, setCambiosCamara] = useState([]);
  const [edicionesCamara, setEdicionesCamara] = useState([]);
  const [eliminacionesCamara, setEliminacionesCamara] = useState([]);

  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [error, setError] = useState("");

  const textoBusqueda = busqueda?.trim() || "";

  useEffect(() => {
    const buscarCamaras = async () => {
      if (textoBusqueda.length < 2) {
        setCamarasEncontradas([]);
        setCamaraSeleccionada(null);
        setDetalleCamara(null);
        setReportesOperaciones([]);
        setEdicionesReportesOperaciones([]);
        setReportesTecnologia([]);
        setCambiosCamara([]);
        setEdicionesCamara([]);
        setEliminacionesCamara([]);
        setError("");
        return;
      }

      try {
        setCargandoBusqueda(true);
        setError("");

        const data = await obtenerCamarasFiltradas({
          busqueda: textoBusqueda,
          page: 0,
          size: 8,
        });

        const lista = Array.isArray(data) ? data : data.content || [];
        setCamarasEncontradas(lista);
      } catch (error) {
        console.error("Error al buscar cámaras para histórico:", error);
        setCamarasEncontradas([]);
        setError("No se pudieron buscar cámaras.");
      } finally {
        setCargandoBusqueda(false);
      }
    };

    buscarCamaras();
  }, [textoBusqueda]);

  const cargarHistorialCamara = async (camara) => {
    const idCamara = obtenerIdCamara(camara);

    if (!idCamara) {
      return;
    }

    try {
      setCamaraSeleccionada(camara);
      setDetalleCamara(null);
      setReportesOperaciones([]);
      setEdicionesReportesOperaciones([]);
      setReportesTecnologia([]);
      setCambiosCamara([]);
      setEdicionesCamara([]);
      setEliminacionesCamara([]);
      setCargandoHistorial(true);
      setError("");

      const [
      resultadoDetalle,
      resultadoCambios,
      resultadoNovedades,
      resultadoTecnologia,
      resultadoEdiciones,
      resultadoEliminaciones,
      resultadoAuditorias,
    ] = await Promise.allSettled([
      obtenerCamaraPorId(idCamara),
      listarHistorialCambiosPorCamara(idCamara),
      listarHistorialNovedades(),
      listarHistorialTecnicoPorCamara(idCamara),
      listarHistorialEdicionPorCamara(idCamara),
      listarHistorialEliminacionPorCamara(idCamara),
      obtenerAuditoriasPaginadas(0, 200),
    ]);

      if (resultadoDetalle.status === "fulfilled") {
        setDetalleCamara(resultadoDetalle.value);
      } else {
        setDetalleCamara(camara);
      }

      const listaCambios = obtenerLista(resultadoCambios);
      const listaNovedades = obtenerLista(resultadoNovedades);
      const listaTecnologia = obtenerLista(resultadoTecnologia);
      const listaEdiciones = obtenerLista(resultadoEdiciones);
      const listaEliminaciones = obtenerLista(resultadoEliminaciones);
      const listaAuditorias = obtenerLista(resultadoAuditorias);

      const novedadesDeCamara = listaNovedades.filter((reporte) => {
        const idReporteCamara = obtenerValor(
          reporte,
          ["idCamara", "id_camara"],
          ""
        );

        return String(idReporteCamara) === String(idCamara);
      });

      const idsReportesDeCamara = new Set(
        novedadesDeCamara
          .map((reporte) =>
            String(
              obtenerValor(
                reporte,
                ["idNovedad", "id_novedad", "idHistorial", "id_historial", "id"],
                ""
              )
            )
          )
          .filter(Boolean)
      );

      const auditoriasEdicionReporte = listaAuditorias.filter((auditoria) => {
        const entidad = String(
          obtenerValor(auditoria, ["entidad"], "")
        ).toUpperCase();

        const accion = String(
          obtenerValor(auditoria, ["accion"], "")
        ).toUpperCase();

        const idRegistro = String(
          obtenerValor(
            auditoria,
            ["idRegistro", "id_registro", "idRegistroAfectado", "id_registro_afectado"],
            ""
          )
        );

        return (
          entidad === "HISTORIAL_NOVEDAD" &&
          accion.includes("ACTUALIZAR") &&
          idsReportesDeCamara.has(idRegistro)
        );
      });

      setCambiosCamara(listaCambios);
      setReportesOperaciones(novedadesDeCamara);
      setEdicionesReportesOperaciones(auditoriasEdicionReporte);
      setReportesTecnologia(listaTecnologia);
      setEdicionesCamara(listaEdiciones);
      setEliminacionesCamara(listaEliminaciones);
    } catch (error) {
      console.error("Error al cargar histórico de cámara:", error);
      setError("No se pudo cargar el histórico de la cámara.");
    } finally {
      setCargandoHistorial(false);
    }
  };

  const eventosTimeline = useMemo(() => {
    const eventos = [];

    reportesOperaciones.forEach((reporte) => {
      eventos.push({
        tipo: "Reporte operaciones",
        icono: "📑",
        fecha: obtenerFechaEvento(reporte, [
          "fechaRevision",
          "fecha_revision",
          "fecha",
        ]),
        titulo: obtenerValor(
          reporte,
          ["estadoOperativo", "estado_operativo", "estadoActual"],
          "Reporte operativo"
        ),
        detalle: obtenerValor(
          reporte,
          ["novedades", "observaciones", "descripcionDano"],
          "Sin detalle"
        ),
        extra: obtenerValor(reporte, ["ticketGlpi", "ticket_glpi"], ""),
      });
    });

    edicionesReportesOperaciones.forEach((auditoria) => {
      const idReporte = obtenerValor(
        auditoria,
        ["idRegistro", "id_registro", "idRegistroAfectado", "id_registro_afectado"],
        "—"
      );

      const detalleAuditoria = obtenerValor(
        auditoria,
        ["detalle", "descripcion"],
        "Se editó el reporte operativo."
      );

      eventos.push({
        tipo: "Edición de reporte operativo",
        icono: "📝",
        fecha: obtenerFechaEvento(auditoria, [
          "fechaHora",
          "fecha_hora",
          "fecha",
        ]),
        titulo: `Reporte operativo #${idReporte}`,
        detalle: formatearDetalleEdicionReporte(detalleAuditoria),
        extra: obtenerValor(
          auditoria,
          ["username", "usuario", "usuarioRegistro"],
          ""
        ),
      });
    });

    reportesTecnologia.forEach((reporte) => {
      eventos.push({
        tipo: "Reporte tecnología",
        icono: "🛠️",
        fecha: obtenerFechaEvento(reporte, [
          "fechaIntervencion",
          "fecha_intervencion",
          "fecha",
        ]),
        titulo: obtenerValor(
          reporte,
          ["tipoIntervencion", "tipo_intervencion"],
          "Intervención técnica"
        ),
        detalle: obtenerValor(
          reporte,
          ["resultado", "accionRealizada", "descripcionTecnica", "diagnostico"],
          "Sin detalle técnico"
        ),
        extra: obtenerValor(reporte, ["ticketGlpi", "ticket_glpi"], ""),
      });
    });

    cambiosCamara.forEach((cambio) => {
      const idCambio = obtenerValor(cambio, ["idCambio", "id_cambio"], "");
      const tipoCambio = obtenerValor(
        cambio,
        ["tipoCambio", "tipo_cambio"],
        "Cambio registrado"
      );

      const nombreAnterior = obtenerValor(
        cambio,
        ["nombreCamaraAnterior", "nombre_camara_anterior"],
        ""
      );

      const nombreNuevo = obtenerValor(
        cambio,
        ["nombreCamaraNueva", "nombre_camara_nueva"],
        ""
      );

      const ipAnterior = obtenerValor(cambio, ["ipAnterior", "ip_anterior"], "");
      const ipNueva = obtenerValor(cambio, ["ipNueva", "ip_nueva"], "");

      const estadoAnterior = obtenerValor(
        cambio,
        ["estadoAnterior", "estado_anterior"],
        ""
      );

      const estadoNuevo = obtenerValor(
        cambio,
        ["estadoNuevo", "estado_nuevo"],
        ""
      );

      const motivoCambio = obtenerValor(
        cambio,
        ["motivoCambio", "motivo_cambio"],
        ""
      );

      const observacionTecnica = obtenerValor(
        cambio,
        ["observacionTecnica", "observacion_tecnica"],
        ""
      );

      const detallesCambio = [
        nombreAnterior || nombreNuevo
          ? `Cámara: ${nombreAnterior || "Sin dato"} → ${nombreNuevo || "Sin dato"}`
          : "",
        ipAnterior || ipNueva
          ? `IP: ${ipAnterior || "Sin dato"} → ${ipNueva || "Sin dato"}`
          : "",
        estadoAnterior || estadoNuevo
          ? `Estado: ${estadoAnterior || "Sin dato"} → ${estadoNuevo || "Sin dato"}`
          : "",
        motivoCambio ? `Motivo: ${motivoCambio}` : "",
        observacionTecnica ? `Observación técnica: ${observacionTecnica}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      eventos.push({
        tipo: "Cambio de cámara",
        icono: "🔁",
        fecha: obtenerFechaEvento(cambio, [
          "fechaRegistro",
          "fecha_registro",
          "fechaCambio",
          "fecha_cambio",
          "fecha",
        ]),
        titulo: idCambio ? `${tipoCambio} · Cambio #${idCambio}` : tipoCambio,
        detalle: detallesCambio || "Cambio de cámara registrado.",
        extra: obtenerValor(cambio, ["usuarioRegistro", "usuario_registro"], ""),
      });
    });

    edicionesCamara.forEach((edicion) => {
      const campoModificado = obtenerValor(
        edicion,
        ["campoModificado", "campo_modificado"],
        "Campo modificado"
      );

      const valorAnterior = mostrarValorEdicion(
        campoModificado,
        obtenerValor(edicion, ["valorAnterior", "valor_anterior"], "")
      );

      const valorNuevo = mostrarValorEdicion(
        campoModificado,
        obtenerValor(edicion, ["valorNuevo", "valor_nuevo"], "")
      );

      eventos.push({
        tipo: "Edición de cámara",
        icono: "✏️",
        fecha: obtenerFechaEvento(edicion, [
          "fechaEdicion",
          "fecha_edicion",
          "fecha",
        ]),
        titulo: campoModificado,
        detalle: `Antes: ${valorAnterior}\nDespués: ${valorNuevo}`,
        extra: obtenerValor(
          edicion,
          ["usuarioRegistro", "usuario_registro"],
          ""
        ),
      });
    });

    eliminacionesCamara.forEach((eliminacion) => {
      eventos.push({
        tipo: "Eliminación / desactivación",
        icono: "🗑️",
        fecha: obtenerFechaEvento(eliminacion, [
          "fechaEliminacion",
          "fecha_eliminacion",
          "fecha",
        ]),
        titulo: obtenerValor(
          eliminacion,
          ["estadoAnterior", "estado_anterior"],
          "Cámara desactivada"
        ),
        detalle: obtenerValor(eliminacion, ["motivo"], "Sin motivo registrado"),
        extra: obtenerValor(
          eliminacion,
          ["usuarioRegistro", "usuario_registro"],
          ""
        ),
      });
    });

    return ordenarPorFechaDesc(eventos);
      }, [
      reportesOperaciones,
      edicionesReportesOperaciones,
      reportesTecnologia,
      cambiosCamara,
      edicionesCamara,
      eliminacionesCamara,
    ]);

  const camaraActual = detalleCamara || camaraSeleccionada;

  return (
    <div className="historico-camara-panel">
      {textoBusqueda.length < 2 && (
        <div className="auditorias-sin-datos">
          Escribe al menos 2 caracteres para buscar una cámara por ID, nombre,
          IP, provincia, cantón o dirección.
        </div>
      )}

      {textoBusqueda.length >= 2 && (
        <>
          <div className="auditoria-modal-section">
            <h4>Cámaras encontradas</h4>

            {cargandoBusqueda && (
              <div className="auditorias-sin-datos">Buscando cámaras...</div>
            )}

            {!cargandoBusqueda && camarasEncontradas.length === 0 && (
              <div className="auditorias-sin-datos">
                No se encontraron cámaras con esa búsqueda.
              </div>
            )}

            {!cargandoBusqueda && camarasEncontradas.length > 0 && (
              <div className="auditoria-modal-grid-pro">
                {camarasEncontradas.map((camara) => {
                  const idCamara = obtenerIdCamara(camara);
                  const seleccionado =
                    String(obtenerIdCamara(camaraSeleccionada || {})) ===
                    String(idCamara);

                  return (
                    <button
                      key={idCamara}
                      type="button"
                      className={`auditoria-info-card ${
                        seleccionado ? "historico-camara-activa" : ""
                      }`}
                      onClick={() => cargarHistorialCamara(camara)}
                    >
                      <span>ID {idCamara} · Punto {obtenerIdPunto(camara)}</span>
                      <strong>{obtenerNombreCamara(camara)}</strong>
                      <small>
                        {obtenerValor(camara, ["nombreCanton", "canton"], "Sin cantón")} ·{" "}
                        {obtenerValor(
                          camara,
                          ["nombreProvincia", "provincia"],
                          "Sin provincia"
                        )}
                      </small>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && <div className="auditorias-sin-datos">{error}</div>}

          {cargandoHistorial && (
            <div className="auditorias-sin-datos">
              Cargando histórico completo de la cámara...
            </div>
          )}

          {!cargandoHistorial && camaraActual && (
            <>
              <div className="auditoria-modal-section">
                <h4>Datos actuales de la cámara</h4>

                <div className="auditoria-modal-highlight">
                  <div className="auditoria-highlight-item">
                    <span>ID cámara</span>
                    <strong>{obtenerIdCamara(camaraActual)}</strong>
                  </div>

                  <div className="auditoria-highlight-item">
                    <span>ID punto</span>
                    <strong>{obtenerIdPunto(camaraActual)}</strong>
                  </div>

                  <div className="auditoria-highlight-item">
                    <span>Nombre</span>
                    <strong>{obtenerNombreCamara(camaraActual)}</strong>
                  </div>

                  <div className="auditoria-highlight-item">
                    <span>Estado</span>
                    <strong>
                      {obtenerValor(
                        camaraActual,
                        ["estadoActual", "estado_actual"],
                        "Sin estado"
                      )}
                    </strong>
                  </div>
                </div>

                <div className="auditoria-modal-grid-pro">
                  <div className="auditoria-info-card">
                    <span>Provincia</span>
                    <strong>
                      {obtenerValor(
                        camaraActual,
                        ["nombreProvincia", "provincia"],
                        "Sin provincia"
                      )}
                    </strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Cantón</span>
                    <strong>
                      {obtenerValor(
                        camaraActual,
                        ["nombreCanton", "canton"],
                        "Sin cantón"
                      )}
                    </strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Dirección IP</span>
                    <strong>
                      {obtenerValor(
                        camaraActual,
                        ["direccionIp", "direccion_ip"],
                        "Sin IP"
                      )}
                    </strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Marca / modelo</span>
                    <strong>
                      {obtenerValor(camaraActual, ["nombreMarca"], "Sin marca")}{" "}
                      /{" "}
                      {obtenerValor(
                        camaraActual,
                        ["nombreModelo"],
                        "Sin modelo"
                      )}
                    </strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Plataforma</span>
                    <strong>
                      {obtenerValor(
                        camaraActual,
                        ["nombrePlataforma", "plataforma"],
                        "Sin plataforma"
                      )}
                    </strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Fecha instalación</span>
                    <strong>
                      {obtenerValor(
                        camaraActual,
                        ["fechaInstalacion", "fecha_instalacion"],
                        "Sin fecha"
                      )}
                    </strong>
                  </div>
                </div>

                <div className="auditoria-detalle-box auditoria-detalle-box-separado">
                  <strong>Dirección:</strong>{" "}
                  {obtenerValor(camaraActual, ["direccion"], "Sin dirección")}
                  {"\n\n"}
                  <strong>Observaciones:</strong>{" "}
                  {obtenerValor(
                    camaraActual,
                    ["observaciones"],
                    "Sin observaciones"
                  )}
                </div>
              </div>

              <div className="auditoria-modal-section">
                <h4>Resumen histórico</h4>

                <div className="auditoria-modal-grid-pro">
                  <div className="auditoria-info-card">
                    <span>Reportes operaciones</span>
                    <strong>{reportesOperaciones.length}</strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Ediciones reportes operaciones</span>
                    <strong>{edicionesReportesOperaciones.length}</strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Reportes tecnología</span>
                    <strong>{reportesTecnologia.length}</strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Cambios de cámara</span>
                    <strong>{cambiosCamara.length}</strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Ediciones</span>
                    <strong>{edicionesCamara.length}</strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Eliminaciones / desactivaciones</span>
                    <strong>{eliminacionesCamara.length}</strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Total eventos</span>
                    <strong>{eventosTimeline.length}</strong>
                  </div>
                </div>
              </div>

              <div className="auditoria-modal-section">
                <h4>Línea de tiempo</h4>

                {eventosTimeline.length === 0 && (
                  <div className="auditorias-sin-datos">
                    Esta cámara todavía no tiene eventos históricos registrados.
                  </div>
                )}

                {eventosTimeline.length > 0 && (
                  <div className="historico-timeline">
                    {eventosTimeline.map((evento, index) => (
                      <div
                        className="historico-timeline-item"
                        key={`${evento.tipo}-${evento.fecha}-${index}`}
                      >
                        <div className="historico-timeline-icon">
                          {evento.icono}
                        </div>

                        <div className="historico-timeline-content">
                          <div className="historico-timeline-top">
                            <div>
                              <strong>{evento.tipo}</strong>
                              <small>{evento.titulo}</small>
                            </div>

                            <span>{formatearFechaHora(evento.fecha)}</span>
                          </div>

                          <div className="historico-reporte-detalle">
                            {String(evento.detalle || "")
                              .split("\n")
                              .filter(Boolean)
                              .map((linea, indice) => {
                                const partes = linea.split(":");
                                const tieneEtiqueta = partes.length > 1;

                                if (!tieneEtiqueta) {
                                  return (
                                    <div
                                      className="historico-reporte-fila historico-reporte-fila-texto"
                                      key={`${evento.tipo}-detalle-${indice}`}
                                    >
                                      <strong>{linea}</strong>
                                    </div>
                                  );
                                }

                                const etiqueta = partes[0];
                                const valor = partes.slice(1).join(":").trim();

                                return (
                                  <div
                                    className="historico-reporte-fila"
                                    key={`${evento.tipo}-detalle-${indice}`}
                                  >
                                    <span>{etiqueta}</span>
                                    <strong>{valor || "Sin dato"}</strong>
                                  </div>
                                );
                              })}
                          </div>

                          {evento.extra && (
                            <div className="historico-reporte-referencia">
                              <span>Registrado por</span>
                              <strong>{evento.extra}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default HistoricoCamaraPanel;