import {
  formatearFechaHora,
  obtenerCampoModificadoEdicion,
  obtenerDetalleEdicionCamara,
  obtenerFechaEdicionCamara,
  obtenerIdAnalistaEdicion,
  obtenerIdCamaraEdicion,
  obtenerIdEdicionCamara,
  obtenerIdPuntoEdicion,
  obtenerNombreAnalistaEdicion,
  obtenerNombreCamaraEdicion,
  obtenerRolRegistroEdicion,
  obtenerUsuarioRegistroEdicion,
  obtenerValorAnteriorEdicion,
  obtenerValorNuevoEdicion,
} from "../../utils/auditoriasUtils";

function EdicionCamaraModal({ edicion, cargando, onCerrar }) {
  if (!edicion && !cargando) {
    return null;
  }

  const esGrupo = edicion?.esGrupoEdicion && Array.isArray(edicion?.cambios);
  const cambios = esGrupo ? edicion.cambios : [];

  const tituloRegistro = esGrupo
    ? `Edición #${edicion.idGrupo}`
    : `Registro #${obtenerIdEdicionCamara(edicion)}`;

  return (
    <div className="auditoria-modal-overlay">
      <div className="auditoria-modal auditoria-modal-pro">
        <div className="auditoria-modal-top">
          <div>
            <h3>Detalle de edición de cámara</h3>
            <p>
              {edicion
                ? `${tituloRegistro} · ${formatearFechaHora(
                    obtenerFechaEdicionCamara(edicion)
                  )}`
                : "Cargando información..."}
            </p>
          </div>

          <div className="auditoria-modal-top-actions">
            <span className="auditoria-badge actualizar">ACTUALIZAR</span>
            <button onClick={onCerrar}>✕</button>
          </div>
        </div>

        {cargando && (
          <div className="auditoria-detalle-box">
            Cargando detalle de edición...
          </div>
        )}

        {!cargando && edicion && (
          <>
            <div className="auditoria-modal-highlight">
              <div className="auditoria-highlight-item">
                <span>Cambios realizados</span>
                <strong>
                  {esGrupo
                    ? `${cambios.length} campo(s)`
                    : obtenerCampoModificadoEdicion(edicion)}
                </strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>ID cámara</span>
                <strong>{obtenerIdCamaraEdicion(edicion)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>ID punto</span>
                <strong>{obtenerIdPuntoEdicion(edicion)}</strong>
              </div>

              <div className="auditoria-highlight-item">
                <span>Cámara</span>
                <strong>{obtenerNombreCamaraEdicion(edicion)}</strong>
              </div>
            </div>

            <div className="auditoria-modal-section">
              <h4>Comparación del cambio</h4>

              {esGrupo ? (
                <div className="auditoria-detalle-box">
                  <strong>
                    {tituloRegistro} - Cámara{" "}
                    {obtenerNombreCamaraEdicion(edicion)}
                  </strong>

                  <div className="auditoria-cambios-detalle">
                    {cambios.map((cambio) => (
                      <div
                        key={obtenerIdEdicionCamara(cambio)}
                        className="auditoria-cambio-item"
                      >
                        <span className="auditoria-badge actualizar">
                          {obtenerCampoModificadoEdicion(cambio)}
                        </span>

                        <p>
                          <strong>
                            {obtenerValorAnteriorEdicion(cambio)}
                          </strong>
                          {" → "}
                          <strong>{obtenerValorNuevoEdicion(cambio)}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="auditoria-modal-grid-pro">
                  <div className="auditoria-info-card">
                    <span>Valor anterior</span>
                    <strong>{obtenerValorAnteriorEdicion(edicion)}</strong>
                  </div>

                  <div className="auditoria-info-card">
                    <span>Valor nuevo</span>
                    <strong>{obtenerValorNuevoEdicion(edicion)}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="auditoria-modal-section">
              <h4>Responsable de la edición</h4>

              <div className="auditoria-modal-grid-pro">
                <div className="auditoria-info-card">
                  <span>Usuario</span>
                  <strong>{obtenerUsuarioRegistroEdicion(edicion)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Rol</span>
                  <strong>{obtenerRolRegistroEdicion(edicion)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>ID analista</span>
                  <strong>{obtenerIdAnalistaEdicion(edicion)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Analista</span>
                  <strong>{obtenerNombreAnalistaEdicion(edicion)}</strong>
                </div>

                <div className="auditoria-info-card">
                  <span>Fecha edición</span>
                  <strong>
                    {formatearFechaHora(obtenerFechaEdicionCamara(edicion))}
                  </strong>
                </div>
              </div>
            </div>

            {!esGrupo && (
              <div className="auditoria-modal-section">
                <h4>Detalle</h4>

                <div className="auditoria-detalle-box">
                  {obtenerDetalleEdicionCamara(edicion)}
                </div>
              </div>
            )}
          </>
        )}

        <div className="auditoria-modal-footer">
          <button onClick={onCerrar}>Cerrar detalle</button>
        </div>
      </div>
    </div>
  );
}

export default EdicionCamaraModal;