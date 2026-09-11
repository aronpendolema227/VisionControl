
import { useEffect, useState } from "react";

import { obtenerAuditoriasPaginadas } from "../services/auditoriaService";
import { obtenerHistorialCambioCamaraPorId } from "../services/historialCambioCamaraService";
import {
  listarHistorialNovedadesPaginado,
  obtenerHistorialNovedadPorId,
} from "../services/historialNovedadService";
import {
  listarHistorialEdicionCamaraPaginado,
  obtenerHistorialEdicionCamaraPorId,
} from "../services/historialEdicionCamaraService";
import {
  listarHistorialTecnicoCamaraPaginado,
  obtenerHistorialTecnicoCamaraPorId,
} from "../services/historialTecnicoCamaraService";

import { MODULOS_AUDITORIA } from "../utils/auditoriasConfig";
import { obtenerCamaraPorId } from "../services/camaraService";
import {
  listarHistorialEliminacionCamaraPaginado,
  obtenerHistorialEliminacionCamaraPorId,
} from "../services/historialEliminacionCamaraService";
import {
  esAuditoriaCambioCamara,
  filtrarAuditorias,
  filtrarEdicionesCamara,
  filtrarReportesTecnologia,
  normalizarTexto,
  obtenerIdEdicionCamara,
  obtenerIdRegistro,
  obtenerResumenAuditorias,
  obtenerIdReporteOperacion,
  obtenerIdReporteTecnologia,
  filtrarEliminacionesCamara,
  obtenerIdEliminacionCamara,
  filtrarReactivacionesCamara,
  filtrarReportesOperaciones,
  normalizarDesactivacionesCamara,
  normalizarReactivacionesCamara,
  ordenarActivacionesDesactivaciones,
} from "../utils/auditoriasUtils";

