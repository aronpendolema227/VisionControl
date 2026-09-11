import { useLocation, useNavigate, useParams } from "react-router-dom";

import { actualizarConvenioCamara } from "../services/camaraService";
import { obtenerConvenios } from "../services/convenioService";

import { useEffect, useState } from "react";
import "../styles/convenios.css";

function ConvenioEditarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idCamara } = useParams();

  const username = localStorage.getItem("username") || "Usuario";
  const rol = localStorage.getItem("rol") || "LECTOR";
  const esSuperAdmin = rol === "SUPER_ADMIN";
  const puedeEditar = rol === "EDITOR" || rol === "SUPER_ADMIN";

  const convenioGuardado = localStorage.getItem("convenioEditarSeleccionado");

  const camaraInicial =
    location.state?.camara ||
    (convenioGuardado ? JSON.parse(convenioGuardado) : null);

  const camaraValida =
    camaraInicial && String(camaraInicial.idCamara) === String(idCamara);

  const [formulario, setFormulario] = useState({
    nombreConvenio: camaraInicial?.nombreConvenio || "",
    fechaConvenioOriginal: camaraInicial?.fechaConvenioOriginal || "",
    fechaConvenioInicio: camaraInicial?.fechaConvenioInicio || "",
    fechaConvenioFin: camaraInicial?.fechaConvenioFin || "",
    estadoFechaConvenio: camaraInicial?.estadoFechaConvenio || "",
    fechaInicialPago: camaraInicial?.fechaInicialPago || "",
    proveedorEnlace: camaraInicial?.proveedorEnlace || "",
    responsablePago: camaraInicial?.responsablePago || "",
    costoEnlace: camaraInicial?.costoEnlace || "",
    direccionIp: camaraInicial?.direccionIp || "",
    direccion: camaraInicial?.direccion || "",
  });

  const [conveniosDisponibles, setConveniosDisponibles] = useState([]);
  const [idConvenioSeleccionado, setIdConvenioSeleccionado] = useState(
    camaraInicial?.idConvenio || ""
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const manejarCambio = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  useEffect(() => {
    const cargarConvenios = async () => {
      try {
        const data = await obtenerConvenios();
        setConveniosDisponibles(data || []);

        if (!camaraInicial?.idConvenio && camaraInicial?.nombreConvenio) {
          const convenioActual = data.find(
            (convenio) =>
              convenio.nombreConvenio === camaraInicial.nombreConvenio
          );

          if (convenioActual) {
            setIdConvenioSeleccionado(convenioActual.idConvenio);
          }
        }
      } catch (error) {
        console.error("Error al cargar convenios:", error);
        setError("No se pudieron cargar los convenios.");
      }
    };

      cargarConvenios();
  }, [camaraInicial?.idConvenio, camaraInicial?.nombreConvenio]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");

    navigate("/");
  };

  const guardarCambios = async () => {
    if (!idConvenioSeleccionado) {
      setError("Seleccione un convenio.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const datosLimpios = {
        costoEnlace: formulario.costoEnlace || null,
        fechaConvenioOriginal: formulario.fechaConvenioOriginal || null,
        fechaConvenioInicio: formulario.fechaConvenioInicio || null,
        fechaConvenioFin: formulario.fechaConvenioFin || null,
        estadoFechaConvenio: formulario.estadoFechaConvenio || null,
        fechaInicialPago: formulario.fechaInicialPago || null,
        proveedorEnlace: formulario.proveedorEnlace || null,
        responsablePago: formulario.responsablePago || null,
        direccionIp: formulario.direccionIp || null,
        direccion: formulario.direccion || null,
      };

      await actualizarConvenioCamara(
        idCamara,
        Number(idConvenioSeleccionado),
        datosLimpios
      );

      alert("Convenio actualizado correctamente.");
      localStorage.removeItem("convenioEditarSeleccionado");
      navigate("/convenios");
    } catch (error) {
      console.error("Error al actualizar convenio:", error);
      setError("No se pudo actualizar el convenio.");
    } finally {
      setGuardando(false);
    }
  };

  if (!puedeEditar) {
    return (
      <div className="camaras-page convenios-page">
        <main className="camaras-main">
          <section className="editar-convenio-card">
            <h2>Acceso no permitido</h2>
            <p>No tienes permisos para editar convenios.</p>

            <button
              type="button"
              className="btn-volver-convenio"
              onClick={() => navigate("/convenios")}
            >
              Volver a convenios
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="camaras-page convenios-page">
      <aside className="camaras-sidebar">
        <div className="logo-box">
          <h1>ECU 911</h1>
          <span>Servicio Integrado de Seguridad</span>
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
          <button onClick={() => navigate("/camaras")}>🎥 Cámaras</button>

          <button className="activo" onClick={() => navigate("/convenios")}>
            📄 Convenios
          </button>

          <button onClick={() => navigate("/reportes")}>📑 Reportes</button>

          {esSuperAdmin && (
            <button onClick={() => navigate("/auditorias")}>
              📋 Auditorías
            </button>
          )}
        </nav>
      </aside>

      <main className="camaras-main">
        <section className="page-header header-superior">
          <div>
            <h2>Editar convenio</h2>
            <p>Actualiza la información de convenio de la cámara seleccionada.</p>
          </div>

          <div className="dashboard-user">
            <div className="user-avatar">👤</div>

            <div>
              <strong>{username}</strong>
              <p>{rol}</p>
            </div>

            <button type="button" className="btn-salir" onClick={cerrarSesion}>
              Salir
            </button>
          </div>
        </section>

        {!camaraValida ? (
          <section className="editar-convenio-card">
            <h2>No se encontró el convenio seleccionado</h2>
            <p>Regresa al listado y selecciona nuevamente una cámara.</p>

            <button
              type="button"
              className="btn-volver-convenio"
              onClick={() => navigate("/convenios")}
            >
              Volver a convenios
            </button>
          </section>
        ) : (
          <section className="editar-convenio-card">
            <div className="editar-convenio-header">
              <div>
                <h3>
                  {camaraInicial.idPuntoOriginal} - {camaraInicial.nombreCamara}
                </h3>
                <p>
                  {camaraInicial.nombreProvincia} / {camaraInicial.nombreCanton}
                </p>
              </div>

              <button
                type="button"
                className="btn-volver-convenio"
                onClick={() => navigate("/convenios")}
              >
                Volver
              </button>
            </div>
            
            {error && <p className="mensaje-error">{error}</p>}
            <div className="editar-convenio-grid">
              <div className="campo-edicion-convenio">
                <label>Convenio</label>
                <select
                  value={idConvenioSeleccionado}
                  onChange={(e) => setIdConvenioSeleccionado(e.target.value)}
                >
                  <option value="">Seleccione convenio</option>

                  {conveniosDisponibles.map((convenio) => (
                    <option
                      key={convenio.idConvenio}
                      value={convenio.idConvenio}
                    >
                      {convenio.nombreConvenio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-edicion-convenio">
                <label>Dato original convenio</label>
                <input
                  value={formulario.fechaConvenioOriginal}
                  onChange={(e) =>
                    manejarCambio("fechaConvenioOriginal", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion-convenio">
                <label>Fecha inicio convenio</label>
                <input
                  type="date"
                  value={formulario.fechaConvenioInicio || ""}
                  onChange={(e) =>
                    manejarCambio("fechaConvenioInicio", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion-convenio">
                <label>Fecha fin convenio</label>
                <input
                  type="date"
                  value={formulario.fechaConvenioFin || ""}
                  onChange={(e) =>
                    manejarCambio("fechaConvenioFin", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion-convenio">
                <label>Estado fecha convenio</label>
                <select
                  value={formulario.estadoFechaConvenio}
                  onChange={(e) =>
                    manejarCambio("estadoFechaConvenio", e.target.value)
                  }
                >
                  <option value="">Seleccione estado</option>
                  <option value="VIGENTE">VIGENTE</option>
                  <option value="VENCIDO">VENCIDO</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="NO APLICA">NO APLICA</option>
                  <option value="SIN DATO">SIN DATO</option>
                </select>
              </div>

              <div className="campo-edicion-convenio">
                <label>Fecha inicial de pago</label>
                <input
                  type="date"
                  value={formulario.fechaInicialPago || ""}
                  onChange={(e) =>
                    manejarCambio("fechaInicialPago", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion-convenio">
                <label>Proveedor enlace</label>
                <input
                  value={formulario.proveedorEnlace}
                  onChange={(e) =>
                    manejarCambio("proveedorEnlace", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion-convenio">
                <label>Responsable pago</label>
                <input
                  value={formulario.responsablePago}
                  onChange={(e) =>
                    manejarCambio("responsablePago", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion-convenio">
                <label>Costo enlace</label>
                <input
                  value={formulario.costoEnlace}
                  onChange={(e) =>
                    manejarCambio("costoEnlace", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion-convenio">
                <label>Dirección IP</label>
                <input
                  value={formulario.direccionIp}
                  onChange={(e) =>
                    manejarCambio("direccionIp", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion-convenio campo-edicion-convenio-full">
                <label>Dirección</label>
                <textarea
                  value={formulario.direccion}
                  onChange={(e) => manejarCambio("direccion", e.target.value)}
                />
              </div>
            </div>

            <div className="editar-convenio-acciones">
              <button
                type="button"
                className="btn-volver-convenio"
                onClick={() => navigate("/convenios")}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-guardar-convenio"
                onClick={guardarCambios}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default ConvenioEditarPage;