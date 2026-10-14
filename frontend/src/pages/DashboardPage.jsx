import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {MdDashboard} from "react-icons/md";
import logoDark from "../assets/logo.png";
import logoLight from "../assets/logo_light.png";
import UserHeaderActions from "../components/common/UserHeaderActions";
import{
  FaVideo,
  FaFileContract,
  FaClipboardList,

} from "react-icons/fa"

import "../styles/dashboard.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [temaClaro, setTemaClaro] = useState(
    document.body.classList.contains("theme-light")
  );

  const token = localStorage.getItem("token");

  const [resumen, setResumen] = useState({
    totalCamaras: 0,
    operativas: 0,
    noOperativas: 0,
    glpiActivos: 0,
    conectividad: 0,
    mantenimiento: 0,
  });

  const porcentajeOperativas =
    resumen.totalCamaras > 0
      ? ((resumen.operativas / resumen.totalCamaras) * 100).toFixed(1)
      : "0.0";


  const otrasNoOperativas =
    resumen.noOperativas - resumen.conectividad - resumen.mantenimiento;

  const totalDona =
    resumen.operativas +
    resumen.conectividad +
    resumen.mantenimiento +
    otrasNoOperativas;

  const gradosOperativas =
    totalDona > 0 ? (resumen.operativas / totalDona) * 360 : 0;

  const gradosConectividad =
    totalDona > 0 ? (resumen.conectividad / totalDona) * 360 : 0;

  const gradosMantenimiento =
    totalDona > 0 ? (resumen.mantenimiento / totalDona) * 360 : 0;

  const finOperativas = gradosOperativas;
  const finConectividad = finOperativas + gradosConectividad;
  const finMantenimiento = finConectividad + gradosMantenimiento;

  const estiloDona = {
    background: `conic-gradient(
      #22c55e 0deg ${finOperativas}deg,
      #eab308 ${finOperativas}deg ${finConectividad}deg,
      #f97316 ${finConectividad}deg ${finMantenimiento}deg,
      #ef4444 ${finMantenimiento}deg 360deg
    )`,
  };


  const username = localStorage.getItem("username") || "Usuario";
  const rol = localStorage.getItem("rol") || "LECTOR";
  const esSuperAdmin = rol === "SUPER_ADMIN";
  const esLector = rol === "LECTOR";

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const [ticketsUltimos7Dias, setTicketsUltimos7Dias] = useState([]);

  const hayTicketsUltimos7Dias = ticketsUltimos7Dias.some(
    (item) => item.total > 0
  );

  const maxTickets = Math.max(
    ...ticketsUltimos7Dias.map((item) => item.total),
    1
  );

  const puntosTicketsGlpi = ticketsUltimos7Dias.map((item, index) => {
    const cantidadDias = Math.max(ticketsUltimos7Dias.length - 1, 1);

    const x = 40 + (index / cantidadDias) * 620;
    const y = 175 - (item.total / maxTickets) * 130;

    return {
      ...item,
      x,
      y,
    };
  });

  const lineaTicketsGlpi = puntosTicketsGlpi
    .map((item) => `${item.x},${item.y}`)
    .join(" ");

  const areaTicketsGlpi =
    puntosTicketsGlpi.length > 0
      ? `40,185 ${lineaTicketsGlpi} ${
          puntosTicketsGlpi[puntosTicketsGlpi.length - 1].x
        },185`
      : "";
  

  const [rendimientoCantones, setRendimientoCantones] = useState([]);
  const [bitacoraReciente, setBitacoraReciente] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    let cancelado = false;

    const cargarResumen = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [
          responseResumen,
          responseTickets,
          responseCantones,
        ] = await Promise.all([
          axios.get("http://localhost:8081/api/dashboard/resumen", {
            headers,
          }),

          axios.get("http://localhost:8081/api/dashboard/tickets-ultimos-7-dias", {
            headers,
          }),

          axios.get("http://localhost:8081/api/dashboard/rendimiento-cantones", {
            headers,
          }),
        ]);

        if (!cancelado) {
          setResumen(responseResumen.data);
          setTicketsUltimos7Dias(responseTickets.data);
          setRendimientoCantones(responseCantones.data);
        }

        if (!esLector) {
          const responseBitacora = await axios.get(
            "http://localhost:8081/api/dashboard/bitacora-reciente",
            {
              headers,
            }
          );

          if (!cancelado) {
            setBitacoraReciente(responseBitacora.data);
          }
        } else {
          setBitacoraReciente([]);
        }
      } catch (error) {
        console.error("Error al cargar resumen del dashboard:", error);
      }
    };

    cargarResumen();

    return () => {
      cancelado = true;
    };
  }, [token, navigate, esLector]);

  useEffect(() => {
    const verificarTema = () => {
      setTemaClaro(document.body.classList.contains("theme-light"));
    };

    verificarTema();

    const observadorTema = new MutationObserver(verificarTema);

    observadorTema.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observadorTema.disconnect();
    };
  }, []);

  const obtenerColorBitacora = (accion) => {
    if (accion === "CREAR") return "verde";
    if (accion === "ACTUALIZAR") return "amarillo";
    if (accion === "ELIMINAR") return "rojo";
    return "azul";
  };

  const formatearFechaBitacora = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleString("es-EC", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (

    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <img
            src={temaClaro ? logoLight : logoDark}
            alt="VisionControl"
            className="dashboard-logo-img"
          />
        </div>

        <nav className="dashboard-menu">
          <button className="menu-item active" onClick={() => navigate("/dashboard")}>
            <MdDashboard className="menu-icon" />
            Dashboard
          </button>

          <button className="menu-item" onClick={() => navigate("/camaras")}>
            <FaVideo className="menu-icon" />
            Cámaras
          </button>

          <button className="menu-item" onClick={() => navigate("/convenios")}>
            <FaFileContract className="menu-icon" />
            Convenios
          </button>

          <button className="menu-item" onClick={() => navigate("/reportes")}>
            <FaClipboardList className="menu-icon" />
            Reportes
          </button>

          {esSuperAdmin && (
            <button className="menu-item" onClick={() => navigate("/auditorias")}>
              <FaClipboardList className="menu-icon" />
              Auditorías
            </button>
          )}
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <h2>Centro de Control - Resumen Operativo</h2>
            <p>Panel general del sistema de inventario de cámaras</p>
          </div>

          <UserHeaderActions
            username={username}
            rol={rol}
            onCerrarSesion={cerrarSesion}
          />
        </header>

        <section className="dashboard-cards">
          <div className="stat-card blue">
            <p>Total Cámaras</p>
            <h3>{resumen.totalCamaras}</h3>
            <span>Inventario general</span>
          </div>

          <div className="stat-card green">
            <p>Operativas</p>
            <h3>{resumen.operativas}</h3>
            <span>{porcentajeOperativas}% activas</span>
          </div>

          <div className="stat-card red">
            <p>No Operativas</p>
            <h3>{resumen.noOperativas}</h3>
            <span>Con novedades</span>
          </div>

          <div className="stat-card yellow">
            <p>GLPI Activos</p>
            <h3>{resumen.glpiActivos}</h3>
            <span>Tickets pendientes</span>
          </div>
        </section>

        <section className="dashboard-grid">
        <div className="dashboard-panel">
          <h3>Cámaras por Estado</h3>

          <div className="donut-layout">
            <div className="donut-chart" style={estiloDona}>
              <div className="donut-center">
                <strong>{resumen.totalCamaras}</strong>
                <span>Total</span>
              </div>
            </div>

            <div className="donut-legend">
              <div>
                <span className="legend-color operativa"></span>
                Operativas <b>{resumen.operativas}</b>
              </div>

              <div>
                <span className="legend-color conectividad"></span>
                Conectividad <b>{resumen.conectividad}</b>
              </div>

              <div>
                <span className="legend-color mantenimiento"></span>
                Mantenimiento <b>{resumen.mantenimiento}</b>
              </div>

              <div>
                <span className="legend-color no-operativa"></span>
                Otras no operativas <b>{otrasNoOperativas}</b>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-panel">
          <h3>Evolución Tickets GLPI</h3>

          {hayTicketsUltimos7Dias ? (
  <>
          <div className="tickets-line-card">
            <svg
              className="tickets-line-svg"
              viewBox="0 0 700 220"
              role="img"
              aria-label="Evolución de tickets GLPI en los últimos 7 días"
            >
              <line className="tickets-grid-line" x1="40" y1="45" x2="660" y2="45" />
              <line className="tickets-grid-line" x1="40" y1="90" x2="660" y2="90" />
              <line className="tickets-grid-line" x1="40" y1="135" x2="660" y2="135" />
              <line className="tickets-grid-line" x1="40" y1="180" x2="660" y2="180" />

              <polygon className="tickets-area" points={areaTicketsGlpi} />

              <polyline className="tickets-line-path" points={lineaTicketsGlpi} />

              {puntosTicketsGlpi.map((item) => (
                <g key={item.dia}>
                  <circle
                    className="tickets-point-glow"
                    cx={item.x}
                    cy={item.y}
                    r="11"
                  />

                  <circle
                    className="tickets-point"
                    cx={item.x}
                    cy={item.y}
                    r="5.5"
                  />

                  <text
                    className="tickets-point-value"
                    x={item.x}
                    y={item.y - 17}
                    textAnchor="middle"
                  >
                    {item.total}
                  </text>
                </g>
              ))}
            </svg>

            <div className="tickets-line-labels">
              {ticketsUltimos7Dias.map((item) => (
                <span key={item.dia}>{item.dia}</span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="sin-datos-chart">
          <p>Sin tickets GLPI registrados en los últimos 7 días</p>
        </div>
      )}
        </div>
      </section>





        <section className="dashboard-grid dashboard-grid-extra">
        <div className="dashboard-panel">
          
            <h3>Rendimiento por Cantón</h3>

            {rendimientoCantones.length > 0 ? (
              rendimientoCantones.map((item) => (
                <div
                  className={`canton-row ${item.porcentaje < 80 ? "alerta" : ""}`}
                  key={item.canton}
                >
                  <div>
                    <strong>{item.canton}</strong>
                    <p>
                      {item.operativas} óptimas / {item.caidas} caídas
                    </p>
                  </div>

                  <div className="barra">
                    <span style={{ width: `${item.porcentaje}%` }}></span>
                  </div>

                  <b>{item.porcentaje}%</b>
                </div>
              ))
            ) : (
              <p className="sin-datos-texto">
                No hay datos de rendimiento por cantón.
              </p>
            )}
        </div>


        {!esLector &&(
          <div className="dashboard-panel">
            <h3>Bitácora de Turno</h3>

            <div className="bitacora">
              {bitacoraReciente.length === 0 ? (
                <p className="dashboard-empty">
                  No hay acciones recientes registradas.
                </p>
              ) : (
                bitacoraReciente.slice(0, 14).map((item) => (
                  <div
                    className={`bitacora-item ${obtenerColorBitacora(item.accion)}`}
                    key={item.idAuditoria}
                  >
                    <span></span>

                    <p>
                      <small>{formatearFechaBitacora(item.fechaHora)}</small>
                      <br />

                      <strong>{item.username}</strong>{" "}
                      realizó la acción{" "}
                      <b>{item.accion}</b>{" "}
                      en{" "}
                      <b>{item.entidad}</b>.
                      <br />

                      {item.detalle}
                    </p>
                  </div>
                ))
              )}
            </div>
            
          </div>
        )}  



      </section>

      </main>
    </div>
  );
}

export default DashboardPage;