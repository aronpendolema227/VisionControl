import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaBell } from "react-icons/fa";
import { obtenerResumenOperativo } from "../../services/reporteService";
import "../../styles/notificaciones.css";

function UserHeaderActions({ username, rol, onCerrarSesion }) {
  const navigate = useNavigate();
  const notificacionesRef = useRef(null);

  const rolNormalizado = String(rol || "").toUpperCase();

  const storageKeyNotificaciones = useMemo(() => {
    const usuarioSeguro = String(username || "usuario")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    return `visioncontrol_notificaciones_leidas_${usuarioSeguro}_${rolNormalizado}`;
  }, [username, rolNormalizado]);

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false);

  const [notificacionesLeidas, setNotificacionesLeidas] = useState(() => {
    try {
      const datosGuardados = localStorage.getItem(storageKeyNotificaciones);
      const leidas = datosGuardados ? JSON.parse(datosGuardados) : [];

      return Array.isArray(leidas) ? leidas : [];
    } catch (error) {
      console.error("Error al cargar notificaciones leídas:", error);
      return [];
    }
  });

  useEffect(() => {
    let activo = true;

    const cargarResumen = async () => {
      try {
        setCargandoNotificaciones(true);

        const data = await obtenerResumenOperativo();

        if (activo) {
          setResumen(data);
        }
      } catch (error) {
        console.error("Error al cargar notificaciones:", error);
      } finally {
        if (activo) {
          setCargandoNotificaciones(false);
        }
      }
    };

    cargarResumen();

    return () => {
      activo = false;
    };
  }, []);

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



  const notificaciones = useMemo(() => {
    const lista = [];

    const glpiActivos = Number(resumen?.glpiActivos || 0);
    const noOperativas = Number(resumen?.noOperativas || 0);

    const puedeVerGlpi =
      rolNormalizado === "SUPER_ADMIN" ||
      rolNormalizado === "ANALISTA_TECNOLOGIA" ||
      rolNormalizado === "ANALISTA_OPERACIONES";

    const puedeVerCamarasConNovedad =
      rolNormalizado === "SUPER_ADMIN" ||
      rolNormalizado === "ANALISTA_TECNOLOGIA" ||
      rolNormalizado === "ANALISTA_OPERACIONES";

    if (puedeVerGlpi && glpiActivos > 0) {
      lista.push({
        id: "glpi-activos",
        lecturaId: `glpi-activos-${glpiActivos}`,
        titulo: "Tickets GLPI activos",
        mensaje: `Existen ${glpiActivos} tickets GLPI pendientes de seguimiento.`,
        detalle: "Requiere revisión técnica o actualización del seguimiento.",
        accionTexto: "Ver reportes GLPI",
        prioridad: "Seguimiento técnico",
        etiqueta: "GLPI",
        tipo: "glpi",
        ruta: "/reportes",
        state: {
          filtroNotificacion: "GLPI_ACTIVOS",
          soloGlpiActivos: true,
        },
      });
    }

    if (puedeVerCamarasConNovedad && noOperativas > 0) {
      lista.push({
        id: "camaras-no-operativas",
        lecturaId: `camaras-no-operativas-${noOperativas}`,
        titulo: "Cámaras con novedades",
        mensaje: `Hay ${noOperativas} cámaras no operativas o con novedades registradas.`,
        detalle: "Requiere revisión operativa del estado de las cámaras.",
        accionTexto: "Ver cámaras filtradas",
        prioridad: "Control operativo",
        etiqueta: "CÁMARAS",
        tipo: "camaras",
        ruta: "/camaras",
        state: {
          filtroNotificacion: "CAMARAS_CON_NOVEDAD",
          estado: "NO OPERATIVA",
        },
      });
    }

    return lista;
  }, [resumen, rolNormalizado]);

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

      const nuevasLeidas = [...leidasActuales, notificacion.lecturaId];

      localStorage.setItem(
        storageKeyNotificaciones,
        JSON.stringify(nuevasLeidas)
      );

      return nuevasLeidas;
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
              </div>
            </div>

            <div className="notificaciones-lista">
              {notificaciones.length === 0 ? (
                <div className="notificacion-vacia">
                  No hay notificaciones pendientes.
                </div>
              ) : (
                notificaciones.map((notificacion) => (
                  <button
                    key={notificacion.id}
                    type="button"
                    className={`notificacion-item ${
                      notificacionesLeidas.includes(notificacion.lecturaId) ? "leida" : "nueva"
                    }`}
                    onClick={() => abrirNotificacion(notificacion)}
                  >
                    <div className="notificacion-top">
                      <strong>{notificacion.titulo}</strong>

                      <small
                        className={`notificacion-estado ${
                          notificacionesLeidas.includes(notificacion.lecturaId)
                            ? "leida"
                            : "nueva"
                        }`}
                      >
                        {notificacionesLeidas.includes(notificacion.lecturaId)
                          ? "Leída"
                          : "Nueva"}
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