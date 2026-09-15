import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  actualizarHistorialNovedad,
  obtenerUltimoHistorialPorCamara,
} from "../services/historialNovedadService";

import "../styles/camaras.css";
import "../styles/reportes.css";

function ReporteEditarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idCamara } = useParams();

  const rol = localStorage.getItem("rol") || "LECTOR";

  const puedeEditar = rol === "ANALISTA_TECNOLOGIA" || rol === "SUPER_ADMIN";

   const nombreUsuarioSesion =
    localStorage.getItem("nombre_completo") ||
    localStorage.getItem("username") ||
    "";


  const reporteGuardado = localStorage.getItem("reporteCamaraSeleccionada");

  const camaraInicial =
    location.state?.camara ||
    (reporteGuardado ? JSON.parse(reporteGuardado) : null);

  const [historialActual, setHistorialActual] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [formulario, setFormulario] = useState({
    fechaRevision: "",
    estadoOperativo: "",
    ticketGlpi: "",
    presentaDano: "",
    observaciones: "",
    novedades: "",
    descripcionDano: "",
    fechaSeguimiento: "",
    seguimientoDetalle: "",
    resueltoGlpi: "",
    fechaSolucion: "",
    idAnalista: "",
  });

  const mostrarValor = (valor) => {
    if (valor === null || valor === undefined || valor === "") {
      return "No registrado";
    }

    return valor;
  };

  const obtenerCampo = (objeto, campos) => {
    for (const campo of campos) {
      const valor = objeto?.[campo];

      if (valor !== null && valor !== undefined && valor !== "") {
        return valor;
      }
    }

    return "";
  };

  const normalizarFechaInput = (fecha) => {
    if (!fecha) {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
      return fecha.slice(0, 10);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      const [dia, mes, anio] = fecha.split("/");
      return `${anio}-${mes}-${dia}`;
    }

    return "";
  };

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setCargando(true);

        const historial = await obtenerUltimoHistorialPorCamara(idCamara);

        if (!historial) {
          setHistorialActual(null);
          return;
        }

        setHistorialActual(historial);

        setFormulario({
          fechaRevision: normalizarFechaInput(
            obtenerCampo(historial, ["fechaRevision", "fecha_revision"])
          ),
          estadoOperativo: obtenerCampo(historial, [
            "estadoOperativo",
            "estado_operativo",
          ]),
          ticketGlpi: obtenerCampo(historial, ["ticketGlpi", "ticket_glpi"]),
          presentaDano: obtenerCampo(historial, [
            "presentaDano",
            "presenta_dano",
          ]),
          observaciones: obtenerCampo(historial, ["observaciones"]),
          novedades: obtenerCampo(historial, ["novedades"]),
          descripcionDano: obtenerCampo(historial, [
            "descripcionDano",
            "descripcion_dano",
          ]),
          fechaSeguimiento: normalizarFechaInput(
            obtenerCampo(historial, ["fechaSeguimiento", "fecha_seguimiento"])
          ),
          seguimientoDetalle: obtenerCampo(historial, [
            "seguimientoDetalle",
            "seguimiento_detalle",
          ]),
          resueltoGlpi: String(
            obtenerCampo(historial, ["resueltoGlpi", "resuelto_glpi"])
          ),
          fechaSolucion: normalizarFechaInput(
            obtenerCampo(historial, ["fechaSolucion", "fecha_solucion"])
          ),
          idAnalista: obtenerCampo(historial, ["idAnalista", "id_analista"]),
        });
      } catch (error) {
        console.error("Error al cargar historial:", error);
        alert("No se pudo cargar el historial del reporte.");
      } finally {
        setCargando(false);
      }
    };

    cargarHistorial();
  }, [idCamara]);

  const manejarCambio = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const validarFormulario = () => {
    if (!formulario.fechaRevision) {
      alert("La fecha de revisión es obligatoria.");
      return false;
    }

    if (!formulario.estadoOperativo.trim()) {
      alert("El estado operativo es obligatorio.");
      return false;
    }

    if (!formulario.presentaDano) {
      alert("Debe indicar si presenta daño.");
      return false;
    }

    if (formulario.resueltoGlpi === "") {
      alert("Debe indicar si está resuelto en GLPI.");
      return false;
    }

    if (!formulario.idAnalista) {
      alert("No se encontró el analista del reporte.");
      return false;
    }

    return true;
  };

  const guardarCambios = async () => {
    if (!historialActual?.idNovedad) {
      alert("No se encontró el ID de la novedad para editar.");
      return;
    }

    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);

      const datosHistorial = {
        fechaRevision: formulario.fechaRevision,
        estadoOperativo: formulario.estadoOperativo.trim(),
        ticketGlpi: formulario.ticketGlpi.trim(),
        observaciones: formulario.observaciones.trim(),
        novedades: formulario.novedades.trim(),
        presentaDano: formulario.presentaDano,
        descripcionDano: formulario.descripcionDano.trim(),
        fechaSeguimiento: formulario.fechaSeguimiento || null,
        seguimientoDetalle: formulario.seguimientoDetalle.trim(),
        resueltoGlpi: formulario.resueltoGlpi === "true",
        fechaSolucion: formulario.fechaSolucion || null,
        idCamara: Number(idCamara),
        idAnalista: Number(formulario.idAnalista),
      };

      const historialGuardado = await actualizarHistorialNovedad(
        historialActual.idNovedad,
        datosHistorial
      );

      const camaraActualizada = {
        ...camaraInicial,
        fechaRevision: historialGuardado.fechaRevision,
        estadoOperativo: historialGuardado.estadoOperativo,
        ticketGlpi: historialGuardado.ticketGlpi,
        observaciones: historialGuardado.observaciones,
        novedades: historialGuardado.novedades,
        presentaDano: historialGuardado.presentaDano,
        descripcionDano: historialGuardado.descripcionDano,
        fechaSeguimiento: historialGuardado.fechaSeguimiento,
        seguimientoDetalle: historialGuardado.seguimientoDetalle,
        resueltoGlpi: historialGuardado.resueltoGlpi,
        fechaSolucion: historialGuardado.fechaSolucion,
        idAnalista: historialGuardado.idAnalista,
        nombreAnalista:
          historialGuardado.nombreAnalista || camaraInicial?.nombreAnalista,
      };

      localStorage.setItem(
        "reporteCamaraSeleccionada",
        JSON.stringify(camaraActualizada)
      );

      alert("Reporte actualizado correctamente.");

      navigate(`/reportes/camara/${idCamara}`, {
        state: {
          camara: camaraActualizada,
        },
      });
    } catch (error) {
      console.error("Error al actualizar reporte:", error);
      alert("No se pudo actualizar el reporte.");
    } finally {
      setGuardando(false);
    }
  };

  if (!puedeEditar) {
    return (
      <div className="camaras-page">
        <main className="camaras-main">
          <section className="reporte-detalle-card">
            <h2>Acceso no permitido</h2>
            <p>No tienes permisos para editar reportes.</p>

            <button
              type="button"
              className="btn-reporte-volver"
              onClick={() => navigate("/reportes")}
            >
              Volver a reportes
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="camaras-page">

      <main className="camaras-main">
        {cargando ? (
          <section className="reporte-detalle-card">
            <h2>Cargando reporte...</h2>
            <p>Espere un momento.</p>
          </section>
        ) : !camaraInicial ? (
          <section className="reporte-detalle-card">
            <h2>No se encontró la cámara seleccionada</h2>
            <p>Regresa al listado y selecciona nuevamente un reporte.</p>

            <button
              type="button"
              className="btn-reporte-volver"
              onClick={() => navigate("/reportes")}
            >
              Volver a reportes
            </button>
          </section>
        ) : !historialActual ? (
          <section className="reporte-detalle-card">
            <h2>Esta cámara no tiene historial para editar</h2>
            <p>
              Para esta cámara primero se debe crear un nuevo reporte o novedad.
            </p>

            <button
              type="button"
              className="btn-reporte-volver"
              onClick={() => navigate(`/reportes/camara/${idCamara}`)}
            >
              Volver
            </button>
          </section>
        ) : (
          <>
            <section className="reporte-detalle-hero">
              <div>
                <span>Editar reporte técnico</span>

                <h2>
                  {mostrarValor(camaraInicial.idPuntoOriginal)} -{" "}
                  {mostrarValor(camaraInicial.nombreCamara)}
                </h2>

                <p>
                  Actualiza la revisión, novedades, GLPI y seguimiento operativo.
                </p>
              </div>

              <div className="reporte-detalle-hero-actions">
                <button
                  type="button"
                  className="btn-reporte-volver"
                  onClick={() =>
                    navigate(`/reportes/camara/${idCamara}`, {
                      state: {
                        camara: camaraInicial,
                      },
                    })
                  }
                >
                  Volver
                </button>
              </div>
            </section>

            <section className="reporte-detalle-card">
              <div className="reporte-detalle-card-header">
                <div>
                  <h3>Información de la cámara</h3>
                  <p>Datos principales del punto seleccionado.</p>
                </div>
              </div>

              <div className="reporte-detalle-grid">
                <div>
                  <span>ID Punto</span>
                  <strong>{mostrarValor(camaraInicial.idPuntoOriginal)}</strong>
                </div>

                <div>
                  <span>Nombre cámara</span>
                  <strong>{mostrarValor(camaraInicial.nombreCamara)}</strong>
                </div>

                <div>
                  <span>Provincia</span>
                  <strong>{mostrarValor(camaraInicial.provincia)}</strong>
                </div>

                <div>
                  <span>Cantón</span>
                  <strong>{mostrarValor(camaraInicial.canton)}</strong>
                </div>

                <div className="reporte-detalle-full">
                  <span>Dirección</span>
                  <strong>{mostrarValor(camaraInicial.direccion)}</strong>
                </div>
              </div>
            </section>

            <section className="editar-camara-card">
              <div className="editar-camara-header">
                <div>
                  <h3>Datos del reporte</h3>
                  <p>Campos editables del historial operativo.</p>
                </div>
              </div>

              <div className="editar-camara-grid">
                <div className="campo-edicion">
                  
                  <label>Fecha revisión </label>
                  <input
                    type="date"
                    value={formulario.fechaRevision}
                    onChange={(e) =>
                      manejarCambio("fechaRevision", e.target.value)
                    } disabled
                  />
                </div>

                <div className="campo-edicion">
                  <label>Estado operativo </label>
                  <select
                    value={formulario.estadoOperativo}
                    onChange={(e) =>
                      manejarCambio("estadoOperativo", e.target.value)
                    }
                  >
                    <option value="">Seleccione estado</option>
                    <option value="OPERATIVA">OPERATIVA</option>
                    <option value="NO OPERATIVA">NO OPERATIVA</option>
                    <option value="FALLA TECNICA">FALLA TECNICA</option>
                    <option value="CONECTIVIDAD">CONECTIVIDAD</option>
                    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                  </select>
                </div>

                <div className="campo-edicion">
                  <label>Ticket GLPI</label>
                  <input
                    value={formulario.ticketGlpi}
                    onChange={(e) => manejarCambio("ticketGlpi", e.target.value)} disabled
                    placeholder="Ej: GLPI-0000"
                  />
                </div>

                <div className="campo-edicion">
                  <label>Presenta daño </label>
                  <select
                    value={formulario.presentaDano}
                    onChange={(e) =>
                      manejarCambio("presentaDano", e.target.value)
                    }
                  >
                    <option value="">Seleccione</option>
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </select>
                </div>

                <div className="campo-edicion">
                  <label>Fecha seguimiento</label>
                  <input
                    type="date"
                    value={formulario.fechaSeguimiento}
                    onChange={(e) =>
                      manejarCambio("fechaSeguimiento", e.target.value)
                    }
                  />
                </div>

                <div className="campo-edicion">
                  <label>Resuelto GLPI </label>
                  <select
                    value={formulario.resueltoGlpi}
                    onChange={(e) =>
                      manejarCambio("resueltoGlpi", e.target.value)
                    }
                  >
                    <option value="">Seleccione</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>

                <div className="campo-edicion">
                  <label>Fecha solución</label>
                  <input
                    type="date"
                    value={formulario.fechaSolucion}
                    onChange={(e) =>
                      manejarCambio("fechaSolucion", e.target.value)
                    }
                  />
                </div>

                <div className="campo-edicion">
                  <label>Analista responsable</label>
                  <input value={nombreUsuarioSesion} disabled />
                </div>

                <div className="campo-edicion">
                  <label>ID Analista </label>
                  <input type="number" value={formulario.idAnalista} disabled />
                </div>

                <div className="campo-edicion campo-edicion-full">
                  <label>Observaciones de video vigilancia</label>
                  <textarea
                    value={formulario.observaciones}
                    onChange={(e) =>
                      manejarCambio("observaciones", e.target.value)
                    } disabled
                    placeholder="Ingrese observaciones del reporte"
                  />
                </div>

                <div className="campo-edicion campo-edicion-full">
                  <label>Novedades</label>
                  <textarea
                    value={formulario.novedades}
                     onChange={(e) => manejarCambio("novedades", e.target.value)

                    } disabled
                    placeholder="Ingrese novedades encontradas"
                  />
                </div>

                <div className="campo-edicion campo-edicion-full">
                  <label>Descripción daño</label>
                  <textarea
                    value={formulario.descripcionDano}
                    onChange={(e) =>
                      manejarCambio("descripcionDano", e.target.value)
                    }
                    placeholder="Detalle del daño presentado"
                  />
                </div>

                <div className="campo-edicion campo-edicion-full">
                  <label>Detalle seguimiento</label>
                  <textarea
                    value={formulario.seguimientoDetalle}
                    onChange={(e) =>
                      manejarCambio("seguimientoDetalle", e.target.value)
                    }
                    placeholder="Detalle del seguimiento realizado"
                  />
                </div>
              </div>

              <div className="editar-camara-acciones">
                <button
                  type="button"
                  className="btn-volver-edicion"
                  onClick={() =>
                    navigate(`/reportes/camara/${idCamara}`, {
                      state: {
                        camara: camaraInicial,
                      },
                    })
                  }
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-guardar-edicion"
                  onClick={guardarCambios}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default ReporteEditarPage;