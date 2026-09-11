import {
  esAuditoriaCambioCamara,
  formatearFechaHora,
  obtenerAccion,
  obtenerClaseAccion,
  obtenerDetalle,
  obtenerEntidad,
  obtenerFechaHora,
  obtenerIdAuditoria,
  obtenerIdRegistro,
  obtenerRol,
  obtenerUsername,
  obtenerValor,
} from "../../utils/auditoriasUtils";

function CambioCamaraModal({
  auditoriaSeleccionada,
  detalleCambioCamara,
  cargando,
  onCerrar,
}) {
  if (
    !auditoriaSeleccionada ||
    !esAuditoriaCambioCamara(auditoriaSeleccionada)
  ) {
    return null;
  }

  const obtenerValorCambio = (campos) => {
    return obtenerValor(detalleCambioCamara, campos, "Sin dato");
  };

  const construirComparativo = () => {
    if (!detalleCambioCamara) {
      return [];
    }

    return [
      {
        campo: "Nombre cámara",
        anterior: obtenerValorCambio([
          "nombreCamaraAnterior",
          "nombre_camara_anterior",
        ]),
        nuevo: obtenerValorCambio([
          "nombreCamaraNueva",
          "nombre_camara_nueva",
        ]),
      },
      {
        campo: "Dirección IP",
        anterior: obtenerValorCambio(["ipAnterior", "ip_anterior"]),
        nuevo: obtenerValorCambio(["ipNueva", "ip_nueva"]),
      },
      {
        campo: "Estado",
        anterior: obtenerValorCambio(["estadoAnterior", "estado_anterior"]),
        nuevo: obtenerValorCambio(["estadoNuevo", "estado_nuevo"]),
      },
      {
        campo: "Tipo dispositivo",
        anterior: obtenerValorCambio([
          "tipoDispositivoAnterior",
          "tipo_dispositivo_anterior",
        ]),
        nuevo: obtenerValorCambio([
          "tipoDispositivoNuevo",
          "tipo_dispositivo_nuevo",
        ]),
      },
      {
        campo: "Marca",
        anterior: obtenerValorCambio(["marcaAnterior", "marca_anterior"]),
        nuevo: obtenerValorCambio(["marcaNueva", "marca_nueva"]),
      },
      {
        campo: "Modelo",
        anterior: obtenerValorCambio(["modeloAnterior", "modelo_anterior"]),
        nuevo: obtenerValorCambio([
          "modeloNueva",
          "modeloNuevo",
          "modelo_nuevo",
        ]),
      },
    ].filter(
      (item) => item.anterior !== "Sin dato" || item.nuevo !== "Sin dato"
    );
  };

  return (
    <div className="auditoria-modal-overlay">
      <div className="auditoria-modal auditoria-modal-pro">
        <div className="auditoria-modal-top">
          <div>
            <h3>Detalle de cambio de cámara</h3>
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
            <span>ID cambio</span>
            <strong>{obtenerIdRegistro(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>Usuario responsable</span>
            <strong>{obtenerUsername(auditoriaSeleccionada)}</strong>
          </div>

          <div className="auditoria-highlight-item">
            <span>Rol</span>
            <strong>{obtenerRol(auditoriaSeleccionada)}</strong>
          </div>
        </div>

        <div className="auditoria-modal-section">
          <h4>Detalle registrado en auditoría</h4>

          <div className="auditoria-detalle-box">
            {obtenerDetalle(auditoriaSeleccionada)}
          </div>
        </div>

        <div className="auditoria-modal-section">
          <h4>Información técnica del cambio</h4>

          {cargando && (
            <div className="auditoria-detalle-box">
              Cargando información técnica del cambio...
            </div>
          )}

          {!cargando && detalleCambioCamara && (
            <>
              <div className="auditoria-cambio-resumen">
                <div>
                  <span>Tipo de cambio</span>
                  <strong>
                    {obtenerValorCambio(["tipoCambio", "tipo_cambio"])}
                  </strong>
                </div>

                <div>
                  <span>Motivo</span>
                  <strong>
                    {obtenerValorCambio(["motivoCambio", "motivo_cambio"])}
                  </strong>
                </div>

                <div>
                  <span>Observación técnica</span>
                  <strong>
                    {obtenerValorCambio([
                      "observacionTecnica",
                      "observacion_tecnica",
                    ])}
                  </strong>
                </div>
              </div>

              <div className="auditoria-comparativo-tabla">
                <div className="auditoria-comparativo-header">
                  <span>Campo</span>
                  <span>Antes del cambio</span>
                  <span>Después del cambio</span>
                </div>

                {construirComparativo().map((item) => (
                  <div className="auditoria-comparativo-row" key={item.campo}>
                    <span>{item.campo}</span>
                    <strong className="valor-anterior">{item.anterior}</strong>
                    <strong className="valor-nuevo">{item.nuevo}</strong>
                  </div>
                ))}
              </div>
            </>
          )}

          {!cargando && !detalleCambioCamara && (
            <div className="auditoria-detalle-box">
              No se encontró el historial técnico asociado a esta auditoría.
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

export default CambioCamaraModal;