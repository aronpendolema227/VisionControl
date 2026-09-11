import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { obtenerCamarasFiltradas } from "../services/camaraService";
import {
  crearHistorialNovedad,
  listarHistorialNovedades,
} from "../services/historialNovedadService";

import "../styles/camaras.css";
import "../styles/reportes.css";

const obtenerFechaActualInput = () => {
  const hoy = new Date();

  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
};



function ReporteNuevoPage() {
  const navigate = useNavigate();

  const rol = localStorage.getItem("rol") || "LECTOR";
  
  const puedeEditar = rol === "ANALISTA_OPERACIONES" || rol === "SUPER_ADMIN";
  const idAnalistaSesion = localStorage.getItem("idAnalista") || "";
  const nombreUsuarioSesion =
    localStorage.getItem("nombre_completo") ||
    localStorage.getItem("username") ||
    "";

  const [camaras, setCamaras] = useState([]);
  const [idsCamarasConReporte, setIdsCamarasConReporte] = useState([]);

  const [cargandoCamaras, setCargandoCamaras] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [busquedaCamara, setBusquedaCamara] = useState("");
  const [filtroReporteCamara, setFiltroReporteCamara] = useState("TODAS");

  const [formulario, setFormulario] = useState({
    idCamara: "",
    busqueda: "",
    fechaRevision: obtenerFechaActualInput(),
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
    usuarioAlfanumerico: "",
    idAnalista: idAnalistaSesion,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargandoCamaras(true);

        const dataCamaras = await obtenerCamarasFiltradas({
          busqueda: "",
          page: 0,
          size: 1500,
        });

        const historial = await listarHistorialNovedades();

        const listaCamaras = dataCamaras.content || [];

        const idsConReporte = historial
          .map((item) => Number(item.idCamara))
          .filter((idCamara) => !Number.isNaN(idCamara));

        setCamaras(listaCamaras);
        setIdsCamarasConReporte(idsConReporte);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("No se pudieron cargar las cámaras o el historial.");
      } finally {
        setCargandoCamaras(false);
      }
    };

    cargarDatos();
  }, []);

  const manejarCambio = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const obtenerTextoCamara = (camara) => {
    return `${camara.idPuntoOriginal || ""} - ${camara.nombreCamara || ""} - ${
      camara.canton || ""
    } - ${camara.provincia || ""} - ${
      camara.estadoActual || camara.estadoOperativo || ""
    }`;
  };

  const camarasFiltradas = camaras.filter((camara) => {
    const idCamara = Number(camara.idCamara);
    const tieneReporte = idsCamarasConReporte.includes(idCamara);

    if (filtroReporteCamara === "SIN_REPORTE" && tieneReporte) {
      return false;
    }

    if (filtroReporteCamara === "CON_REPORTE" && !tieneReporte) {
      return false;
    }

    return true;
  });

  const manejarBusquedaCamara = (valor) => {
    setBusquedaCamara(valor);

    const camaraSeleccionada = camarasFiltradas.find(
      (camara) => obtenerTextoCamara(camara) === valor
    );

    if (camaraSeleccionada) {
      manejarCambio("idCamara", camaraSeleccionada.idCamara);
    } else {
      manejarCambio("idCamara", "");
    }
  };

  const validarFormulario = () => {
    if (!formulario.idCamara) {
      alert("Debe seleccionar una cámara.");
      return false;
    }

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

    

    if (!formulario.idAnalista) {
      alert(
        "Tu usuario no tiene un analista asignado. Revisa la configuración del usuario."
      );
      return false;
    }

    return true;
  };

  const guardarReporte = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      setGuardando(true);

      const datosReporte = {
        fechaRevision: formulario.fechaRevision || obtenerFechaActualInput(),
        estadoOperativo: formulario.estadoOperativo.trim(),
        ticketGlpi: formulario.ticketGlpi.trim(),
        observaciones: formulario.observaciones.trim(),
        novedades: formulario.novedades.trim(),
        presentaDano: formulario.presentaDano,
        descripcionDano: formulario.descripcionDano.trim(),
        fechaSeguimiento: formulario.fechaSeguimiento || null,
        seguimientoDetalle: formulario.seguimientoDetalle.trim(),
        resueltoGlpi: false,
        fechaSolucion: formulario.fechaSolucion || null,
        idCamara: Number(formulario.idCamara),
        idAnalista: Number(formulario.idAnalista),
        usuarioAlfanumerico: formulario.usuarioAlfanumerico.trim(),
      };

      await crearHistorialNovedad(datosReporte);

      alert("Reporte creado correctamente.");
      navigate("/reportes");
    } catch (error) {
      console.error("Error al crear reporte:", error);
      alert("No se pudo crear el reporte.");
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
            <p>No tienes permisos para crear reportes.</p>

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
    <div className="camaras-page reporte-nuevo-page">
      

      <main className="camaras-main">
        <section className="reporte-detalle-hero">
          <div>
            <span>Nuevo reporte técnico</span>
            <h2>Registrar reporte de cámara</h2>
            <p>
              Registra una nueva revisión, novedad o seguimiento operativo para
              una cámara.
            </p>
          </div>

          <div className="reporte-detalle-hero-actions">
            <button
              type="button"
              className="btn-reporte-volver"
              onClick={() => navigate("/reportes")}
            >
              Volver
            </button>
          </div>
        </section>

        <section className="editar-camara-card">
          <div className="editar-camara-header">
            <div>
              <h3>Datos del nuevo reporte</h3>
              <p>Campos obligatorios marcados con *</p>
            </div>
          </div>

          <div className="editar-camara-grid">

            <div className="campo-edicion campo-edicion-full">
              <label>Filtro de cámaras</label>
              <select
                value={filtroReporteCamara}
                onChange={(e) => {
                  setFiltroReporteCamara(e.target.value);
                  setBusquedaCamara("");
                  manejarCambio("idCamara", "");
                }}
              >
                <option value="TODAS">Todas las cámaras</option>
                <option value="SIN_REPORTE">Solo cámaras sin reporte</option>
                <option value="CON_REPORTE">Solo cámaras con reporte</option>
              </select>
            </div>

            <div className="campo-edicion campo-edicion-full">
              <label>Cámara </label>

              <input
                type="text"
                list="lista-camaras"
                value={busquedaCamara}
                onChange={(e) => manejarBusquedaCamara(e.target.value)}
                disabled={cargandoCamaras}
                placeholder={
                  cargandoCamaras
                    ? "Cargando cámaras..."
                    : "Escriba y seleccione una cámara"
                }
              />

              <datalist id="lista-camaras">
                {camarasFiltradas.map((camara) => (
                  <option key={camara.idCamara} value={obtenerTextoCamara(camara)} />
                ))}
              </datalist>

              {!cargandoCamaras && camarasFiltradas.length === 0 && (
                <small className="form-help">No hay cámaras para este filtro.</small>
              )}

              {busquedaCamara && !formulario.idCamara && (
                <small className="form-help">
                  Seleccione una cámara válida de la lista.
                </small>
              )}
            </div>

            <div className="campo-edicion">
              <label>Fecha revisión video vigilancia</label>
              <input
                type="date"
                value={formulario.fechaRevision}
                disabled
              />
              <small className="form-help">
                La fecha se asigna automáticamente al crear el reporte.
              </small>
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
                onChange={(e) => manejarCambio("ticketGlpi", e.target.value)}
                placeholder="Ej: GLPI-0000"
              />
            </div>

            <div className="campo-edicion">
              <label>Presenta daño </label>
              <select
                value={formulario.presentaDano}
                onChange={(e) => manejarCambio("presentaDano", e.target.value)}
              >
                <option value="">Seleccione</option>
                <option value="SI">SI</option>
                <option value="NO">NO</option>
              </select>
            </div>

            <div className="campo-edicion">
              <label>Analista responsable</label>
              <input value={nombreUsuarioSesion} disabled />
            </div>

            <div className="campo-edicion">
              <label>ID Analista </label>
              <input type="number" value={formulario.idAnalista} disabled />
            </div>

            <div className="campo-edicion">
              <label>Usuario alfanumérico</label>
              <input
                value={formulario.usuarioAlfanumerico}
                onChange={(e) => manejarCambio("usuarioAlfanumerico", e.target.value)}
                placeholder="Ingrese usuario alfanumérico"
              />
            </div>

            <div className="campo-edicion campo-edicion-full">
              <label>Observaciones de video vigilancia</label>
              <textarea
                value={formulario.observaciones}
                onChange={(e) => manejarCambio("observaciones", e.target.value)}
                placeholder="Ingrese observaciones del reporte"
              />
            </div>

            <div className="campo-edicion campo-edicion-full">
              <label>Novedades</label>
              <textarea
                value={formulario.novedades}
                onChange={(e) => manejarCambio("novedades", e.target.value)}
                placeholder="Ingrese novedades encontradas"
              />
            </div>
            
            

            
          </div>

          <div className="editar-camara-acciones">
            <button
              type="button"
              className="btn-volver-edicion"
              onClick={() => navigate("/reportes")}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="btn-guardar-edicion"
              onClick={guardarReporte}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar reporte"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ReporteNuevoPage;