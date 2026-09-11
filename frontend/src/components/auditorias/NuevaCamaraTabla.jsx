import {
  formatearFechaHora,
  obtenerAccion,
  obtenerClaseAccion,
  obtenerDetalle,
  obtenerFechaHora,
  obtenerIdAuditoria,
  obtenerIdRegistro,
  obtenerRol,
  obtenerUsername,
} from "../../utils/auditoriasUtils";

function NuevaCamaraTabla({ auditorias, onVerDetalle }) {
  return (
    <div className="auditorias-tabla-contenedor">
      <table className="auditorias-tabla">
        <thead>
          <tr>
            <th>ID auditoría</th>
            <th>Fecha / hora</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acción</th>
            <th>ID cámara</th>
            <th>Detalle</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {auditorias.length > 0 ? (
            auditorias.map((auditoria) => (
              <tr key={obtenerIdAuditoria(auditoria)}>
                <td>{obtenerIdAuditoria(auditoria)}</td>
                <td>{formatearFechaHora(obtenerFechaHora(auditoria))}</td>
                <td>{obtenerUsername(auditoria)}</td>
                <td>{obtenerRol(auditoria)}</td>
                <td>
                  <span
                    className={`auditoria-badge ${obtenerClaseAccion(
                      obtenerAccion(auditoria)
                    )}`}
                  >
                    {obtenerAccion(auditoria)}
                  </span>
                </td>
                <td>{obtenerIdRegistro(auditoria)}</td>
                <td className="auditoria-detalle-celda">
                  {obtenerDetalle(auditoria)}
                </td>
                <td>
                  <button
                    className="btn-auditoria-detalle"
                    onClick={() => onVerDetalle(auditoria)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="auditorias-sin-datos">
                No se encontraron cámaras creadas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NuevaCamaraTabla;