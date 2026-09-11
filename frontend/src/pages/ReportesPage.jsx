import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { MdDashboard } from "react-icons/md";
import {
  FaVideo,
  FaFileContract,
  FaClipboardList,
  FaUserAlt,
  FaPlus,
  FaSearch,
  FaEraser,
  FaFileExcel,
  FaEye,
} from "react-icons/fa";

import {
  obtenerReporteCamaras,
  obtenerResumenOperativo,
} from "../services/reporteService";

import { obtenerProvincias } from "../services/provinciaService";
import { obtenerCantonesPorProvincia } from "../services/cantonService";
import { obtenerMarcas } from "../services/marcaService";

import "../styles/camaras.css";
import "../styles/reportes.css";
import { obtenerFechasInstalacion } from "../services/camaraService";
import * as XLSX from "xlsx";

function ReportesPage() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Usuario";
  const rol = localStorage.getItem("rol") || "LECTOR";
  const esSuperAdmin = rol === "SUPER_ADMIN";
  const puedeEditar = rol === "ANALISTA_OPERACIONES" || rol === "SUPER_ADMIN";

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");

    navigate("/");
  };

  const TAMANO_PAGINA = 20;

  const [resumen, setResumen] = useState(null);
  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [fechasInstalacion, setFechasInstalacion] = useState([]);

  const [camaras, setCamaras] = useState([]);


  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);

  const [cargando, setCargando] = useState(false);
  const [cargandoResumen, setCargandoResumen] = useState(true);
  const [error, setError] = useState("");

  const [filtros, setFiltros] = useState({
    idProvincia: "",
    idCanton: "",
    estadoActual: "",
    idMarca: "",
    fechaInstalacion: "",
    busquedaGeneral: "",
  });

  const [sugerenciasBusqueda, setSugerenciasBusqueda] = useState([]);
  const [mostrarSugerenciasBusqueda, setMostrarSugerenciasBusqueda] = useState(false);



  const cargarDatosIniciales = async () => {
    try {
      setError("");

      const [dataResumen, dataProvincias, dataMarcas, dataFechasInstalacion] =
      await Promise.all([
        obtenerResumenOperativo(),
        obtenerProvincias(),
        obtenerMarcas(),
        obtenerFechasInstalacion(),
      ]);

      setResumen(dataResumen);

      setProvincias(
        Array.isArray(dataProvincias)
          ? dataProvincias
          : dataProvincias.content || []
      );

      setMarcas(
        Array.isArray(dataMarcas)
          ? dataMarcas
          : dataMarcas.content || []
      );

      setFechasInstalacion(
        Array.isArray(dataFechasInstalacion)
          ? dataFechasInstalacion
          : dataFechasInstalacion.content || []
      );
    } catch (error) {
      console.error("Error al cargar datos iniciales de reportes:", error);
      setError("No se pudieron cargar los datos iniciales de reportes.");
    } finally {
      setCargandoResumen(false);
    }
  };

  const abrirReporte = (camara) => {
    localStorage.setItem("reporteCamaraSeleccionada", JSON.stringify(camara));

    navigate(`/reportes/camara/${camara.idCamara}`, {
      state: { camara },
    });
  };

  const cargarReporte = async (pagina = 0, filtrosActuales = filtros) => {
    try {
      setCargando(true);
      setError("");

      const data = await obtenerReporteCamaras(
        filtrosActuales,
        pagina,
        TAMANO_PAGINA
      );

      setCamaras(data.content || []);
      setTotalPaginas(data.totalPages || 0);
      setTotalElementos(data.totalElements || 0);
      setPaginaActual(data.number ?? pagina);
    } catch (error) {
      console.error("Error al cargar reporte de cámaras:", error);
      setError("No se pudo cargar el reporte de cámaras.");
      setCamaras([]);
      setTotalPaginas(0);
      setTotalElementos(0);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
  const iniciarReportes = async () => {
    await cargarDatosIniciales();
    await cargarReporte(0);
  };

  iniciarReportes();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const manejarCambioProvincia = async (idProvincia) => {
    const nuevosFiltros = {
      ...filtros,
      idProvincia,
      idCanton: "",
    };

    setFiltros(nuevosFiltros);
    setCantones([]);

    if (!idProvincia) {
      return;
    }

    try {
      const data = await obtenerCantonesPorProvincia(idProvincia);

      setCantones(Array.isArray(data) ? data : data.content || []);
    } catch (error) {
      console.error("Error al cargar cantones:", error);
      setCantones([]);
    }
  };

  const manejarFiltro = (campo, valor) => {
    setFiltros({
      ...filtros,
      [campo]: valor,
    });
  };

  useEffect(() => {
    const textoBusqueda = filtros.busquedaGeneral.trim();

    if (textoBusqueda.length < 2) {
      return;
    }

    const filtrosSugerencia = {
      idProvincia: filtros.idProvincia,
      idCanton: filtros.idCanton,
      estadoActual: filtros.estadoActual,
      idMarca: filtros.idMarca,
      fechaInstalacion: filtros.fechaInstalacion,
      busquedaGeneral: textoBusqueda,
    };

    const temporizador = setTimeout(async () => {
      try {
        const data = await obtenerReporteCamaras(filtrosSugerencia, 0, 8);

        setSugerenciasBusqueda(data.content || []);
      } catch (error) {
        console.error("Error al cargar sugerencias de búsqueda:", error);
        setSugerenciasBusqueda([]);
      }
    }, 350);

    return () => clearTimeout(temporizador);
  }, [
    filtros.busquedaGeneral,
    filtros.idProvincia,
    filtros.idCanton,
    filtros.estadoActual,
    filtros.idMarca,
    filtros.fechaInstalacion,
  ]);

  const manejarBuscar = () => {
    setMostrarSugerenciasBusqueda(false);
    cargarReporte(0, filtros);
  };

  const manejarLimpiar = () => {
    const filtrosLimpios = {
      idProvincia: "",
      idCanton: "",
      estadoActual: "",
      idMarca: "",
      fechaInstalacion: "",
      busquedaGeneral: "",
    };

    setFiltros(filtrosLimpios);
    setCantones([]);
    setSugerenciasBusqueda([]);
    setMostrarSugerenciasBusqueda(false);
    cargarReporte(0, filtrosLimpios);
  };

  const seleccionarSugerenciaBusqueda = (camara) => {
    const valorBusqueda =
      camara.nombreCamara ||
      camara.ticketGlpi ||
      camara.idPuntoOriginal?.toString() ||
      "";

    const filtrosActualizados = {
      ...filtros,
      busquedaGeneral: valorBusqueda,
    };

    setFiltros(filtrosActualizados);
    setSugerenciasBusqueda([]);
    setMostrarSugerenciasBusqueda(false);
    cargarReporte(0, filtrosActualizados);
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 0 || nuevaPagina >= totalPaginas) {
      return;
    }
    cargarReporte(nuevaPagina, filtros);
  };

  

  const obtenerIdProvincia = (provincia) => {
    return provincia.idProvincia || provincia.id_provincia || provincia.id;
  };

  const obtenerNombreProvincia = (provincia) => {
    return (
      provincia.nombreProvincia ||
      provincia.nombre_provincia ||
      provincia.nombre ||
      ""
    );
  };

  const obtenerIdCanton = (canton) => {
    return canton.idCanton || canton.id_canton || canton.id;
  };

  const obtenerNombreCanton = (canton) => {
    return canton.nombreCanton || canton.nombre_canton || canton.nombre || "";
  };

  const obtenerIdMarca = (marca) => {
    return marca.idMarca || marca.id_marca || marca.id;
  };

  const obtenerNombreMarca = (marca) => {
    return marca.nombreMarca || marca.nombre_marca || marca.nombre || "";
  };

  const mostrarValor = (valor) => {
    if (valor === null || valor === undefined || valor === "") {
      return "No registrado";
    }

    return valor;
  };

  const obtenerCampo = (objeto, nombresCampos) => {
  for (const nombreCampo of nombresCampos) {
    const valor = objeto?.[nombreCampo];

    if (valor !== null && valor !== undefined && valor !== "") {
      return valor;
    }
  }

  return "";
};

  const obtenerClaseEstadoReporte = (estado) => {
    const estadoNormalizado = (estado || "").toUpperCase().trim();

    if (estadoNormalizado === "OPERATIVA") {
      return "estado-reporte operativa";
    }

    if (estadoNormalizado === "NO OPERATIVA") {
      return "estado-reporte no-operativa";
    }

    if (estadoNormalizado === "FALLA TECNICA") {
      return "estado-reporte falla";
    }

    return "estado-reporte";
  };

  

const manejarDescargarExcel = async () => {
  try {
    setCargando(true);

    const TAMANO_EXPORTACION = 500;
    let pagina = 0;
    let totalPaginasExportacion = 1;
    let todasLasCamaras = [];

    do {
      const data = await obtenerReporteCamaras(
        filtros,
        pagina,
        TAMANO_EXPORTACION
      );

      const lista = Array.isArray(data) ? data : data.content || [];

      todasLasCamaras = [...todasLasCamaras, ...lista];
      totalPaginasExportacion = data.totalPages || 1;
      pagina++;
    } while (pagina < totalPaginasExportacion);

    if (todasLasCamaras.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const filasExcel = todasLasCamaras.map((camara) => ({
      "ID Punto": mostrarValor(camara.idPuntoOriginal),
      "Nombre cámara": mostrarValor(camara.nombreCamara),
      Provincia: mostrarValor(camara.provincia),
      Cantón: mostrarValor(camara.canton),
      "Estado actual": mostrarValor(camara.estadoActual),
      Marca: mostrarValor(camara.marca),
      Modelo: mostrarValor(camara.modelo),
      Plataforma: mostrarValor(
        obtenerCampo(camara, [
          "plataforma",
          "nombrePlataforma",
          "plataformaNombre",
          "nombre_plataforma",
        ])
      ),
      "Fecha instalación": mostrarValor(camara.fechaInstalacion),
      "Cambio de cámara": mostrarValor(camara.cambioDeCamara),
      "A quién pertenece": mostrarValor(
        obtenerCampo(camara, [
          "aQuienPertenece",
          "aquienPertenece",
          "AQuienPertenece",
          "a_quien_pertenece",
          "pertenece",
        ])
      ),
      Analista: mostrarValor(camara.nombreAnalista),
      "Grupo operativo": mostrarValor(camara.grupoOperativo),
      "Fecha revisión": mostrarValor(camara.fechaRevision),
      "Estado operativo": mostrarValor(camara.estadoOperativo),
      "Ticket GLPI": mostrarValor(camara.ticketGlpi),
      Observaciones: mostrarValor(camara.observaciones),
      Novedades: mostrarValor(camara.novedades),
      "Presenta daño": mostrarValor(camara.presentaDano),
      "Descripción daño": mostrarValor(camara.descripcionDano),
      "Fecha seguimiento": mostrarValor(camara.fechaSeguimiento),
      "Detalle seguimiento": mostrarValor(camara.seguimientoDetalle),
      "Resuelto GLPI":
        camara.resueltoGlpi === true
          ? "Sí"
          : camara.resueltoGlpi === false
          ? "No"
          : "No registrado",
      "Fecha solución": mostrarValor(camara.fechaSolucion),
    }));

    const hoja = XLSX.utils.json_to_sheet(filasExcel);

    hoja["!cols"] = [
      { wch: 12 },
      { wch: 24 },
      { wch: 18 },
      { wch: 24 },
      { wch: 18 },
      { wch: 16 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 22 },
      { wch: 24 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 18 },
      { wch: 36 },
      { wch: 36 },
      { wch: 16 },
      { wch: 36 },
      { wch: 18 },
      { wch: 36 },
      { wch: 16 },
      { wch: 18 },
    ];

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Reporte cámaras");

    const fechaActual = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(libro, `reporte_camaras_${fechaActual}.xlsx`);
  } catch (error) {
    console.error("Error al descargar Excel:", error);
    alert("No se pudo descargar el reporte en Excel.");
  } finally {
    setCargando(false);
  }
};



  return (
    <div className="camaras-page">
      <aside className="camaras-sidebar">
        <div className="logo-box">
          <img src={logo} alt="VisionControl" className="logo-box-img" />
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => navigate("/dashboard")}>
            <MdDashboard className="sidebar-icon" />
            Dashboard
          </button>
          <button onClick={() => navigate("/camaras")}>
            <FaVideo className="sidebar-icon" />
            Cámaras
          </button>
          <button onClick={() => navigate("/convenios")}>
            <FaFileContract className="sidebar-icon" />
            Convenios
          </button>

          <button className="activo" onClick={() => navigate("/reportes")}>
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
        <header className="reportes-header">
          <div>
            <h1>REPORTES</h1>
            <p>Consulta, filtra y revisa información operativa de cámaras ECU 911.</p>
          </div>

          <div className="dashboard-user">
            <div className="user-avatar">
              <FaUserAlt />
            </div>

            <div>
              <strong>{username}</strong>
              <p>{rol}</p>
            </div>

            <button
              type="button"
              className="btn-salir"
              onClick={cerrarSesion}
            >
              Salir
            </button>
          </div>
        </header>

        <section className="reportes-resumen">
          <div className="reporte-resumen-card">
            <span>Total cámaras</span>
            <strong>{cargandoResumen ? "..." : resumen?.totalCamaras ?? 0}</strong>
            <small>Inventario registrado</small>
          </div>

          <div className="reporte-resumen-card">
            <span>Operativas</span>
            <strong>{cargandoResumen ? "..." : resumen?.operativas ?? 0}</strong>
            <small>Cámaras funcionando</small>
          </div>

          <div className="reporte-resumen-card">
            <span>No operativas</span>
            <strong>{cargandoResumen ? "..." : resumen?.noOperativas ?? 0}</strong>
            <small>Cámaras con novedad</small>
          </div>
        </section>

        <section className="tabla-panel">
          <div className="tabla-header">
            <div>
              <h3>Reporte de cámaras</h3>
              <p className="total-camaras">
                Resultados encontrados: {totalElementos}
              </p>
            </div>

            {puedeEditar && (
              <button
                type="button"
                className="btn-nuevo-reporte"
                onClick={() => navigate("/reportes/nuevo")}
              >
                <FaPlus className="btn-icon" />
                Nuevo reporte
              </button>
            )}
          </div>

          {error && <p className="sin-datos">{error}</p>}

          <div className="filtros-camaras">
            <select
              value={filtros.idProvincia}
              onChange={(e) => manejarCambioProvincia(e.target.value)}
            >
              <option value="">Todas las provincias</option>

              {provincias.map((provincia) => (
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
              onChange={(e) => manejarFiltro("idCanton", e.target.value)}
              disabled={!filtros.idProvincia}
            >
              <option value="">Todos los cantones</option>

              {cantones.map((canton) => (
                <option key={obtenerIdCanton(canton)} value={obtenerIdCanton(canton)}>
                  {obtenerNombreCanton(canton)}
                </option>
              ))}
            </select>

            <select
              value={filtros.estadoActual}
              onChange={(e) => manejarFiltro("estadoActual", e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="OPERATIVA">OPERATIVA</option>
              <option value="NO OPERATIVA">NO OPERATIVA</option>
            </select>

            <select
              value={filtros.idMarca}
              onChange={(e) => manejarFiltro("idMarca", e.target.value)}
            >
              <option value="">Todas las marcas</option>

              {marcas.map((marca) => (
                <option key={obtenerIdMarca(marca)} value={obtenerIdMarca(marca)}>
                  {obtenerNombreMarca(marca)}
                </option>
              ))}
            </select>

            <select
              value={filtros.fechaInstalacion}
              onChange={(e) => manejarFiltro("fechaInstalacion", e.target.value)}
            >
              <option value="">Todas las fechas de instalación</option>

              {fechasInstalacion.map((fecha) => (
                <option key={fecha} value={fecha}>
                  {fecha}
                </option>
              ))}
            </select>

            <div className="buscador-reporte-wrap">
              <input
                className="input-busqueda-reporte"
                type="text"
                value={filtros.busquedaGeneral}
                onChange={(e) => {
                  const valor = e.target.value;

                  manejarFiltro("busquedaGeneral", valor);
                  setMostrarSugerenciasBusqueda(true);

                  if (valor.trim().length < 2) {
                    setSugerenciasBusqueda([]);
                  }
                }}
                onFocus={() => setMostrarSugerenciasBusqueda(true)}
                onBlur={() => {
                  setTimeout(() => setMostrarSugerenciasBusqueda(false), 150);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    manejarBuscar();
                  }

                  if (e.key === "Escape") {
                    setMostrarSugerenciasBusqueda(false);
                  }
                }}
                placeholder="Buscar por GLPI, cámara, ID punto, provincia, cantón, marca, modelo..."
              />

              {mostrarSugerenciasBusqueda && sugerenciasBusqueda.length > 0 && (
                <div className="sugerencias-reporte">
                  {sugerenciasBusqueda.map((camara) => (
                    <button
                      type="button"
                      key={camara.idCamara}
                      className="sugerencia-reporte-item"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => seleccionarSugerenciaBusqueda(camara)}
                    >
                      <strong>
                        {mostrarValor(camara.idPuntoOriginal)} - {mostrarValor(camara.nombreCamara)}
                      </strong>

                      <span>
                        {mostrarValor(camara.provincia)} / {mostrarValor(camara.canton)}
                        {" · "}
                        {camara.ticketGlpi ? `GLPI: ${camara.ticketGlpi}` : "Sin GLPI"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="reportes-botones-filtros">
              <button
                type="button"
                className="btn-reporte btn-buscar-reporte"
                onClick={manejarBuscar}
              >
                <FaSearch className="btn-icon" />
                Buscar
              </button>

              <div className="reportes-exportar-grupo">
                <button
                  type="button"
                  className="btn-reporte btn-limpiar-reporte"
                  onClick={manejarLimpiar}
                >
                  <FaEraser className="btn-icon" />
                  Limpiar
                </button>

                <button
                  type="button"
                  className="btn-reporte btn-excel-reporte"
                  onClick={manejarDescargarExcel}
                >
                  <FaFileExcel className="btn-icon" />
                  Excel
                </button>
              </div>
            </div>

          
          </div>

          <div className="tabla-contenedor">
            <table className="tabla-camaras">
              <thead>
                <tr>
                  <th>ID Punto</th>
                  <th>Nombre cámara</th>
                  <th>Provincia</th>
                  <th>Cantón</th>
                  <th>Estado actual</th>
                  <th>Marca</th>
                  <th>Fecha instalación</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="8">Cargando reporte...</td>
                  </tr>
                ) : camaras.length === 0 ? (
                  <tr>
                    <td colSpan="8">No hay cámaras para mostrar.</td>
                  </tr>
                ) : (
                  camaras.map((camara) => (
                    <tr key={camara.idCamara}>
                      <td>
                        <strong>{mostrarValor(camara.idPuntoOriginal)}</strong>
                      </td>
                      <td>{mostrarValor(camara.nombreCamara)}</td>
                      <td>{mostrarValor(camara.provincia)}</td>
                      <td>{mostrarValor(camara.canton)}</td>
                      <td>
                        <span className={obtenerClaseEstadoReporte(camara.estadoActual)}>
                          {mostrarValor(camara.estadoActual)}
                        </span>
                      </td>
                      <td>{mostrarValor(camara.marca)}</td>
                      <td>{mostrarValor(camara.fechaInstalacion)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-ver-reporte"
                          onClick={() => abrirReporte(camara)}
                        >
                          <FaEye className="btn-icon" />
                          Ver reporte
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="reportes-paginacion">
            <button
              type="button"
              className="btn-paginacion"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 0}
            >
              Anterior
            </button>

            <span className="paginacion-info">
              Página {totalPaginas === 0 ? 0 : paginaActual + 1} de {totalPaginas}
            </span>

            <button
              type="button"
              className="btn-paginacion"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual + 1 >= totalPaginas}
            >
              Siguiente
            </button>
          </div>
        </section>

        
      </main>
    </div>
  );
}

export default ReportesPage;