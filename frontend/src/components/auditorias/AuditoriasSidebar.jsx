import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

import { MdDashboard } from "react-icons/md";
import {
  FaVideo,
  FaFileContract,
  FaClipboardList,
} from "react-icons/fa";

function AuditoriasSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="auditorias-sidebar">
      <div className="auditorias-logo">
        <img
          src={logo}
          alt="VisionControl"
          className="auditorias-logo-img"
        />
      </div>

      <nav className="auditorias-menu">
        <button onClick={() => navigate("/dashboard")}>
          <MdDashboard className="auditorias-sidebar-icon" />
          Dashboard
        </button>

        <button onClick={() => navigate("/camaras")}>
          <FaVideo className="auditorias-sidebar-icon" />
          Cámaras
        </button>

        <button onClick={() => navigate("/convenios")}>
          <FaFileContract className="auditorias-sidebar-icon" />
          Convenios
        </button>

        <button onClick={() => navigate("/reportes")}>
          <FaClipboardList className="auditorias-sidebar-icon" />
          Reportes
        </button>

        <button className="activo" onClick={() => navigate("/auditorias")}>
          <FaClipboardList className="auditorias-sidebar-icon" />
          Auditorías
        </button>
      </nav>
    </aside>
  );
}

export default AuditoriasSidebar;