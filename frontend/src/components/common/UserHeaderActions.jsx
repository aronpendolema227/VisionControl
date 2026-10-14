import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaBell, FaSyncAlt, FaEraser } from "react-icons/fa";
import { obtenerNotificacionesPorRol } from "../../services/notificacionService";
import "../../styles/notificaciones.css";

const convertirStateJson = (stateJson) => {
  if (!stateJson) {
    return null;
  }

  try {
    return JSON.parse(stateJson);
  } catch (error) {
    console.error("Error al convertir stateJson de notificación:", error);
    return null;
  }
};

const obtenerTipoVisual = (tipo) => {
  if (tipo === "GLPI_ACTIVOS") {
    return "glpi";
  }

  if (tipo === "CAMARAS_CON_NOVEDAD") {
    return "camaras";
  }

  if (tipo === "NOVEDADES_CONECTIVIDAD") {
    return "conectividad";
  }

  if (tipo === "NOVEDADES_MANTENIMIENTO") {
    return "mantenimiento";
  }

  return "general";
};

const normalizarNotificacion = (notificacion) => {
  return {
    id: notificacion.idNotificacion || notificacion.tipo,
    lecturaId: notificacion.lecturaId,
    titulo: notificacion.titulo,
    mensaje: notificacion.mensaje,
    detalle: notificacion.detalle,
    accionTexto: notificacion.accionTexto,
    prioridad: notificacion.prioridad,
    etiqueta: notificacion.etiqueta,
    tipo: obtenerTipoVisual(notificacion.tipo),
    tipoOriginal: notificacion.tipo,
    ruta: notificacion.ruta,
    state: convertirStateJson(notificacion.stateJson),
    conteoActual: notificacion.conteoActual,
    fechaActualizacion: notificacion.fechaActualizacion,
  };
};

