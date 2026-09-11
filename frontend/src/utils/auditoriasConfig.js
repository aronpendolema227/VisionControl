import {
  FaClipboardList,
  FaFileAlt,
  FaTools,
  FaExchangeAlt,
  FaEdit,
  FaPlusCircle,
  FaHistory,
  FaPowerOff,
} from "react-icons/fa";

export const MODULOS_AUDITORIA = [
  {
    id: "GENERAL",
    icono: FaClipboardList,
    titulo: "Auditoría general",
    descripcion: "Todas las acciones registradas.",
  },
  {
    id: "REPORTES_OPERACIONES",
    icono: FaFileAlt,
    titulo: "Reportes operaciones",
    descripcion: "Historial operativo y novedades.",
  },
  {
    id: "REPORTES_TECNOLOGIA",
    icono: FaTools,
    titulo: "Reportes tecnología",
    descripcion: "Intervenciones técnicas, GLPI y soporte.",
  },
  {
    id: "CAMBIO_CAMARA",
    icono: FaExchangeAlt,
    titulo: "Cambio de cámara",
    descripcion: "Cambios físicos o técnicos de cámara.",
  },
  {
    id: "EDICION_CAMARA",
    icono: FaEdit,
    titulo: "Edición de cámara",
    descripcion: "Actualizaciones de ficha de cámara.",
  },
  {
    id: "NUEVA_CAMARA",
    icono: FaPlusCircle,
    titulo: "Nueva cámara",
    descripcion: "Cámaras creadas desde el sistema.",
  },
  {
    id: "HISTORICO_CAMARA",
    icono: FaHistory,
    titulo: "Histórico de cámara",
    descripcion: "Intervenciones acumuladas por cámara.",
  },
  {
    id: "ELIMINADAS_DESACTIVADAS",
    icono: FaPowerOff,
    titulo: "Activaciones / desactivaciones",
    descripcion: "Registro de activación y desactivación de cámaras.",
  },
];