import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import {
  buscarCamarasParaCambio,
  obtenerCamaraPorId,
  validarDuplicadosCamara,
} from "../services/camaraService";
import { obtenerConvenios } from "../services/convenioService";
import { obtenerMarcas } from "../services/marcaService";
import { obtenerModelosPorMarca } from "../services/modeloService";
import { crearHistorialCambioCamara } from "../services/historialCambioCamaraService";
import { obtenerPlataformas } from "../services/plataformaService";
import "../styles/camaras.css";

function CamaraCambioPage() {
  const navigate = useNavigate();
  const { idCamara } = useParams();

  const username = localStorage.getItem("username") || "Usuario";
  const rol = localStorage.getItem("rol") || "LECTOR";
  const token = localStorage.getItem("token");

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


  const puedeRegistrarCambio =
    rol === "SUPER_ADMIN" || rol === "ANALISTA_TECNOLOGIA" || rol === "EDITOR";

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);

  const [camara, setCamara] = useState(null);
  const [cargandoCamara, setCargandoCamara] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [conveniosDisponibles, setConveniosDisponibles] = useState([]);
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);
  const [modelosDisponibles, setModelosDisponibles] = useState([]);
  const [plataformasDisponibles, setPlataformasDisponibles] = useState([]);

  const obtenerFechaActual = () => {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
  };

  const obtenerFormularioInicial = () => ({
    fechaCambio: obtenerFechaActual(),
    tipoCambio: "",
    motivoCambio: "",
    observacionTecnica: "",

    idPuntoOriginal: "",
    nombreCamara: "",
    marca: "",
    modelo: "",
    idModelo: "",
    tipoDispositivo: "",
    pilotoCnt: "",
    anchoBanda: "",
    latitud: "",
    longitud: "",
    conversor: "",
    poste: "",
    brazo: "",

    idConvenio: "",
    fechaConvenioOriginal: "",
    fechaConvenioInicio: "",
    fechaConvenioFin: "",
    estadoFechaConvenio: "",
    fechaInicialPago: "",
    proveedorEnlace: "",
    responsablePago: "",
    costoEnlace: "",

    direccionIp: "",
    aQuienPertenece: "",
    estadoActual: "",
    tipoDanoSinServicio: "",
    tipoFallaTecnica: "",
    plataforma: "",
    idPlataforma: "",
    fechaInstalacion: "",
    direccion: "",
    observaciones: "",
  });

  const [formulario, setFormulario] = useState(obtenerFormularioInicial);

  const obtenerCampo = useCallback((objeto, campos) => {
    for (const campo of campos) {
      const valor = objeto?.[campo];

      if (valor !== null && valor !== undefined && valor !== "") {
        return valor;
      }
    }

    return "";
  }, []);

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

  const normalizarTexto = (valor) => String(valor ?? "").trim().toUpperCase();

  const obtenerIdMarca = useCallback(
    (marca) => obtenerCampo(marca, ["idMarca", "id_marca", "id"]),
    [obtenerCampo]
  );

  const obtenerNombreMarca = useCallback(
    (marca) =>
      obtenerCampo(marca, [
        "nombreMarca",
        "nombre_marca",
        "marcaNombre",
        "marca",
        "nombre",
      ]),
    [obtenerCampo]
  );

  const obtenerIdModelo = useCallback(
    (modelo) => obtenerCampo(modelo, ["idModelo", "id_modelo", "id"]),
    [obtenerCampo]
  );

  const obtenerNombreModelo = useCallback(
    (modelo) =>
      obtenerCampo(modelo, [
        "nombreModelo",
        "nombre_modelo",
        "modeloNombre",
        "modelo",
        "nombre",
      ]),
    [obtenerCampo]
  );

  const obtenerIdPlataforma = useCallback(
    (plataforma) =>
      obtenerCampo(plataforma, ["idPlataforma", "id_plataforma", "id"]),
    [obtenerCampo]
  );

  const obtenerNombrePlataforma = useCallback(
    (plataforma) =>
      obtenerCampo(plataforma, [
        "nombrePlataforma",
        "nombre_plataforma",
        "plataformaNombre",
        "plataforma",
        "nombre",
      ]),
    [obtenerCampo]
  );

  const obtenerTextoSugerenciaCamara = (item) => {
    const ip = obtenerCampo(item, ["direccionIp", "direccion_ip"]);
    const canton = obtenerCampo(item, ["nombreCanton", "canton"]);
    const provincia = obtenerCampo(item, ["nombreProvincia", "provincia"]);
    const estado = obtenerCampo(item, ["estadoActual", "estado_actual"]);

    return {
      titulo: `${item.idPuntoOriginal || ""} - ${item.nombreCamara || ""}`,
      detalle: `${ip || "Sin IP"} · ${canton || "Sin cantón"} · ${
        provincia || "Sin provincia"
      } · ${estado || "Sin estado"}`,
    };
  };

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");

    navigate("/");
  };

  const limpiarFormularioCambio = () => {
    setFormulario(obtenerFormularioInicial());
  };

  const llenarFormularioConCamara = useCallback(
    (camaraSeleccionada) => {
      setFormulario((prev) => ({
        ...prev,
        idPuntoOriginal: obtenerCampo(camaraSeleccionada, [
          "idPuntoOriginal",
          "id_punto_original",
        ]),
        nombreCamara: obtenerCampo(camaraSeleccionada, [
          "nombreCamara",
          "nombre_camara",
        ]),
        marca: obtenerCampo(camaraSeleccionada, [
          "marca",
          "nombreMarca",
          "marcaNombre",
          "nombre_marca",
          "marca_camara",
        ]),
        idModelo: obtenerCampo(camaraSeleccionada, [
          "idModelo",
          "id_modelo",
        ]),
        modelo: obtenerCampo(camaraSeleccionada, [
          "modelo",
          "nombreModelo",
          "modeloNombre",
          "nombre_modelo",
          "modelo_camara",
        ]),
        tipoDispositivo: obtenerCampo(camaraSeleccionada, [
          "tipoDispositivo",
          "tipo_dispositivo",
        ]),

        pilotoCnt: obtenerCampo(camaraSeleccionada, ["pilotoCnt", "piloto_cnt"]),
        anchoBanda: obtenerCampo(camaraSeleccionada, ["anchoBanda", "ancho_banda"]),
        latitud: obtenerCampo(camaraSeleccionada, ["latitud"]),
        longitud: obtenerCampo(camaraSeleccionada, ["longitud"]),
        conversor: obtenerCampo(camaraSeleccionada, ["conversor"]),
        poste: obtenerCampo(camaraSeleccionada, ["poste"]),
        brazo: obtenerCampo(camaraSeleccionada, ["brazo"]),

        idConvenio: obtenerCampo(camaraSeleccionada, ["idConvenio", "id_convenio"]),
        fechaConvenioOriginal: obtenerCampo(camaraSeleccionada, [
          "fechaConvenioOriginal",
          "fecha_convenio_original",
        ]),
        fechaConvenioInicio: normalizarFechaInput(
          obtenerCampo(camaraSeleccionada, [
            "fechaConvenioInicio",
            "fecha_convenio_inicio",
          ])
        ),
        fechaConvenioFin: normalizarFechaInput(
          obtenerCampo(camaraSeleccionada, ["fechaConvenioFin", "fecha_convenio_fin"])
        ),
        estadoFechaConvenio: obtenerCampo(camaraSeleccionada, [
          "estadoFechaConvenio",
          "estado_fecha_convenio",
        ]),
        fechaInicialPago: normalizarFechaInput(
          obtenerCampo(camaraSeleccionada, ["fechaInicialPago", "fecha_inicial_pago"])
        ),
        proveedorEnlace: obtenerCampo(camaraSeleccionada, [
          "proveedorEnlace",
          "proveedor_enlace",
        ]),
        responsablePago: obtenerCampo(camaraSeleccionada, [
          "responsablePago",
          "responsable_pago",
        ]),
        costoEnlace: obtenerCampo(camaraSeleccionada, ["costoEnlace", "costo_enlace"]),

        direccionIp: obtenerCampo(camaraSeleccionada, ["direccionIp", "direccion_ip"]),
        aQuienPertenece: obtenerCampo(camaraSeleccionada, [
          "aQuienPertenece",
          "aquienPertenece",
          "AQuienPertenece",
          "a_quien_pertenece",
        ]),
        estadoActual: obtenerCampo(camaraSeleccionada, ["estadoActual", "estado_actual"]),
        tipoDanoSinServicio: obtenerCampo(camaraSeleccionada, [
          "tipoDanoSinServicio",
          "tipo_dano_sin_servicio",
        ]),
        tipoFallaTecnica: obtenerCampo(camaraSeleccionada, [
          "tipoFallaTecnica",
          "tipo_falla_tecnica",
        ]),
        plataforma: obtenerCampo(camaraSeleccionada, [
          "plataforma",
          "nombrePlataforma",
          "plataformaNombre",
          "nombre_plataforma",
        ]),

        idPlataforma: obtenerCampo(camaraSeleccionada, [
          "idPlataforma",
          "id_plataforma",
        ]),
        fechaInstalacion: normalizarFechaInput(
          obtenerCampo(camaraSeleccionada, ["fechaInstalacion", "fecha_instalacion"])
        ),
        direccion: obtenerCampo(camaraSeleccionada, ["direccion"]),
        observaciones: obtenerCampo(camaraSeleccionada, ["observaciones"]),
      }));
    },
    [obtenerCampo]
  );

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
    if (!token) {
      navigate("/");
      return;
    }

    if (!puedeRegistrarCambio) {
      alert("No tiene permisos para registrar cambio de cámara.");
      navigate("/camaras");
      return;
    }

    const cargarPorId = async () => {
      if (!idCamara) {
        return;
      }

      try {
        setCargandoCamara(true);
        const data = await obtenerCamaraPorId(idCamara);
        setCamara(data);
        llenarFormularioConCamara(data);
      } catch (error) {
        console.error("Error al cargar cámara:", error);
        alert("No se pudo cargar la cámara.");
        navigate("/camaras");
      } finally {
        setCargandoCamara(false);
      }
    };

    cargarPorId();
  }, [token, puedeRegistrarCambio, idCamara, navigate, llenarFormularioConCamara]);

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

  useEffect(() => {
    const cargarMarcas = async () => {
      try {
        const data = await obtenerMarcas();
        setMarcasDisponibles(data || []);
      } catch (error) {
        console.error("Error al cargar marcas:", error);
      }
    };

    cargarMarcas();
  }, []);

  useEffect(() => {
    const cargarPlataformas = async () => {
      try {
        const data = await obtenerPlataformas();
        setPlataformasDisponibles(data || []);
      } catch (error) {
        console.error("Error al cargar plataformas:", error);
      }
    };

    cargarPlataformas();
  }, []);

  useEffect(() => {
    const marcaSeleccionada = marcasDisponibles.find(
      (item) =>
        normalizarTexto(obtenerNombreMarca(item)) ===
        normalizarTexto(formulario.marca)
    );

    const idMarca = marcaSeleccionada ? obtenerIdMarca(marcaSeleccionada) : "";

    if (!idMarca) {
      return;
    }

    const cargarModelos = async () => {
      try {
        const data = await obtenerModelosPorMarca(idMarca);
        setModelosDisponibles(data || []);
      } catch (error) {
        console.error("Error al cargar modelos:", error);
      }
    };

      cargarModelos();
  }, [
    formulario.marca,
    marcasDisponibles,
    obtenerIdMarca,
    obtenerNombreMarca,
  ]);

  const consultarSugerenciasCamaras = useCallback(
    async (textoBusqueda = "", mostrarAlerta = false) => {
      const texto = textoBusqueda.trim();

      if (!texto && mostrarAlerta) {
        alert("Ingrese un dato para buscar: GLPI, IP, nombre, ID, dirección, etc.");
        return;
      }

      try {
        setBuscando(true);

        const data = await buscarCamarasParaCambio({
          busqueda: texto,
          page: 0,
          size: 12,
        });

        const lista = Array.isArray(data) ? data : data.content || [];

        setResultados(lista);
        setMostrarSugerencias(true);

        if (lista.length === 0 && mostrarAlerta) {
          alert("No se encontraron cámaras con esa búsqueda.");
        }
      } catch (error) {
        console.error("Error al buscar cámaras:", error);

        if (mostrarAlerta) {
          alert("No se pudo realizar la búsqueda.");
        }
      } finally {
        setBuscando(false);
      }
    },
    []
  );

  const buscarCamaras = () => {
    setMostrarSugerencias(true);
    consultarSugerenciasCamaras(busqueda, true);
  };

  useEffect(() => {
    if (!mostrarSugerencias) {
      return;
    }

    const temporizador = setTimeout(() => {
      consultarSugerenciasCamaras(busqueda, false);
    }, busqueda.trim() ? 300 : 0);

    return () => clearTimeout(temporizador);
  }, [busqueda, mostrarSugerencias, consultarSugerenciasCamaras]);

  const seleccionarCamara = async (camaraSeleccionada) => {
    try {
      setCargandoCamara(true);

      const data = await obtenerCamaraPorId(camaraSeleccionada.idCamara);
      setCamara(data);
      llenarFormularioConCamara(data);
      setResultados([]);
      setMostrarSugerencias(false);

      setBusqueda(
        `${data.idPuntoOriginal || ""} - ${data.nombreCamara || ""}`
      );
    } catch (error) {
      console.error("Error al seleccionar cámara:", error);
      alert("No se pudo cargar la información completa de la cámara.");
    } finally {
      setCargandoCamara(false);
    }
  };

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

  const manejarCambioMarca = (idMarca) => {
    if (idMarca === "__actual__") {
      return;
    }

    const marcaSeleccionada = marcasDisponibles.find(
      (item) => String(obtenerIdMarca(item)) === String(idMarca)
    );

    const nombreMarca = marcaSeleccionada
      ? obtenerNombreMarca(marcaSeleccionada)
      : "";

    setFormulario((prev) => ({
      ...prev,
      marca: nombreMarca,
      modelo: "",
      idModelo: "",
    }));
  };

  const manejarCambioModelo = (idModelo) => {
    if (idModelo === "__actual__") {
      return;
    }

    const modeloSeleccionado = modelosDisponibles.find(
      (item) => String(obtenerIdModelo(item)) === String(idModelo)
    );

    const nombreModelo = modeloSeleccionado
      ? obtenerNombreModelo(modeloSeleccionado)
      : "";

    setFormulario((prev) => ({
      ...prev,
      idModelo,
      modelo: nombreModelo,
    }));
  };

  const manejarCambioPlataforma = (idPlataforma) => {
    if (idPlataforma === "__actual__") {
      return;
    }

    const plataformaSeleccionada = plataformasDisponibles.find(
      (item) => String(obtenerIdPlataforma(item)) === String(idPlataforma)
    );

    const nombrePlataforma = plataformaSeleccionada
      ? obtenerNombrePlataforma(plataformaSeleccionada)
      : "";

    setFormulario((prev) => ({
      ...prev,
      idPlataforma,
      plataforma: nombrePlataforma,
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

  const validarDuplicadosAntesDeGuardar = async () => {
    const camposAValidar = {};

    const idPuntoActual = obtenerCampo(camara, ["idPuntoOriginal", "id_punto_original"]);
    const nombreActual = obtenerCampo(camara, ["nombreCamara", "nombre_camara"]);
    const ipActual = obtenerCampo(camara, ["direccionIp", "direccion_ip"]);

    const idPuntoNuevo = String(formulario.idPuntoOriginal || "").trim();
    const nombreNuevo = String(formulario.nombreCamara || "").trim();
    const ipNueva = String(formulario.direccionIp || "").trim();

    if (!idPuntoNuevo) {
      alert("Debe ingresar el ID Punto.");
      return false;
    }

    if (!/^\d+$/.test(idPuntoNuevo)) {
      alert("El ID Punto debe contener solo números.");
      return false;
    }

    if (!nombreNuevo) {
      alert("Debe ingresar el nombre de la cámara.");
      return false;
    }

    if (!ipNueva) {
      alert("Debe ingresar la dirección IP.");
      return false;
    }

    if (normalizarTexto(idPuntoNuevo) !== normalizarTexto(idPuntoActual)) {
      camposAValidar.idPuntoOriginal = idPuntoNuevo;
    }

    if (normalizarTexto(nombreNuevo) !== normalizarTexto(nombreActual)) {
      camposAValidar.nombreCamara = nombreNuevo;
    }

    if (normalizarTexto(ipNueva) !== normalizarTexto(ipActual)) {
      camposAValidar.direccionIp = ipNueva;
    }

    if (Object.keys(camposAValidar).length === 0) {
      return true;
    }

    const duplicados = await validarDuplicadosCamara({
      ...camposAValidar,
      idCamaraExcluir: camara.idCamara,
    });

    const existeDuplicado = (...campos) => {
      if (duplicados === true) {
        return true;
      }

      return campos.some((campo) => duplicados?.[campo] === true);
    };

    if (
      existeDuplicado(
        "idPuntoDuplicado",
        "idPuntoOriginalDuplicado",
        "existeIdPuntoOriginal",
        "existeIdPunto",
        "idPuntoExiste"
      )
    ) {
      alert("Ya existe otra cámara con ese ID Punto.");
      return false;
    }

    if (
      existeDuplicado(
        "nombreCamaraDuplicado",
        "nombreDuplicado",
        "existeNombreCamara",
        "nombreCamaraExiste",
        "nombreExiste"
      )
    ) {
      alert("Ya existe otra cámara con ese nombre.");
      return false;
    }

    if (
      existeDuplicado(
        "direccionIpDuplicada",
        "ipDuplicada",
        "existeDireccionIp",
        "direccionIpExiste",
        "ipExiste"
      )
    ) {
      alert("Ya existe otra cámara con esa dirección IP.");
      return false;
    }

    if (duplicados?.existeDuplicado || duplicados?.duplicado) {
      alert("Existen datos duplicados. Revise ID Punto, nombre de cámara o IP.");
      return false;
    }

    return true;
  };

  const obtenerDatosCamaraActualizada = () => ({
    idAnalista: idAnalistaTecnologiaNumero,
    idPuntoOriginal: formulario.idPuntoOriginal
      ? Number(formulario.idPuntoOriginal)
      : null,
    nombreCamara: formulario.nombreCamara.trim(),
    marca: formulario.marca.trim(),
    modelo: formulario.modelo.trim(),
    idModelo: formulario.idModelo ? Number(formulario.idModelo) : null,
    tipoDispositivo: formulario.tipoDispositivo.trim(),
    pilotoCnt: formulario.pilotoCnt.trim(),
    anchoBanda: formulario.anchoBanda.trim(),
    latitud: formulario.latitud,
    longitud: formulario.longitud,
    aQuienPertenece: formulario.aQuienPertenece.trim(),
    plataforma: formulario.plataforma.trim(),
    idPlataforma: formulario.idPlataforma
      ? Number(formulario.idPlataforma)
      : null,
    direccionIp: formulario.direccionIp.trim(),
    estadoActual: formulario.estadoActual,
    tipoDanoSinServicio:
      formulario.estadoActual === "SIN SERVICIO"
        ? formulario.tipoDanoSinServicio || null
        : null,
    tipoFallaTecnica:
      formulario.estadoActual === "FALLA TECNICA"
        ? formulario.tipoFallaTecnica || null
        : null,
    fechaInstalacion: formulario.fechaInstalacion || null,
    direccion: formulario.direccion.trim(),
    observaciones: formulario.observaciones.trim(),
    conversor: formulario.conversor || null,
    poste: formulario.poste || null,
    brazo: formulario.brazo || null,

    idConvenio: formulario.idConvenio ? Number(formulario.idConvenio) : null,
    fechaConvenioOriginal: formulario.fechaConvenioOriginal || null,
    fechaConvenioInicio: formulario.fechaConvenioInicio || null,
    fechaConvenioFin: formulario.fechaConvenioFin || null,
    estadoFechaConvenio: formulario.estadoFechaConvenio || null,
    fechaInicialPago: formulario.fechaInicialPago || null,
    proveedorEnlace: formulario.proveedorEnlace || null,
    responsablePago: formulario.responsablePago || null,
    costoEnlace: formulario.costoEnlace || null,
  });

  const obtenerDatosAnteriores = () => ({
    idPuntoAnterior: obtenerCampo(camara, ["idPuntoOriginal", "id_punto_original"]),
    nombreCamaraAnterior: obtenerCampo(camara, ["nombreCamara", "nombre_camara"]),
    marcaAnterior: obtenerCampo(camara, [
      "nombreMarca",
      "marca",
      "marcaNombre",
      "nombre_marca",
    ]),
    modeloAnterior: obtenerCampo(camara, [
      "nombreModelo",
      "modelo",
      "modeloNombre",
      "nombre_modelo",
    ]),
    tipoDispositivoAnterior: obtenerCampo(camara, [
      "tipoDispositivo",
      "tipo_dispositivo",
    ]),
    pilotoCntAnterior: obtenerCampo(camara, ["pilotoCnt", "piloto_cnt"]),
    anchoBandaAnterior: obtenerCampo(camara, ["anchoBanda", "ancho_banda"]),
    latitudAnterior: obtenerCampo(camara, ["latitud"]),
    longitudAnterior: obtenerCampo(camara, ["longitud"]),
    conversorAnterior: obtenerCampo(camara, ["conversor"]),
    posteAnterior: obtenerCampo(camara, ["poste"]),
    brazoAnterior: obtenerCampo(camara, ["brazo"]),
    ipAnterior: obtenerCampo(camara, ["direccionIp", "direccion_ip"]),
    estadoAnterior: obtenerCampo(camara, ["estadoActual", "estado_actual"]),
    tipoDanoSinServicioAnterior: obtenerCampo(camara, [
      "tipoDanoSinServicio",
      "tipo_dano_sin_servicio",
    ]),
    tipoFallaTecnicaAnterior: obtenerCampo(camara, [
      "tipoFallaTecnica",
      "tipo_falla_tecnica",
    ]),
    plataformaAnterior: obtenerCampo(camara, [
      "nombrePlataforma",
      "plataforma",
      "plataformaNombre",
      "nombre_plataforma",
    ]),
    aQuienPerteneceAnterior: obtenerCampo(camara, [
      "aQuienPertenece",
      "a_quien_pertenece",
    ]),
    fechaInstalacionAnterior: obtenerCampo(camara, [
      "fechaInstalacion",
      "fecha_instalacion",
    ]),
    direccionAnterior: obtenerCampo(camara, ["direccion"]),
    observacionesAnteriores: obtenerCampo(camara, ["observaciones"]),
    idConvenioAnterior: obtenerCampo(camara, ["idConvenio", "id_convenio"]),
    fechaConvenioOriginalAnterior: obtenerCampo(camara, [
      "fechaConvenioOriginal",
      "fecha_convenio_original",
    ]),
    fechaConvenioInicioAnterior: obtenerCampo(camara, [
      "fechaConvenioInicio",
      "fecha_convenio_inicio",
    ]),
    fechaConvenioFinAnterior: obtenerCampo(camara, [
      "fechaConvenioFin",
      "fecha_convenio_fin",
    ]),
    estadoFechaConvenioAnterior: obtenerCampo(camara, [
      "estadoFechaConvenio",
      "estado_fecha_convenio",
    ]),
    fechaInicialPagoAnterior: obtenerCampo(camara, [
      "fechaInicialPago",
      "fecha_inicial_pago",
    ]),
    proveedorEnlaceAnterior: obtenerCampo(camara, [
      "proveedorEnlace",
      "proveedor_enlace",
    ]),
    responsablePagoAnterior: obtenerCampo(camara, [
      "responsablePago",
      "responsable_pago",
    ]),
    costoEnlaceAnterior: obtenerCampo(camara, ["costoEnlace", "costo_enlace"]),
  });

  const guardarCambio = async () => {
    if (!camara?.idCamara) {
      alert("Primero seleccione una cámara.");
      return;
    }

    if (!formulario.fechaCambio) {
      alert("Debe ingresar la fecha del cambio.");
      return;
    }

    if (!formulario.tipoCambio) {
      alert("Debe seleccionar el tipo de cambio.");
      return;
    }

    if (!formulario.motivoCambio.trim()) {
      alert("Debe ingresar el motivo del cambio.");
      return;
    }

    try {
      setGuardando(true);

      const duplicadosValidos = await validarDuplicadosAntesDeGuardar();

      if (!duplicadosValidos) {
        return;
      }

      const datosCamaraActualizada = obtenerDatosCamaraActualizada();

      const datosCambio = {
        idCamara: camara.idCamara,
        idAnalista: idAnalistaTecnologiaNumero,

        fechaCambio: formulario.fechaCambio,
        tipoCambio: formulario.tipoCambio,
        motivoCambio: formulario.motivoCambio.trim(),
        observacionTecnica: formulario.observacionTecnica.trim(),

        

        ...obtenerDatosAnteriores(),

        idPuntoNuevo: datosCamaraActualizada.idPuntoOriginal,
        nombreCamaraNueva: datosCamaraActualizada.nombreCamara,
        marcaNueva: datosCamaraActualizada.marca,
        modeloNuevo: datosCamaraActualizada.modelo,
        idModeloNuevo: datosCamaraActualizada.idModelo,
        tipoDispositivoNuevo: datosCamaraActualizada.tipoDispositivo,
        pilotoCntNuevo: datosCamaraActualizada.pilotoCnt,
        anchoBandaNuevo: datosCamaraActualizada.anchoBanda,
        latitudNueva: datosCamaraActualizada.latitud,
        longitudNueva: datosCamaraActualizada.longitud,
        conversorNuevo: datosCamaraActualizada.conversor,
        posteNuevo: datosCamaraActualizada.poste,
        brazoNuevo: datosCamaraActualizada.brazo,
        ipNueva: datosCamaraActualizada.direccionIp,
        estadoNuevo: datosCamaraActualizada.estadoActual,
        tipoDanoSinServicioNuevo: datosCamaraActualizada.tipoDanoSinServicio,
        tipoFallaTecnicaNuevo: datosCamaraActualizada.tipoFallaTecnica,
        plataformaNueva: datosCamaraActualizada.plataforma,
        idPlataformaNueva: datosCamaraActualizada.idPlataforma,
        aQuienPerteneceNuevo: datosCamaraActualizada.aQuienPertenece,
        fechaInstalacionNueva: datosCamaraActualizada.fechaInstalacion,
        direccionNueva: datosCamaraActualizada.direccion,
        observacionesNuevas: datosCamaraActualizada.observaciones,
        idConvenioNuevo: datosCamaraActualizada.idConvenio,
        fechaConvenioOriginalNueva: datosCamaraActualizada.fechaConvenioOriginal,
        fechaConvenioInicioNueva: datosCamaraActualizada.fechaConvenioInicio,
        fechaConvenioFinNueva: datosCamaraActualizada.fechaConvenioFin,
        estadoFechaConvenioNuevo: datosCamaraActualizada.estadoFechaConvenio,
        fechaInicialPagoNueva: datosCamaraActualizada.fechaInicialPago,
        proveedorEnlaceNuevo: datosCamaraActualizada.proveedorEnlace,
        responsablePagoNuevo: datosCamaraActualizada.responsablePago,
        costoEnlaceNuevo: datosCamaraActualizada.costoEnlace,

        // Este bloque permite que el backend actualice la ficha actual de camaras
        // desde el mismo servicio que registra el historial.
        datosCamaraActualizada,
      };

      await crearHistorialCambioCamara(datosCambio);

      alert("Cambio de cámara registrado correctamente.");
      setCamara(null);
      setResultados([]);
      setBusqueda("");
      limpiarFormularioCambio();
    } catch (error) {
      console.error("Error al registrar cambio de cámara:", error);
      const mensaje =
        error.response?.data?.message ||
        error.response?.data?.mensaje ||
        "No se pudo registrar el cambio de cámara.";
      alert(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  const marcaSeleccionadaFormulario = marcasDisponibles.find(
    (item) =>
      normalizarTexto(obtenerNombreMarca(item)) ===
      normalizarTexto(formulario.marca)
  );

  const idMarcaFormulario = marcaSeleccionadaFormulario
    ? String(obtenerIdMarca(marcaSeleccionadaFormulario))
    : "";

  

  return (
    <div className="camaras-page camara-cambio-page">
      

      <main className="camaras-main">
        <header className="camaras-header">
          <div>
            <h2>Cambio de cámara</h2>
            <p>
              Busca una cámara por GLPI, IP, nombre, ID punto, dirección,
              cantón o provincia.
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

        <section className="editar-camara-card">
          <div className="editar-camara-header">
            <div>
              <h3>Buscar cámara</h3>
              <p>
                Selecciona la cámara antes de registrar el cambio técnico o
                físico.
              </p>
            </div>

            <button
              type="button"
              className="btn-volver-edicion"
              onClick={() => navigate("/camaras")}
            >
              Volver
            </button>
          </div>

          <div className="buscador-principal">
            <div className="buscador-cambio-campo">
              <input
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setMostrarSugerencias(true);
                }}
                onFocus={() => {
                  setMostrarSugerencias(true);

                  if (resultados.length === 0) {
                    consultarSugerenciasCamaras(busqueda, false);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setMostrarSugerencias(false);
                  }, 180);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    buscarCamaras();
                  }
                }}
                placeholder="Buscar por Ticket GLPI, IP, nombre, ID punto, dirección, cantón..."
              />

              {mostrarSugerencias && (
                <div className="sugerencias-camaras-cambio">
                  {buscando && (
                    <div className="sugerencia-camara-vacia">
                      Buscando cámaras...
                    </div>
                  )}

                  {!buscando && resultados.length === 0 && (
                    <div className="sugerencia-camara-vacia">
                      No hay resultados.
                    </div>
                  )}

                  {!buscando &&
                    resultados.map((item) => {
                      const texto = obtenerTextoSugerenciaCamara(item);

                      return (
                        <button
                          key={item.idCamara}
                          type="button"
                          className="sugerencia-camara-cambio"
                          onMouseDown={() => seleccionarCamara(item)}
                        >
                          <strong>{texto.titulo}</strong>
                          <span>{texto.detalle}</span>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            <button type="button" onClick={buscarCamaras} disabled={buscando}>
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </section>

        {cargandoCamara && (
          <section className="editar-camara-card">
            <h3>Cargando cámara...</h3>
          </section>
        )}

        {camara && (
          <section className="editar-camara-card">
            <div className="editar-camara-header">
              <div>
                <h3>Formulario de cambio de cámara</h3>
                <p>
                  Punto {obtenerCampo(camara, ["idPuntoOriginal", "id_punto_original"])} - {" "}
                  {obtenerCampo(camara, ["nombreCamara", "nombre_camara"])}
                </p>
              </div>
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
                <label>Fecha de cambio</label>
                <input
                  type="date"
                  value={formulario.fechaCambio}
                  onChange={(e) => manejarCambio("fechaCambio", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Tipo de cambio</label>
                <select
                  value={formulario.tipoCambio}
                  onChange={(e) => manejarCambio("tipoCambio", e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="CAMBIO FISICO">Cambio físico</option>
                  <option value="REEMPLAZO DE EQUIPO">Reemplazo de equipo</option>
                  <option value="CAMBIO DE IP">Cambio de IP</option>
                  <option value="REUBICACION">Reubicación</option>
                  <option value="MANTENIMIENTO MAYOR">Mantenimiento mayor</option>
                </select>
              </div>

              <div className="campo-edicion campo-edicion-full">
                <h3>Datos de la cámara</h3>
              </div>

              <div className="campo-edicion">
                <label>ID Punto</label>
                <input
                  value={formulario.idPuntoOriginal}
                  onChange={(e) => manejarCambio("idPuntoOriginal", e.target.value)}
                  placeholder="Ej: 1001"
                />
              </div>

              <div className="campo-edicion">
                <label>Nombre cámara</label>
                <input
                  value={formulario.nombreCamara}
                  onChange={(e) => manejarCambio("nombreCamara", e.target.value)}
                  placeholder="Ej: GYE-001-DOMO"
                />
              </div>

              <div className="campo-edicion">
                <label>Marca</label>
                <select
                  value={idMarcaFormulario || (formulario.marca ? "__actual__" : "")}
                  onChange={(e) => manejarCambioMarca(e.target.value)}
                >
                  <option value="">Seleccione una marca</option>

                  {formulario.marca && !idMarcaFormulario && (
                    <option value="__actual__">{formulario.marca}</option>
                  )}

                  {marcasDisponibles.map((marca) => {
                    const idMarca = obtenerIdMarca(marca);
                    const nombreMarca = obtenerNombreMarca(marca);

                    return (
                      <option key={idMarca} value={idMarca}>
                        {nombreMarca}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="campo-edicion">
                <label>Modelo</label>
                <select
                  value={formulario.idModelo || (formulario.modelo ? "__actual__" : "")}
                  onChange={(e) => manejarCambioModelo(e.target.value)}
                  disabled={!formulario.marca}
                >
                  <option value="">
                    {formulario.marca ? "Seleccione un modelo" : "Seleccione primero una marca"}
                  </option>

                  {formulario.modelo && !formulario.idModelo && (
                    <option value="__actual__">{formulario.modelo}</option>
                  )}

                  {modelosDisponibles.map((modelo) => {
                    const idModelo = obtenerIdModelo(modelo);
                    const nombreModelo = obtenerNombreModelo(modelo);

                    return (
                      <option key={idModelo} value={idModelo}>
                        {nombreModelo}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="campo-edicion">
                <label>A quién pertenece</label>
                <input
                  value={formulario.aQuienPertenece}
                  onChange={(e) => manejarCambio("aQuienPertenece", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Dirección IP</label>
                <input
                  value={formulario.direccionIp}
                  onChange={(e) => manejarCambio("direccionIp", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Tipo dispositivo</label>
                <select
                  value={formulario.tipoDispositivo}
                  onChange={(e) => manejarCambio("tipoDispositivo", e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="DOMO">DOMO</option>
                  <option value="FIJA">FIJA</option>
                  <option value="PTZ">PTZ</option>
                  <option value="BULLET">BULLET</option>
                  <option value="LPR">LPR</option>
                </select>
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
                <select
                  value={formulario.anchoBanda}
                  onChange={(e) => manejarCambio("anchoBanda", e.target.value)}
                >
                  <option value="">Seleccione una opción</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
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
                  onChange={(e) => manejarCambio("estadoActual", e.target.value)}
                >
                  <option value="">Seleccione estado</option>
                  <option value="OPERATIVA">OPERATIVA</option>
                  <option value="NO OPERATIVA">NO OPERATIVA</option>
                  <option value="FALLA TECNICA">FALLA TECNICA</option>
                  <option value="CONECTIVIDAD">CONECTIVIDAD</option>
                  <option value="MANTENIMIENTO">MANTENIMIENTO</option>
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
                            name="tipoDanoSinServicioCambio"
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
                            name="tipoFallaTecnicaCambio"
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
                  <option value="RADIOENLACE">RADIOENLACE</option>
                  <option value="NO APLICA">NO APLICA</option>
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
                  <option value="Madera">Madera</option>
                  <option value="Pared">Pared</option>
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
                  <option value="Metalico">Metalico</option>
                  
                  <option value="Fibra">Fibra</option>
                  <option value="NO APLICA">NO APLICA</option>
                </select>
              </div>

              <div className="campo-edicion">
                <label>Plataforma</label>
                <select
                  value={formulario.idPlataforma || (formulario.plataforma ? "__actual__" : "")}
                  onChange={(e) => manejarCambioPlataforma(e.target.value)}
                >
                  <option value="">Seleccione una plataforma</option>

                  {formulario.plataforma && !formulario.idPlataforma && (
                    <option value="__actual__">{formulario.plataforma}</option>
                  )}

                  {plataformasDisponibles.map((plataforma) => {
                    const idPlataforma = obtenerIdPlataforma(plataforma);
                    const nombrePlataforma = obtenerNombrePlataforma(plataforma);

                    return (
                      <option key={idPlataforma} value={idPlataforma}>
                        {nombrePlataforma}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="campo-edicion">
                <label>Fecha instalación</label>
                <input
                  type="date"
                  value={formulario.fechaInstalacion || ""}
                  onChange={(e) => manejarCambio("fechaInstalacion", e.target.value)}
                />
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
                  onChange={(e) => manejarCambio("observaciones", e.target.value)}
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
                  onChange={(e) => manejarCambio("fechaConvenioOriginal", e.target.value)}
                  placeholder="Ej: 2013-04-12, PENDIENTE o NO APLICA"
                />
              </div>

              <div className="campo-edicion">
                <label>Fecha inicio convenio</label>
                <input
                  type="date"
                  value={formulario.fechaConvenioInicio || ""}
                  onChange={(e) => manejarCambio("fechaConvenioInicio", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Fecha fin convenio</label>
                <input
                  type="date"
                  value={formulario.fechaConvenioFin || ""}
                  onChange={(e) => manejarCambio("fechaConvenioFin", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Estado fecha convenio</label>
                <select
                  value={formulario.estadoFechaConvenio || ""}
                  onChange={(e) => manejarCambio("estadoFechaConvenio", e.target.value)}
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
                  onChange={(e) => manejarCambio("fechaInicialPago", e.target.value)}
                />
              </div>

              <div className="campo-edicion">
                <label>Proveedor enlace</label>
                <input
                  value={formulario.proveedorEnlace || ""}
                  onChange={(e) => manejarCambio("proveedorEnlace", e.target.value)}
                  placeholder="Ej: CNT, TELCONET o NO APLICA"
                />
              </div>

              <div className="campo-edicion">
                <label>Responsable pago</label>
                <input
                  value={formulario.responsablePago || ""}
                  onChange={(e) => manejarCambio("responsablePago", e.target.value)}
                  placeholder="Ej: ECU911, GAD, PREFECTURA"
                />
              </div>

              <div className="campo-edicion">
                <label>Costo enlace</label>
                <input
                  value={formulario.costoEnlace || ""}
                  onChange={(e) => manejarCambio("costoEnlace", e.target.value)}
                  placeholder="Ej: 8, 100 o NO APLICA"
                />
              </div>

              <div className="campo-edicion campo-edicion-full">
                <h3>Justificación del cambio</h3>
              </div>

              <div className="campo-edicion campo-edicion-full">
                <label>Motivo del cambio</label>
                <textarea
                  value={formulario.motivoCambio}
                  onChange={(e) => manejarCambio("motivoCambio", e.target.value)}
                  placeholder="Explique por qué se realiza el cambio de cámara"
                />
              </div>

              <div className="campo-edicion campo-edicion-full">
                <label>Observación técnica</label>
                <textarea
                  value={formulario.observacionTecnica}
                  onChange={(e) => manejarCambio("observacionTecnica", e.target.value)}
                  placeholder="Detalle técnico del cambio realizado"
                />
              </div>
            </div>

            <div className="editar-camara-acciones">
              <button
                type="button"
                className="btn-volver-edicion"
                onClick={() => {
                  setCamara(null);
                  limpiarFormularioCambio();
                }}
              >
                Cambiar selección
              </button>

              <button
                type="button"
                className="btn-guardar-edicion"
                onClick={guardarCambio}
                disabled={guardando}
              >
                {guardando ? "Guardando..." : "Guardar cambio"}
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default CamaraCambioPage;
