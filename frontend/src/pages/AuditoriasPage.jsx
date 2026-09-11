import { useNavigate } from "react-router-dom";

import AuditoriasSidebar from "../components/auditorias/AuditoriasSidebar";
import AuditoriasHeader from "../components/auditorias/AuditoriasHeader";
import AuditoriasResumen from "../components/auditorias/AuditoriasResumen";
import AuditoriasModulos from "../components/auditorias/AuditoriasModulos";
import AuditoriasPanel from "../components/auditorias/AuditoriasPanel";
import AuditoriasModales from "../components/auditorias/AuditoriasModales";

import useAuditoriasData from "../hooks/useAuditoriasData";

import "../styles/auditorias.css";

function AuditoriasPage() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Usuario";
  const rol = localStorage.getItem("rol") || "LECTOR";

  const {
    modulosAuditoria,

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
    edicionesCamaraFiltradas,
    eliminacionesCamaraFiltradas,

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

    edicionCamaraSeleccionada,
    cargandoDetalleEdicionCamara,
    abrirDetalleEdicionCamara,
    cerrarDetalleEdicionCamara,

    eliminacionCamaraSeleccionada,
    cargandoDetalleEliminacionCamara,
    abrirDetalleEliminacionCamara,
    cerrarDetalleEliminacionCamara,

    nuevaCamaraAuditoriaSeleccionada,
    detalleNuevaCamara,
    cargandoDetalleNuevaCamara,
    abrirDetalleNuevaCamara,
    cerrarDetalleNuevaCamara,
  } = useAuditoriasData();

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="auditorias-page">
      <AuditoriasSidebar />

      <main className="auditorias-main">
        <AuditoriasHeader
          username={username}
          rol={rol}
          onCerrarSesion={cerrarSesion}
        />

        <AuditoriasResumen resumen={resumen} />

        <AuditoriasModulos
          modulos={modulosAuditoria}
          moduloActivo={moduloActivo}
          onSeleccionarModulo={seleccionarModulo}
        />

        <AuditoriasPanel
          moduloActivo={moduloActivo}
          moduloSeleccionado={moduloSeleccionado}
          busqueda={busqueda}
          onCambiarBusqueda={setBusqueda}
          onLimpiarBusqueda={limpiarBusqueda}
          cargando={cargando}
          error={error}
          auditoriasFiltradas={auditoriasFiltradas}
          reportesOperacionesFiltrados={reportesOperacionesFiltrados}
          paginaReportesOperaciones={paginaReportesOperaciones}
          totalPaginasReportesOperaciones={totalPaginasReportesOperaciones}
          totalReportesOperaciones={totalReportesOperaciones}
          onCambiarPaginaReportesOperaciones={cargarPaginaReportesOperaciones}
          reportesTecnologiaFiltrados={reportesTecnologiaFiltrados}
          edicionesCamaraFiltradas={edicionesCamaraFiltradas}
          eliminacionesCamaraFiltradas={eliminacionesCamaraFiltradas}
          onVerDetalleAuditoria={abrirDetalleAuditoria}
          onVerDetalleReporteOperacion={abrirDetalleReporteOperacion}
          onVerDetalleReporteTecnologia={abrirDetalleReporteTecnologia}
          onVerDetalleEdicionCamara={abrirDetalleEdicionCamara}
          onVerDetalleEliminacionCamara={abrirDetalleEliminacionCamara}
          onVerDetalleNuevaCamara={abrirDetalleNuevaCamara}
        />
      </main>

      <AuditoriasModales
        auditoriaSeleccionada={auditoriaSeleccionada}
        detalleCambioCamara={detalleCambioCamara}
        cargandoDetalleCambio={cargandoDetalleCambio}
        onCerrarAuditoria={cerrarDetalleAuditoria}
        reporteOperacionSeleccionado={reporteOperacionSeleccionado}
        cargandoDetalleReporteOperacion={cargandoDetalleReporteOperacion}
        onCerrarReporteOperacion={cerrarDetalleReporteOperacion}
        reporteTecnologiaSeleccionado={reporteTecnologiaSeleccionado}
        cargandoDetalleReporteTecnologia={cargandoDetalleReporteTecnologia}
        onCerrarReporteTecnologia={cerrarDetalleReporteTecnologia}
        edicionCamaraSeleccionada={edicionCamaraSeleccionada}
        cargandoDetalleEdicionCamara={cargandoDetalleEdicionCamara}
        onCerrarEdicionCamara={cerrarDetalleEdicionCamara}
        eliminacionCamaraSeleccionada={eliminacionCamaraSeleccionada}
        cargandoDetalleEliminacionCamara={cargandoDetalleEliminacionCamara}
        onCerrarEliminacionCamara={cerrarDetalleEliminacionCamara}
        nuevaCamaraAuditoriaSeleccionada={nuevaCamaraAuditoriaSeleccionada}
        detalleNuevaCamara={detalleNuevaCamara}
        cargandoDetalleNuevaCamara={cargandoDetalleNuevaCamara}
        onCerrarNuevaCamara={cerrarDetalleNuevaCamara}
      />
    </div>
  );
}

export default AuditoriasPage;