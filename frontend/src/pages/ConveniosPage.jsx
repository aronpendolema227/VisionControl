import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { MdDashboard } from "react-icons/md";
import UserHeaderActions from "../components/common/UserHeaderActions";
import {
  FaVideo,
  FaFileContract,
  FaClipboardList,
  FaEye,
} from "react-icons/fa";
import { obtenerResumenConvenios } from "../services/convenioService";
import {
  obtenerCamarasPorConvenio,
  obtenerFechasInicioConvenio,
} from "../services/camaraService";
import { obtenerProvincias } from "../services/provinciaService";
import { obtenerCantonesPorProvincia } from "../services/cantonService";
import "../styles/camaras.css";
import "../styles/convenios.css";

function ConveniosPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [resumen, setResumen] = useState({
    totalConvenios: 0,
    totalCamarasAsociadas: 0,
    totalProvinciasConConvenios: 0,
  });

  const [filtros, setFiltros] = useState({
    idProvincia: "",
    idCanton: "",
    estadoConvenio: "",
    fechaConvenioInicio: "",
  });

  const [provinciasDisponibles, setProvinciasDisponibles] = useState([]);
  const [cantonesDisponibles, setCantonesDisponibles] = useState([]);

  const [fechasInicioDisponibles, setFechasInicioDisponibles] = useState([]);

  const [camaras, setCamaras] = useState([]);
  const [camaraSeleccionada, setCamaraSeleccionada] = useState(null);

  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username") || "Usuario";
  const rol = localStorage.getItem("rol") || "LECTOR";
  const esSuperAdmin = rol === "SUPER_ADMIN";
  

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");

    navigate("/");
  };

  const size = 10;

  const obtenerValor = (valor) => {
    if (valor === null || valor === undefined || valor === "") {
      return "Sin dato";
    }

    return valor;
  };

  const formatearNumero = (valor) => {
    if (valor === null || valor === undefined) {
      return 0;
    }

    return Number(valor).toLocaleString("es-EC");
  };

  const obtenerNombreProvincia = (provincia) => {
    return (
      provincia.nombreProvincia ||
      provincia.nombre_provincia ||
      provincia.nombre ||
      provincia.provincia ||
      ""
    );
  };

  const obtenerIdProvincia = (provincia) => {
    return provincia.idProvincia || provincia.id_provincia || provincia.id || "";
  };

  const obtenerNombreCanton = (canton) => {
    return (
      canton.nombreCanton ||
      canton.nombre_canton ||
      canton.nombre ||
      canton.canton ||
      ""
    );
  };

  const obtenerIdCanton = (canton) => {
    return canton.idCanton || canton.id_canton || canton.id || "";
  };

  const obtenerClaseEstado = (estado) => {
    const texto = String(estado || "").toUpperCase();

    if (texto.includes("VIGENTE")) return "estado-operativa";
    if (texto.includes("VENCIDO")) return "estado-no-operativa";
    if (texto.includes("PENDIENTE")) return "estado-mantenimiento";
    if (texto.includes("NO APLICA")) return "estado-neutral";
    if (texto.includes("VARIOS")) return "estado-conectividad";

    return "estado-neutral";
  };

  const cargarResumen = async () => {
    try {
      const data = await obtenerResumenConvenios();

      setResumen({
        totalConvenios: data.totalConvenios || 0,
        totalCamarasAsociadas: data.totalCamarasAsociadas || 0,
        totalProvinciasConConvenios: data.totalProvinciasConConvenios || 0,
      });
    } catch (error) {
      console.error("Error al cargar resumen de convenios:", error);
    }
  };

  const cargarProvincias = async () => {
    try {
      const data = await obtenerProvincias();
      const lista = Array.isArray(data) ? data : data.content || [];
      setProvinciasDisponibles(lista);
    } catch (error) {
      console.error("Error al cargar provincias:", error);
      setProvinciasDisponibles([]);
    }
  };

  const cargarFechasInicioConvenio = async () => {
    try {
      const data = await obtenerFechasInicioConvenio();
      setFechasInicioDisponibles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar fechas de inicio de convenio:", error);
      setFechasInicioDisponibles([]);
    }
  };

  const cargarCantones = async (idProvincia) => {
    try {
      if (!idProvincia) {
        setCantonesDisponibles([]);
        return;
      }

      const data = await obtenerCantonesPorProvincia(idProvincia);
      const lista = Array.isArray(data) ? data : data.content || [];
      setCantonesDisponibles(lista);
    } catch (error) {
      console.error("Error al cargar cantones:", error);
      setCantonesDisponibles([]);
    }
  };

  const buscarCamaras = async (pagina = 0) => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerCamarasPorConvenio({
        ...filtros,
        page: pagina,
        size,
      });

      const lista = Array.isArray(data) ? data : data.content || [];

      setCamaras(lista);
      setPaginaActual(data.number || 0);
      setTotalPaginas(data.totalPages || 0);
      setTotalElementos(data.totalElements || lista.length);
    } catch (error) {
      console.error("Error al filtrar cámaras por convenio:", error);
      setError("No se pudieron cargar las cámaras por convenio.");
      setCamaras([]);
      setTotalPaginas(0);
      setTotalElementos(0);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      await Promise.all([
        cargarResumen(),
        cargarProvincias(),
        cargarFechasInicioConvenio(),
      ]);

      await buscarCamaras(0);
    };

    cargarDatosIniciales();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manejarCambioFiltro = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const manejarCambioProvincia = async (valor) => {
    setFiltros((prev) => ({
      ...prev,
      idProvincia: valor,
      idCanton: "",
    }));

    await cargarCantones(valor);
  };

  const limpiarFiltros = async () => {
    const filtrosLimpios = {
      idProvincia: "",
      idCanton: "",
      estadoConvenio: "",
      fechaConvenioInicio: "",
    };

    setFiltros(filtrosLimpios);
    setCantonesDisponibles([]);
    setCamaraSeleccionada(null);

    try {
      setCargando(true);
      setError("");

      const data = await obtenerCamarasPorConvenio({
        ...filtrosLimpios,
        page: 0,
        size,
      });

      const lista = Array.isArray(data) ? data : data.content || [];

      setCamaras(lista);
      setPaginaActual(data.number || 0);
      setTotalPaginas(data.totalPages || 0);
      setTotalElementos(data.totalElements || lista.length);
    } catch (error) {
      console.error("Error al limpiar filtros de convenio:", error);
      setError("No se pudieron cargar las cámaras por convenio.");
      setCamaras([]);
      setTotalPaginas(0);
      setTotalElementos(0);
    } finally {
      setCargando(false);
    }
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 0 || nuevaPagina >= totalPaginas) {
      return;
    }

    buscarCamaras(nuevaPagina);
  };

  const abrirDetalle = (camara) => {
    setCamaraSeleccionada(camara);
  };



  const cerrarDetalle = () => {
    setCamaraSeleccionada(null);
  };

  return (
    <div className="camaras-page convenios-page">
      <aside className="camaras-sidebar">
        <div className="logo-box">
          <img src={logo} alt="VisionControl" className="logo-box-img" />
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => navigate("/dashboard")}>
            <MdDashboard className= "sidebar-icon" />
            Dashboard</button>
          <button onClick={() => navigate("/camaras")}>
            <FaVideo className="sidebar-icon" />
            Cámaras</button>
          <button
            className={location.pathname.startsWith("/convenios") ? "activo" : ""}
            onClick={() => navigate("/convenios")}
          >
            <FaFileContract className="sidebar-icon" />
            Convenios
          </button>

          
          
          <button onClick={() => navigate("/reportes")}>
            <FaClipboardList className="sidebar-icon" />
            Reportes 
          </button>

          {esSuperAdmin && (
            <button onClick={() => navigate("/auditorias")}>
              <FaClipboardList className="sidebar-icon" />
              Auditorías
            </button>
          )}

          
        </nav>
      </aside>

      <main className="camaras-main">
        <section className="page-header header-superior">
          <div>
            <h2>Convenios</h2>
            <p>Consulta de cámaras por información de convenio.</p>
          </div>

          <UserHeaderActions
            username={username}
            rol={rol}
            onCerrarSesion={cerrarSesion}
          />
        </section>

        <section className="dashboard-cards">
          <div className="dashboard-card">
            <span>Total convenios</span>
            <strong>{formatearNumero(resumen.totalConvenios)}</strong>
            <small>Tipos registrados</small>
          </div>

          <div className="dashboard-card">
            <span>Cámaras asociadas</span>
            <strong>{formatearNumero(resumen.totalCamarasAsociadas)}</strong>
            <small>Inventario asociado</small>
          </div>

          <div className="dashboard-card">
            <span>Provincias con convenios</span>
            <strong>
              {formatearNumero(resumen.totalProvinciasConConvenios)}
            </strong>
            <small>Cobertura actual</small>
          </div>
        </section>

        <section className="tabla-panel">
          <div className="tabla-header">
            <div>
              <h3>Consulta de cámaras por convenio</h3>
              <p className="total-camaras">
                {formatearNumero(totalElementos)} cámaras encontradas
              </p>
            </div>
          </div>

          <div className="filtros-convenios">
            <select
              value={filtros.idProvincia}
              onChange={(e) => manejarCambioProvincia(e.target.value)}
            >
              <option value="">Todas las provincias</option>
              {provinciasDisponibles.map((provincia) => (
                <option
                  key={obtenerIdProvincia(provincia)}
                  value={obtenerIdProvincia(provincia)}
                >
                  {obtenerNombreProvincia(provincia)}
                </option>
              ))}
            </select>

            <select
              value={filtros.idCanton}
              onChange={(e) => manejarCambioFiltro("idCanton", e.target.value)}
              disabled={!filtros.idProvincia}
            >
              <option value="">Todos los cantones</option>
              {cantonesDisponibles.map((canton) => (
                <option key={obtenerIdCanton(canton)} value={obtenerIdCanton(canton)}>
                  {obtenerNombreCanton(canton)}
                </option>
              ))}
            </select>

            <select
              value={filtros.estadoConvenio}
              onChange={(e) =>
                manejarCambioFiltro("estadoConvenio", e.target.value)
              }
            >
              <option value="">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="NO APLICA">No aplica</option>
              <option value="VIGENTE">Vigente</option>
              <option value="VENCIDO">Vencido</option>
              <option value="SIN DATO">Sin dato</option>
            </select>

            <select
              value={filtros.fechaConvenioInicio}
              onChange={(e) =>
                manejarCambioFiltro("fechaConvenioInicio", e.target.value)
              }
            >
              <option value="">Todas las fechas de inicio</option>

              {fechasInicioDisponibles.map((fecha) => (
                <option key={fecha} value={fecha}>
                  {fecha}
                </option>
              ))}
            </select>

            <button onClick={() => buscarCamaras(0)}>Buscar</button>
            <button className="btn-limpiar" onClick={limpiarFiltros}>
              Limpiar
            </button>
          </div>

          {cargando && <p className="sin-datos">Cargando cámaras...</p>}
          {error && <p className="sin-datos">{error}</p>}

          {!cargando && !error && (
            <>
              <div className="tabla-contenedor">
                <table className="tabla-camaras">
                  <thead>
                    <tr>
                      <th>ID Punto</th>
                      <th>Cámara</th>
                      <th>Provincia</th>
                      <th>Cantón</th>
                      <th>Convenio</th>
                      <th>Inicio convenio</th>
                      
                      <th>Estado convenio</th>
                      <th>Proveedor enlace</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {camaras.length > 0 ? (
                      camaras.map((camara) => (
                        <tr key={camara.idCamara}>
                          <td>{obtenerValor(camara.idPuntoOriginal)}</td>
                          <td>{obtenerValor(camara.nombreCamara)}</td>
                          <td>{obtenerValor(camara.nombreProvincia)}</td>
                          <td>{obtenerValor(camara.nombreCanton)}</td>
                          <td>{obtenerValor(camara.nombreConvenio)}</td>
                          <td>{obtenerValor(camara.fechaConvenioInicio)}</td>
                          
                          <td>
                            <span
                              className={`estado-badge ${obtenerClaseEstado(
                                camara.estadoFechaConvenio
                              )}`}
                            >
                              {obtenerValor(camara.estadoFechaConvenio)}
                            </span>
                          </td>
                          <td>{obtenerValor(camara.proveedorEnlace)}</td>
                          <td>
                            <div className="acciones-tabla acciones-tabla-vertical">
                              <button
                                type="button"
                                className="btn-ver-convenio"
                                onClick={() => abrirDetalle(camara)}
                              >
                                <FaEye className="btn-icon" />
                                Ver
                              </button>

                              
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="10" className="sin-datos">
                          No se encontraron cámaras con esos filtros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="paginacion">
                <button
                  onClick={() => cambiarPagina(paginaActual - 1)}
                  disabled={paginaActual === 0}
                >
                  Anterior
                </button>

                <span>{paginaActual + 1}</span>

                <button
                  onClick={() => cambiarPagina(paginaActual + 1)}
                  disabled={paginaActual + 1 >= totalPaginas}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </section>

        {camaraSeleccionada && (
          <div className="modal-detalle-overlay">
            <div className="modal-detalle-camara">
              <div className="modal-detalle-header">
                <div>
                  <h3>Detalle de convenio</h3>
                  <p>{obtenerValor(camaraSeleccionada.nombreCamara)}</p>
                </div>

                <button onClick={cerrarDetalle}>✕</button>
              </div>

              <div className="detalle-grid">
                <div>
                  <span>ID Punto</span>
                  <strong>{obtenerValor(camaraSeleccionada.idPuntoOriginal)}</strong>
                </div>

                <div>
                  <span>Nombre cámara</span>
                  <strong>{obtenerValor(camaraSeleccionada.nombreCamara)}</strong>
                </div>

                <div>
                  <span>Provincia</span>
                  <strong>{obtenerValor(camaraSeleccionada.nombreProvincia)}</strong>
                </div>

                <div>
                  <span>Cantón</span>
                  <strong>{obtenerValor(camaraSeleccionada.nombreCanton)}</strong>
                </div>

                <div>
                  <span>Convenio</span>
                  <strong>{obtenerValor(camaraSeleccionada.nombreConvenio)}</strong>
                </div>

                <div>
                  <span>Dato original convenio</span>
                  <strong>
                    {obtenerValor(camaraSeleccionada.fechaConvenioOriginal)}
                  </strong>
                </div>

                <div>
                  <span>Fecha inicio convenio</span>
                  <strong>
                    {obtenerValor(camaraSeleccionada.fechaConvenioInicio)}
                  </strong>
                </div>

                <div>
                  <span>Fecha fin convenio</span>
                  <strong>{obtenerValor(camaraSeleccionada.fechaConvenioFin)}</strong>
                </div>

                <div>
                  <span>Estado fecha convenio</span>
                  <strong>
                    {obtenerValor(camaraSeleccionada.estadoFechaConvenio)}
                  </strong>
                </div>

                <div>
                  <span>Fecha inicial de pago</span>
                  <strong>{obtenerValor(camaraSeleccionada.fechaInicialPago)}</strong>
                </div>

                <div>
                  <span>Proveedor enlace</span>
                  <strong>{obtenerValor(camaraSeleccionada.proveedorEnlace)}</strong>
                </div>

                <div>
                  <span>Responsable pago</span>
                  <strong>{obtenerValor(camaraSeleccionada.responsablePago)}</strong>
                </div>

                <div>
                  <span>Costo enlace</span>
                  <strong>{obtenerValor(camaraSeleccionada.costoEnlace)}</strong>
                </div>

                <div>
                  <span>Dirección IP</span>
                  <strong>{obtenerValor(camaraSeleccionada.direccionIp)}</strong>
                </div>

                <div>
                  <span>Dirección</span>
                  <strong>{obtenerValor(camaraSeleccionada.direccion)}</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ConveniosPage;