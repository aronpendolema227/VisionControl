import {
  formatearFechaHora,
  obtenerAccionRealizadaReporteTecnologia,
  obtenerAnalistaReporteTecnologia,
  obtenerDescripcionTecnicaReporteTecnologia,
  obtenerDiagnosticoReporteTecnologia,
  obtenerEstadoAnteriorReporteTecnologia,
  obtenerEstadoNuevoReporteTecnologia,
  obtenerFechaIntervencionReporteTecnologia,
  obtenerFechaSeguimientoReporteTecnologia,
  obtenerIdCamaraReporteTecnologia,
  obtenerIdPuntoReporteTecnologia,
  obtenerIdReporteTecnologia,
  obtenerNombreCamaraReporteTecnologia,
  obtenerObservacionSeguimientoReporteTecnologia,
  obtenerResueltoGlpiReporteTecnologia,
  obtenerResultadoReporteTecnologia,
  obtenerRolRegistroReporteTecnologia,
  obtenerTicketReporteTecnologia,
  obtenerTipoIntervencionReporteTecnologia,
  obtenerUsuarioRegistroReporteTecnologia,
} from "../../utils/auditoriasUtils";

function ReportesTecnologiaModal({ reporte, cargando, onCerrar }) {
  if (!reporte) {
    return null;
  }

  return (
    <div className="auditoria-modal-overlay">
      <div className="auditoria-modal auditoria-modal-pro">
        <div className="auditoria-modal-top">
          <div>
            <h3>Detalle de reporte técnico</h3>
            <p>
              Intervención #{obtenerIdReporteTecnologia(reporte)} ·{" "}
              {formatearFechaHora(
                obtenerFechaIntervencionReporteTecnologia(reporte)
              )}
            </p>
          </div>

          <div className="auditoria-modal-top-actions">
            <span className="auditoria-badge actualizar">
              {obtenerTipoIntervencionReporteTecnologia(reporte)}
            </span>

            <button onClick={onCerrar}>✕</button>
          </div>
        </div>

        {cargando && (
          <div className="auditoria-detalle-box">
            Cargando detalle del reporte técnico...
          </div>
        )}

        {!cargando && (
          <>
            <div className="auditoria-modal-highlight">
              <div className="auditoria-highlight-item">
                <span>ID cámara</span>
                <strong>{obtenerIdCamaraReporteTecnologia(reporte)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>ID punto</span>
                <strong>{obtenerIdPuntoReporteTecnologia(reporte)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>Ticket GLPI</span>
                <strong>{obtenerTicketReporteTecnologia(reporte)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>Analista técnico</span>
                <strong>{obtenerAnalistaReporteTecnologia(reporte)}</strong>
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Datos de la cámara</h4>

              <div className="auditoria-modal-grid-pro">
                <div className="auditoria-info-card">
                  <span>Nombre cámara</span>
                  <strong>{obtenerNombreCamaraReporteTecnologia(reporte)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Tipo de intervención</span>
                  <strong>
                    {obtenerTipoIntervencionReporteTecnologia(reporte)}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Estado anterior</span>
                  <strong>{obtenerEstadoAnteriorReporteTecnologia(reporte)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Estado nuevo</span>
                  <strong>{obtenerEstadoNuevoReporteTecnologia(reporte)}</strong>
                </div>
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Diagnóstico técnico</h4>

              <div className="auditoria-detalle-box">
                <strong>Descripción técnica:</strong>{" "}
                {obtenerDescripcionTecnicaReporteTecnologia(reporte)}
                {"\n\n"}
                <strong>Diagnóstico:</strong>{" "}
                {obtenerDiagnosticoReporteTecnologia(reporte)}
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Acción realizada y resultado</h4>

              <div className="auditoria-detalle-box">
                <strong>Acción realizada:</strong>{" "}
                {obtenerAccionRealizadaReporteTecnologia(reporte)}
                {"\n\n"}
                <strong>Resultado:</strong>{" "}
                {obtenerResultadoReporteTecnologia(reporte)}
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Seguimiento técnico</h4>

              <div className="auditoria-modal-grid-pro">
                <div className="auditoria-info-card">
                  <span>Fecha seguimiento</span>
                  <strong>
                    {formatearFechaHora(
                      obtenerFechaSeguimientoReporteTecnologia(reporte)
                    )}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Resuelto GLPI</span>
                  <strong>{obtenerResueltoGlpiReporteTecnologia(reporte)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Usuario registro</span>
                  <strong>{obtenerUsuarioRegistroReporteTecnologia(reporte)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Rol registro</span>
                  <strong>{obtenerRolRegistroReporteTecnologia(reporte)}</strong>
                </div>
              </div>

              <div className="auditoria-detalle-box auditoria-detalle-box-separado">
                <strong>Observación seguimiento:</strong>{" "}
                {obtenerObservacionSeguimientoReporteTecnologia(reporte)}
              </div>
            </div>

            <div className="auditoria-modal-footer">
              <button onClick={onCerrar}>Cerrar detalle</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportesTecnologiaModal;