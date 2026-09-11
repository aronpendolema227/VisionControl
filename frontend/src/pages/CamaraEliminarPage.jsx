import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

import { FaUserAlt } from "react-icons/fa";

import {
  buscarCamarasActivarDesactivar,
  desactivarCamara,
  obtenerCamaraPorId,
  reactivarCamara,
} from "../services/camaraService";

import "../styles/camaras.css";

function CamaraEliminarPage() {
  const navigate = useNavigate();


  const username = localStorage.getItem("username") || "Usuario";
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol") || "LECTOR";

  const esSuperAdmin = rol === "SUPER_ADMIN";

  const [busqueda, setBusqueda] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("true");
  const [camaras, setCamaras] = useState([]);
  const [camaraSeleccionada, setCamaraSeleccionada] = useState(null);

  const [motivo, setMotivo] = useState("");
  const [estadoReactivacion, setEstadoReactivacion] = useState("OPERATIVA");

  const [cargando, setCargando] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (!esSuperAdmin) {
      navigate("/camaras");
    }
  }, [token, esSuperAdmin, navigate]);

  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/");
  };

  const obtenerValor = (objeto, campos, valorDefecto = "Sin dato") => {
    for (const campo of campos) {
      const valor = objeto?.[campo];

      if (valor !== null && valor !== undefined && valor !== "") {
        return valor;
      }
    }

    return valorDefecto;
  };

  const camaraEstaActiva = (camara) => {
    return camara?.activo !== false;
  };

  const buscarCamaras = async () => {
    const textoBusqueda = busqueda.trim();

    setMensaje("");
    setError("");
    setCamaraSeleccionada(null);
    setMotivo("");

    if (textoBusqueda.length < 2) {
      setError("Escribe al menos 2 caracteres para buscar una cámara.");
      setCamaras([]);
      return;
    }

    try {
      setCargando(true);

      const data = await buscarCamarasActivarDesactivar({
        busqueda: textoBusqueda,
        activo: filtroActivo,
        page: 0,
        size: 10,
      });

      const lista = Array.isArray(data) ? data : data.content || [];

      setCamaras(lista);

      if (lista.length === 0) {
        setError("No se encontraron cámaras con esa búsqueda.");
      }
    } catch (error) {
      console.error("Error al buscar cámaras:", error);
      setError("No se pudieron buscar cámaras.");
      setCamaras([]);
    } finally {
      setCargando(false);
    }
  };

  const seleccionarCamara = async (camara) => {
    const idCamara = camara.idCamara || camara.id_camara;

    setMensaje("");
    setError("");
    setMotivo("");
    setEstadoReactivacion("OPERATIVA");

    if (!idCamara) {
      setError("No se pudo obtener el ID de la cámara.");
      return;
    }

    try {
      setCargando(true);

      const detalle = await obtenerCamaraPorId(idCamara);
      setCamaraSeleccionada(detalle);
    } catch (error) {
      console.error("Error al obtener detalle de cámara:", error);
      setCamaraSeleccionada(camara);
    } finally {
      setCargando(false);
    }
  };

  const confirmarAccion = async () => {
    if (!camaraSeleccionada) {
      setError("Primero selecciona una cámara.");
      return;
    }

    const idCamara =
      camaraSeleccionada.idCamara || camaraSeleccionada.id_camara;

    const nombreCamara = obtenerValor(
      camaraSeleccionada,
      ["nombreCamara", "nombre_camara"],
      "Sin nombre"
    );

    const estaActiva = camaraEstaActiva(camaraSeleccionada);

    if (estaActiva && motivo.trim().length < 10) {
      setError("El motivo de desactivación debe tener al menos 10 caracteres.");
      return;
    }

    if (!estaActiva && !estadoReactivacion.trim()) {
      setError("Seleccione el estado con el que se reactivará la cámara.");
      return;
    }

    const textoConfirmacion = estaActiva
      ? `¿Seguro que deseas desactivar la cámara ${nombreCamara}?`
      : `¿Seguro que deseas reactivar la cámara ${nombreCamara}?`;

    const confirmar = window.confirm(textoConfirmacion);

    if (!confirmar) {
      return;
    }

    try {
      setProcesando(true);
      setError("");
      setMensaje("");

      if (estaActiva) {
        await desactivarCamara(idCamara, motivo.trim());
        setMensaje("Cámara desactivada correctamente.");
      } else {
        await reactivarCamara(idCamara, {
          estadoActual: estadoReactivacion,
          motivo: motivo.trim(),
        });

        setMensaje("Cámara reactivada correctamente.");
      }

      setCamaraSeleccionada(null);
      setMotivo("");
      setEstadoReactivacion("OPERATIVA");

      await buscarCamaras();
    } catch (error) {
      console.error("Error al procesar cámara:", error);

      const mensajeBackend =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "No se pudo procesar la acción.";

      setError(mensajeBackend);
    } finally {
      setProcesando(false);
    }
  };

  const textoEstadoFiltro = () => {
    if (filtroActivo === "true") return "cámaras activas";
    if (filtroActivo === "false") return "cámaras desactivadas";
    return "cámaras activas y desactivadas";
  };

  const estaActivaSeleccionada = camaraEstaActiva(camaraSeleccionada);

  return (
    <div className="camaras-page camara-desactivar-page">
      

      <main className="camaras-main">
        <header className="camaras-header">
          <div>
            <h2>Activar / desactivar cámara</h2>
            <p>
              Administración de estado lógico de cámaras con registro de
              auditoría.
            </p>
          </div>

          <div className="dashboard-user">
            <div className="user-avatar">
              <FaUserAlt />
            </div>

            <div>
              <strong>{username}</strong>
              <p>{rol}</p>
            </div>

            <button type="button" className="btn-salir" onClick={cerrarSesion}>
              Salir
            </button>
          </div>
        </header>

        <section className="filtros-panel">
          <div className="buscador-principal">
            <input
              type="text"
              placeholder="Buscar por ID, punto, nombre, IP o dirección..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  buscarCamaras();
                }
              }}
            />

            <select
              value={filtroActivo}
              onChange={(e) => {
                setFiltroActivo(e.target.value);
                setCamaras([]);
                setCamaraSeleccionada(null);
                setMensaje("");
                setError("");
              }}
            >
              <option value="true">Solo activas</option>
              <option value="false">Solo desactivadas</option>
              <option value="">Todas</option>
            </select>

            <div className="acciones-busqueda">
              <button type="button" onClick={buscarCamaras}>
                Buscar
              </button>

              <button
                type="button"
                className="btn-limpiar"
                onClick={() => navigate("/camaras")}
              >
                Volver
              </button>
            </div>
          </div>
        </section>

        {mensaje && <p className="sin-datos">{mensaje}</p>}
        {error && <p className="sin-datos">{error}</p>}

        <section className="tabla-panel">
          <div className="tabla-header">
            <div>
              <h3>Cámaras encontradas</h3>
              <p>Seleccione una cámara para activar o desactivar.</p>
              <p>Filtro actual: {textoEstadoFiltro()}</p>
            </div>
          </div>

          {cargando ? (
            <p className="sin-datos">Cargando información...</p>
          ) : camaras.length === 0 ? (
            <p className="sin-datos">
              Busque una cámara para activar o desactivar.
            </p>
          ) : (
            <div className="tabla-contenedor">
              <table>
                <thead>
                  <tr>
                    <th>ID Cámara</th>
                    <th>ID Punto</th>
                    <th>Nombre Cámara</th>
                    <th>Cantón</th>
                    <th>Dirección IP</th>
                    <th>Estado</th>
                    <th>Condición</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {camaras.map((camara) => {
                    const estaActiva = camaraEstaActiva(camara);

                    return (
                      <tr key={camara.idCamara}>
                        <td>{camara.idCamara}</td>
                        <td>{camara.idPuntoOriginal || "Sin dato"}</td>
                        <td>{camara.nombreCamara || "Sin nombre"}</td>
                        <td>{camara.nombreCanton || "Sin cantón"}</td>
                        <td>{camara.direccionIp || "Sin IP"}</td>
                        <td>
                          <span
                            className={
                              estaActiva
                                ? "estado-operativa"
                                : "estado-no-operativa"
                            }
                          >
                            {camara.estadoActual || "Sin estado"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              estaActiva
                                ? "estado-operativa"
                                : "estado-no-operativa"
                            }
                          >
                            {estaActiva ? "ACTIVA" : "DESACTIVADA"}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-ver"
                            onClick={() => seleccionarCamara(camara)}
                          >
                            Seleccionar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {camaraSeleccionada && (
          <section className="tabla-panel">
            <div className="tabla-header">
              <div>
                <h3>Cámara seleccionada</h3>
                <p>
                  {estaActivaSeleccionada
                    ? "Revise la información antes de confirmar la desactivación."
                    : "Revise la información antes de confirmar la reactivación."}
                </p>
              </div>
            </div>

            <div className="detalle-grid">
              <div>
                <span>ID cámara</span>
                <strong>
                  {obtenerValor(camaraSeleccionada, ["idCamara", "id_camara"])}
                </strong>
              </div>

              <div>
                <span>ID punto</span>
                <strong>
                  {obtenerValor(camaraSeleccionada, [
                    "idPuntoOriginal",
                    "id_punto_original",
                  ])}
                </strong>
              </div>

              <div>
                <span>Nombre</span>
                <strong>
                  {obtenerValor(camaraSeleccionada, [
                    "nombreCamara",
                    "nombre_camara",
                  ])}
                </strong>
              </div>

              <div>
                <span>Provincia</span>
                <strong>
                  {obtenerValor(camaraSeleccionada, ["nombreProvincia"])}
                </strong>
              </div>

              <div>
                <span>Cantón</span>
                <strong>
                  {obtenerValor(camaraSeleccionada, ["nombreCanton"])}
                </strong>
              </div>

              <div>
                <span>Dirección IP</span>
                <strong>
                  {obtenerValor(camaraSeleccionada, [
                    "direccionIp",
                    "direccion_ip",
                  ])}
                </strong>
              </div>

              <div>
                <span>Estado actual</span>
                <strong>
                  {obtenerValor(camaraSeleccionada, [
                    "estadoActual",
                    "estado_actual",
                  ])}
                </strong>
              </div>

              <div>
                <span>Condición</span>
                <strong>
                  {estaActivaSeleccionada ? "ACTIVA" : "DESACTIVADA"}
                </strong>
              </div>
            </div>

            {!estaActivaSeleccionada && (
              <div className="detalle-bloque">
                <h4>Datos de desactivación actual</h4>

                <p>
                  <strong>Motivo:</strong>{" "}
                  {obtenerValor(
                    camaraSeleccionada,
                    ["motivoDesactivacion", "motivo_desactivacion"],
                    "Sin motivo"
                  )}
                </p>

                <p>
                  <strong>Usuario:</strong>{" "}
                  {obtenerValor(
                    camaraSeleccionada,
                    ["usuarioDesactivacion", "usuario_desactivacion"],
                    "Sin usuario"
                  )}
                </p>

                <p>
                  <strong>Rol:</strong>{" "}
                  {obtenerValor(
                    camaraSeleccionada,
                    ["rolDesactivacion", "rol_desactivacion"],
                    "Sin rol"
                  )}
                </p>

                <p>
                  <strong>Fecha:</strong>{" "}
                  {obtenerValor(
                    camaraSeleccionada,
                    ["fechaDesactivacion", "fecha_desactivacion"],
                    "Sin fecha"
                  )}
                </p>
              </div>
            )}

            <div className="detalle-bloque">
              {estaActivaSeleccionada ? (
                <>
                  <h4>Motivo de desactivación</h4>

                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ingrese el motivo. Ejemplo: cámara retirada por daño físico, traslado, baja técnica, duplicado, etc."
                    rows={5}
                  />
                </>
              ) : (
                <>
                  <h4>Datos para reactivación</h4>

                  <select
                    value={estadoReactivacion}
                    onChange={(e) => setEstadoReactivacion(e.target.value)}
                  >
                    <option value="OPERATIVA">OPERATIVA</option>
                    <option value="NO OPERATIVA">NO OPERATIVA</option>
                    <option value="FALLA TECNICA">FALLA TÉCNICA</option>
                    <option value="CONECTIVIDAD">CONECTIVIDAD</option>
                    <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                  </select>

                  <textarea
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Motivo de reactivación, opcional."
                    rows={4}
                  />
                </>
              )}

              <div className="detalle-acciones">
                <button
                  type="button"
                  className="btn-limpiar"
                  onClick={() => {
                    setCamaraSeleccionada(null);
                    setMotivo("");
                    setEstadoReactivacion("OPERATIVA");
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-editar-camara"
                  disabled={procesando}
                  onClick={confirmarAccion}
                >
                  {procesando
                    ? "Procesando..."
                    : estaActivaSeleccionada
                    ? "Confirmar desactivación"
                    : "Confirmar reactivación"}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default CamaraEliminarPage;