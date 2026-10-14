import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarAnalistas,
  actualizarAnalista,
} from "../services/analistaService";
import { listarUsuarios } from "../services/usuarioService";
import {
  FaUserCircle,
  FaUsers,
  FaCircle,
  FaUserTie,
  FaEdit,
  FaUserSlash,
  FaUserCheck,
} from "react-icons/fa";
import ThemeToggle from "../components/common/ThemeToggle";
import "../styles/analistas.css";




function AnalistasPage() {
  const navigate = useNavigate();

  const [analistas, setAnalistas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [vistaActual, setVistaActual] = useState("filtrosAnalistas");
  const [filtroAnalistas, setFiltroAnalistas] = useState("");
  const [analistaSeleccionado, setAnalistaSeleccionado] = useState(null);

  const [analistaForm, setAnalistaForm] = useState({
    nombreAnalista: "",
    cargo: "",
    area: "",
    correo: "",
    telefono: "",
    activo: true,
  });

  const obtenerDatoLocal = (clave) => {
    const valor = localStorage.getItem(clave);

    if (!valor || valor === "undefined" || valor === "null") {
      return "";
    }

    return valor;
  };

  const nombre =
    obtenerDatoLocal("nombreCompleto") ||
    obtenerDatoLocal("nombre_completo") ||
    obtenerDatoLocal("nombre") ||
    obtenerDatoLocal("username") ||
    obtenerDatoLocal("usuario") ||
    "Usuario";

  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("token");

  const puedeEditar =
  rol === "SUPER_ADMIN" ||
  rol === "ANALISTA_OPERACIONES" ||
  rol === "ANALISTA_TECNOLOGIA";



  const cargarAnalistas = async () => {
    try {
      const [dataAnalistas, dataUsuarios] = await Promise.all([
        listarAnalistas(),
        listarUsuarios(),
      ]);

      setAnalistas(dataAnalistas);
      setUsuarios(dataUsuarios);
      setError("");
    } catch (error) {
      console.error("Error al cargar analistas:", error);
      setError("No se pudieron cargar los analistas");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    let cancelado = false;

    const cargarInicial = async () => {
      try {
        const [dataAnalistas, dataUsuarios] = await Promise.all([
          listarAnalistas(),
          listarUsuarios(),
        ]);

        if (!cancelado) {
          setAnalistas(dataAnalistas);
          setUsuarios(dataUsuarios);
          setError("");
        }
      } catch (error) {
        if (!cancelado) {
          console.error("Error al cargar analistas:", error);
          setError("No se pudieron cargar los analistas");
        }
      }
    };

    cargarInicial();

    return () => {
      cancelado = true;
    };
  }, [token, navigate]);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const limpiarFormulario = () => {
    setAnalistaForm({
      nombreAnalista: "",
      cargo: "",
      area: "",
      correo: "",
      telefono: "",
      activo: true,
    });
  };

  const cargarFormularioEditar = (analista) => {
    setAnalistaSeleccionado(analista);
    setAnalistaForm({
      nombreAnalista: analista.nombreAnalista || "",
      cargo: analista.cargo || "",
      area: analista.area || "",
      correo: analista.correo || "",
      telefono: analista.telefono || "",
      activo: analista.activo === true,
    });
  };

  const manejarEditar = (analista) => {
    if (!puedeEditar) {
      alert("No tienes permisos para editar analistas");
      return;
    }

    cargarFormularioEditar(analista);
    setVistaActual("editar");
  };

  const manejarCambioInput = (e) => {
    const { name, value } = e.target;

    setAnalistaForm({
      ...analistaForm,
      [name]: name === "activo" ? value === "true" : value,
    });
  };

  const guardarAnalista = async (e) => {
    e.preventDefault();

    if (!analistaSeleccionado) {
      alert("Primero selecciona un analista");
      return;
    }

    try {
      const datosEnviar = {
        nombreAnalista: analistaForm.nombreAnalista.trim(),
        cargo: analistaForm.cargo.trim(),
        area: analistaForm.area.trim(),
        correo: analistaForm.correo.trim(),
        telefono: analistaForm.telefono.trim(),
        activo: analistaForm.activo,
      };

      await actualizarAnalista(analistaSeleccionado.idAnalista, datosEnviar);

      await cargarAnalistas();
      limpiarFormulario();
      setAnalistaSeleccionado(null);
      setVistaActual("lista");
      setFiltroAnalistas(datosEnviar.activo ? "activos" : "inactivos");

      alert("Analista actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar analista:", error);
      alert("No se pudo actualizar el analista");
    }
  };

  const manejarCambiarEstado = async (analista) => {
    if (!puedeEditar) {
      alert("No tienes permisos para cambiar el estado del analista");
      return;
    }

    const nuevoEstado = !analista.activo;
    const accion = nuevoEstado ? "reactivar" : "desactivar";

    if (!window.confirm(`¿Deseas ${accion} este analista?`)) {
      return;
    }

    try {
      const datosEnviar = {
        nombreAnalista: analista.nombreAnalista || "Sin nombre",
        cargo: analista.cargo || "Sin cargo",
        area: analista.area || "Sin área",
        correo: analista.correo || "",
        telefono: analista.telefono || "",
        activo: nuevoEstado,
      };

      await actualizarAnalista(analista.idAnalista, datosEnviar);

      await cargarAnalistas();
      setAnalistaSeleccionado(null);
      setVistaActual("lista");
      setFiltroAnalistas(nuevoEstado ? "activos" : "inactivos");

      alert(
        nuevoEstado
          ? "Analista reactivado correctamente"
          : "Analista desactivado correctamente"
      );
    } catch (error) {
      console.error("Error al cambiar estado del analista:", error);
      alert("No se pudo cambiar el estado del analista");
    }
  };

  const normalizarTexto = (texto) => {
    return (texto || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
      .trim();
  };

  const obtenerUsuarioVinculado = (analista) => {
    return usuarios.find((usuario) => {
      const mismoIdAnalista =
        usuario.idAnalista &&
        analista.idAnalista &&
        Number(usuario.idAnalista) === Number(analista.idAnalista);

      const mismoNombreAnalista =
        normalizarTexto(usuario.nombreAnalista) &&
        normalizarTexto(usuario.nombreAnalista) ===
          normalizarTexto(analista.nombreAnalista);

      const mismoCorreo =
        normalizarTexto(usuario.correo) &&
        normalizarTexto(analista.correo) &&
        normalizarTexto(usuario.correo) === normalizarTexto(analista.correo);

      return mismoIdAnalista || mismoNombreAnalista || mismoCorreo;
    });
  };

  const obtenerRolUsuarioAnalista = (analista) => {
    const usuarioVinculado = obtenerUsuarioVinculado(analista);
    return usuarioVinculado?.rol || "";
  };

  const obtenerTipoAnalista = (analista) => {
    const rolUsuarioAnalista = obtenerRolUsuarioAnalista(analista);

    if (rolUsuarioAnalista === "ANALISTA_TECNOLOGIA") {
      return "ANALISTA_TECNOLOGIA";
    }

    if (rolUsuarioAnalista === "ANALISTA_OPERACIONES") {
      return "ANALISTA_OPERACIONES";
    }

    const textoClasificacion = normalizarTexto(
      `${analista.tipoAnalista || ""} ${analista.area || ""} ${analista.cargo || ""}`
    );

    if (
      textoClasificacion.includes("TECNOLOGIA") ||
      textoClasificacion.includes("TECNOLOGICO") ||
      textoClasificacion.includes("SOPORTE") ||
      textoClasificacion.includes("TI")
    ) {
      return "ANALISTA_TECNOLOGIA";
    }

    return "ANALISTA_OPERACIONES";
  };

  const analistasVisibles = analistas.filter((analista) => {
    const rolUsuarioAnalista = obtenerRolUsuarioAnalista(analista);

    if (rolUsuarioAnalista === "SUPER_ADMIN") return false;
    if (rolUsuarioAnalista === "LECTOR") return false;
    if (rolUsuarioAnalista === "COORDINACIÓN_ZONAL") return false;
    if (rolUsuarioAnalista === "OPERACIÓN_ZONAL") return false;

    return true;
  });

  const analistasFiltrados = analistasVisibles.filter((analista) => {
    if (filtroAnalistas === "activos") return analista.activo === true;
    if (filtroAnalistas === "inactivos") return analista.activo === false;
    return true;
  });

  const totalAnalistasActivos = analistasVisibles.filter(
    (analista) => analista.activo === true
  ).length;

  const totalAnalistasInactivos = analistasVisibles.filter(
    (analista) => analista.activo === false
  ).length;

  const volverPanelUsuarios = () => {
    setAnalistaSeleccionado(null);
    setFiltroAnalistas("");
    navigate("/usuarios");
  };

  const volverFiltrosAnalistas = () => {
    setAnalistaSeleccionado(null);
    setFiltroAnalistas("");
    setVistaActual("filtrosAnalistas");
  };

  const gruposAnalistas = [
    {
      tipo: "ANALISTA_OPERACIONES",
      titulo: "Analistas de operaciones",
      descripcion: "Personal asignado al monitoreo y operación de cámaras.",
      analistas: analistasFiltrados.filter(
        (analista) => obtenerTipoAnalista(analista) === "ANALISTA_OPERACIONES"
      ),
    },
    {
      tipo: "ANALISTA_TECNOLOGIA",
      titulo: "Analistas de tecnología",
      descripcion: "Personal asignado a soporte, infraestructura y gestión técnica.",
      analistas: analistasFiltrados.filter(
        (analista) => obtenerTipoAnalista(analista) === "ANALISTA_TECNOLOGIA"
      ),
    },
  ];


  return (
    <div className="analistas-page">
      <div className="analistas-header">
        <h1>Gestión de Analistas</h1>

        <div className="analistas-header-actions">
          <ThemeToggle />

          <div className="estado-sistema">
            <FaCircle className="estado-sistema-icono" />
            Conectado
          </div>
        </div>
      </div>

      <div className="analista-info">
        <div className="analista-perfil">
          <div className="avatar">
            <FaUserCircle />
          </div>
          <div>
            <h2>{nombre}</h2>
            <p>
              Rol: <span className="rol">{rol}</span>
            </p>
          </div>
        </div>

        <button className="btn-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      {error && (
        <p
          style={{
            color: "#f87171",
            background: "#7f1d1d33",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #f8717155",
            marginBottom: "20px",
          }}
        >
          {error}
        </p>
      )}

      <div className="analistas-contenido analistas-contenido-sin-sidebar">
        

        <div className="panel-principal panel-principal-completo">
        
          {vistaActual === "filtrosAnalistas" && (
            <div className="analistas-lista-panel">
              <div className="analistas-vista-header">
                <button
                  type="button"
                  className="btn-volver-panel"
                  onClick={volverPanelUsuarios}
                >
                  ← Volver al panel principal
                </button>
              </div>

              <section className="analistas-lista-hero">
                <div>
                  <h2>Lista de Analistas</h2>
                  <p>
                    Selecciona el tipo de analistas que deseas consultar dentro del
                    sistema.
                  </p>
                </div>

                <div className="analistas-lista-icono">
                  <FaUsers />
                </div>
              </section>

              <section className="analistas-tipo-grid">
                <button
                  type="button"
                  className="analistas-tipo-card activo"
                  onClick={() => {
                    setFiltroAnalistas("activos");
                    setVistaActual("lista");
                  }}
                >
                  <span className="analistas-tipo-icono icono-activo">
                    <FaCircle />
                  </span>

                  <div>
                    <h3>Analistas activos</h3>
                    <p>Analistas habilitados actualmente en el sistema.</p>
                  </div>

                  <strong>{totalAnalistasActivos}</strong>
                </button>

                <button
                  type="button"
                  className="analistas-tipo-card inactivo"
                  onClick={() => {
                    setFiltroAnalistas("inactivos");
                    setVistaActual("lista");
                  }}
                >
                  <span className="analistas-tipo-icono icono-inactivo">
                    <FaCircle />
                  </span>

                  <div>
                    <h3>Analistas inactivos</h3>
                    <p>Analistas registrados pero deshabilitados.</p>
                  </div>

                  <strong>{totalAnalistasInactivos}</strong>
                </button>
              </section>
            </div>
          )}

          {vistaActual === "lista" && (
            <div>
              
              <div className="analistas-vista-header">
                <button
                  type="button"
                  className="btn-volver-panel"
                  onClick={volverFiltrosAnalistas}
                >
                  ← Cambiar tipo de lista
                </button>

                <button
                  type="button"
                  className="btn-volver-panel secundario"
                  onClick={volverPanelUsuarios}
                >
                  Volver al panel principal
                </button>
              </div>

              <h2 className="analistas-lista-titulo">
                {filtroAnalistas === "activos"
                  ? "Analistas Activos"
                  : "Analistas Inactivos"}
              </h2>

              {analistasFiltrados.length === 0 ? (
                <p className="form-subtitle">
                  No hay analistas para mostrar en esta categoría.
                </p>
              ) : (
                <div className="analistas-grupos-lista">
                  {gruposAnalistas.map((grupo) => (
                    <section key={grupo.tipo} className="analistas-grupo">
                      <div className="analistas-grupo-header">
                        <div>
                          <h3>{grupo.titulo}</h3>
                          <p>{grupo.descripcion}</p>
                        </div>

                        <span>{grupo.analistas.length}</span>
                      </div>

                      {grupo.analistas.length === 0 ? (
                        <div className="analistas-grupo-vacio">
                          <p>
                            No hay {grupo.titulo.toLowerCase()}{" "}
                            {filtroAnalistas === "activos" ? "activos" : "inactivos"}.
                          </p>
                        </div>
                      ) : (
                        <div className="analistas-grid">
                          {grupo.analistas.map((analista) => (
                            <div
                              key={analista.idAnalista}
                              className={
                                analistaSeleccionado?.idAnalista === analista.idAnalista
                                  ? "analista-card seleccionado"
                                  : "analista-card"
                              }
                              onClick={() => setAnalistaSeleccionado(analista)}
                            >
                              <div className="analista-card-left">
                                <div className="analista-card-avatar">
                                  <FaUserTie />
                                </div>

                                <div>
                                  <h3>{analista.nombreAnalista}</h3>
                                  <p>{analista.correo || "Sin correo"}</p>

                                  <p className="analista-detalle">
                                    Cargo: {analista.cargo || "Sin cargo"}
                                  </p>

                                  <p className="analista-detalle">
                                    Área: {analista.area || "Sin área"}
                                  </p>

                                  <p className="analista-detalle">
                                    Teléfono: {analista.telefono || "Sin teléfono"}
                                  </p>

                                  <div className="analista-badges">
                                    <span
                                      className={
                                        grupo.tipo === "ANALISTA_TECNOLOGIA"
                                          ? "badge-area badge-tecnologia"
                                          : "badge-area badge-operaciones"
                                      }
                                    >
                                      {grupo.tipo === "ANALISTA_TECNOLOGIA"
                                        ? "Tecnología"
                                        : "Operaciones"}
                                    </span>

                                    <span
                                      className={
                                        analista.activo
                                          ? "estado-analista-card activo"
                                          : "estado-analista-card inactivo"
                                      }
                                    >
                                      <FaCircle />
                                      {analista.activo ? "Activo" : "Inactivo"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div
                                className="card-actions"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {puedeEditar && (
                                  <button
                                    className="btn-editar"
                                    title="Editar analista"
                                    onClick={() => manejarEditar(analista)}
                                  >
                                    <FaEdit />
                                  </button>
                                )}

                                {puedeEditar && (
                                  <button
                                    className={
                                      analista.activo ? "btn-desactivar" : "btn-reactivar"
                                    }
                                    title={
                                      analista.activo
                                        ? "Desactivar analista"
                                        : "Reactivar analista"
                                    }
                                    onClick={() => manejarCambiarEstado(analista)}
                                  >
                                    {analista.activo ? <FaUserSlash /> : <FaUserCheck />}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}
            </div>
          )}

          {vistaActual === "editar" && (
            <div className="form-card">
              <h2>Editar Analista</h2>

              <p className="form-subtitle">
                Modifica la información de {" "}
                {analistaSeleccionado?.nombreAnalista || "este analista"}
              </p>

              <form className="form-analista" onSubmit={guardarAnalista}>
                <div className="form-group">
                  <label>Nombre del analista</label>
                  <input
                    type="text"
                    name="nombreAnalista"
                    value={analistaForm.nombreAnalista}
                    onChange={manejarCambioInput}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Cargo</label>
                  <input
                    type="text"
                    name="cargo"
                    value={analistaForm.cargo}
                    onChange={manejarCambioInput}
                    placeholder="Ej: Analista"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Área</label>
                  <input
                    type="text"
                    name="area"
                    value={analistaForm.area}
                    onChange={manejarCambioInput}
                    placeholder="Ej: Monitoreo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Correo</label>
                  <input
                    type="email"
                    name="correo"
                    value={analistaForm.correo}
                    onChange={manejarCambioInput}
                    placeholder="Ej: analista@ecu911.gob.ec"
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={analistaForm.telefono}
                    onChange={manejarCambioInput}
                    placeholder="Ej: 0999999999"
                  />
                </div>

                <div className="form-group">
                  <label>Estado del analista</label>
                  <select
                    name="activo"
                    value={analistaForm.activo ? "true" : "false"}
                    onChange={manejarCambioInput}
                    required
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancelar"
                    onClick={() => {
                      limpiarFormulario();
                      setAnalistaSeleccionado(null);
                      setVistaActual("lista");
                    }}
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn-guardar">
                    Actualizar Analista
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalistasPage;
