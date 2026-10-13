import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt, FaBell } from "react-icons/fa";
import { obtenerResumenOperativo } from "../../services/reporteService";
import "../../styles/notificaciones.css";

function UserHeaderActions({ username, rol, onCerrarSesion }) {
  const navigate = useNavigate();
  const notificacionesRef = useRef(null);

  const [panelAbierto, setPanelAbierto] = useState(false);
  const [resumen, setResumen] = useState(null);
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false);

  const rolNormalizado = String(rol || "").toUpperCase();

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
        titulo: "Tickets GLPI activos",
        mensaje: `Existen ${glpiActivos} tickets GLPI pendientes de seguimiento.`,
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
        titulo: "Cámaras con novedades",
        mensaje: `Hay ${noOperativas} cámaras no operativas o con novedades registradas.`,
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

  const abrirNotificacion = (notificacion) => {
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

          {notificaciones.length > 0 && (
            <span className="notificaciones-badge">
              {notificaciones.length}
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
                    : `${notificaciones.length} notificaciones disponibles`}
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
                    className="notificacion-item"
                    onClick={() => abrirNotificacion(notificacion)}
                  >
                    <strong>{notificacion.titulo}</strong>
                    <span>{notificacion.mensaje}</span>

                    <small className={`notificacion-etiqueta ${notificacion.tipo}`}>
                      {notificacion.etiqueta}
                    </small>
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