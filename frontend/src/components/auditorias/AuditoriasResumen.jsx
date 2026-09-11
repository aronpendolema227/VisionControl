import {
  FaClipboardList,
  FaUsers,
  FaVideo,
  FaFileAlt,
  FaTrashAlt,
} from "react-icons/fa";
function AuditoriasResumen({ resumen }) {
  return (
    <section className="auditorias-resumen-grid">
      <div className="auditoria-resumen-card">
        <span>
          <FaClipboardList />
        </span>
        <div>
          <p>Total eventos</p>
          <strong>{resumen.total}</strong>
        </div>
      </div>

      <div className="auditoria-resumen-card">
        <span>
          <FaUsers />
        </span>
        <div>
          <p>Usuarios</p>
          <strong>{resumen.usuarios}</strong>
        </div>
      </div>

      <div className="auditoria-resumen-card">
        <span>
          <FaVideo />
        </span>
        <div>
          <p>Cámaras</p>
          <strong>{resumen.camaras}</strong>
        </div>
      </div>

      <div className="auditoria-resumen-card">
        <span>
          <FaFileAlt />
        </span>
        <div>
          <p>Reportes</p>
          <strong>{resumen.reportes}</strong>
        </div>
      </div>

      <div className="auditoria-resumen-card">
        <span>
          <FaTrashAlt />
        </span>
        <div>
          <p>Eliminadas</p>
          <strong>{resumen.eliminadas}</strong>
        </div>
      </div>
    </section>
  );
}

export default AuditoriasResumen;