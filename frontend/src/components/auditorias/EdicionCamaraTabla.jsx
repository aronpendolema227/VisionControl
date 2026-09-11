import {
  formatearFechaHora,
  obtenerCampoModificadoEdicion,
  obtenerFechaEdicionCamara,
  obtenerIdCamaraEdicion,
  obtenerIdEdicionCamara,
  obtenerIdPuntoEdicion,
  obtenerNombreCamaraEdicion,
  obtenerRolRegistroEdicion,
  obtenerUsuarioRegistroEdicion,
  obtenerValorAnteriorEdicion,
  obtenerValorNuevoEdicion,
} from "../../utils/auditoriasUtils";

const obtenerFechaGrupo = (edicion) => {
  const fecha = obtenerFechaEdicionCamara(edicion);
  const fechaConvertida = new Date(fecha);

  if (Number.isNaN(fechaConvertida.getTime())) {
    return String(fecha || "");
  }

  return fechaConvertida.toISOString().slice(0, 16);
};

const obtenerNumeroId = (edicion) => {
  const id = Number(obtenerIdEdicionCamara(edicion));
  return Number.isNaN(id) ? 0 : id;
};

const agruparEdicionesCamara = (ediciones = []) => {
  const grupos = new Map();

  ediciones.forEach((edicion) => {
    const clave = [
      obtenerFechaGrupo(edicion),
      obtenerIdCamaraEdicion(edicion),
      obtenerUsuarioRegistroEdicion(edicion),
      obtenerRolRegistroEdicion(edicion),
    ].join("|");

    if (!grupos.has(clave)) {
      grupos.set(clave, {
        edicionPrincipal: edicion,
        cambios: [],
      });
    }

    const grupo = grupos.get(clave);
    grupo.cambios.push(edicion);

    if (obtenerNumeroId(edicion) > obtenerNumeroId(grupo.edicionPrincipal)) {
      grupo.edicionPrincipal = edicion;
    }
  });

  return Array.from(grupos.values())
    .map((grupo) => {
      const cambiosOrdenados = [...grupo.cambios].sort(
        (a, b) => obtenerNumeroId(a) - obtenerNumeroId(b)
      );

      const idGrupo = Math.max(...cambiosOrdenados.map(obtenerNumeroId));

      return {
        ...grupo.edicionPrincipal,
        esGrupoEdicion: true,
        idGrupo,
        cambios: cambiosOrdenados,
        cantidadCambios: cambiosOrdenados.length,
      };
    })
    .sort((a, b) => b.idGrupo - a.idGrupo);
};

function EdicionCamaraTabla({ ediciones, onVerDetalle }) {
  const edicionesAgrupadas = agruparEdicionesCamara(ediciones);

  return (
    <div className="auditorias-tabla-contenedor">
      <table className="auditorias-tabla">
        <thead>
          <tr>
            <th>Edición</th>
            <th>Fecha</th>
            <th>ID cámara</th>
            <th>ID punto</th>
            <th>Cámara</th>
            <th>Cambios realizados</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {edicionesAgrupadas.length > 0 ? (
            edicionesAgrupadas.map((grupo) => (
              <tr key={`grupo-edicion-${grupo.idGrupo}`}>
                <td>#{grupo.idGrupo}</td>

                <td>
                  {formatearFechaHora(obtenerFechaEdicionCamara(grupo))}
                </td>

                <td>{obtenerIdCamaraEdicion(grupo)}</td>
                <td>{obtenerIdPuntoEdicion(grupo)}</td>
                <td>{obtenerNombreCamaraEdicion(grupo)}</td>

                <td className="auditoria-detalle-celda">
                  <strong>{grupo.cantidadCambios} cambio(s)</strong>

                  <div className="auditoria-cambios-lista">
                    {grupo.cambios.slice(0, 4).map((cambio) => (
                      <div key={obtenerIdEdicionCamara(cambio)}>
                        <span className="auditoria-badge actualizar">
                          {obtenerCampoModificadoEdicion(cambio)}
                        </span>
                        {" "}
                        {obtenerValorAnteriorEdicion(cambio)} →{" "}
                        {obtenerValorNuevoEdicion(cambio)}
                      </div>
                    ))}

                    {grupo.cambios.length > 4 && (
                      <div>
                        + {grupo.cambios.length - 4} cambio(s) más...
                      </div>
                    )}
                  </div>
                </td>

                <td>{obtenerUsuarioRegistroEdicion(grupo)}</td>
                <td>{obtenerRolRegistroEdicion(grupo)}</td>

                <td>
                  <button
                    className="btn-auditoria-detalle"
                    onClick={() => onVerDetalle(grupo)}
                  >
                    Ver detalle
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="auditorias-sin-datos">
                No se encontraron ediciones de cámara.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EdicionCamaraTabla;