import { FaEraser } from "react-icons/fa";
import AuditoriasTablaGeneral from "./AuditoriasTablaGeneral";
import ReportesOperacionesTabla from "./ReportesOperacionesTabla";
import ReportesTecnologiaTabla from "./ReportesTecnologiaTabla";
import CambioCamaraTabla from "./CambioCamaraTabla";
import NuevaCamaraTabla from "./NuevaCamaraTabla";
import EdicionCamaraTabla from "./EdicionCamaraTabla";
import HistoricoCamaraPanel from "./HistoricoCamaraPanel";
import EliminadasDesactivadasTabla from "./EliminadasDesactivadasTabla";

function AuditoriasPanel({
  moduloActivo,
  moduloSeleccionado,
  busqueda,
  onCambiarBusqueda,
  onLimpiarBusqueda,
  cargando,
  error,
  auditoriasFiltradas,
  reportesOperacionesFiltrados,
  paginaReportesOperaciones,
  totalPaginasReportesOperaciones,
  totalReportesOperaciones,
  onCambiarPaginaReportesOperaciones,
  reportesTecnologiaFiltrados,
  onVerDetalleAuditoria,
  onVerDetalleReporteOperacion,
  onVerDetalleReporteTecnologia,
  onVerDetalleNuevaCamara,
  edicionesCamaraFiltradas,
  onVerDetalleEdicionCamara,
  eliminacionesCamaraFiltradas,
  onVerDetalleEliminacionCamara,
}) {
  const obtenerTotalEncontrados = () => {
    if (moduloActivo === "REPORTES_OPERACIONES") {
    return busqueda.trim()
      ? reportesOperacionesFiltrados.length
      : totalReportesOperaciones;
  }

    if (moduloActivo === "REPORTES_TECNOLOGIA") {
      return reportesTecnologiaFiltrados.length;
    }

    if (moduloActivo === "EDICION_CAMARA") {
      return edicionesCamaraFiltradas.length;
    }

    if (moduloActivo === "ELIMINADAS_DESACTIVADAS") {
      return eliminacionesCamaraFiltradas.length;
    }

    return auditoriasFiltradas.length;
  };

  const claseModuloActivo = `modulo-${moduloActivo
    .toLowerCase()
    .replaceAll("_", "-")}`;

  return (
    <section className={`auditorias-tabla-panel ${claseModuloActivo}`}>
      <div className="auditorias-tabla-header">
        <div>
          <h3>{moduloSeleccionado?.titulo || "Auditoría general"}</h3>
          <p>
            Total encontrados: <strong>{obtenerTotalEncontrados()}</strong>
          </p>
        </div>
      </div>

      <div className="auditorias-buscador">
        <input
          type="text"
          placeholder="Buscar por ID, fecha, usuario, nombre, analista, grupo, rol, acción, módulo o detalle..."
          value={busqueda}
          onChange={(e) => onCambiarBusqueda(e.target.value)}
        />

        <button onClick={onLimpiarBusqueda}>
          <FaEraser className="auditorias-btn-icon" />
          Limpiar
        </button>
      </div>

      {cargando && (
        <p className="auditorias-sin-datos">Cargando auditorías...</p>
      )}

      {error && <p className="auditorias-sin-datos">{error}</p>}

      {!cargando && !error && moduloActivo === "REPORTES_OPERACIONES" && (
        <>
          <ReportesOperacionesTabla
            reportes={reportesOperacionesFiltrados}
            onVerDetalle={onVerDetalleReporteOperacion}
          />

          <div className="auditorias-paginacion">
            <button
              type="button"
              disabled={paginaReportesOperaciones <= 0}
              onClick={() =>
                onCambiarPaginaReportesOperaciones(paginaReportesOperaciones - 1)
              }
            >
              Anterior
            </button>

            <span>
              Página {totalPaginasReportesOperaciones === 0 ? 0 : paginaReportesOperaciones + 1}
              {" "}de{" "}
              {totalPaginasReportesOperaciones}
            </span>

            <button
              type="button"
              disabled={paginaReportesOperaciones + 1 >= totalPaginasReportesOperaciones}
              onClick={() =>
                onCambiarPaginaReportesOperaciones(paginaReportesOperaciones + 1)
              }
            >
              Siguiente
            </button>
          </div>
        </>
      )}

      {!cargando && !error && moduloActivo === "REPORTES_TECNOLOGIA" && (
        <ReportesTecnologiaTabla
          reportes={reportesTecnologiaFiltrados}
          onVerDetalle={onVerDetalleReporteTecnologia}
        />
      )}

      {!cargando && !error && moduloActivo === "CAMBIO_CAMARA" && (
        <CambioCamaraTabla
          auditorias={auditoriasFiltradas}
          onVerDetalle={onVerDetalleAuditoria}
        />
      )}

      {!cargando && !error && moduloActivo === "EDICION_CAMARA" && (
        <EdicionCamaraTabla
          ediciones={edicionesCamaraFiltradas}
          onVerDetalle={onVerDetalleEdicionCamara}
        />
      )}

      {!cargando && !error && moduloActivo === "NUEVA_CAMARA" && (
        <NuevaCamaraTabla
          auditorias={auditoriasFiltradas}
          onVerDetalle={onVerDetalleNuevaCamara}
        />
      )}

      {!cargando && !error && moduloActivo === "HISTORICO_CAMARA" && (
        <HistoricoCamaraPanel busqueda={busqueda} />
      )}

      {!cargando && !error && moduloActivo === "ELIMINADAS_DESACTIVADAS" && (
        <EliminadasDesactivadasTabla
          eliminaciones={eliminacionesCamaraFiltradas}
          onVerDetalle={onVerDetalleEliminacionCamara}
        />
      )}

      {!cargando &&
        !error &&
        moduloActivo !== "REPORTES_OPERACIONES" &&
        moduloActivo !== "REPORTES_TECNOLOGIA" &&
        moduloActivo !== "CAMBIO_CAMARA" &&
        moduloActivo !== "EDICION_CAMARA" &&
        moduloActivo !== "NUEVA_CAMARA" && 
        moduloActivo !== "HISTORICO_CAMARA" && 
        moduloActivo !== "ELIMINADAS_DESACTIVADAS" && (
          <AuditoriasTablaGeneral
            auditorias={auditoriasFiltradas}
            onVerDetalle={onVerDetalleAuditoria}
          />
        )}
    </section>
  );
}

export default AuditoriasPanel;