import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import UsuariosPage from "./pages/UsuariosPage";
import AnalistasPage from "./pages/AnalistasPage";
import CamarasPage from "./pages/CamarasPage";
import ConveniosPage from "./pages/ConveniosPage";
import AuditoriasPage from "./pages/AuditoriasPage";
import ReportesPage from "./pages/ReportesPage";
import ReporteDetallePage from "./pages/ReporteDetallePage";
import CamaraEditarPage from "./pages/CamaraEditarPage";

import CamaraNuevaPage from "./pages/CamaraNuevaPage";

import ReporteEditarPage from "./pages/ReporteEditarPage";
import ReporteNuevoPage from "./pages/ReporteNuevoPage";

import CamaraCambioPage from "./pages/CamaraCambioPage";

import CamaraEliminarPage from "./pages/CamaraEliminarPage";


const RutaSoloSuperAdmin = ({ children }) => {
  const rol = localStorage.getItem("rol");

  if (rol !== "SUPER_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/camaras" element={<CamarasPage />} />
        <Route path="/camaras/editar/:idCamara" element={<CamaraEditarPage />} />
        <Route path="/camaras/nueva" element={<CamaraNuevaPage />} />
        <Route path="/camaras/cambio/:idCamara" element={<CamaraCambioPage />} />
        <Route path="/camaras/cambio" element={<CamaraCambioPage />} />
        <Route
          path="/camaras/eliminar"
          element={
            <RutaSoloSuperAdmin>
              <CamaraEliminarPage />
            </RutaSoloSuperAdmin>
          }
        />
        
        <Route path="/convenios" element={<ConveniosPage />} />
        
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/reportes/camara/:idCamara" element={<ReporteDetallePage />} />
        <Route path="/reportes/editar/:idCamara" element={<ReporteEditarPage />} />
        <Route path="/reportes/nuevo" element={<ReporteNuevoPage />} />
        <Route path="/auditorias" element={<AuditoriasPage />} />

        <Route
          path="/usuarios"
          element={
            <RutaSoloSuperAdmin>
              <UsuariosPage />
            </RutaSoloSuperAdmin>
          }
        />

        <Route
          path="/analistas"
          element={
            <RutaSoloSuperAdmin>
              <AnalistasPage />
            </RutaSoloSuperAdmin>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;