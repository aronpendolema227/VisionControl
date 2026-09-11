import { esAuditoriaCambioCamara } from "../../utils/auditoriasUtils";
import AuditoriasModalGeneral from "./AuditoriasModalGeneral";
import ReportesOperacionesModal from "./ReportesOperacionesModal";
import ReportesTecnologiaModal from "./ReportesTecnologiaModal";
import CambioCamaraModal from "./CambioCamaraModal";
import NuevaCamaraModal from "./NuevaCamaraModal";
import EdicionCamaraModal from "./EdicionCamaraModal";
import EliminadasDesactivadasModal from "./EliminadasDesactivadasModal";

function AuditoriasModales({
  auditoriaSeleccionada,
  detalleCambioCamara,
  cargandoDetalleCambio,
  onCerrarAuditoria,

  reporteOperacionSeleccionado,
  cargandoDetalleReporteOperacion,
  onCerrarReporteOperacion,

  reporteTecnologiaSeleccionado,
  cargandoDetalleReporteTecnologia,
  onCerrarReporteTecnologia,
  nuevaCamaraAuditoriaSeleccionada,
  detalleNuevaCamara,
  cargandoDetalleNuevaCamara,
  onCerrarNuevaCamara,
  edicionCamaraSeleccionada,
  cargandoDetalleEdicionCamara,
  onCerrarEdicionCamara,
  eliminacionCamaraSeleccionada,
  cargandoDetalleEliminacionCamara,
  onCerrarEliminacionCamara,
}) {
  return (
    <>
      {auditoriaSeleccionada && !esAuditoriaCambioCamara(auditoriaSeleccionada) && (
        <AuditoriasModalGeneral
          auditoriaSeleccionada={auditoriaSeleccionada}
          onCerrar={onCerrarAuditoria}
        />
      )}

      <CambioCamaraModal
        auditoriaSeleccionada={auditoriaSeleccionada}
        detalleCambioCamara={detalleCambioCamara}
        cargando={cargandoDetalleCambio}
        onCerrar={onCerrarAuditoria}
      />

      <ReportesOperacionesModal
        reporte={reporteOperacionSeleccionado}
        cargando={cargandoDetalleReporteOperacion}
        onCerrar={onCerrarReporteOperacion}
      />

      <ReportesTecnologiaModal
        reporte={reporteTecnologiaSeleccionado}
        cargando={cargandoDetalleReporteTecnologia}
        onCerrar={onCerrarReporteTecnologia}
      />

      <NuevaCamaraModal
        auditoriaSeleccionada={nuevaCamaraAuditoriaSeleccionada}
        detalleNuevaCamara={detalleNuevaCamara}
        cargando={cargandoDetalleNuevaCamara}
        onCerrar={onCerrarNuevaCamara}
      />

      <EdicionCamaraModal
        edicion={edicionCamaraSeleccionada}
        cargando={cargandoDetalleEdicionCamara}
        onCerrar={onCerrarEdicionCamara}
      />

      <EliminadasDesactivadasModal
        eliminacion={eliminacionCamaraSeleccionada}
        cargando={cargandoDetalleEliminacionCamara}
        onCerrar={onCerrarEliminacionCamara}
      />

    </>

    
  );
}

export default AuditoriasModales;