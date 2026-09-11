import {
  formatearFechaHora,
  obtenerEstadoAnteriorMovimiento,
  obtenerEstadoNuevoMovimiento,
  obtenerEtiquetaMovimientoCamara,
  obtenerFechaMovimientoCamara,
  obtenerIdCamaraMovimiento,
  obtenerIdMovimientoCamara,
  obtenerIdPuntoMovimiento,
  obtenerMotivoMovimiento,
  obtenerNombreCamaraMovimiento,
  obtenerRolMovimiento,
  obtenerTipoMovimientoCamara,
  obtenerUsuarioMovimiento,
} from "../../utils/auditoriasUtils";

function EliminadasDesactivadasModal({ eliminacion, cargando, onCerrar }) {
  if (!eliminacion && !cargando) {
    return null;
  }

  const tipoMovimiento = obtenerTipoMovimientoCamara(eliminacion || {});
  const esReactivacion = tipoMovimiento === "REACTIVACION";
  const claseBadge = esReactivacion ? "crear" : "eliminar";

  return (
    <div className="auditoria-modal-overlay">
      <div className="auditoria-modal auditoria-modal-pro">
        <div className="auditoria-modal-top">
          <div>
            <h3>Detalle de activación / desactivación</h3>
            <p>
              {eliminacion
                ? `Registro #${obtenerIdMovimientoCamara(
                    eliminacion
                  )} · ${formatearFechaHora(
                    obtenerFechaMovimientoCamara(eliminacion)
                  )}`
                : "Cargando información..."}
            </p>
          </div>

          <div className="auditoria-modal-top-actions">
            <span className={`auditoria-badge ${claseBadge}`}>
              {eliminacion
                ? obtenerEtiquetaMovimientoCamara(eliminacion)
                : "CARGANDO"}
            </span>
            <button type="button" onClick={onCerrar}>
              ✕
            </button>
          </div>
        </div>

        {cargando && (
          <div className="auditoria-detalle-box">
            Cargando detalle del movimiento...
          </div>
        )}

        {!cargando && eliminacion && (
          <>
            <div className="auditoria-modal-highlight">
              <div className="auditoria-highlight-item">
                <span>Movimiento</span>
                <strong>{obtenerEtiquetaMovimientoCamara(eliminacion)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>ID cámara</span>
                <strong>{obtenerIdCamaraMovimiento(eliminacion)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>ID punto</span>
                <strong>{obtenerIdPuntoMovimiento(eliminacion)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>Cámara</span>
                <strong>{obtenerNombreCamaraMovimiento(eliminacion)}</strong>
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Comparación del estado</h4>

              <div className="auditoria-modal-grid-pro">
                <div className="auditoria-info-card">
                  <span>Estado anterior</span>
                  <strong>{obtenerEstadoAnteriorMovimiento(eliminacion)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Estado nuevo</span>
                  <strong>{obtenerEstadoNuevoMovimiento(eliminacion)}</strong>
                </div>
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>{esReactivacion ? "Detalle de reactivación" : "Motivo registrado"}</h4>

              <div className="auditoria-detalle-box">
                {obtenerMotivoMovimiento(eliminacion)}
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Responsable del movimiento</h4>

              <div className="auditoria-modal-grid-pro">
                <div className="auditoria-info-card">
                  <span>Usuario</span>
                  <strong>{obtenerUsuarioMovimiento(eliminacion)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Rol</span>
                  <strong>{obtenerRolMovimiento(eliminacion)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Fecha</span>
                  <strong>
                    {formatearFechaHora(
                      obtenerFechaMovimientoCamara(eliminacion)
                    )}
                  </strong>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="auditoria-modal-footer">
          <button type="button" onClick={onCerrar}>
            Cerrar detalle
          </button>
        </div>
      </div>
    </div>
  );
}

export default EliminadasDesactivadasModal;