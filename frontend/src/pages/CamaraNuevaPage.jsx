import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import {
  FaUserAlt,
} from "react-icons/fa";

import { obtenerProvincias } from "../services/provinciaService";
import { obtenerCantonesPorProvincia } from "../services/cantonService";
import { obtenerMarcas } from "../services/marcaService";
import { obtenerModelosPorMarca } from "../services/modeloService";
import { obtenerPlataformas } from "../services/plataformaService";
import {
  crearCamara,
  validarDuplicadosCamara,
} from "../services/camaraService";
import { obtenerConvenios } from "../services/convenioService";


import "../styles/camaras.css";

function CamaraNuevaPage() {
  const navigate = useNavigate();

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

  const [provincias, setProvincias] = useState([]);
  const [cantones, setCantones] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [conveniosDisponibles, setConveniosDisponibles] = useState([]);

  const [formulario, setFormulario] = useState({
    idPuntoOriginal: "",
    nombreCamara: "",
    
    aQuienPertenece: "",

    idProvincia: "",
    idCanton: "",

    direccionIp: "",

    idPlataforma: "",
    estadoActual: "",
    fechaInstalacion: "",

    tipoDispositivo: "",

    idMarca: "",
    idModelo: "",

    pilotoCnt: "",
    anchoBanda: "",

    direccion: "",
    latitud: "",
    longitud: "",

    conversor: "",
    poste: "",
    brazo: "",

    observaciones: "",

    idConvenio: "",
    fechaConvenioOriginal: "",
    fechaConvenioInicio: "",
    fechaConvenioFin: "",
    estadoFechaConvenio: "",
    fechaInicialPago: "",
    proveedorEnlace: "",
    responsablePago: "",
    costoEnlace: "",
  });

  const [guardando, setGuardando] = useState(false);

  const [validandoDuplicados, setValidandoDuplicados] = useState(false);

  const [erroresDuplicados, setErroresDuplicados] = useState({
    idPuntoOriginal: "",
    nombreCamara: "",
    direccionIp: "",
  });

  const manejarCambio = (campo, valor) => {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    if (
      campo === "idPuntoOriginal" ||
      campo === "nombreCamara" ||
      campo === "direccionIp"
    ) {
      setErroresDuplicados((prev) => ({
        ...prev,
        [campo]: "",
      }));
    }
  };

  const obtenerIdProvincia = (provincia) => {
    return provincia.idProvincia || provincia.id_provincia || provincia.id;
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

  const obtenerIdCanton = (canton) => {
    return canton.idCanton || canton.id_canton || canton.id;
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

  const obtenerIdMarca = (marca) => {
    return marca.idMarca || marca.id_marca || marca.id;
  };

  const obtenerNombreMarca = (marca) => {
    return (
      marca.nombreMarca ||
      marca.nombre_marca ||
      marca.nombre ||
      marca.marca ||
      ""
    );
  };

  const obtenerIdModelo = (modelo) => {
    return modelo.idModelo || modelo.id_modelo || modelo.id;
  };

  const obtenerNombreModelo = (modelo) => {
    return (
      modelo.nombreModelo ||
      modelo.nombre_modelo ||
      modelo.nombre ||
      modelo.modelo ||
      ""
    );
  };

  const obtenerIdPlataforma = (plataforma) => {
    return plataforma.idPlataforma || plataforma.id_plataforma || plataforma.id;
  };

  const obtenerNombrePlataforma = (plataforma) => {
    return (
      plataforma.nombrePlataforma ||
      plataforma.nombre_plataforma ||
      plataforma.nombre ||
      plataforma.plataforma ||
      ""
    );
  };

  

  useEffect(() => {
    const cargarCatalogos = async () => {
      try {
        const [
          provinciasData,
          marcasData,
          plataformasData,
          conveniosData,
        ] = await Promise.all([
          obtenerProvincias(),
          obtenerMarcas(),
          obtenerPlataformas(),
          obtenerConvenios(),
        ]);

        setProvincias(provinciasData || []);
        setMarcas(marcasData || []);
        setPlataformas(plataformasData || []);
        setConveniosDisponibles(conveniosData || []);
      } catch (error) {
        console.error("Error al cargar catálogos:", error);
        alert("No se pudieron cargar los catálogos.");
      }
    };

    cargarCatalogos();
  }, []);

  const manejarCambioProvincia = async (idProvincia) => {
    manejarCambio("idProvincia", idProvincia);
    manejarCambio("idCanton", "");

    if (!idProvincia) {
      setCantones([]);
      return;
    }

    try {
      const data = await obtenerCantonesPorProvincia(idProvincia);
      setCantones(data || []);
    } catch (error) {
      console.error("Error al cargar cantones:", error);
      setCantones([]);
    }
  };

  const manejarCambioMarca = async (idMarca) => {
    manejarCambio("idMarca", idMarca);
    manejarCambio("idModelo", "");

    if (!idMarca) {
      setModelos([]);
      return;
    }

    try {
      const data = await obtenerModelosPorMarca(idMarca);
      setModelos(data || []);
    } catch (error) {
      console.error("Error al cargar modelos:", error);
      setModelos([]);
    }
  };
  
  const manejarCambioConvenio = (idConvenio) => {
    manejarCambio("idConvenio", idConvenio);

    const convenio = conveniosDisponibles.find(
      (item) => String(item.idConvenio) === String(idConvenio)
    );

    const nombreConvenio = convenio?.nombreConvenio?.toUpperCase() || "";

    if (!idConvenio) {
      manejarCambio("fechaConvenioOriginal", "");
      manejarCambio("fechaConvenioInicio", "");
      manejarCambio("fechaConvenioFin", "");
      manejarCambio("estadoFechaConvenio", "");
      manejarCambio("fechaInicialPago", "");
      manejarCambio("proveedorEnlace", "");
      manejarCambio("responsablePago", "");
      manejarCambio("costoEnlace", "");
      return;
    }

    if (nombreConvenio === "SI") {
      manejarCambio("estadoFechaConvenio", "VIGENTE");
      manejarCambio("proveedorEnlace", "CNT");
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

  const obtenerFechaActual = () => {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  };

  const validarCamposDuplicados = async () => {
    const idPuntoOriginal = formulario.idPuntoOriginal
      ? Number(formulario.idPuntoOriginal)
      : "";

    const nombreCamara = formulario.nombreCamara.trim();
    const direccionIp = formulario.direccionIp.trim();

    if (!idPuntoOriginal && !nombreCamara && !direccionIp) {
      return true;
    }

    try {
      setValidandoDuplicados(true);

      const resultado = await validarDuplicadosCamara({
        idPuntoOriginal,
        nombreCamara,
        direccionIp,
      });

      const nuevosErrores = {
        idPuntoOriginal: resultado.idPuntoOriginalExiste
          ? "Ya existe una cámara con este ID Punto."
          : "",
        nombreCamara: resultado.nombreCamaraExiste
          ? "Ya existe una cámara con este nombre."
          : "",
        direccionIp: resultado.direccionIpExiste
          ? "Ya existe una cámara con esta dirección IP."
          : "",
      };

      setErroresDuplicados(nuevosErrores);

      return !(
        nuevosErrores.idPuntoOriginal ||
        nuevosErrores.nombreCamara ||
        nuevosErrores.direccionIp
      );
    } catch (error) {
      console.error("Error al validar duplicados:", error);
      alert("No se pudo validar si la cámara ya existe.");
      return false;
    } finally {
      setValidandoDuplicados(false);
    }
  };

  const guardarCamara = async () => {
    if (!formulario.idPuntoOriginal) {
      alert("Ingrese el ID Punto.");
      return;
    }

    if (!formulario.nombreCamara.trim()) {
      alert("Ingrese el nombre de la cámara.");
      return;
    }

    if (!formulario.idCanton) {
      alert("Seleccione provincia y cantón.");
      return;
    }

    if (!formulario.idModelo) {
      alert("Seleccione marca y modelo.");
      return;
    }

    if (!formulario.idPlataforma) {
      alert("Seleccione la plataforma.");
      return;
    }

    const sinDuplicados = await validarCamposDuplicados();

    if (!sinDuplicados) {
      alert("Revise los campos marcados. Hay datos que ya existen.");
      return;
    }

    try {
      setGuardando(true);

      const datosCamara = {
        idPuntoOriginal: Number(formulario.idPuntoOriginal),
        nombreCamara: formulario.nombreCamara.trim(),
        idAnalista: idAnalistaTecnologiaNumero,

        aQuienPertenece: formulario.aQuienPertenece.trim(),
        direccionIp: formulario.direccionIp.trim(),
        estadoActual: formulario.estadoActual,
        fechaInstalacion: formulario.fechaInstalacion || obtenerFechaActual(),
        tipoDispositivo: formulario.tipoDispositivo,
        pilotoCnt: formulario.pilotoCnt,
        anchoBanda: formulario.anchoBanda,
        conversor: formulario.conversor || null,
        poste: formulario.poste || null,
        brazo: formulario.brazo || null,
        direccion: formulario.direccion,
        latitud: formulario.latitud ? Number(formulario.latitud) : null,
        longitud: formulario.longitud ? Number(formulario.longitud) : null,
        observaciones: formulario.observaciones,

        idCanton: Number(formulario.idCanton),
        idModelo: Number(formulario.idModelo),
        idPlataforma: Number(formulario.idPlataforma),
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

      console.log("Datos enviados al backend:", datosCamara);

      await crearCamara(datosCamara);

      alert("Cámara creada correctamente.");
      navigate("/camaras");
    } catch (error) {
      console.error("Error al crear cámara:", error);
      alert("No se pudo crear la cámara. Revisa la consola o el backend.");
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
            <p>No tienes permisos para crear cámaras.</p>

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

  const hayDuplicados = Object.values(erroresDuplicados).some(Boolean);

  return (
    <div className="camaras-page camara-nueva-page">
      

      <main className="camaras-main">
        <header className="camaras-header">
          <div>
            <h2>Nueva cámara</h2>
            <p>Registra una nueva cámara en el inventario ECU 911.</p>
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

        <section className="editar-camara-card">
          <div className="editar-camara-header">
            <div>
              <h3>Formulario de nueva cámara</h3>
              <p>Completa la información básica de la cámara.</p>
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
              <label>ID Punto</label>
              <input
                className={erroresDuplicados.idPuntoOriginal ? "input-error" : ""}
                value={formulario.idPuntoOriginal}
                onChange={(e) =>
                  manejarCambio("idPuntoOriginal", e.target.value)
                }
                onBlur={validarCamposDuplicados}
                placeholder="Ej: 1010"
              />

              {erroresDuplicados.idPuntoOriginal && (
                <small className="mensaje-error-campo">
                  {erroresDuplicados.idPuntoOriginal}
                </small>
              )}
            </div>

            

            <div className="campo-edicion">
              <label>Nombre cámara</label>
              <input
                className={erroresDuplicados.nombreCamara ? "input-error" : ""}
                value={formulario.nombreCamara}
                onChange={(e) =>
                  manejarCambio("nombreCamara", e.target.value)
                }
                onBlur={validarCamposDuplicados}
                placeholder="Ej: GYE-001-DOMO"
              />

              {erroresDuplicados.nombreCamara && (
                <small className="mensaje-error-campo">
                  {erroresDuplicados.nombreCamara}
                </small>
              )}
            </div>

            

            <div className="campo-edicion">
              <label>A quién pertenece</label>
              <input
                value={formulario.aQuienPertenece}
                onChange={(e) =>
                  manejarCambio("aQuienPertenece", e.target.value)
                }
                placeholder="Ej: ECU911"
              />
            </div>

            <div className="campo-edicion">
              <label>Provincia</label>
              <select
                value={formulario.idProvincia}
                onChange={(e) => manejarCambioProvincia(e.target.value)}
              >
                <option value="">Seleccione provincia</option>

                {provincias.map((provincia) => (
                  <option
                    key={obtenerIdProvincia(provincia)}
                    value={obtenerIdProvincia(provincia)}
                  >
                    {obtenerNombreProvincia(provincia)}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-edicion">
              <label>Cantón</label>
              <select
                value={formulario.idCanton}
                onChange={(e) => manejarCambio("idCanton", e.target.value)}
                disabled={!formulario.idProvincia}
              >
                <option value="">
                  {formulario.idProvincia
                    ? "Seleccione cantón"
                    : "Primero seleccione provincia"}
                </option>

                {cantones.map((canton) => (
                  <option key={obtenerIdCanton(canton)} value={obtenerIdCanton(canton)}>
                    {obtenerNombreCanton(canton)}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-edicion">
              <label>Dirección IP</label>
              <input
                className={erroresDuplicados.direccionIp ? "input-error" : ""}
                value={formulario.direccionIp}
                onChange={(e) => manejarCambio("direccionIp", e.target.value)}
                onBlur={validarCamposDuplicados}
                placeholder="Ej: 10.1.1.1"
              />

              {erroresDuplicados.direccionIp && (
                <small className="mensaje-error-campo">
                  {erroresDuplicados.direccionIp}
                </small>
              )}
            </div>

            <div className="campo-edicion">
              <label>Plataforma</label>
              <select
                value={formulario.idPlataforma}
                onChange={(e) => manejarCambio("idPlataforma", e.target.value)}
              >
                <option value="">Seleccione plataforma</option>

                {plataformas.map((plataforma) => (
                  <option
                    key={obtenerIdPlataforma(plataforma)}
                    value={obtenerIdPlataforma(plataforma)}
                  >
                    {obtenerNombrePlataforma(plataforma)}
                  </option>
                ))}
              </select>
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
              </select>
            </div>

            <div className="campo-edicion">
              <label>Fecha instalación</label>
              <input
                type="date"
                value={formulario.fechaInstalacion}
                onChange={(e) =>
                  manejarCambio("fechaInstalacion", e.target.value)
                }
              />
            </div>

            <div className="campo-edicion">
              <label>Tipo dispositivo</label>
              <select
                value={formulario.tipoDispositivo}
                onChange={(e) =>
                  manejarCambio("tipoDispositivo", e.target.value)
                }
              >
                <option value="">Seleccione tipo</option>
                <option value="DOMO">DOMO</option>
                <option value="FIJA">FIJA</option>
              </select>
            </div>

            <div className="campo-edicion">
              <label>Marca</label>
              <select
                value={formulario.idMarca}
                onChange={(e) => manejarCambioMarca(e.target.value)}
              >
                <option value="">Seleccione marca</option>

                {marcas.map((marca) => (
                  <option key={obtenerIdMarca(marca)} value={obtenerIdMarca(marca)}>
                    {obtenerNombreMarca(marca)}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-edicion">
              <label>Modelo</label>
              <select
                value={formulario.idModelo}
                onChange={(e) => manejarCambio("idModelo", e.target.value)}
                disabled={!formulario.idMarca}
              >
                <option value="">
                  {formulario.idMarca ? "Seleccione modelo" : "Primero seleccione marca"}
                </option>

                {modelos.map((modelo) => (
                  <option key={obtenerIdModelo(modelo)} value={obtenerIdModelo(modelo)}>
                    {obtenerNombreModelo(modelo)}
                  </option>
                ))}
              </select>
            </div>

            <div className="campo-edicion">
              <label>Piloto CNT</label>
              <input
                value={formulario.pilotoCnt}
                onChange={(e) => manejarCambio("pilotoCnt", e.target.value)}
                placeholder="Ej: 88214"
              />
            </div>

            <div className="campo-edicion">
              <label>Ancho banda</label>
              <input
                value={formulario.anchoBanda}
                onChange={(e) => manejarCambio("anchoBanda", e.target.value)}
                placeholder="Ej: 2"
              />
            </div>

            <div className="campo-edicion">
              <label>Latitud</label>
              <input
                value={formulario.latitud}
                onChange={(e) => manejarCambio("latitud", e.target.value)}
                placeholder="Ej: -2.190888889"
              />
            </div>

            <div className="campo-edicion">
              <label>Longitud</label>
              <input
                value={formulario.longitud}
                onChange={(e) => manejarCambio("longitud", e.target.value)}
                placeholder="Ej: -79.889000000"
              />
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
                <option value="METALICO">Metálico</option>
                <option value="HORMIGON">Hormigón</option>
                <option value="FIBRA">Fibra</option>
              </select>
            </div>

            <div className="campo-edicion">
              <label>Brazo</label>
              <select
                value={formulario.brazo}
                onChange={(e) => manejarCambio("brazo", e.target.value)}
              >
                <option value="">Seleccione una opción</option>
                <option value="FIBRA">Fibra</option>
                <option value="METALICO">Metálico</option>
                
              </select>
            </div>

            <div className="campo-edicion campo-edicion-full">
              <label>Dirección</label>
              <textarea
                value={formulario.direccion}
                onChange={(e) => manejarCambio("direccion", e.target.value)}
                placeholder="Ingrese la dirección de ubicación de la cámara"
              />
            </div>

            <div className="campo-edicion campo-edicion-full">
              <label>Observaciones</label>
              <textarea
                value={formulario.observaciones}
                onChange={(e) =>
                  manejarCambio("observaciones", e.target.value)
                }
                placeholder="Observaciones generales"
              />
            </div>

            <div className="campo-edicion campo-edicion-full">
              <h3>Información de convenio</h3>
            </div>

            <div className="campo-edicion">
              <label>Convenio</label>
              <select
                value={formulario.idConvenio}
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
                value={formulario.fechaConvenioOriginal}
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
                value={formulario.fechaConvenioInicio}
                onChange={(e) =>
                  manejarCambio("fechaConvenioInicio", e.target.value)
                }
              />
            </div>

            <div className="campo-edicion">
              <label>Fecha fin convenio</label>
              <input
                type="date"
                value={formulario.fechaConvenioFin}
                onChange={(e) =>
                  manejarCambio("fechaConvenioFin", e.target.value)
                }
              />
            </div>

            <div className="campo-edicion">
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

            <div className="campo-edicion">
              <label>Fecha inicial pago</label>
              <input
                type="date"
                value={formulario.fechaInicialPago}
                onChange={(e) =>
                  manejarCambio("fechaInicialPago", e.target.value)
                }
              />
            </div>

            <div className="campo-edicion">
              <label>Proveedor enlace</label>
              <input
                value={formulario.proveedorEnlace}
                onChange={(e) =>
                  manejarCambio("proveedorEnlace", e.target.value)
                }
                placeholder="Ej: CNT, TELCONET o NO APLICA"
              />
            </div>

            <div className="campo-edicion">
              <label>Responsable pago</label>
              <input
                value={formulario.responsablePago}
                onChange={(e) =>
                  manejarCambio("responsablePago", e.target.value)
                }
                placeholder="Ej: ECU911, GAD, PREFECTURA"
              />
            </div>

            <div className="campo-edicion">
              <label>Costo enlace</label>
              <input
                value={formulario.costoEnlace}
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
              onClick={guardarCamara}
              disabled={guardando || validandoDuplicados || hayDuplicados}
            >
              {guardando
              ? "Guardando..."
              : validandoDuplicados
              ? "Validando..."
              : "Guardar cámara"}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CamaraNuevaPage;