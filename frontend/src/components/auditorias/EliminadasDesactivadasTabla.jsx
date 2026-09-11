import {
  formatearFechaHora,
  obtenerEstadoNuevoMovimiento,
  obtenerEtiquetaMovimientoCamara,
  obtenerFechaMovimientoCamara,
  obtenerIdMovimientoCamara,
  obtenerNombreCamaraMovimiento,
  obtenerTipoMovimientoCamara,
  obtenerUsuarioMovimiento,
} from "../../utils/auditoriasUtils";

function EliminadasDesactivadasTabla({ eliminaciones, onVerDetalle }) {
  return (
    <div className="auditorias-tabla-contenedor tabla-activaciones-compacta">
      <table className="auditorias-tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Movimiento</th>
            <th>Cámara</th>
            <th>Estado actual</th>
            <th>Usuario</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {eliminaciones.length > 0 ? (
            eliminaciones.map((movimiento) => {
              const tipoMovimiento = obtenerTipoMovimientoCamara(movimiento);
              const claseBadge =
                tipoMovimiento === "REACTIVACION" ? "crear" : "eliminar";

              return (
                <tr
                  key={`${tipoMovimiento}-${obtenerIdMovimientoCamara(
                    movimiento
                  )}`}
                >
                  <td>{formatearFechaHora(obtenerFechaMovimientoCamara(movimiento))}</td>

                  <td>
                    <span className={`auditoria-badge ${claseBadge}`}>
                      {obtenerEtiquetaMovimientoCamara(movimiento)}
                    </span>
                  </td>

                  <td>{obtenerNombreCamaraMovimiento(movimiento)}</td>

                  <td>{obtenerEstadoNuevoMovimiento(movimiento)}</td>

                  <td>{obtenerUsuarioMovimiento(movimiento)}</td>

                  <td>
                    <button
                      type="button"
                      className="btn-auditoria-detalle"
                      onClick={() => onVerDetalle(movimiento)}
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="auditorias-sin-datos">
                No se encontraron activaciones o desactivaciones de cámara.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EliminadasDesactivadasTabla;