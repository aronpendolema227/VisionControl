import {
  formatearFechaHora,
  obtenerAnalistaReporteOperacion,
  obtenerEstadoReporteOperacion,
  obtenerFechaRevisionReporteOperacion,
  obtenerIdCamaraReporteOperacion,
  obtenerIdPuntoReporteOperacion,
  obtenerIdReporteOperacion,
  obtenerNombreCamaraReporteOperacion,
  obtenerTicketReporteOperacion,
} from "../../utils/auditoriasUtils";

function ReportesOperacionesTabla({ reportes, onVerDetalle }) {
  return (
    <div className="auditorias-tabla-contenedor">
      <table className="auditorias-tabla">
        <thead>
          <tr>
            <th>ID reporte</th>
            <th>ID cámara</th>
            <th>ID punto</th>
            <th>Cámara</th>
            <th>Fecha revisión</th>
            <th>Estado operativo</th>
            <th>Ticket GLPI</th>
            <th>Analista</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {reportes.length > 0 ? (
            reportes.map((reporte) => (
              <tr key={obtenerIdReporteOperacion(reporte)}>
                <td>{obtenerIdReporteOperacion(reporte)}</td>
                <td>{obtenerIdCamaraReporteOperacion(reporte)}</td>
                <td>{obtenerIdPuntoReporteOperacion(reporte)}</td>
                <td>{obtenerNombreCamaraReporteOperacion(reporte)}</td>
                <td>
                  {formatearFechaHora(
                    obtenerFechaRevisionReporteOperacion(reporte)
                  )}
                </td>
                <td>
                  <span className="auditoria-badge actualizar">
                    {obtenerEstadoReporteOperacion(reporte)}
                  </span>
                </td>
                <td>{obtenerTicketReporteOperacion(reporte)}</td>
                <td>{obtenerAnalistaReporteOperacion(reporte)}</td>
                <td>
                  <button
                    className="btn-auditoria-detalle"
                    onClick={() => onVerDetalle(reporte)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="auditorias-sin-datos">
                No se encontraron reportes operativos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportesOperacionesTabla;