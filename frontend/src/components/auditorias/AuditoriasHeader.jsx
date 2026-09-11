import { FaUserAlt } from "react-icons/fa";
function AuditoriasHeader({ username, rol, onCerrarSesion }) {
  return (
    <section className="auditorias-header">
      <div>
        <h2>Auditorías</h2>
        <p>Consulta, control e históricos del sistema.</p>
      </div>

      <div className="auditorias-user">
        <div className="auditorias-avatar">
          <FaUserAlt />
        </div>

        <div>
          <strong>{username}</strong>
          <p>{rol}</p>
        </div>

        <button onClick={onCerrarSesion}>Salir</button>
      </div>
    </section>
  );
}

export default AuditoriasHeader;