import {
  formatearFechaHora,
  obtenerAnalistaReporteOperacion,
  obtenerDescripcionDanoReporteOperacion,
  obtenerDetalleSeguimientoReporteOperacion,
  obtenerEstadoReporteOperacion,
  obtenerFechaRevisionReporteOperacion,
  obtenerFechaSeguimientoReporteOperacion,
  obtenerIdCamaraReporteOperacion,
  obtenerIdPuntoReporteOperacion,
  obtenerIdReporteOperacion,
  obtenerNombreCamaraReporteOperacion,
  obtenerNovedadesReporteOperacion,
  obtenerObservacionesReporteOperacion,
  obtenerPresentaDanoReporteOperacion,
  obtenerResueltoGlpiReporteOperacion,
  obtenerTicketReporteOperacion,
} from "../../utils/auditoriasUtils";

function ReportesOperacionesModal({ reporte, cargando, onCerrar }) {
  if (!reporte) {
    return null;
  }

  return (
    <div className="auditoria-modal-overlay">
      <div className="auditoria-modal auditoria-modal-pro">
        <div className="auditoria-modal-top">
          <div>
            <h3>Detalle de reporte operativo</h3>
            <p>
              Reporte #{obtenerIdReporteOperacion(reporte)} ·{" "}
              {formatearFechaHora(obtenerFechaRevisionReporteOperacion(reporte))}
            </p>
          </div>

          <div className="auditoria-modal-top-actions">
            <span className="auditoria-badge actualizar">
              {obtenerEstadoReporteOperacion(reporte)}
            </span>

            <button onClick={onCerrar}>✕</button>
          </div>
        </div>

        {cargando && (
          <div className="auditoria-detalle-box">
            Cargando detalle del reporte operativo...
          </div>
        )}

        {!cargando && (
          <>
            <div className="auditoria-modal-highlight">
              <div className="auditoria-highlight-item">
                <span>ID cámara</span>
                <strong>{obtenerIdCamaraReporteOperacion(reporte)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>ID punto</span>
                <strong>{obtenerIdPuntoReporteOperacion(reporte)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>Ticket GLPI</span>
                <strong>{obtenerTicketReporteOperacion(reporte)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>Analista</span>
                <strong>{obtenerAnalistaReporteOperacion(reporte)}</strong>
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Datos de la cámara</h4>

              <div className="auditoria-modal-grid-pro">
                <div className="auditoria-info-card">
                  <span>Nombre cámara</span>
                  <strong>{obtenerNombreCamaraReporteOperacion(reporte)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Estado operativo</span>
                  <strong>{obtenerEstadoReporteOperacion(reporte)}</strong>
                </div>
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Novedad y observaciones</h4>

              <div className="auditoria-detalle-box">
                <strong>Novedades:</strong>{" "}
                {obtenerNovedadesReporteOperacion(reporte)}
                {"\n\n"}
                <strong>Observaciones:</strong>{" "}
                {obtenerObservacionesReporteOperacion(reporte)}
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Daño y seguimiento</h4>

              <div className="auditoria-modal-grid-pro">
                <div className="auditoria-info-card">
                  <span>Presenta daño</span>
                  <strong>{obtenerPresentaDanoReporteOperacion(reporte)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Descripción daño</span>
                  <strong>
                    {obtenerDescripcionDanoReporteOperacion(reporte)}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Fecha seguimiento</span>
                  <strong>
                    {formatearFechaHora(
                      obtenerFechaSeguimientoReporteOperacion(reporte)
                    )}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Resuelto GLPI</span>
                  <strong>{obtenerResueltoGlpiReporteOperacion(reporte)}</strong>
                </div>
              </div>

              <div className="auditoria-detalle-box auditoria-detalle-box-separado">
                <strong>Detalle seguimiento:</strong>{" "}
                {obtenerDetalleSeguimientoReporteOperacion(reporte)}
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

export default ReportesOperacionesModal;