import {
  formatearFechaHora,
  obtenerAnalistaReporteTecnologia,
  obtenerEstadoAnteriorReporteTecnologia,
  obtenerEstadoNuevoReporteTecnologia,
  obtenerFechaIntervencionReporteTecnologia,
  obtenerIdCamaraReporteTecnologia,
  obtenerIdPuntoReporteTecnologia,
  obtenerIdReporteTecnologia,
  obtenerNombreCamaraReporteTecnologia,
  obtenerTicketReporteTecnologia,
  obtenerTipoIntervencionReporteTecnologia,
} from "../../utils/auditoriasUtils";

function ReportesTecnologiaTabla({ reportes, onVerDetalle }) {
  return (
    <div className="auditorias-tabla-contenedor">
      <table className="auditorias-tabla">
        <thead>
          <tr>
            <th>ID técnico</th>
            <th>ID cámara</th>
            <th>ID punto</th>
            <th>Cámara</th>
            <th>Fecha intervención</th>
            <th>Tipo intervención</th>
            <th>Estado anterior</th>
            <th>Estado nuevo</th>
            <th>Ticket GLPI</th>
            <th>Analista</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {reportes.length > 0 ? (
            reportes.map((reporte) => (
              <tr key={obtenerIdReporteTecnologia(reporte)}>
                <td>{obtenerIdReporteTecnologia(reporte)}</td>
                <td>{obtenerIdCamaraReporteTecnologia(reporte)}</td>
                <td>{obtenerIdPuntoReporteTecnologia(reporte)}</td>
                <td>{obtenerNombreCamaraReporteTecnologia(reporte)}</td>
                <td>
                  {formatearFechaHora(
                    obtenerFechaIntervencionReporteTecnologia(reporte)
                  )}
                </td>
                <td>
                  <span className="auditoria-badge actualizar">
                    {obtenerTipoIntervencionReporteTecnologia(reporte)}
                  </span>
                </td>
                <td>{obtenerEstadoAnteriorReporteTecnologia(reporte)}</td>
                <td>{obtenerEstadoNuevoReporteTecnologia(reporte)}</td>
                <td>{obtenerTicketReporteTecnologia(reporte)}</td>
                <td>{obtenerAnalistaReporteTecnologia(reporte)}</td>
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
              <td colSpan="11" className="auditorias-sin-datos">
                No se encontraron reportes técnicos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ReportesTecnologiaTabla;