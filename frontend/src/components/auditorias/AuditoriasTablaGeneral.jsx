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

function AuditoriasTablaGeneral({ auditorias, onVerDetalle }) {
  return (
    <div className="auditorias-tabla-contenedor">
      <table className="auditorias-tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha / Hora</th>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Analista</th>
            <th>Grupo</th>
            <th>Rol</th>
            <th>Acción</th>
            <th>Módulo</th>
            <th>ID registro</th>
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
                <td>{obtenerNombreUsuarioAuditoria(auditoria)}</td>
                <td>{obtenerNombreAnalistaAuditoria(auditoria)}</td>
                <td>{obtenerGrupoOperativoAuditoria(auditoria)}</td>
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
                <td>{obtenerEntidad(auditoria)}</td>
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
              <td colSpan="12" className="auditorias-sin-datos">
                No se encontraron registros para esta sección.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AuditoriasTablaGeneral;