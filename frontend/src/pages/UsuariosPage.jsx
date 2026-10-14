import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usuarioService";
import {
  FaUserCircle,
  FaUsersCog,
  FaUserShield,
  FaListAlt,
  FaUsers,
  FaUserPlus,
  FaCircle,
  FaUser,
  FaEdit,
  FaTrashAlt,
} from "react-icons/fa";
import "../styles/usuarios.css";
import ThemeToggle from "../components/common/ThemeToggle";

function UsuariosPage() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");

  const [vistaActual, setVistaActual] = useState("inicio");
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [filtroUsuarios, setFiltroUsuarios] = useState("");
  const [vistaRetornoFormulario, setVistaRetornoFormulario] = useState("inicio");

  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    password: "",
    nombreCompleto: "",
    correo: "",
    rol: "",
    activo: true,
    cargo: "",
    area: "",
    telefono: "",
    grupoOperativo: "",
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

  const limpiarFormulario = () => {
    setNuevoUsuario({
      username: "",
      password: "",
      nombreCompleto: "",
      correo: "",
      rol: "",
      activo: true,
      cargo: "",
      area: "",
      telefono: "",
    });
  };

  const cargarUsuarios = async () => {
    try {
      setError("");
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      setError("No se pudieron cargar los usuarios");
    }
  };

  useEffect(() => {
    if (!token || rol !== "SUPER_ADMIN") {
      navigate("/");
      return;
    }

    let cancelado = false;

    const cargarInicial = async () => {
      try {
        setError("");
        const data = await listarUsuarios();

        if (!cancelado) {
          setUsuarios(data);
        }
      } catch (error) {
        if (!cancelado) {
          console.error("Error al cargar usuarios:", error);
          setError("No se pudieron cargar los usuarios");
        }
      }
    };

    cargarInicial();

    return () => {
      cancelado = true;
    };
  }, [token, rol, navigate]);

  const guardarUsuario = async (e) => {
    e.preventDefault();

    const esNuevoUsuario = vistaActual === "nuevo";
    const esEditarUsuario = vistaActual === "editar";

    if (esEditarUsuario && !usuarioSeleccionado?.idUsuario) {
      alert("No se encontró el usuario seleccionado para editar");
      return;
    }

    try {
      const datosEnviar = {
        ...nuevoUsuario,
        username: nuevoUsuario.username.trim(),
        nombreCompleto: nuevoUsuario.nombreCompleto.trim(),
        correo: nuevoUsuario.correo.trim(),
        cargo: nuevoUsuario.cargo.trim(),
        area: nuevoUsuario.area.trim(),
        telefono: nuevoUsuario.telefono.trim(),
        grupoOperativo:
          nuevoUsuario.rol === "ANALISTA_OPERACIONES"
            ? nuevoUsuario.grupoOperativo.trim()
            : "",
      };

      if (esEditarUsuario && !datosEnviar.password) {
        delete datosEnviar.password;
      }

      if (esNuevoUsuario) {
        await crearUsuario(datosEnviar);
      } else {
        await actualizarUsuario(usuarioSeleccionado.idUsuario, datosEnviar);
      }

      await cargarUsuarios();

      limpiarFormulario();
      setUsuarioSeleccionado(null);
      setVistaActual(esNuevoUsuario ? "inicio" : vistaRetornoFormulario || "lista");

      alert(
        esNuevoUsuario
          ? "Usuario creado correctamente"
          : "Usuario actualizado correctamente"
      );
    } catch (error) {
      console.error("Error al guardar usuario:", error);

      const mensajeBackend =
        error.response?.data?.message ||
        error.response?.data?.mensaje ||
        error.response?.data ||
        "No se pudo guardar el usuario";

      alert(mensajeBackend);
    }
  };

  const abrirNuevoUsuario = () => {
    limpiarFormulario();
    setUsuarioSeleccionado(null);
    setVistaRetornoFormulario("inicio");
    setVistaActual("nuevo");
  };

  const volverFormularioUsuario = () => {
    limpiarFormulario();
    setUsuarioSeleccionado(null);
    setVistaActual(vistaRetornoFormulario || "inicio");
  };

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const manejarEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);

    setNuevoUsuario({
      username: usuario.username || "",
      password: "",
      nombreCompleto: usuario.nombreCompleto || "",
      correo: usuario.correo || "",
      rol: usuario.rol || "",
      activo: usuario.activo ?? true,
      cargo: usuario.cargo || "",
      area: usuario.area || "",
      telefono: usuario.telefono || "",
      grupoOperativo: usuario.grupoOperativo || "",
    });

    setVistaRetornoFormulario(filtroUsuarios ? "lista" : "filtrosUsuarios");
    setVistaActual("editar");
  };

  const manejarEliminar = async (idUsuario) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      await eliminarUsuario(idUsuario);

      await cargarUsuarios();
      setUsuarioSeleccionado(null);

      alert("Usuario eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("No se pudo eliminar el usuario");
    }
  };

  const manejarCambioInput = (e) => {
  const { name, value } = e.target;

    setNuevoUsuario((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "rol" && value !== "ANALISTA_OPERACIONES"
        ? { grupoOperativo: "" }
        : {}),
    }));
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    if (filtroUsuarios === "activos") return usuario.activo === true;
    if (filtroUsuarios === "inactivos") return usuario.activo === false;
    return false;
  });

  const totalUsuarios = usuarios.length;
  const totalUsuariosActivos = usuarios.filter(
    (usuario) => usuario.activo === true
  ).length;

  const totalUsuariosInactivos = usuarios.filter(
    (usuario) => usuario.activo === false
  ).length;

  const totalRoles = new Set(
    usuarios.map((usuario) => usuario.rol).filter(Boolean)
  ).size;

  const ordenRolesUsuarios = [
    "SUPER_ADMIN",
    "ANALISTA_TECNOLOGIA",
    "ANALISTA_OPERACIONES",
    "COORDINACION_ZONAL",
    "OPERACION_ZONAL",
    "LECTOR",
  ];

  const nombreRolUsuario = (rolUsuario) => {
    const nombres = {
      SUPER_ADMIN: "Super administradores",
      ANALISTA_TECNOLOGIA: "Analistas de tecnología",
      ANALISTA_OPERACIONES: "Analistas de operaciones",
      COORDINACION_ZONAL: "Coordinación zonal",
      OPERACION_ZONAL: "Operación zonal",
      LECTOR: "Lectores",
    };

    return nombres[rolUsuario] || rolUsuario || "Sin rol";
  };

  const usuariosAgrupadosPorRol = ordenRolesUsuarios
    .map((rolUsuario) => ({
      rol: rolUsuario,
      titulo: nombreRolUsuario(rolUsuario),
      usuarios: usuariosFiltrados.filter(
        (usuario) => usuario.rol === rolUsuario
      ),
    }))
    .filter((grupo) => grupo.usuarios.length > 0);

  const volverPanelUsuarios = () => {
    setFiltroUsuarios("");
    setUsuarioSeleccionado(null);
    setVistaActual("inicio");
  };

  const gruposOperativosDisponibles = Array.from(
    new Set(
      usuarios
        .map((usuario) => usuario.grupoOperativo)
        .filter((grupo) => grupo && grupo.trim() !== "")
    )
  ).sort();

  const mostrarGrupoOperativo =
    nuevoUsuario.rol === "ANALISTA_OPERACIONES";



  return (
    <div className="usuarios-page">
      <div className="usuarios-header">
        <h1>Gestión de Usuarios</h1>

        <div className="usuarios-header-actions">
          <ThemeToggle />

          <div className="estado-sistema">
            <FaCircle className="estado-sistema-icono" />
            Conectado
          </div>
        </div>
      </div>

      <div className="usuario-info">
        <div className="usuario-perfil">
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

      <div className="usuarios-contenido usuarios-contenido-sin-sidebar">
        <div className="panel-principal panel-principal-completo">
          {vistaActual === "inicio" && (
          <div className="usuarios-inicio">
            <section className="usuarios-hero">
              <div className="usuarios-hero-icono">
                <FaUsersCog />
              </div>

              <div className="usuarios-hero-texto">
                <h2>Administración de usuarios y analistas</h2>
                <p>
                  Gestiona accesos, roles, analistas vinculados y permisos del sistema
                  ECU 911.
                </p>
              </div>

              <div className="usuarios-hero-seguridad">
                <FaUserShield />
              </div>
            </section>

            <section className="usuarios-resumen-grid">
              <button
                type="button"
                className="usuarios-opcion-card"
                onClick={() => {
                  setVistaActual("filtrosUsuarios");
                  setFiltroUsuarios("");
                }}
              >
                <div className="usuarios-opcion-icono azul">
                  <FaListAlt />
                </div>

                <div>
                  <h3>Lista de Usuarios</h3>
                  <p>Ver usuarios activos e inactivos registrados en el sistema.</p>
                </div>

                <span className="usuarios-opcion-contador">{totalUsuarios}</span>
              </button>

              <button
                type="button"
                className="usuarios-opcion-card"
                onClick={() => navigate("/analistas")}
              >
                <div className="usuarios-opcion-icono morado">
                  <FaUsers />
                </div>

                <div>
                  <h3>Gestión de Analistas</h3>
                  <p>Administrar analistas vinculados a usuarios y operaciones.</p>
                </div>

                <span className="usuarios-opcion-flecha">›</span>
              </button>

              <button
                type="button"
                className="usuarios-opcion-card"
                onClick={abrirNuevoUsuario}
              >
                <div className="usuarios-opcion-icono verde">
                  <FaUserPlus />
                </div>

                <div>
                  <h3>Nuevo Usuario</h3>
                  <p>Crear un nuevo acceso para el sistema ECU 911.</p>
                </div>

                <span className="usuarios-opcion-flecha">›</span>
              </button>
            </section>

            <section className="usuarios-estadisticas-grid">
              <div className="usuarios-stat-card">
                <span>Usuarios activos</span>
                <strong>{totalUsuariosActivos}</strong>
              </div>

              <div className="usuarios-stat-card">
                <span>Usuarios inactivos</span>
                <strong>{totalUsuariosInactivos}</strong>
              </div>

              <div className="usuarios-stat-card">
                <span>Roles registrados</span>
                <strong>{totalRoles || 4}</strong>
              </div>
            </section>
          </div>
        )}

        {vistaActual === "filtrosUsuarios" && (
          <div className="usuarios-lista-panel">
            <div className="usuarios-vista-header">
              <button
                type="button"
                className="btn-volver-panel"
                onClick={volverPanelUsuarios}
              >
                ← Volver al panel principal
              </button>
            </div>

            <section className="usuarios-lista-hero">
              <div>
                <h2>Lista de Usuarios</h2>
                <p>
                  Selecciona el tipo de usuarios que deseas consultar dentro del
                  sistema.
                </p>
              </div>

              <div className="usuarios-lista-icono">
                <FaListAlt />
              </div>
            </section>

            <section className="usuarios-tipo-grid">
              <button
                type="button"
                className="usuarios-tipo-card activo"
                onClick={() => {
                  setFiltroUsuarios("activos");
                  setVistaActual("lista");
                }}
              >
                <span className="usuarios-tipo-icono icono-activo">
                  <FaCircle />
                </span>

                <div>
                  <h3>Usuarios activos</h3>
                  <p>Usuarios habilitados para ingresar al sistema.</p>
                </div>

                <strong>{totalUsuariosActivos}</strong>
              </button>

              <button
                type="button"
                className="usuarios-tipo-card inactivo"
                onClick={() => {
                  setFiltroUsuarios("inactivos");
                  setVistaActual("lista");
                }}
              >
                <span className="usuarios-tipo-icono icono-inactivo">
                  <FaCircle />
                </span>

                <div>
                  <h3>Usuarios inactivos</h3>
                  <p>Usuarios registrados pero sin acceso activo.</p>
                </div>

                <strong>{totalUsuariosInactivos}</strong>
              </button>
            </section>
          </div>
        )}

        {vistaActual === "lista" && (
          <div className="usuarios-lista-panel">
            <div className="usuarios-vista-header">
              <button
                type="button"
                className="btn-volver-panel"
                onClick={() => setVistaActual("filtrosUsuarios")}
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

            <section className="usuarios-lista-top">
              <div>
                <h2>
                  {filtroUsuarios === "activos"
                    ? "Usuarios activos"
                    : "Usuarios inactivos"}
                </h2>

                <p>
                  {filtroUsuarios === "activos"
                    ? "Usuarios habilitados actualmente para acceder al sistema."
                    : "Usuarios registrados que se encuentran deshabilitados."}
                </p>
              </div>

              <div className="usuarios-lista-total">
                <span>Total</span>
                <strong>{usuariosFiltrados.length}</strong>
              </div>
            </section>

            {usuariosFiltrados.length === 0 ? (
              <div className="usuarios-lista-vacia">
                <h3>No hay usuarios para mostrar</h3>
                <p>No existen registros en esta categoría por el momento.</p>
              </div>
            ) : (

              <div className="usuarios-grupos-lista">
                {usuariosAgrupadosPorRol.map((grupo) => (
                  <section key={grupo.rol} className="usuarios-grupo">
                    <div className="usuarios-grupo-header">
                      <div>
                        <h3>{grupo.titulo}</h3>
                        <p>
                          {grupo.rol === "SUPER_ADMIN" &&
                            "Usuarios con acceso total al sistema."}

                          {grupo.rol === "ANALISTA_TECNOLOGIA" &&
                            "Usuarios encargados de gestión técnica, cámaras e infraestructura."}

                          {grupo.rol === "ANALISTA_OPERACIONES" &&
                            "Usuarios encargados de reportes, novedades y operación."}

                          {grupo.rol === "COORDINACION_ZONAL" &&
                            "Usuarios de coordinación zonal con acceso únicamente de consulta."}

                          {grupo.rol === "OPERACION_ZONAL" &&
                            "Usuarios de operación zonal con acceso únicamente de consulta."}

                          {grupo.rol === "LECTOR" &&
                            "Usuarios con acceso únicamente de consulta."}
                        </p>
                      </div>

                      

                      <span>{grupo.usuarios.length}</span>
                    </div>


                    

                    <div className="usuarios-grid">
                      {grupo.usuarios.map((usuario) => (
                        <div
                          key={usuario.idUsuario}
                          className={
                            usuarioSeleccionado?.idUsuario === usuario.idUsuario
                              ? "usuario-card seleccionado"
                              : "usuario-card"
                          }
                          onClick={() => setUsuarioSeleccionado(usuario)}
                        >
                          <div className="usuario-card-left">
                            <div className="usuario-card-avatar">
                              <FaUser />
                            </div>

                            <div className="usuario-card-info">
                              <h3>{usuario.username}</h3>

                              <p className="usuario-nombre">
                                {usuario.nombreCompleto || "Sin nombre"}
                              </p>

                              <p className="usuario-detalle">
                                Correo: {usuario.correo || "Sin correo"}
                              </p>

                              <p className="usuario-detalle">
                                Analista: {usuario.nombreAnalista || "Sin analista"}
                              </p>

                              <div className="usuario-badges">
                                <span className="badge-rol">{usuario.rol}</span>

                                <span
                                  className={
                                    usuario.activo
                                      ? "estado-usuario activo"
                                      : "estado-usuario inactivo"
                                  }
                                >
                                  {usuario.activo ? "Activo" : "Inactivo"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="card-actions"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              className="btn-editar"
                              onClick={() => manejarEditar(usuario)}
                              title="Editar usuario"
                            >
                              <FaEdit />
                            </button>

                            <button
                              type="button"
                              className="btn-eliminar"
                              onClick={() => manejarEliminar(usuario.idUsuario)}
                              title="Eliminar usuario"
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}


                
              </div>
            )}
          </div>
        )}

          {(vistaActual === "nuevo" || vistaActual === "editar") && (
            <div className="usuarios-form-panel">
              <div className="usuarios-vista-header">
                <button
                  type="button"
                  className="btn-volver-panel"
                  onClick={volverFormularioUsuario}
                >
                  {vistaActual === "nuevo"
                    ? "← Volver al panel principal"
                    : "← Volver a la lista"}
                </button>
              </div>

              <div className="form-card">
                <h2>
                {vistaActual === "nuevo"
                  ? "Crear Nuevo Usuario"
                  : "Editar Usuario"}
              </h2>

              <p className="form-subtitle">
                {vistaActual === "nuevo"
                  ? "Registra un nuevo usuario para el sistema ECU911"
                  : "Modifica la información del usuario seleccionado"}
              </p>

              <form className="form-usuario" onSubmit={guardarUsuario}>
                <div className="form-group form-full">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={nuevoUsuario.nombreCompleto}
                    onChange={manejarCambioInput}
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Usuario</label>
                  <input
                    type="text"
                    name="username"
                    value={nuevoUsuario.username}
                    onChange={manejarCambioInput}
                    placeholder="Ej: jperez"
                    required
                  />
                </div>

                <div className="form-group form-full">
                  <label>Correo</label>
                  <input
                    type="email"
                    name="correo"
                    value={nuevoUsuario.correo}
                    onChange={manejarCambioInput}
                    placeholder="Ej: usuario@ecu911.gob.ec"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={nuevoUsuario.password}
                    onChange={manejarCambioInput}
                    placeholder={
                      vistaActual === "nuevo"
                        ? "Ingrese una contraseña"
                        : "Dejar vacío para no cambiar"
                    }
                    required={vistaActual === "nuevo"}
                  />

                  {vistaActual === "editar" && (
                    <small className="form-help">
                      Déjala vacía si no deseas cambiar la contraseña actual.
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>Cargo </label>
                  <input
                    type="text"
                    name="cargo"
                    value={nuevoUsuario.cargo}
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
                    value={nuevoUsuario.area}
                    onChange={manejarCambioInput}
                    placeholder="Ej: Monitoreo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono</label>
                  <input
                    type="text"
                    name="telefono"
                    value={nuevoUsuario.telefono}
                    onChange={manejarCambioInput}
                    placeholder="Ej: 0999999999"
                  />
                </div>

                <div className="form-group">
                  <label>Rol</label>
                  <select
                    name="rol"
                    value={nuevoUsuario.rol}
                    onChange={manejarCambioInput}
                    required
                  >
                    <option value="">Seleccione un rol</option>
                    <option value="SUPER_ADMIN">Super administrador</option>
                    <option value="ANALISTA_TECNOLOGIA">Analista de tecnología</option>
                    <option value="ANALISTA_OPERACIONES">Analista de operaciones</option>
                    <option value="COORDINACION_ZONAL">Coordinación zonal</option>
                    <option value="OPERACION_ZONAL">Operación zonal</option>
                    <option value="LECTOR">Lector</option>
                  </select>
                </div>

                {mostrarGrupoOperativo && (
                  <div className="form-group">
                    <label>Grupo operativo</label>

                    <input
                      type="text"
                      name="grupoOperativo"
                      value={nuevoUsuario.grupoOperativo}
                      onChange={manejarCambioInput}
                      list="grupos-operativos"
                      placeholder="Ej: Grupo Operativo A"
                      required
                    />

                    <datalist id="grupos-operativos">
                      {gruposOperativosDisponibles.map((grupo) => (
                        <option key={grupo} value={grupo} />
                      ))}
                    </datalist>

                    <small className="form-help">
                      Este campo solo aparece para analistas de operaciones.
                    </small>
                  </div>
                )}

                <div className="form-group">
                  <label>Estado del usuario</label>

                  <select
                    name="activo"
                    value={nuevoUsuario.activo ? "true" : "false"}
                    onChange={(e) =>
                      setNuevoUsuario({
                        ...nuevoUsuario,
                        activo: e.target.value === "true",
                      })
                    }
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
                    onClick={volverFormularioUsuario}
                  >
                    Cancelar
                  </button>

                  <button type="submit" className="btn-guardar">
                    {vistaActual === "nuevo"
                      ? "Guardar Usuario"
                      : "Actualizar Usuario"}
                  </button>
                </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsuariosPage;
