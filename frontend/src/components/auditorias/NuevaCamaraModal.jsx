import {
  formatearFechaHora,
  obtenerDetalle,
  obtenerFechaHora,
  obtenerIdAuditoria,
  obtenerIdRegistro,
  obtenerRol,
  obtenerUsername,
  obtenerValor,
} from "../../utils/auditoriasUtils";

function NuevaCamaraModal({
  auditoriaSeleccionada,
  detalleNuevaCamara,
  cargando,
  onCerrar,
}) {
  if (!auditoriaSeleccionada) {
    return null;
  }

  const obtenerCampoCamara = (campos, valorDefecto = "Sin dato") => {
    return obtenerValor(detalleNuevaCamara, campos, valorDefecto);
  };

  return (
    <div className="auditoria-modal-overlay">
      <div className="auditoria-modal auditoria-modal-pro">
        <div className="auditoria-modal-top">
          <div>
            <h3>Detalle de nueva cámara</h3>
            <p>
              Auditoría #{obtenerIdAuditoria(auditoriaSeleccionada)} ·{" "}
              {formatearFechaHora(obtenerFechaHora(auditoriaSeleccionada))}
            </p>
          </div>

          <div className="auditoria-modal-top-actions">
            <span className="auditoria-badge crear">CREAR</span>
            <button onClick={onCerrar}>✕</button>
          </div>
        </div>

        <div className="auditoria-modal-highlight">
          <div className="auditoria-highlight-item">
            <span>ID cámara</span>
            <strong>{obtenerIdRegistro(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>Usuario creador</span>
            <strong>{obtenerUsername(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>Rol</span>
            <strong>{obtenerRol(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>Fecha creación</span>
            <strong>
              {formatearFechaHora(obtenerFechaHora(auditoriaSeleccionada))}
            </strong>
          </div>
        </div>

        <div className="auditoria-modal-section">
          <h4>Detalle registrado en auditoría</h4>

          <div className="auditoria-detalle-box">
            {obtenerDetalle(auditoriaSeleccionada)}
          </div>
        </div>

        <div className="auditoria-modal-section">
          <h4>Ficha de cámara creada</h4>

          {cargando && (
            <div className="auditoria-detalle-box">
              Cargando información de la cámara...
            </div>
          )}

          {!cargando && detalleNuevaCamara && (
            <>
              <div className="auditoria-modal-grid-pro">
                <div className="auditoria-info-card">
                  <span>ID punto</span>
                  <strong>
                    {obtenerCampoCamara(["idPuntoOriginal", "id_punto_original"])}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Nombre cámara</span>
                  <strong>
                    {obtenerCampoCamara(["nombreCamara", "nombre_camara"])}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Provincia</span>
                  <strong>
                    {obtenerCampoCamara(["provincia", "nombreProvincia"])}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Cantón</span>
                  <strong>{obtenerCampoCamara(["canton", "nombreCanton"])}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Dirección IP</span>
                  <strong>
                    {obtenerCampoCamara(["direccionIp", "direccion_ip"])}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Estado actual</span>
                  <strong>
                    {obtenerCampoCamara(["estadoActual", "estado_actual"])}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Marca</span>
                  <strong>{obtenerCampoCamara(["marca", "nombreMarca"])}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Modelo</span>
                  <strong>{obtenerCampoCamara(["modelo", "nombreModelo"])}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Plataforma</span>
                  <strong>
                    {obtenerCampoCamara(["plataforma", "nombrePlataforma"])}
                  </strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Analista tecnología</span>
                  <strong>
                    {obtenerCampoCamara(["nombreAnalista", "analista"])}
                  </strong>
                </div>
              </div>

              <div className="auditoria-detalle-box auditoria-detalle-box-separado">
                <strong>Dirección:</strong>{" "}
                {obtenerCampoCamara(["direccion"], "Sin dirección")}
                {"\n\n"}
                <strong>Observaciones:</strong>{" "}
                {obtenerCampoCamara(["observaciones"], "Sin observaciones")}
              </div>
            </>
          )}

          {!cargando && !detalleNuevaCamara && (
            <div className="auditoria-detalle-box">
              No se encontró la ficha de la cámara asociada a esta auditoría.
            </div>
          )}
        </div>

        <div className="auditoria-modal-footer">
          <button onClick={onCerrar}>Cerrar detalle</button>
        </div>
      </div>
    </div>
  );
}

export default NuevaCamaraModal;