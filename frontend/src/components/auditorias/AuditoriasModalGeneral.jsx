import {
  formatearFechaHora,
  obtenerAccion,
  obtenerClaseAccion,
  obtenerDetalle,
  obtenerEntidad,
  obtenerFechaHora,
  obtenerGrupoOperativoAuditoria,
  obtenerIdAuditoria,
  obtenerIdRegistro,
  obtenerNombreAnalistaAuditoria,
  obtenerNombreUsuarioAuditoria,
  obtenerRol,
  obtenerUsername,
} from "../../utils/auditoriasUtils";

function AuditoriasModalGeneral({ auditoriaSeleccionada, onCerrar }) {
  if (!auditoriaSeleccionada) {
    return null;
  }

  return (
    <div className="auditoria-modal-overlay">
      <div className="auditoria-modal auditoria-modal-pro">
        <div className="auditoria-modal-top">
          <div>
            <h3>Detalle de auditoría</h3>
            <p>
              Registro #{obtenerIdAuditoria(auditoriaSeleccionada)} ·{" "}
              {formatearFechaHora(obtenerFechaHora(auditoriaSeleccionada))}
            </p>
          </div>

          <div className="auditoria-modal-top-actions">
            <span
              className={`auditoria-badge ${obtenerClaseAccion(
                obtenerAccion(auditoriaSeleccionada)
              )}`}
            >
              {obtenerAccion(auditoriaSeleccionada)}
            </span>

            <button onClick={onCerrar}>✕</button>
          </div>
        </div>

        <div className="auditoria-modal-highlight">
          <div className="auditoria-highlight-item">
            <span>Módulo</span>
            <strong>{obtenerEntidad(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>ID registro afectado</span>
            <strong>{obtenerIdRegistro(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>Usuario responsable</span>
            <strong>{obtenerUsername(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>Analista vinculado</span>
            <strong>{obtenerNombreAnalistaAuditoria(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>Rol</span>
            <strong>{obtenerRol(auditoriaSeleccionada)}</strong>
          </div>
        </div>

        <div className="auditoria-modal-section">
          <h4>Información del evento</h4>

          <div className="auditoria-modal-grid-pro">
            <div className="auditoria-info-card">
              <span>Fecha / hora</span>
              <strong>
                {formatearFechaHora(obtenerFechaHora(auditoriaSeleccionada))}
              </strong>
            </div>

            <div className="auditoria-info-card">
              <span>Usuario</span>
              <strong>{obtenerUsername(auditoriaSeleccionada)}</strong>
            </div>

            <div className="auditoria-info-card">
              <span>Nombre usuario</span>
              <strong>{obtenerNombreUsuarioAuditoria(auditoriaSeleccionada)}</strong>
            </div>

            <div className="auditoria-info-card">
              <span>Analista vinculado</span>
              <strong>{obtenerNombreAnalistaAuditoria(auditoriaSeleccionada)}</strong>
            </div>

            <div className="auditoria-info-card">
              <span>Grupo operativo</span>
              <strong>{obtenerGrupoOperativoAuditoria(auditoriaSeleccionada)}</strong>
            </div>

            <div className="auditoria-info-card">
              <span>Rol</span>
              <strong>{obtenerRol(auditoriaSeleccionada)}</strong>
            </div>

            <div className="auditoria-info-card">
              <span>Acción ejecutada</span>
              <strong>{obtenerAccion(auditoriaSeleccionada)}</strong>
            </div>

            <div className="auditoria-info-card">
              <span>Entidad / módulo</span>
              <strong>{obtenerEntidad(auditoriaSeleccionada)}</strong>
            </div>

            <div className="auditoria-info-card">
              <span>ID registro</span>
              <strong>{obtenerIdRegistro(auditoriaSeleccionada)}</strong>
            </div>
          </div>
        </div>

        <div className="auditoria-modal-section">
          <h4>Detalle registrado</h4>

          <div className="auditoria-detalle-box">
            {obtenerDetalle(auditoriaSeleccionada)}
          </div>
        </div>

        <div className="auditoria-modal-footer">
          <button onClick={onCerrar}>Cerrar detalle</button>
        </div>
      </div>
    </div>
  );
}

export default AuditoriasModalGeneral;