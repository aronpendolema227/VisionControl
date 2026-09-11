import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import { actualizarCamara } from "../services/camaraService";
import { obtenerConvenios } from "../services/convenioService";

import "../styles/camaras.css";


function CamaraEditarPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { idCamara } = useParams();
  

  const username = localStorage.getItem("username") || "Usuario";
  const rol = localStorage.getItem("rol") || "LECTOR";

  const idAnalistaTecnologia =
    localStorage.getItem("idAnalista") ||
    localStorage.getItem("id_analista") ||
    localStorage.getItem("analistaId") ||
    "";

  const nombreAnalistaTecnologia =
    localStorage.getItem("nombreCompleto") ||
    localStorage.getItem("nombre_completo") ||
    localStorage.getItem("nombreAnalista") ||
    username;

  const idAnalistaTecnologiaNumero =
    idAnalistaTecnologia && !Number.isNaN(Number(idAnalistaTecnologia))
      ? Number(idAnalistaTecnologia)
      : null;

  
  const puedeEditar = rol === "ANALISTA_TECNOLOGIA" || rol === "SUPER_ADMIN";

  const camaraGuardada = localStorage.getItem("camaraEditarSeleccionada");

  const camaraInicial =
    location.state?.camara ||
    (camaraGuardada ? JSON.parse(camaraGuardada) : null);

  const camaraValida =
    camaraInicial && String(camaraInicial.idCamara) === String(idCamara);  


  const obtenerCampo = (objeto, campos) => {
    for (const campo of campos) {
      const valor = objeto?.[campo];

      if (valor !== null && valor !== undefined && valor !== "") {
        return valor;
      }
    }

    return "";
  };

  const normalizarFechaInput = (fecha) => {
    if (!fecha) {
      return "";
    }

    if (/^\d{4}-\d{2}-\d{2}/.test(fecha)) {
      return fecha.slice(0, 10);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(fecha)) {
      const [dia, mes, anio] = fecha.split("/");
      return `${anio}-${mes}-${dia}`;
    }

    return "";
  };

  const normalizarOpcionInfraestructura = (campo, valor) => {
    if (!valor) {
      return "";
    }

    const valorLimpio = String(valor).trim();

    const opciones = {
      conversor: {
        OPCION_1: "GPON",
        OPCION_2: "FOT",
        OPCION_3: "SWITCH",
      },
      poste: {
        OPCION_1: "Metalico",
        OPCION_2: "Hormigon",
        OPCION_3: "Fibra",
        OPCION_4: "NO APLICA",
      },
      brazo: {
        OPCION_1: "Fibra",
        OPCION_2: "Metalico",
      },
    };

    return opciones[campo]?.[valorLimpio] || valorLimpio;
  };

  
  const [formulario, setFormulario] = useState({
    nombreCamara: obtenerCampo(camaraInicial, [
      "nombreCamara",
      "nombre_camara",
    ]),

    marca: obtenerCampo(camaraInicial, [
      "marca",
      "nombreMarca",
      "marcaNombre",
      "nombre_marca",
      "marca_camara",
    ]),

    modelo: obtenerCampo(camaraInicial, [
      "modelo",
      "nombreModelo",
      "modeloNombre",
      "nombre_modelo",
      "modelo_camara",
    ]),

    tipoDispositivo: obtenerCampo(camaraInicial, [
      "tipoDispositivo",
      "tipo_dispositivo",
    ]),

    pilotoCnt: obtenerCampo(camaraInicial, [
      "pilotoCnt",
      "piloto_cnt",
    ]),

    anchoBanda: obtenerCampo(camaraInicial, [
      "anchoBanda",
      "ancho_banda",
    ]),

    latitud: obtenerCampo(camaraInicial, [
      "latitud",
    ]),

    longitud: obtenerCampo(camaraInicial, [
      "longitud",
    ]),

    conversor: normalizarOpcionInfraestructura(
      "conversor",
      obtenerCampo(camaraInicial, ["conversor"])
    ),

    poste: normalizarOpcionInfraestructura(
      "poste",
      obtenerCampo(camaraInicial, ["poste"])
    ),

    brazo: normalizarOpcionInfraestructura(
      "brazo",
      obtenerCampo(camaraInicial, ["brazo"])
    ),

    descripcionDano: obtenerCampo(camaraInicial, [
      "descripcionDano",
      "descripcion_dano",
    ]),

    tipoDanoSinServicio: obtenerCampo(camaraInicial, [
      "tipoDanoSinServicio",
      "tipo_dano_sin_servicio",
    ]),

    tipoFallaTecnica: obtenerCampo(camaraInicial, [
      "tipoFallaTecnica",
      "tipo_falla_tecnica",
    ]),

    serieCamara: obtenerCampo(camaraInicial, [
      "serieCamara",
      "serie_camara",
    ]),

    marcaUps: obtenerCampo(camaraInicial, [
      "marcaUps",
      "marca_ups",
    ]),

    serieUps: obtenerCampo(camaraInicial, [
      "serieUps",
      "serie_ups",
    ]),

    estadoUps: obtenerCampo(camaraInicial, [
      "estadoUps",
      "estado_ups",
    ]),

    abejas: obtenerCampo(camaraInicial, [
      "abejas",
    ]),

    idConvenio: obtenerCampo(camaraInicial, [
      "idConvenio",
      "id_convenio",
    ]),

    

    fechaConvenioInicio: normalizarFechaInput(
      obtenerCampo(camaraInicial, [
        "fechaConvenioInicio",
        "fecha_convenio_inicio",
      ])
    ),

    fechaConvenioFin: normalizarFechaInput(
      obtenerCampo(camaraInicial, [
        "fechaConvenioFin",
        "fecha_convenio_fin",
      ])
    ),

    estadoFechaConvenio: obtenerCampo(camaraInicial, [
      "estadoFechaConvenio",
      "estado_fecha_convenio",
    ]),

    fechaInicialPago: normalizarFechaInput(
      obtenerCampo(camaraInicial, [
        "fechaInicialPago",
        "fecha_inicial_pago",
      ])
    ),

    proveedorEnlace: obtenerCampo(camaraInicial, [
      "proveedorEnlace",
      "proveedor_enlace",
    ]),

    responsablePago: obtenerCampo(camaraInicial, [
      "responsablePago",
      "responsable_pago",
    ]),

    costoEnlace: obtenerCampo(camaraInicial, [
      "costoEnlace",
      "costo_enlace",
    ]),

    direccionIp: obtenerCampo(camaraInicial, [
      "direccionIp",
      "direccion_ip",
    ]),

    

    aQuienPertenece: obtenerCampo(camaraInicial, [
      "aQuienPertenece",
      "aquienPertenece",
      "AQuienPertenece",
      "a_quien_pertenece",
    ]),

    estadoActual: obtenerCampo(camaraInicial, [
      "estadoActual",
      "estado_actual",
    ]),

    plataforma: obtenerCampo(camaraInicial, [
      "plataforma",
      "nombrePlataforma",
      "plataformaNombre",
      "nombre_plataforma",
    ]),

    fechaInstalacion: normalizarFechaInput(
      obtenerCampo(camaraInicial, [
        "fechaInstalacion",
        "fecha_instalacion",
      ])
    ),

    direccion: obtenerCampo(camaraInicial, [
      "direccion",
    ]),

    observaciones: obtenerCampo(camaraInicial, [
      "observaciones",
    ]),
  });



  
  const [guardando, setGuardando] = useState(false);
  const [conveniosDisponibles, setConveniosDisponibles] = useState([]);

  const opcionesTipoDanoSinServicio = [
    "ELECTRICO",
    "CAMARA",
    "SINIESTRO",
    "CONECTIVIDAD",
    "REVISION",
    "RETIRO DE INFRAESTRUCTURA",
  ];

  const opcionesTipoFallaTecnica = [
    "DAÑO DE ENFOQUE",
    "PANTALLA AZUL",
    "PANTALLA NEGRA",
    "PANTALLA BLANCA",
    "DAÑO ZOOM",
    "DAÑO ROTOR",
    "INTERMITENCIA",
  ];


  useEffect(() => {
    const cargarConvenios = async () => {
      try {
        const data = await obtenerConvenios();
        setConveniosDisponibles(data || []);
      } catch (error) {
        console.error("Error al cargar convenios:", error);
      }
    };

    cargarConvenios();
  }, []);

  const manejarCambio = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
      ...(campo === "estadoActual" && valor !== "SIN SERVICIO"
        ? { tipoDanoSinServicio: "" }
        : {}),
      ...(campo === "estadoActual" && valor !== "FALLA TECNICA"
        ? { tipoFallaTecnica: "" }
        : {}),
    }));
  };

  const manejarTipoDanoSinServicio = (opcion) => {
    setFormulario((prev) => ({
      ...prev,
      tipoDanoSinServicio: opcion,
    }));
  };

  const manejarTipoFallaTecnica = (opcion) => {
    setFormulario((prev) => ({
      ...prev,
      tipoFallaTecnica: opcion,
    }));
  };

  const manejarCambioConvenio = (idConvenio) => {
    manejarCambio("idConvenio", idConvenio);

    const convenio = conveniosDisponibles.find(
      (item) => String(item.idConvenio) === String(idConvenio)
    );

    const nombreConvenio = convenio?.nombreConvenio?.toUpperCase() || "";

    if (!idConvenio) {
      return;
    }

    if (nombreConvenio === "SI") {
      manejarCambio("estadoFechaConvenio", "VIGENTE");
      return;
    }

    if (nombreConvenio === "EN TRÁMITE" || nombreConvenio === "EN TRAMITE") {
      manejarCambio("fechaConvenioOriginal", "PENDIENTE");
      manejarCambio("estadoFechaConvenio", "PENDIENTE");
      manejarCambio("costoEnlace", "NO APLICA");
      return;
    }

    if (nombreConvenio === "NO") {
      manejarCambio("fechaConvenioOriginal", "NO APLICA");
      manejarCambio("estadoFechaConvenio", "NO APLICA");
      manejarCambio("fechaConvenioInicio", "");
      manejarCambio("fechaConvenioFin", "");
      manejarCambio("fechaInicialPago", "");
      return;
    }

    if (nombreConvenio === "NO APLICA") {
      manejarCambio("fechaConvenioOriginal", "NO APLICA");
      manejarCambio("estadoFechaConvenio", "NO APLICA");
      manejarCambio("proveedorEnlace", "NO APLICA");
      manejarCambio("responsablePago", "NO APLICA");
      manejarCambio("costoEnlace", "NO APLICA");
      manejarCambio("fechaConvenioInicio", "");
      manejarCambio("fechaConvenioFin", "");
      manejarCambio("fechaInicialPago", "");
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");

    navigate("/");
  };

  const guardarCambios = async () => {
    try {
      setGuardando(true);

      const datosActualizados = {
        ...camaraInicial,

        idAnalista: idAnalistaTecnologiaNumero,
        nombreCamara: formulario.nombreCamara,
        marca: formulario.marca,
        modelo: formulario.modelo,
        tipoDispositivo: formulario.tipoDispositivo,
        pilotoCnt: formulario.pilotoCnt,
        anchoBanda: formulario.anchoBanda,
        latitud: formulario.latitud,
        longitud: formulario.longitud,
        aQuienPertenece: formulario.aQuienPertenece,
        plataforma: formulario.plataforma,
        direccionIp: formulario.direccionIp,
        estadoActual: formulario.estadoActual,
        fechaInstalacion: formulario.fechaInstalacion || null,
        direccion: formulario.direccion,
        observaciones: formulario.observaciones,
        conversor: formulario.conversor || null,
        poste: formulario.poste || null,
        brazo: formulario.brazo || null,
        descripcionDano: formulario.descripcionDano || null,
        tipoDanoSinServicio:
          formulario.estadoActual === "SIN SERVICIO"
            ? formulario.tipoDanoSinServicio || null
            : null,
        tipoFallaTecnica:
          formulario.estadoActual === "FALLA TECNICA"
            ? formulario.tipoFallaTecnica || null
            : null,
        serieCamara: formulario.serieCamara || null,
        marcaUps: formulario.marcaUps || null,
        serieUps: formulario.serieUps || null,
        estadoUps: formulario.estadoUps || null,
        abejas: formulario.abejas || null,

        idConvenio: formulario.idConvenio
          ? Number(formulario.idConvenio)
          : null,
        fechaConvenioOriginal: formulario.fechaConvenioOriginal || null,
        fechaConvenioInicio: formulario.fechaConvenioInicio || null,
        fechaConvenioFin: formulario.fechaConvenioFin || null,
        estadoFechaConvenio: formulario.estadoFechaConvenio || null,
        fechaInicialPago: formulario.fechaInicialPago || null,
        proveedorEnlace: formulario.proveedorEnlace || null,
        responsablePago: formulario.responsablePago || null,
        costoEnlace: formulario.costoEnlace || null,
      };

      await actualizarCamara(idCamara, datosActualizados);

      alert("Cámara actualizada correctamente.");

      localStorage.removeItem("camaraEditarSeleccionada");
      navigate("/camaras");
    } catch (error) {
      console.error("Error al actualizar cámara:", error);
      alert("No se pudo actualizar la cámara.");
    } finally {
      setGuardando(false);
    }
  };

  if (!puedeEditar) {
    return (
      <div className="camaras-page">
        <main className="camaras-main">
          <section className="editar-camara-card">
            <h2>Acceso no permitido</h2>
            <p>No tienes permisos para editar cámaras.</p>

            <button
              type="button"
              className="btn-volver-edicion"
              onClick={() => navigate("/camaras")}
            >
              Volver a cámaras
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="camaras-page camara-editar-page">
      

      <main className="camaras-main">
        <header className="camaras-header">
          <div>
            <h2>Editar cámara</h2>
            <p>Actualiza la información operativa de la cámara seleccionada.</p>
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

        {!camaraValida ? (
          <section className="editar-camara-card">
            <h2>No se encontró la cámara seleccionada</h2>
            <p>Regresa al listado y selecciona nuevamente una cámara.</p>

            <button
              type="button"
              className="btn-volver-edicion"
              onClick={() => navigate("/camaras")}
            >
              Volver a cámaras
            </button>
          </section>
        ) : (
          <section className="editar-camara-card">
            <div className="editar-camara-header">
              <div>
                <h3>
                  {camaraInicial.idPuntoOriginal} - {camaraInicial.nombreCamara}
                </h3>
                <p>{camaraInicial.canton}</p>
              </div>

              <button
                type="button"
                className="btn-volver-edicion"
                onClick={() => navigate("/camaras")}
              >
                Volver
              </button>
            </div>

            <div className="editar-camara-grid">
              <div className="campo-edicion">
                <label>ID Analista tecnología</label>
                <input
                  value={idAnalistaTecnologia || "Sin ID registrado"}
                  disabled
                  readOnly
                />
              </div>

              <div className="campo-edicion">
                <label>Analista de tecnología</label>
                <input
                  value={nombreAnalistaTecnologia}
                  disabled
                  readOnly
                />
              </div>
              <div className="campo-edicion">
                <label>Nombre cámara</label>
                <input
                  value={formulario.nombreCamara}
                  onChange={(e) =>
                    manejarCambio("nombreCamara", e.target.value)
                  }
                  placeholder="Ej: GYE-001-DOMO"
                />
              </div>
                
              <div className="campo-edicion">
                <label>Marca</label>
                <input
                  value={formulario.marca}
                  onChange={(e) => manejarCambio("marca", e.target.value)}
                  placeholder="Ej: HIKVISION"
                />
              </div>

              <div className="campo-edicion">
                <label>Modelo</label>
                <input
                  value={formulario.modelo }
                  onChange={(e) => manejarCambio("modelo", e.target.value)}
                  placeholder="Ej: Hikvision DS-2DE422IW-DE"
                />
              </div>


              <div className="campo-edicion">
                <label>A quién pertenece</label>
                <input
                  value={formulario.aQuienPertenece || "Sin dato"}
                  onChange={(e) => manejarCambio("aQuienPertenece", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Dirección IP</label>
                <input
                  value={formulario.direccionIp}
                  onChange={(e) =>
                    manejarCambio("direccionIp", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion">
                <label>Tipo dispositivo</label>
                <input
                  value={formulario.tipoDispositivo}
                  onChange={(e) => manejarCambio("tipoDispositivo", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Piloto CNT</label>
                <input
                  value={formulario.pilotoCnt}
                  onChange={(e) => manejarCambio("pilotoCnt", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Ancho de banda</label>
                <input
                  value={formulario.anchoBanda}
                  onChange={(e) => manejarCambio("anchoBanda", e.target.value)}
                />
              </div>
              <div className="campo-edicion">
                <label>Latitud</label>
                <input
                  value={formulario.latitud}
                  onChange={(e) => manejarCambio("latitud", e.target.value)}
                />
              </div>
              <div className="campo-edicion">
                <label>Longitud</label>
                <input 
                  value={formulario.longitud}
                  onChange={(e) => manejarCambio("longitud", e.target.value)}
                />
              </div>

              

              <div className="campo-edicion">
                <label>Estado actual</label>
                <select
                  value={formulario.estadoActual}
                  onChange={(e) =>
                    manejarCambio("estadoActual", e.target.value)
                  }
                >
                  <option value="">Seleccione estado</option>
                  <option value="OPERATIVA">OPERATIVA</option>
                  <option value="NO OPERATIVA">NO OPERATIVA</option>
                  <option value="FALLA TECNICA">FALLA TECNICA</option>
                  <option value="SIN SERVICIO">SIN SERVICIO</option>
                </select>


                {formulario.estadoActual === "SIN SERVICIO" && (
                  <div className="campo-edicion campo-edicion-full">
                    <label>Tipo de daño</label>

                    <div className="tipo-dano-opciones">
                      {opcionesTipoDanoSinServicio.map((opcion) => (
                        <label key={opcion} className="tipo-dano-check">
                          <input
                            type="radio"
                            name="tipoDanoSinServicio"
                            checked={formulario.tipoDanoSinServicio === opcion}
                            onChange={() => manejarTipoDanoSinServicio(opcion)}
                          />
                          <span>{opcion}</span>
                        </label>
                      ))}
                    </div>

                    <small className="ayuda-campo">
                      Seleccione un solo tipo de daño.
                    </small>
                  </div>
                )}

                {formulario.estadoActual === "FALLA TECNICA" && (
                  <div className="campo-edicion campo-edicion-full">
                    <label>Tipo de falla</label>

                    <div className="tipo-dano-opciones">
                      {opcionesTipoFallaTecnica.map((opcion) => (
                        <label key={opcion} className="tipo-dano-check">
                          <input
                            type="radio"
                            name="tipoFallaTecnica"
                            checked={formulario.tipoFallaTecnica === opcion}
                            onChange={() => manejarTipoFallaTecnica(opcion)}
                          />
                          <span>{opcion}</span>
                        </label>
                      ))}
                    </div>

                    <small className="ayuda-campo">
                      Seleccione un solo tipo de falla.
                    </small>
                  </div>
                )}

              </div>

              <div className="campo-edicion">
                <label>Conversor</label>
                <select
                  value={formulario.conversor}
                  onChange={(e) => manejarCambio("conversor", e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                    <option value="GPON">GPON</option>
                    <option value="FOT">FOT</option>
                    <option value="SWITCH">SWITCH</option>
                </select>
              </div>

              <div className="campo-edicion">
                <label>Poste</label>
                <select
                  value={formulario.poste}
                  onChange={(e) => manejarCambio("poste", e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Metalico">Metalico</option>
                  <option value="Hormigon">Hormigon</option>
                  <option value="Fibra">Fibra</option>
                  <option value="NO APLICA">NO APLICA</option>
                </select>
              </div>

              <div className="campo-edicion">
                <label>Brazo</label>
                <select
                  value={formulario.brazo}
                  onChange={(e) => manejarCambio("brazo", e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="Fibra">Fibra</option>
                  <option value="Metalico">Metalico</option>
                  
                </select>
              </div>

              <div className="campo-edicion">
                <label>Plataforma</label>
                <input
                  value={formulario.plataforma}
                  onChange={(e) => manejarCambio("plataforma", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Fecha instalación</label>
                <input
                  type="date"
                  value={formulario.fechaInstalacion || ""}
                  onChange={(e) =>
                    manejarCambio("fechaInstalacion", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion campo-edicion-full">
                <h3>Información técnica adicional</h3>
              </div>

              <div className="campo-edicion campo-edicion-full">
                <label>Descripción daño</label>
                <textarea
                  value={formulario.descripcionDano || ""}
                  onChange={(e) => manejarCambio("descripcionDano", e.target.value)}
                  placeholder="Describa el daño encontrado en la cámara"
                />
              </div>

              <div className="campo-edicion">
                <label>Serie de la cámara</label>
                <input
                  value={formulario.serieCamara || ""}
                  onChange={(e) => manejarCambio("serieCamara", e.target.value)}
                  placeholder="Ingrese la serie de la cámara"
                />
              </div>

              <div className="campo-edicion">
                <label>Marca UPS</label>
                <input
                  value={formulario.marcaUps || ""}
                  onChange={(e) => manejarCambio("marcaUps", e.target.value)}
                  placeholder="Ej: APC, Forza, CDP"
                />
              </div>

              <div className="campo-edicion">
                <label>Serie UPS</label>
                <input
                  value={formulario.serieUps || ""}
                  onChange={(e) => manejarCambio("serieUps", e.target.value)}
                  placeholder="Ingrese la serie del UPS"
                />
              </div>

              <div className="campo-edicion">
                <label>Estado UPS</label>
                <select
                  value={formulario.estadoUps || ""}
                  onChange={(e) => manejarCambio("estadoUps", e.target.value)}
                >
                  <option value="">Seleccione estado</option>
                  <option value="BUENO">Bueno</option>
                  <option value="MALO">Malo</option>
                  <option value="REGULAR">Regular</option>
                </select>
              </div>

              <div className="campo-edicion">
                <label>Abejas</label>
                <select
                  value={formulario.abejas || ""}
                  onChange={(e) => manejarCambio("abejas", e.target.value)}
                >
                  <option value="">Seleccione opción</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </div>

              <div className="campo-edicion campo-edicion-full">
                <label>Dirección</label>
                <textarea
                  value={formulario.direccion}
                  onChange={(e) => manejarCambio("direccion", e.target.value)}
                />
              </div>

              <div className="campo-edicion campo-edicion-full">
                <label>Observaciones</label>
                <textarea
                  value={formulario.observaciones}
                  onChange={(e) =>
                    manejarCambio("observaciones", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion campo-edicion-full">
                <h3>Información de convenio</h3>
              </div>

              <div className="campo-edicion">
                <label>Convenio</label>
                <select
                  value={formulario.idConvenio || ""}
                  onChange={(e) => manejarCambioConvenio(e.target.value)}
                >
                  <option value="">Seleccione convenio</option>

                  {conveniosDisponibles.map((convenio) => (
                    <option key={convenio.idConvenio} value={convenio.idConvenio}>
                      {convenio.nombreConvenio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo-edicion">
                <label>Fecha convenio original</label>
                <input
                  value={formulario.fechaConvenioOriginal || ""}
                  onChange={(e) =>
                    manejarCambio("fechaConvenioOriginal", e.target.value)
                  }
                  placeholder="Ej: 2013-04-12, PENDIENTE o NO APLICA"
                />
              </div>

              <div className="campo-edicion">
                <label>Fecha inicio convenio</label>
                <input
                  type="date"
                  value={formulario.fechaConvenioInicio || ""}
                  onChange={(e) =>
                    manejarCambio("fechaConvenioInicio", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion">
                <label>Fecha fin convenio</label>
                <input
                  type="date"
                  value={formulario.fechaConvenioFin || ""}
                  onChange={(e) =>
                    manejarCambio("fechaConvenioFin", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion">
                <label>Estado fecha convenio</label>
                <select
                  value={formulario.estadoFechaConvenio || ""}
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

              <div className="campo-edicion">
                <label>Fecha inicial pago</label>
                <input
                  type="date"
                  value={formulario.fechaInicialPago || ""}
                  onChange={(e) =>
                    manejarCambio("fechaInicialPago", e.target.value)
                  }
                />
              </div>

              <div className="campo-edicion">
                <label>Proveedor enlace</label>
                <input
                  value={formulario.proveedorEnlace || ""}
                  onChange={(e) =>
                    manejarCambio("proveedorEnlace", e.target.value)
                  }
                  placeholder="Ej: CNT, TELCONET o NO APLICA"
                />
              </div>

              <div className="campo-edicion">
                <label>Responsable pago</label>
                <input
                  value={formulario.responsablePago || ""}
                  onChange={(e) =>
                    manejarCambio("responsablePago", e.target.value)
                  }
                  placeholder="Ej: ECU911, GAD, PREFECTURA"
                />
              </div>

              <div className="campo-edicion">
                <label>Costo enlace</label>
                <input
                  value={formulario.costoEnlace || ""}
                  onChange={(e) =>
                    manejarCambio("costoEnlace", e.target.value)
                  }
                  placeholder="Ej: 8, 100 o NO APLICA"
                />
              </div>

            </div>

            <div className="editar-camara-acciones">
              <button
                type="button"
                className="btn-volver-edicion"
                onClick={() => navigate("/camaras")}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="btn-guardar-edicion"
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

export default CamaraEditarPage;