function UserHeaderActions({ username, rol, onCerrarSesion }) {
  const navigate = useNavigate();
  const notificacionesRef = useRef(null);

  const rolNormalizado = String(rol || "").toUpperCase();

  

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const [notificacionesLeidas, setNotificacionesLeidas] = useState([]);

  const cargarNotificaciones = useCallback(
    async ({ mostrarCarga = false, reiniciarLeidas = false } = {}) => {
      if (!rolNormalizado) {
        return;
      }

      try {
        if (mostrarCarga) {
          setCargandoNotificaciones(true);
        }

        const data = await obtenerNotificacionesPorRol(rolNormalizado);

        const notificacionesFormateadas = Array.isArray(data)
          ? data.map(normalizarNotificacion)
          : [];

        setNotificaciones(notificacionesFormateadas);
        setUltimaActualizacion(new Date());

        if (reiniciarLeidas) {
          setNotificacionesLeidas([]);
        }
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        if (mostrarCarga) {
          setCargandoNotificaciones(false);
        }
      }
    },
    [rolNormalizado]
  );

  useEffect(() => {
    const cargaInicial = setTimeout(() => {
      cargarNotificaciones({
        mostrarCarga: true,
        reiniciarLeidas: false,
      });
    }, 0);

    const intervaloNotificaciones = setInterval(() => {
      cargarNotificaciones({
        mostrarCarga: false,
        reiniciarLeidas: true,
      });
    }, 60000);

    return () => {
      clearTimeout(cargaInicial);
      clearInterval(intervaloNotificaciones);
    };
  }, [cargarNotificaciones]);

  useEffect(() => {
    if (!panelAbierto) return;

    const manejarClickFuera = (event) => {
      if (
        notificacionesRef.current &&
        !notificacionesRef.current.contains(event.target)
      ) {
        setPanelAbierto(false);
      }
    };

    const manejarEscape = (event) => {
      if (event.key === "Escape") {
        setPanelAbierto(false);
      }
    };

    document.addEventListener("mousedown", manejarClickFuera);
    document.addEventListener("keydown", manejarEscape);

    return () => {
      document.removeEventListener("mousedown", manejarClickFuera);
      document.removeEventListener("keydown", manejarEscape);
    };
  }, [panelAbierto]);

  const formatearUltimaActualizacion = (fecha) => {
    if (!fecha) {
      return "Sin actualizar";
    }

    return fecha.toLocaleTimeString("es-EC", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };


  const notificacionesNoLeidas = useMemo(() => {
    return notificaciones.filter(
      (notificacion) => !notificacionesLeidas.includes(notificacion.lecturaId)
    );
  }, [notificaciones, notificacionesLeidas]);

  const marcarNotificacionComoLeida = (notificacion) => {
    if (!notificacion.lecturaId) return;

    setNotificacionesLeidas((leidasActuales) => {
      if (leidasActuales.includes(notificacion.lecturaId)) {
        return leidasActuales;
      }

      return [...leidasActuales, notificacion.lecturaId];
    });
  };

  const limpiarNotificaciones = () => {
    const idsNotificacionesActuales = notificaciones
      .map((notificacion) => notificacion.lecturaId)
      .filter(Boolean);

    if (idsNotificacionesActuales.length === 0) return;

    setNotificacionesLeidas((leidasActuales) =>
      Array.from(new Set([...leidasActuales, ...idsNotificacionesActuales]))
    );
  };

  const actualizarNotificacionesManual = () => {
    cargarNotificaciones({
      mostrarCarga: true,
      reiniciarLeidas: true,
    });
  };

  const abrirNotificacion = (notificacion) => {
    marcarNotificacionComoLeida(notificacion);

    setPanelAbierto(false);

    navigate(notificacion.ruta, {
      state: notificacion.state || null,
    });
  };

  return (
    <div className="user-header-actions">
      <div className="notificaciones-wrapper" ref={notificacionesRef}>
        <button
          type="button"
          className="btn-notificaciones"
          title="Notificaciones"
          onClick={() => setPanelAbierto((valorActual) => !valorActual)}
        >
          <FaBell />

          {notificacionesNoLeidas.length > 0 && (
            <span className="notificaciones-badge">
              {notificacionesNoLeidas.length}
            </span>
          )}
        </button>

        {panelAbierto && (
          <div className="notificaciones-panel">
            <div className="notificaciones-header">
              <div>
                <h3>Notificaciones</h3>
                <p>
                  {cargandoNotificaciones
                    ? "Cargando información..."
                    : `${notificacionesNoLeidas.length} nuevas de ${notificaciones.length} disponibles`}
                </p>
                <small className="notificaciones-actualizacion">
                  Última actualización: {formatearUltimaActualizacion(ultimaActualizacion)}
                </small>
              </div>

              <div className="notificaciones-header-acciones">
                <button
                  type="button"
                  className="btn-accion-notificacion"
                  onClick={actualizarNotificacionesManual}
                  disabled={cargandoNotificaciones}
                  title="Actualizar notificaciones"
                  aria-label="Actualizar notificaciones"
                >
                  <FaSyncAlt />
                </button>

                {notificacionesNoLeidas.length > 0 && (
                  <button
                    type="button"
                    className="btn-accion-notificacion"
                    onClick={limpiarNotificaciones}
                    title="Limpiar notificaciones"
                    aria-label="Limpiar notificaciones"
                  >
                    <FaEraser />
                  </button>
                )}
              </div>
            </div>

            <div className="notificaciones-lista">
              {notificacionesNoLeidas.length === 0 ? (
                <div className="notificacion-vacia">
                  No hay notificaciones nuevas.
                </div>
              ) : (
                notificacionesNoLeidas.map((notificacion) => (
                  <button
                    key={notificacion.id || notificacion.lecturaId}
                    type="button"
                    className="notificacion-item nueva"
                    onClick={() => abrirNotificacion(notificacion)}
                  >
                    <div className="notificacion-top">
                      <strong>{notificacion.titulo}</strong>

                      <small className="notificacion-estado nueva">
                        Nueva
                      </small>
                    </div>

                    <span>{notificacion.mensaje}</span>

                    <p className="notificacion-detalle">
                      {notificacion.detalle}
                    </p>

                    <div className="notificacion-meta">
                      <small className={`notificacion-etiqueta ${notificacion.tipo}`}>
                        {notificacion.etiqueta}
                      </small>

                      <small className="notificacion-prioridad">
                        {notificacion.prioridad}
                      </small>
                    </div>

                    <div className="notificacion-accion">
                      {notificacion.accionTexto}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-user">
        <div className="user-avatar">
          <FaUserAlt />
        </div>

        <div>
          <strong>{username}</strong>
          <p>{rol}</p>
        </div>

        <button className="btn-salir" onClick={onCerrarSesion}>
          Salir
        </button>
      </div>
    </div>
  );
}

export default UserHeaderActions;