import UserHeaderActions from "../common/UserHeaderActions";

function AuditoriasHeader({ username, rol, onCerrarSesion }) {
  return (
    <section className="auditorias-header">
      <div>
        <h2>Auditorías</h2>
        <p>Consulta, control e históricos del sistema.</p>
      </div>

      <UserHeaderActions
        username={username}
        rol={rol}
        onCerrarSesion={onCerrarSesion}
      />
    </section>
  );
}

export default AuditoriasHeader;