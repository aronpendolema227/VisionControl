import { useLocation, useNavigate, useParams } from "react-router-dom";

import "../styles/camaras.css";
import "../styles/reportes.css";

function ReporteDetallePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idCamara } = useParams();

  const rol = localStorage.getItem("rol") || "LECTOR";
  const esSuperAdmin = rol === "SUPER_ADMIN";
  const puedeEditar = rol === "ANALISTA_TECNOLOGIA" || rol === "SUPER_ADMIN";

  const camaraGuardada = localStorage.getItem("reporteCamaraSeleccionada");

  const camara =
    location.state?.camara ||
    (camaraGuardada ? JSON.parse(camaraGuardada) : null);

  const camaraValida =
    camara && String(camara.idCamara) === String(idCamara);

  const mostrarValor = (valor) => {
    if (valor === null || valor === undefined || valor === "") {
      return "No registrado";
    }

    return valor;
  };

  const mostrarBooleano = (valor) => {
    if (valor === true) {
      return "Sí";
    }

    if (valor === false) {
      return "No";
    }

    return "No registrado";
  };

  const obtenerClaseEstadoReporte = (estado) => {
    const estadoNormalizado = (estado || "").toUpperCase().trim();

    if (estadoNormalizado === "OPERATIVA") {
      return "estado-reporte operativa";
    }

    if (estadoNormalizado === "NO OPERATIVA") {
      return "estado-reporte no-operativa";
    }

    if (
      estadoNormalizado === "FALLA TECNICA" ||
      estadoNormalizado === "FALLA TÉCNICA"
    ) {
      return "estado-reporte falla";
    }

    return "estado-reporte";
  };

  return (
    <div className="camaras-page">
      <aside className="camaras-sidebar">
        <div className="logo-box">
          <h1>ECU 911</h1>
          <span>Servicio Integrado de Seguridad</span>
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
          <button onClick={() => navigate("/camaras")}>🎥 Cámaras</button>
          <button onClick={() => navigate("/convenios")}>📄 Convenios</button>

          <button className="activo" onClick={() => navigate("/reportes")}>
            📑 Reportes
          </button>

          {esSuperAdmin && (
            <button onClick={() => navigate("/auditorias")}>
              📋 Auditorías
            </button>
          )}
        </nav>
      </aside>

      <main className="camaras-main">
        {!camaraValida ? (
          <section className="reporte-detalle-card">
            <h2>No se encontró el reporte seleccionado</h2>
            <p>
              Regresa a la lista de reportes y selecciona nuevamente una cámara.
            </p>

            <button
              type="button"
              className="btn-reporte-volver"
              onClick={() => navigate("/reportes")}
            >
              Volver a reportes
            </button>
          </section>
        ) : (
          <>
            <section className="reporte-detalle-hero">
              <div>
                <span>Reporte técnico de cámara</span>

                <h2>
                  {mostrarValor(camara.idPuntoOriginal)} -{" "}
                  {mostrarValor(camara.nombreCamara)}
                </h2>

                <p>
                  Información operativa, técnica y de seguimiento de la cámara
                  seleccionada.
                </p>
              </div>

              <div className="reporte-detalle-hero-actions">
                <span className={obtenerClaseEstadoReporte(camara.estadoActual)}>
                  {mostrarValor(camara.estadoActual)}
                </span>

                {puedeEditar && (
                  <button
                    type="button"
                    className="btn-reporte-editar"
                    onClick={() => navigate(`/reportes/editar/${idCamara}`)}
                  >
                    ✏️ Editar reporte
                  </button>
                )}

                <button
                  type="button"
                  className="btn-reporte-volver"
                  onClick={() => navigate("/reportes")}
                >
                  Volver
                </button>
              </div>
            </section>

            <section className="reporte-detalle-card">
              <div className="reporte-detalle-card-header">
                <div>
                  <h3>Información general</h3>
                  <p>Ubicación y datos principales de la cámara.</p>
                </div>
              </div>

              <div className="reporte-detalle-grid">
                <div>
                  <span>ID Punto</span>
                  <strong>{mostrarValor(camara.idPuntoOriginal)}</strong>
                </div>

                <div>
                  <span>Nombre cámara</span>
                  <strong>{mostrarValor(camara.nombreCamara)}</strong>
                </div>

                <div>
                  <span>Provincia</span>
                  <strong>{mostrarValor(camara.provincia)}</strong>
                </div>

                <div>
                  <span>Cantón</span>
                  <strong>{mostrarValor(camara.canton)}</strong>
                </div>

                <div className="reporte-detalle-full">
                  <span>Dirección</span>
                  <strong>{mostrarValor(camara.direccion)}</strong>
                </div>

                <div>
                  <span>A quién pertenece</span>
                  <strong>{mostrarValor(camara.aQuienPertenece)}</strong>
                </div>
              </div>
            </section>

            <section className="reporte-detalle-card">
              <div className="reporte-detalle-card-header">
                <div>
                  <h3>Información técnica</h3>
                  <p>Marca, modelo, instalación y cambio de cámara.</p>
                </div>
              </div>

              <div className="reporte-detalle-grid">
                <div>
                  <span>Marca</span>
                  <strong>{mostrarValor(camara.marca)}</strong>
                </div>

                <div>
                  <span>Modelo</span>
                  <strong>{mostrarValor(camara.modelo)}</strong>
                </div>

                <div>
                  <span>Fecha instalación</span>
                  <strong>{mostrarValor(camara.fechaInstalacion)}</strong>
                </div>

                <div>
                  <span>Cambio de cámara</span>
                  <strong>{mostrarValor(camara.cambioDeCamara)}</strong>
                </div>

                <div>
                  <span>Grupo operativo</span>
                  <strong>{mostrarValor(camara.grupoOperativo)}</strong>
                </div>

                <div>
                  <span>Analista</span>
                  <strong>{mostrarValor(camara.nombreAnalista)}</strong>
                </div>
              </div>
            </section>

            <section className="reporte-detalle-card">
              <div className="reporte-detalle-card-header">
                <div>
                  <h3>Revisión / Historial operativo</h3>
                  <p>Última revisión registrada para esta cámara.</p>
                </div>
              </div>

              <div className="reporte-detalle-grid">
                <div>
                  <span>Fecha revisión</span>
                  <strong>{mostrarValor(camara.fechaRevision)}</strong>
                </div>

                <div>
                  <span>Estado operativo</span>
                  <strong>{mostrarValor(camara.estadoOperativo)}</strong>
                </div>

                <div>
                  <span>Ticket GLPI</span>
                  <strong>{mostrarValor(camara.ticketGlpi)}</strong>
                </div>

                <div>
                  <span>Presenta daño</span>
                  <strong>{mostrarValor(camara.presentaDano)}</strong>
                </div>

                <div className="reporte-detalle-full">
                  <span>Observaciones</span>
                  <strong>{mostrarValor(camara.observaciones)}</strong>
                </div>

                <div className="reporte-detalle-full">
                  <span>Novedades</span>
                  <strong>{mostrarValor(camara.novedades)}</strong>
                </div>

                <div className="reporte-detalle-full">
                  <span>Descripción daño</span>
                  <strong>{mostrarValor(camara.descripcionDano)}</strong>
                </div>

                <div>
                  <span>Fecha seguimiento</span>
                  <strong>{mostrarValor(camara.fechaSeguimiento)}</strong>
                </div>

                <div>
                  <span>Detalle seguimiento</span>
                  <strong>{mostrarValor(camara.seguimientoDetalle)}</strong>
                </div>

                <div>
                  <span>Resuelto GLPI</span>
                  <strong>{mostrarBooleano(camara.resueltoGlpi)}</strong>
                </div>

                <div>
                  <span>Fecha solución</span>
                  <strong>{mostrarValor(camara.fechaSolucion)}</strong>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ReporteDetallePage;