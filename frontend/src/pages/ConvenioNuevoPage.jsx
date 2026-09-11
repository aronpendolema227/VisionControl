import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  obtenerCamarasFiltradas,
  actualizarConvenioCamara,
} from "../services/camaraService";
import { obtenerConvenios } from "../services/convenioService";
import "../styles/convenios.css";

function ConvenioNuevoPage() {
  const navigate = useNavigate();

  // Cámara que el usuario selecciona desde el desplegable.
  const [camaraSeleccionada, setCamaraSeleccionada] = useState(null);

  // Lista de tipos de convenio: SI, NO, EN TRÁMITE, NO APLICA.
  const [conveniosDisponibles, setConveniosDisponibles] = useState([]);

  // ID del convenio seleccionado en el select "Nuevo convenio".
  const [idConvenioSeleccionado, setIdConvenioSeleccionado] = useState("");

  // Datos adicionales que se guardan en la cámara, según las columnas de PostgreSQL/Excel.
  const [datosConvenio, setDatosConvenio] = useState({
    costoEnlace: "",
    fechaConvenioOriginal: "",
    fechaConvenioInicio: "",
    fechaConvenioFin: "",
    estadoFechaConvenio: "",
    fechaInicialPago: "",
    proveedorEnlace: "",
    responsablePago: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  // Cámaras nuevas o pendientes que todavía no tienen convenio.
  const [camarasSinConvenio, setCamarasSinConvenio] = useState([]);
  const [cargandoSinConvenio, setCargandoSinConvenio] = useState(true);

  // Actualiza un campo específico del formulario de datos de convenio.
  const manejarDatoConvenio = (campo, valor) => {
    setDatosConvenio((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  // Limpia los datos del formulario de convenio.
  const limpiarDatosConvenio = () => {
    setDatosConvenio({
      costoEnlace: "",
      fechaConvenioOriginal: "",
      fechaConvenioInicio: "",
      fechaConvenioFin: "",
      estadoFechaConvenio: "",
      fechaInicialPago: "",
      proveedorEnlace: "",
      responsablePago: "",
    });
  };

  // Devuelve true cuando una cámara no tiene convenio asignado.
  const esCamaraSinConvenio = (camara) => {
    const tieneIdConvenio =
      camara.idConvenio !== null &&
      camara.idConvenio !== undefined &&
      camara.idConvenio !== "";

    const tieneNombreConvenio =
      camara.nombreConvenio !== null &&
      camara.nombreConvenio !== undefined &&
      camara.nombreConvenio !== "";

    return !tieneIdConvenio && !tieneNombreConvenio;
  };

  // Carga nuevamente solo las cámaras sin convenio.
  // Esta función se usa para el botón "Actualizar lista".
  const cargarCamarasSinConvenio = async () => {
    try {
      setCargandoSinConvenio(true);
      setError("");

      const data = await obtenerCamarasFiltradas({
        busqueda: "",
        page: 0,
        size: 2000,
      });

      const lista = data.content || [];
      const sinConvenio = lista.filter(esCamaraSinConvenio);

      setCamarasSinConvenio(sinConvenio);
    } catch (error) {
      console.error("Error al cargar cámaras sin convenio:", error);
      setError("No se pudieron cargar las cámaras sin convenio.");
    } finally {
      setCargandoSinConvenio(false);
    }
  };

  // Carga inicial:
  // 1. Cámaras sin convenio.
  // 2. Convenios disponibles.
  useEffect(() => {
    let componenteActivo = true;

    const cargarDatosIniciales = async () => {
      try {
        const [dataCamaras, dataConvenios] = await Promise.all([
          obtenerCamarasFiltradas({
            busqueda: "",
            page: 0,
            size: 2000,
          }),
          obtenerConvenios(),
        ]);

        if (!componenteActivo) {
          return;
        }

        const lista = dataCamaras.content || [];
        const sinConvenio = lista.filter(esCamaraSinConvenio);

        setCamarasSinConvenio(sinConvenio);
        setConveniosDisponibles(dataConvenios || []);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);

        if (componenteActivo) {
          setError("No se pudieron cargar los datos iniciales.");
        }
      } finally {
        if (componenteActivo) {
          setCargandoSinConvenio(false);
        }
      }
    };

    cargarDatosIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  // Selecciona una cámara directamente desde el objeto.
  const seleccionarCamara = (camara) => {
    setCamaraSeleccionada(camara);
    setIdConvenioSeleccionado("");
    limpiarDatosConvenio();
    setError("");
  };

  // Selecciona una cámara desde el desplegable usando su idCamara.
  const seleccionarCamaraSinConvenio = (idCamara) => {
    if (!idCamara) {
      setCamaraSeleccionada(null);
      setIdConvenioSeleccionado("");
      limpiarDatosConvenio();
      return;
    }

    const camara = camarasSinConvenio.find(
      (item) => String(item.idCamara) === String(idCamara)
    );

    if (camara) {
      seleccionarCamara(camara);
    }
  };

  // Convenio seleccionado actualmente.
  const convenioSeleccionado = conveniosDisponibles.find(
    (convenio) =>
      String(convenio.idConvenio) === String(idConvenioSeleccionado)
  );

  const nombreConvenioSeleccionado =
    convenioSeleccionado?.nombreConvenio?.toUpperCase() || "";

  // Controla cuándo se muestran los campos adicionales.
  const mostrarCamposConvenio = idConvenioSeleccionado !== "";

  // Se usan para mostrar u ocultar campos específicos.
  const esConvenioSi = nombreConvenioSeleccionado === "SI";
  const esConvenioEnTramite =
    nombreConvenioSeleccionado === "EN TRÁMITE" ||
    nombreConvenioSeleccionado === "EN TRAMITE";

  // Cambia el convenio y autollenar valores base según SI, NO, EN TRÁMITE o NO APLICA.
  // Esto reemplaza el useEffect viejo que estaba causando errores.
  const manejarCambioConvenio = (valor) => {
    setIdConvenioSeleccionado(valor);

    const convenio = conveniosDisponibles.find(
      (item) => String(item.idConvenio) === String(valor)
    );

    const nombreConvenio = convenio?.nombreConvenio?.toUpperCase() || "";

    if (!valor) {
      limpiarDatosConvenio();
      return;
    }

    if (nombreConvenio === "SI") {
      setDatosConvenio((prev) => ({
        ...prev,
        costoEnlace: prev.costoEnlace || "",
        fechaConvenioOriginal: prev.fechaConvenioOriginal || "",
        fechaConvenioInicio: prev.fechaConvenioInicio || "",
        fechaConvenioFin: prev.fechaConvenioFin || "",
        estadoFechaConvenio: prev.estadoFechaConvenio || "VIGENTE",
        fechaInicialPago: prev.fechaInicialPago || "",
        proveedorEnlace: prev.proveedorEnlace || "CNT",
        responsablePago: prev.responsablePago || "",
      }));

      return;
    }

    if (nombreConvenio === "EN TRÁMITE" || nombreConvenio === "EN TRAMITE") {
      setDatosConvenio((prev) => ({
        ...prev,
        costoEnlace: prev.costoEnlace || "NO APLICA",
        fechaConvenioOriginal: "PENDIENTE",
        fechaConvenioInicio: "",
        fechaConvenioFin: "",
        estadoFechaConvenio: "PENDIENTE",
        fechaInicialPago: prev.fechaInicialPago || "",
        proveedorEnlace: prev.proveedorEnlace || "",
        responsablePago: prev.responsablePago || "",
      }));

      return;
    }

    if (nombreConvenio === "NO") {
      setDatosConvenio((prev) => ({
        ...prev,
        costoEnlace: prev.costoEnlace || "",
        fechaConvenioOriginal: "NO APLICA",
        fechaConvenioInicio: "",
        fechaConvenioFin: "",
        estadoFechaConvenio: "NO APLICA",
        fechaInicialPago: "",
        proveedorEnlace: prev.proveedorEnlace || "",
        responsablePago: prev.responsablePago || "",
      }));

      return;
    }

    if (nombreConvenio === "NO APLICA") {
      setDatosConvenio({
        costoEnlace: "NO APLICA",
        fechaConvenioOriginal: "NO APLICA",
        fechaConvenioInicio: "",
        fechaConvenioFin: "",
        estadoFechaConvenio: "NO APLICA",
        fechaInicialPago: "",
        proveedorEnlace: "NO APLICA",
        responsablePago: "NO APLICA",
      });
    }
  };

  // Guarda convenio + datos adicionales en la cámara seleccionada.
  const guardarConvenio = async () => {
    if (!camaraSeleccionada) {
      setError("Seleccione una cámara.");
      return;
    }

    if (!idConvenioSeleccionado) {
      setError("Seleccione un convenio.");
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const datosLimpios = {
        costoEnlace: datosConvenio.costoEnlace || null,
        fechaConvenioOriginal: datosConvenio.fechaConvenioOriginal || null,
        fechaConvenioInicio: datosConvenio.fechaConvenioInicio || null,
        fechaConvenioFin: datosConvenio.fechaConvenioFin || null,
        estadoFechaConvenio: datosConvenio.estadoFechaConvenio || null,
        fechaInicialPago: datosConvenio.fechaInicialPago || null,
        proveedorEnlace: datosConvenio.proveedorEnlace || null,
        responsablePago: datosConvenio.responsablePago || null,
      };

      await actualizarConvenioCamara(
        camaraSeleccionada.idCamara,
        Number(idConvenioSeleccionado),
        datosLimpios
      );

      alert("Convenio asignado correctamente.");
      navigate("/convenios");
    } catch (error) {
      console.error("Error al asignar convenio:", error);
      setError("No se pudo asignar el convenio.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="camaras-page">
      <aside className="camaras-sidebar">
        <div className="logo-box">
          <h1>ECU 911</h1>
          <span>Servicio Integrado de Seguridad</span>
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => navigate("/dashboard")}>📊 Dashboard</button>

          <button onClick={() => navigate("/camaras")}>🎥 Cámaras</button>

          <button onClick={() => navigate("/convenios")}>📄 Convenios</button>

          <button
            type="button"
            className="activo"
            onClick={() => navigate("/convenios/nuevo")}
          >
            + Nuevo convenio
          </button>

          <button onClick={() => navigate("/reportes")}>📝 Reportes</button>

          <button onClick={() => navigate("/auditorias")}>🕒 Auditorías</button>
        </nav>
      </aside>

      <main className="camaras-main">
        <section className="page-header header-superior">
          <div>
            <h2>NUEVO CONVENIO</h2>
            <p>
              Seleccione una cámara sin convenio y asigne el convenio
              correspondiente.
            </p>
          </div>
        </section>

        <section className="tabla-panel convenio-nuevo-panel">
          <div className="tabla-header">
            <div>
              <h3>Asignar convenio a cámara</h3>
              <p className="total-camaras">
                Seleccione una cámara pendiente de convenio.
              </p>
            </div>

            <button
              type="button"
              className="btn-volver-convenio"
              onClick={() => navigate("/convenios")}
            >
              ← Volver
            </button>
          </div>

          <div className="selector-camaras-sin-convenio">
            <label>Cámaras sin convenio</label>

            <select
              onChange={(e) => seleccionarCamaraSinConvenio(e.target.value)}
              disabled={cargandoSinConvenio}
              defaultValue=""
            >
              <option value="">
                {cargandoSinConvenio
                  ? "Cargando cámaras sin convenio..."
                  : "Seleccione una cámara sin convenio"}
              </option>

              {camarasSinConvenio.map((camara) => (
                <option key={camara.idCamara} value={camara.idCamara}>
                  {camara.idPuntoOriginal || camara.idCamara} -{" "}
                  {camara.nombreCamara || "Sin nombre"} -{" "}
                  {camara.direccionIp || "Sin IP"}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="btn-limpiar"
              onClick={cargarCamarasSinConvenio}
            >
              Actualizar lista
            </button>
          </div>

          {error && <p className="sin-datos">{error}</p>}

          {camaraSeleccionada && (
            <div className="convenio-seleccion-card">
              <h3>Cámara seleccionada</h3>

              <div className="detalle-convenio-grid">
                <p>
                  <strong>Nombre:</strong>
                  <span>{camaraSeleccionada.nombreCamara || "Sin dato"}</span>
                </p>

                <p>
                  <strong>Dirección IP:</strong>
                  <span>{camaraSeleccionada.direccionIp || "Sin dato"}</span>
                </p>

                <p>
                  <strong>Convenio actual:</strong>
                  <span>
                    {camaraSeleccionada.nombreConvenio || "Sin convenio"}
                  </span>
                </p>
              </div>

              <label>Nuevo convenio</label>

              <select
                value={idConvenioSeleccionado}
                onChange={(e) => manejarCambioConvenio(e.target.value)}
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

              {mostrarCamposConvenio && (
                <div className="campos-datos-convenio">
                  <h4>Datos del convenio</h4>

                  <div className="form-convenio-grid">
                    <div className="campo-convenio">
                      <label>Costo enlace</label>
                      <input
                        type="text"
                        placeholder="Ej: 8, 100 o NO APLICA"
                        value={datosConvenio.costoEnlace}
                        onChange={(e) =>
                          manejarDatoConvenio("costoEnlace", e.target.value)
                        }
                      />
                    </div>

                    <div className="campo-convenio">
                      <label>Fecha convenio original</label>
                      <input
                        type="text"
                        placeholder="Ej: 2013-04-12, PENDIENTE o NO APLICA"
                        value={datosConvenio.fechaConvenioOriginal}
                        onChange={(e) =>
                          manejarDatoConvenio(
                            "fechaConvenioOriginal",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    {esConvenioSi && (
                      <>
                        <div className="campo-convenio">
                          <label>Fecha convenio inicio</label>
                          <input
                            type="date"
                            value={datosConvenio.fechaConvenioInicio}
                            onChange={(e) =>
                              manejarDatoConvenio(
                                "fechaConvenioInicio",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="campo-convenio">
                          <label>Fecha convenio fin</label>
                          <input
                            type="date"
                            value={datosConvenio.fechaConvenioFin}
                            onChange={(e) =>
                              manejarDatoConvenio(
                                "fechaConvenioFin",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="campo-convenio">
                      <label>Estado fecha convenio</label>
                      <select
                        value={datosConvenio.estadoFechaConvenio}
                        onChange={(e) =>
                          manejarDatoConvenio(
                            "estadoFechaConvenio",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Seleccione estado</option>
                        <option value="VIGENTE">VIGENTE</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="VENCIDO">VENCIDO</option>
                        <option value="NO APLICA">NO APLICA</option>
                        <option value="SIN DATO">SIN DATO</option>
                      </select>
                    </div>

                    {(esConvenioSi || esConvenioEnTramite) && (
                      <div className="campo-convenio">
                        <label>Fecha inicial pago</label>
                        <input
                          type="date"
                          value={datosConvenio.fechaInicialPago}
                          onChange={(e) =>
                            manejarDatoConvenio(
                              "fechaInicialPago",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    )}

                    <div className="campo-convenio">
                      <label>Proveedor enlace</label>
                      <input
                        type="text"
                        placeholder="Ej: CNT, TELCONET o NO APLICA"
                        value={datosConvenio.proveedorEnlace}
                        onChange={(e) =>
                          manejarDatoConvenio("proveedorEnlace", e.target.value)
                        }
                      />
                    </div>

                    <div className="campo-convenio">
                      <label>Responsable pago</label>
                      <input
                        type="text"
                        placeholder="Ej: ECU911, GAD DAULE, PREFECTURA"
                        value={datosConvenio.responsablePago}
                        onChange={(e) =>
                          manejarDatoConvenio(
                            "responsablePago",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="acciones-nuevo-convenio">
                <button
                  type="button"
                  className="btn-limpiar"
                  onClick={() => {
                    setCamaraSeleccionada(null);
                    setIdConvenioSeleccionado("");
                    limpiarDatosConvenio();
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="btn-guardar-nuevo-convenio"
                  onClick={guardarConvenio}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar convenio"}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ConvenioNuevoPage;