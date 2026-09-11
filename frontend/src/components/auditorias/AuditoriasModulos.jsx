function AuditoriasModulos({ modulos, moduloActivo, onSeleccionarModulo }) {
  return (
    <section className="auditorias-modulos-panel">
      <div className="auditorias-section-title">
        <h3>Módulos de auditoría</h3>
        <p>Selecciona el histórico que deseas consultar.</p>
      </div>

      <div className="auditorias-modulos-grid">
        {modulos.map((modulo) => {
          const claseModulo = `modulo-${modulo.id.toLowerCase().replaceAll("_", "-")}`;
          const IconoModulo = modulo.icono;

          return (
            <button
              key={modulo.id}
              className={`auditoria-modulo-card ${claseModulo} ${
                moduloActivo === modulo.id ? "activo" : ""
              }`}
              onClick={() => onSeleccionarModulo(modulo.id)}
            >
              <span>
                {IconoModulo && <IconoModulo />}
              </span>

              <div>
                <strong>{modulo.titulo}</strong>
                <p>{modulo.descripcion}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default AuditoriasModulos;