function useAuditoriasData() {

  const [auditorias, setAuditorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [moduloActivo, setModuloActivo] = useState("GENERAL");

  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState(null);
  const [detalleCambioCamara, setDetalleCambioCamara] = useState(null);
  const [cargandoDetalleCambio, setCargandoDetalleCambio] = useState(false);

  const [reportesOperaciones, setReportesOperaciones] = useState([]);
  const [paginaReportesOperaciones, setPaginaReportesOperaciones] = useState(0);
  const [totalPaginasReportesOperaciones, setTotalPaginasReportesOperaciones] = useState(0);
  const [totalReportesOperaciones, setTotalReportesOperaciones] = useState(0);

  const [reporteOperacionSeleccionado, setReporteOperacionSeleccionado] =
    useState(null);

  const [cargandoDetalleReporteOperacion, setCargandoDetalleReporteOperacion] =
    useState(false);

  const [reportesTecnologia, setReportesTecnologia] = useState([]);
  const [reporteTecnologiaSeleccionado, setReporteTecnologiaSeleccionado] =
    useState(null);
  const [cargandoDetalleReporteTecnologia, setCargandoDetalleReporteTecnologia] =
    useState(false);
  
  const [nuevaCamaraAuditoriaSeleccionada, setNuevaCamaraAuditoriaSeleccionada] =
    useState(null);
  const [detalleNuevaCamara, setDetalleNuevaCamara] = useState(null);
  const [cargandoDetalleNuevaCamara, setCargandoDetalleNuevaCamara] =
    useState(false);
  const [edicionesCamara, setEdicionesCamara] = useState([]);
  
  const [edicionCamaraSeleccionada, setEdicionCamaraSeleccionada] =
    useState(null);
  const [cargandoDetalleEdicionCamara, setCargandoDetalleEdicionCamara] =
    useState(false);
  
  const [eliminacionesCamara, setEliminacionesCamara] = useState([]);
  const [eliminacionCamaraSeleccionada, setEliminacionCamaraSeleccionada] =
    useState(null);
  const [cargandoDetalleEliminacionCamara, setCargandoDetalleEliminacionCamara] =
    useState(false);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const textoBusqueda = normalizarTexto(busqueda);

  const auditoriasFiltradas =
  moduloActivo === "GENERAL"
    ? auditorias
    : filtrarAuditorias({
        auditorias,
        moduloActivo,
        textoBusqueda,
      });

  const reportesOperacionesFiltrados = filtrarReportesOperaciones({
    reportesOperaciones,
    moduloActivo,
    textoBusqueda,
  });

  const reportesTecnologiaFiltrados = filtrarReportesTecnologia({
    reportesTecnologia,
    moduloActivo,
    textoBusqueda,
  });

  const edicionesCamaraFiltradas = filtrarEdicionesCamara({
    edicionesCamara,
    moduloActivo,
    textoBusqueda,
  });

  const eliminacionesCamaraFiltradas = filtrarEliminacionesCamara({
    eliminacionesCamara,
    moduloActivo,
    textoBusqueda,
  });

  const reactivacionesCamaraFiltradas = filtrarReactivacionesCamara({
  auditorias,
  moduloActivo,
  textoBusqueda,
  });

  const activacionesDesactivacionesFiltradas =
    ordenarActivacionesDesactivaciones([
      ...normalizarDesactivacionesCamara(eliminacionesCamaraFiltradas),
      ...normalizarReactivacionesCamara(reactivacionesCamaraFiltradas),
    ]);

  const resumen = obtenerResumenAuditorias(auditorias);

  const moduloSeleccionado = MODULOS_AUDITORIA.find(
    (modulo) => modulo.id === moduloActivo
  );

  useEffect(() => {
    const cargarDatosAuditorias = async () => {
      setCargando(true);
      setError("");

      try {
        const [
          resultadoAuditorias,
          resultadoReportesOperaciones,
          resultadoReportesTecnologia,
          resultadoEdicionesCamara,
          resultadoEliminacionesCamara,
        ] = await Promise.allSettled([
          obtenerAuditoriasPaginadas(0, 200),
          listarHistorialNovedadesPaginado(0, 20),
          listarHistorialTecnicoCamaraPaginado(0, 200),
          listarHistorialEdicionCamaraPaginado(0, 500),
          listarHistorialEliminacionCamaraPaginado(0, 100),
        ]);

        if (resultadoAuditorias.status === "fulfilled") {
          const data = resultadoAuditorias.value;
          const lista = Array.isArray(data) ? data : data.content || [];
          setAuditorias(lista);
        } else {
          console.error(
            "No se pudo cargar auditoría general:",
            resultadoAuditorias.reason
          );
          setAuditorias([]);
        }

        if (resultadoReportesOperaciones.status === "fulfilled") {
          const data = resultadoReportesOperaciones.value;
          const lista = Array.isArray(data) ? data : data.content || [];

          setReportesOperaciones(lista);
          setPaginaReportesOperaciones(data.number || 0);
          setTotalPaginasReportesOperaciones(data.totalPages || 0);
          setTotalReportesOperaciones(data.totalElements || lista.length);
        } else {
          console.error(
            "No se pudieron cargar reportes operaciones:",
            resultadoReportesOperaciones.reason
          );
          setReportesOperaciones([]);
        }

        if (resultadoReportesTecnologia.status === "fulfilled") {
          const data = resultadoReportesTecnologia.value;
          const lista = Array.isArray(data) ? data : data.content || [];
          setReportesTecnologia(lista);
        } else {
          console.error(
            "No se pudieron cargar reportes tecnología:",
            resultadoReportesTecnologia.reason
          );
          setReportesTecnologia([]);
        }

        if (resultadoEdicionesCamara.status === "fulfilled") {
          const data = resultadoEdicionesCamara.value;
          const lista = Array.isArray(data) ? data : data.content || [];
          setEdicionesCamara(lista);
        } else {
          console.error(
            "No se pudo cargar historial de edición de cámara:",
            resultadoEdicionesCamara.reason
          );
          setEdicionesCamara([]);
        }

        if (resultadoEliminacionesCamara.status === "fulfilled") {
          const data = resultadoEliminacionesCamara.value;
          const lista = Array.isArray(data) ? data : data.content || [];
          setEliminacionesCamara(lista);
        } else {
          console.error(
            "No se pudo cargar historial de eliminación de cámara:",
            resultadoEliminacionesCamara.reason
          );
          setEliminacionesCamara([]);
        }

        if (
          resultadoAuditorias.status === "rejected" &&
          resultadoReportesOperaciones.status === "rejected" &&
          resultadoReportesTecnologia.status === "rejected" &&
          resultadoEdicionesCamara.status === "rejected" &&
          resultadoEliminacionesCamara.status === "rejected"
        ) {
          setError("No se pudieron cargar los datos de auditoría.");
        }
      } finally {
        setCargando(false);
      }
    };

    cargarDatosAuditorias();
  }, []);

  

  
  useEffect(() => {
    if (moduloActivo !== "GENERAL") {
      return;
    }

    const texto = busqueda.trim();

    const temporizador = setTimeout(async () => {
      try {
        const data = await obtenerAuditoriasPaginadas(0, 20, texto);
        const lista = Array.isArray(data) ? data : data.content || [];

        setAuditorias(lista);
      } catch (error) {
        console.error("Error al buscar auditorías:", error);
        setAuditorias([]);
      }
    }, texto.length > 0 ? 350 : 0);

    return () => clearTimeout(temporizador);
  }, [busqueda, moduloActivo]);


  const cargarPaginaReportesOperaciones = async (paginaNueva) => {
    if (paginaNueva < 0) {
      return;
    }

    try {
      setCargando(true);

      const data = await listarHistorialNovedadesPaginado(paginaNueva, 20);
      const lista = Array.isArray(data) ? data : data.content || [];

      setReportesOperaciones(lista);
      setPaginaReportesOperaciones(data.number || 0);
      setTotalPaginasReportesOperaciones(data.totalPages || 0);
      setTotalReportesOperaciones(data.totalElements || lista.length);
    } catch (error) {
      console.error("Error al cargar página de reportes operaciones:", error);
      setReportesOperaciones([]);
    } finally {
      setCargando(false);
    }
  };


  const limpiarBusqueda = () => {
    setBusqueda("");
  };

  const seleccionarModulo = (idModulo) => {
    setModuloActivo(idModulo);
    setBusqueda("");

    if (idModulo === "REPORTES_OPERACIONES") {
      cargarPaginaReportesOperaciones(0);
    }
  };

  const abrirDetalleAuditoria = async (auditoria) => {
    setAuditoriaSeleccionada(auditoria);
    setDetalleCambioCamara(null);

    if (!esAuditoriaCambioCamara(auditoria)) {
      return;
    }

    const idCambio = obtenerIdRegistro(auditoria);

    if (!idCambio || idCambio === "—") {
      return;
    }

    try {
      setCargandoDetalleCambio(true);

      const detalleCambio = await obtenerHistorialCambioCamaraPorId(idCambio);
      setDetalleCambioCamara(detalleCambio);
    } catch (error) {
      console.error("Error al cargar detalle de cambio de cámara:", error);
      setDetalleCambioCamara(null);
    } finally {
      setCargandoDetalleCambio(false);
    }
  };

  const cerrarDetalleAuditoria = () => {
    setAuditoriaSeleccionada(null);
    setDetalleCambioCamara(null);
  };

  const abrirDetalleReporteOperacion = async (reporte) => {
    const idReporte = obtenerIdReporteOperacion(reporte);

    if (!idReporte) {
      setReporteOperacionSeleccionado(reporte);
      return;
    }

    try {
      setCargandoDetalleReporteOperacion(true);

      const detalle = await obtenerHistorialNovedadPorId(idReporte);
      setReporteOperacionSeleccionado(detalle);
    } catch (error) {
      console.error("Error al cargar detalle del reporte operativo:", error);
      setReporteOperacionSeleccionado(reporte);
    } finally {
      setCargandoDetalleReporteOperacion(false);
    }
  };

  const cerrarDetalleReporteOperacion = () => {
    setReporteOperacionSeleccionado(null);
  };

  const abrirDetalleReporteTecnologia = async (reporte) => {
    const idTecnico = obtenerIdReporteTecnologia(reporte);

    if (!idTecnico) {
      setReporteTecnologiaSeleccionado(reporte);
      return;
    }

    try {
      setCargandoDetalleReporteTecnologia(true);

      const detalle = await obtenerHistorialTecnicoCamaraPorId(idTecnico);
      setReporteTecnologiaSeleccionado(detalle);
    } catch (error) {
      console.error("Error al cargar detalle del reporte técnico:", error);
      setReporteTecnologiaSeleccionado(reporte);
    } finally {
      setCargandoDetalleReporteTecnologia(false);
    }
  };

  const cerrarDetalleReporteTecnologia = () => {
    setReporteTecnologiaSeleccionado(null);
  };

  const abrirDetalleNuevaCamara = async (auditoria) => {
    setNuevaCamaraAuditoriaSeleccionada(auditoria);
    setDetalleNuevaCamara(null);

    const idCamara = obtenerIdRegistro(auditoria);

    if (!idCamara || idCamara === "—") {
      return;
    }

    try {
      setCargandoDetalleNuevaCamara(true);

      const detalle = await obtenerCamaraPorId(idCamara);
      setDetalleNuevaCamara(detalle);
    } catch (error) {
      console.error("Error al cargar detalle de nueva cámara:", error);
      setDetalleNuevaCamara(null);
    } finally {
      setCargandoDetalleNuevaCamara(false);
    }
  };

  const cerrarDetalleNuevaCamara = () => {
    setNuevaCamaraAuditoriaSeleccionada(null);
    setDetalleNuevaCamara(null);
  };

  
  
  const abrirDetalleEdicionCamara = async (edicion) => {
    if (edicion?.esGrupoEdicion) {
      setEdicionCamaraSeleccionada(edicion);
      return;
    }

    const idEdicion = obtenerIdEdicionCamara(edicion);

    if (!idEdicion) {
      setEdicionCamaraSeleccionada(edicion);
      return;
    }

    try {
      setCargandoDetalleEdicionCamara(true);

      const detalle = await obtenerHistorialEdicionCamaraPorId(idEdicion);
      setEdicionCamaraSeleccionada(detalle);
    } catch (error) {
      console.error("Error al cargar detalle de edición de cámara:", error);
      setEdicionCamaraSeleccionada(edicion);
    } finally {
      setCargandoDetalleEdicionCamara(false);
    }
  };

  const cerrarDetalleEdicionCamara = () => {
    setEdicionCamaraSeleccionada(null);
  };

  const abrirDetalleEliminacionCamara = async (eliminacion) => {
    if (eliminacion.tipoMovimiento === "REACTIVACION") {
      setEliminacionCamaraSeleccionada(eliminacion);
      return;
    }

    const idEliminacion = obtenerIdEliminacionCamara(eliminacion);

    if (!idEliminacion) {
      setEliminacionCamaraSeleccionada(eliminacion);
      return;
    }

    try {
      setCargandoDetalleEliminacionCamara(true);

      const detalle = await obtenerHistorialEliminacionCamaraPorId(idEliminacion);
      setEliminacionCamaraSeleccionada({
        ...detalle,
        tipoMovimiento: "DESACTIVACION",
      });
    } catch (error) {
      console.error("Error al cargar detalle de eliminación de cámara:", error);
      setEliminacionCamaraSeleccionada(eliminacion);
    } finally {
      setCargandoDetalleEliminacionCamara(false);
    }
  };

  const cerrarDetalleEliminacionCamara = () => {
    setEliminacionCamaraSeleccionada(null);
  };

  return {
    modulosAuditoria: MODULOS_AUDITORIA,

    busqueda,
    setBusqueda,
    limpiarBusqueda,

    moduloActivo,
    seleccionarModulo,
    moduloSeleccionado,

    cargando,
    error,

    resumen,

    auditoriasFiltradas,
    reportesOperacionesFiltrados,
    paginaReportesOperaciones,
    totalPaginasReportesOperaciones,
    totalReportesOperaciones,
    cargarPaginaReportesOperaciones,
    reportesTecnologiaFiltrados,

    auditoriaSeleccionada,
    detalleCambioCamara,
    cargandoDetalleCambio,
    abrirDetalleAuditoria,
    cerrarDetalleAuditoria,

    reporteOperacionSeleccionado,
    cargandoDetalleReporteOperacion,
    abrirDetalleReporteOperacion,
    cerrarDetalleReporteOperacion,

    reporteTecnologiaSeleccionado,
    cargandoDetalleReporteTecnologia,
    abrirDetalleReporteTecnologia,
    cerrarDetalleReporteTecnologia,
    nuevaCamaraAuditoriaSeleccionada,
    detalleNuevaCamara,
    cargandoDetalleNuevaCamara,
    abrirDetalleNuevaCamara,
    cerrarDetalleNuevaCamara,
    
    edicionesCamaraFiltradas,
    edicionCamaraSeleccionada,
    cargandoDetalleEdicionCamara,
    abrirDetalleEdicionCamara,
    cerrarDetalleEdicionCamara,

    eliminacionesCamaraFiltradas: activacionesDesactivacionesFiltradas,
    eliminacionCamaraSeleccionada,
    cargandoDetalleEliminacionCamara,
    abrirDetalleEliminacionCamara,
    cerrarDetalleEliminacionCamara,
  };
}

export default useAuditoriasData;