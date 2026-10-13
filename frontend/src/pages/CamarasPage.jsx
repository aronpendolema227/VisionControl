import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import {MdDashboard} from "react-icons/md";
import UserHeaderActions from "../components/common/UserHeaderActions";
import {
  FaVideo,
  FaFileContract,
  FaClipboardList,
  FaPlus,
  FaExchangeAlt,
  FaPowerOff,
  FaEye,
  FaEdit,
  FaDownload,
} from "react-icons/fa";

// Servicio principal de cámaras.

import {
  obtenerCamarasFiltradas,
  exportarCamarasFiltradas,
  obtenerFechasInstalacion,
} from "../services/camaraService";

// Estilos de esta pantalla.
import "../styles/camaras.css";

// Servicios para llenar los selects con datos reales del backend.
import { obtenerProvincias } from "../services/provinciaService";
import { obtenerCantonesPorProvincia } from "../services/cantonService";
import { obtenerPlataformas } from "../services/plataformaService";
//odtiene convenios
import { obtenerConvenios } from "../services/convenioService";

import { obtenerMarcas } from "../services/marcaService";
import { obtenerModelosPorMarca } from "../services/modeloService";



function CamarasPage() {
  const navigate = useNavigate();
  const location = useLocation();
  

  
  // ESTADOS PRINCIPALES DE LA TABLA
  // =========================================================
  // camaras: lista que se pinta en la tabla.
  // paginaActual: página actual recibida desde Spring Boot.
  // totalPaginas: total de páginas que devuelve el backend.
  // cargando: muestra el mensaje "Cargando cámaras...".
  const [camaras, setCamaras] = useState([]);
  const [paginaActual, setPaginaActual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(true);
  //total elementos
  const [totalElementos, setTotalElementos] = useState(0);

  
  //  DATOS DEL USUARIO LOGUEADO
  // =========================================================
  // Estos datos vienen del login y se guardaron en localStorage.
  // Si no hay token, más abajo se redirige al login.
  const username = localStorage.getItem("username") || "Usuario";
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol") || "LECTOR" ;
  const esSuperAdmin = rol === "SUPER_ADMIN";
  const puedeEditar = rol === "ANALISTA_TECNOLOGIA" || rol === "SUPER_ADMIN";


  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("rol");

    navigate("/");
  };

  // ESTADOS DEL MODAL "VER DETALLE"
  // =========================================================
  // camaraSeleccionada: guarda la cámara que se abrió con el botón Ver.
  // mostrarDetalle: controla si el modal está visible o no.
  const [camaraSeleccionada, setCamaraSeleccionada] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  
  // ESTADOS DE BÚSQUEDA Y LISTAS PARA SELECTS
  // =========================================================
  // busqueda: texto escrito en el input principal.
  // provinciasDisponibles: lista de provincias reales del backend.
  // plataformasDisponibles: lista de plataformas reales del backend.
  const [busqueda, setBusqueda] = useState("");
  const [provinciasDisponibles, setProvinciasDisponibles] = useState([]);
  const [plataformasDisponibles, setPlataformasDisponibles] = useState([]);
  const [conveniosDisponibles, setConveniosDisponibles] = useState([]);
  const [marcasDisponibles, setMarcasDisponibles] = useState([]);
  const [modelosDisponibles, setModelosDisponibles] = useState([]);
  const [fechasInstalacionDisponibles, setFechasInstalacionDisponibles] = useState([]);


  // ESTADOS ESPECIALES PARA PROVINCIA Y CANTÓN
  // =========================================================
  // provinciaSeleccionada guarda el idProvincia.
  // cantonSeleccionado guarda el idCanton.
  // cantones guarda solo los cantones de la provincia seleccionada.
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState("");
  const [cantonSeleccionado, setCantonSeleccionado] = useState("");
  const [cantones, setCantones] = useState([]);


  // ESTADO GENERAL DE FILTROS
  // =========================================================
  // Este objeto guarda filtros que no necesitan lógica especial.
  // provincia y canton se mantienen aquí también para poder limpiar todo junto,
  // pero los valores reales usados para consultar el backend están en:
  // provinciaSeleccionada y cantonSeleccionado.
  const [filtros, setFiltros] = useState({
    busqueda: "",
    idProvincia: "",
    idCanton: "",
    estado: "",
    plataforma: "",
    convenio: "",
    idMarca: "",
    idModelo: "",
    anchoBanda: "",
    tipoDanoSinServicio: "",
    tipoFallaTecnica: "",
    fechaInstalacion: "",
  });
  const filtroNotificacion = location.state?.filtroNotificacion || "";

const estadoDesdeNotificacion =
  filtroNotificacion === "CAMARAS_CON_NOVEDAD"
    ? location.state?.estado || ""
    : "";
  // CARGA INICIAL DE CÁMARAS
  // =========================================================
  // Apenas entra a la página, carga la primera página de cámaras desde el backend.
  // Usa el endpoint filtrado, pero con todos los filtros vacíos.
  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    let cancelado = false;

    const cargarDatosIniciales = async () => {
      try {
        setCargando(true);

        

        const data = await obtenerCamarasFiltradas({
          busqueda: "",
          idProvincia: "",
          idCanton: "",
          estado: estadoDesdeNotificacion,
          plataforma: "",
          convenio: "",
          idMarca: "",
          idModelo: "",
          anchoBanda: "",
          fechaInstalacion: "",
          coversor: "",
          poste: "",
          brazo: "",
          page: 0,
          size: 10,
        });

        

        if (!cancelado) {
          setCamaras(data.content || []);
          setTotalPaginas(data.totalPages || 0);
          setPaginaActual(data.number || 0);
          setTotalElementos(data.totalElements || 0);

          setFiltros((prevFiltros) => ({
            ...prevFiltros,
            estado: estadoDesdeNotificacion,
          }));
        }
      } catch (error) {
        console.error("Error al cargar cámaras:", error);

        if (!cancelado) {
          setCamaras([]);
          setTotalPaginas(0);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    cargarDatosIniciales();

    return () => {
      cancelado = true;
    };
  }, [token, navigate, estadoDesdeNotificacion]);


  // CARGA DE PROVINCIAS PARA EL SELECT
  // =========================================================
  // Esto llena el primer select: "Seleccione una provincia".
  useEffect(() => {
    if (!token) return;

    let cancelado = false;

    const cargarProvincias = async () => {
      try {
        const data = await obtenerProvincias();

        if (!cancelado) {
          const lista = Array.isArray(data) ? data : data.content || [];
          setProvinciasDisponibles(lista);
        }
      } catch (error) {
        console.error("Error al cargar provincias:", error);
        setProvinciasDisponibles([]);
      }
    };

    cargarProvincias();

    return () => {
      cancelado = true;
    };
  }, [token]);


  // CARGA DE PLATAFORMAS PARA EL SELECT
  // =========================================================
  // Esto llena el select de plataformas con EASY 7, CHECKPOINT e IVS.
  // Ya no se sacan las plataformas desde las 10 cámaras visibles.
  useEffect(() => {
    if (!token) return;

    let cancelado = false;

    const cargarPlataformas = async () => {
      try {
        const data = await obtenerPlataformas();
        const lista = Array.isArray(data) ? data : data.content || [];

        if (!cancelado) {
          setPlataformasDisponibles(lista);
        }
      } catch (error) {
        console.error("Error al cargar plataformas:", error);
        setPlataformasDisponibles([]);
      }
    };

    cargarPlataformas();

    return () => {
      cancelado = true;
    };
  }, [token]);


  
    // CARGA DE CONVENIOS
    // =========================================================
  useEffect(() => {
    const cargarConvenios = async () => {
      try {
        const data = await obtenerConvenios();
        const lista = Array.isArray(data) ? data : data.content || [];

        setConveniosDisponibles(lista);
      } catch (error) {
        console.error("Error al cargar convenios:", error);
        setConveniosDisponibles([]);
      }
    };

    cargarConvenios();
  }, []);


  // CARGA DE MARCAS
  // =========================================================
  useEffect(() => {
    if (!token) return;

    let cancelado = false;

    const cargarMarcasIniciales = async () => {
      try {
        const data = await obtenerMarcas();
        const lista = Array.isArray(data) ? data : data.content || [];

        if (!cancelado) {
          setMarcasDisponibles(lista);
        }
      } catch (error) {
        console.error("Error al cargar marcas:", error);

        if (!cancelado) {
          setMarcasDisponibles([]);
        }
      }
    };

    cargarMarcasIniciales();

    return () => {
      cancelado = true;
    };
  }, [token]);

  // CARGAR FECHAS INSTALACION
  useEffect(() => {
    if (!token) return;

    let cancelado = false;

    const cargarFechasInstalacion = async () => {
      try {
        const data = await obtenerFechasInstalacion();
        const lista = Array.isArray(data) ? data : [];

        if (!cancelado) {
          setFechasInstalacionDisponibles(lista);
        }
      } catch (error) {
        console.error("Error al cargar fechas de instalación:", error);

        if (!cancelado) {
          setFechasInstalacionDisponibles([]);
        }
      }
    };

    cargarFechasInstalacion();

    return () => {
      cancelado = true;
    };
  }, [token]);


  // FUNCIÓN CENTRAL PARA BUSCAR / FILTRAR / PAGINAR
  // =========================================================
  // Esta es la función más importante de la página.
  // Cada vez que presionas Buscar, Limpiar, Anterior o Siguiente,
  // se llama a esta función para consultar el backend.
  //
  // pagina: número de página que queremos pedir al backend.
  // valores: permite enviar valores limpios o nuevos sin esperar que React actualice el state.
  const cargarCamarasFiltradas = async (pagina = 0, valores = {}) => {
    try {
      setCargando(true);

      const data = await obtenerCamarasFiltradas({
        busqueda: valores.busqueda ?? busqueda,
        idProvincia: valores.idProvincia ?? provinciaSeleccionada,
        idCanton: valores.idCanton ?? cantonSeleccionado,
        estado: valores.estado ?? filtros.estado,
        plataforma: valores.plataforma ?? filtros.plataforma,
        convenio: valores.convenio ?? filtros.convenio,

        idMarca: valores.idMarca ?? filtros.idMarca,
        idModelo: valores.idModelo ?? filtros.idModelo,
        anchoBanda: valores.anchoBanda ?? filtros.anchoBanda,
        tipoDanoSinServicio:
          valores.tipoDanoSinServicio ?? filtros.tipoDanoSinServicio,
        tipoFallaTecnica:
          valores.tipoFallaTecnica ?? filtros.tipoFallaTecnica,
        fechaInstalacion:
          valores.fechaInstalacion ?? filtros.fechaInstalacion,

        page: pagina,
        size: 10,
      });

      setCamaras(data.content || []);
      setTotalPaginas(data.totalPages || 0);
      setPaginaActual(data.number || 0);
      setTotalElementos(data.totalElements || 0);
    } catch (error) {
      console.error("Error al cargar cámaras filtradas:", error);
      setCamaras([]);
      setTotalPaginas(0);
      setTotalElementos(0);
    } finally {
      setCargando(false);
    }
  };


  // FUNCIONES DE PRESENTACIÓN DE DATOS
  // =========================================================
  // Estas funciones ayudan a mostrar datos aunque el backend a veces mande
  // objetos anidados o campos planos.
  const obtenerEstadoClase = (estado) => {
    if (!estado) return "estado desconocido";

    const estadoNormalizado = estado.toLowerCase();

    if (estadoNormalizado.includes("sin servicio")) {
      return "estado sin-servicio";
    }

    if (estadoNormalizado.includes("falla tecnica")) {
      return "estado falla-tecnica";
    }

    if (estadoNormalizado.includes("no operativa")) {
      return "estado no-operativa";
    }

    if (estadoNormalizado.includes("operativa") && !estadoNormalizado.includes("no")) {
      return "estado operativa";
    }

    if (estadoNormalizado.includes("conectividad")) {
      return "estado conectividad";
    }

    if (estadoNormalizado.includes("mantenimiento")) {
      return "estado mantenimiento";
    }

    return "estado desconocido";
  };

  const obtenerCanton = (camara) => {
    return (
      camara.canton?.nombreCanton ||
      camara.nombreCanton ||
      camara.canton ||
      "Sin cantón"
    );
  };

  const obtenerPlataforma = (camara) => {
    return (
      camara.plataforma?.nombrePlataforma ||
      camara.nombrePlataforma ||
      camara.plataforma ||
      "Sin plataforma"
    );
  };

  const obtenerAQuienPertenece = (camara) => {
    return (
      camara.aQuienPertenece ||
      camara.aquienPertenece ||
      camara.AQuienPertenece ||
      camara.a_quien_pertenece ||
      "Sin dato"
    );
  };

  const mostrarConversor = (camara) => {
  const valor = camara.conversor || "";

  const opciones = {
    OPCION_1: "GPON",
    OPCION_2: "FOT",
    OPCION_3: "SWITCH",
  };

  return opciones[valor] || valor || "Sin dato";
};

const mostrarPoste = (camara) => {
  const valor = camara.poste || "";

  const opciones = {
    OPCION_1: "Metalico",
    OPCION_2: "Hormigon",
    OPCION_3: "Fibra",
  };

  return opciones[valor] || valor || "Sin dato";
};

  const mostrarBrazo = (camara) => {
    const valor = camara.brazo || "";

    const opciones = {
      OPCION_1: "Fibra",
      OPCION_2: "Metalico",
    };

    return opciones[valor] || valor || "Sin dato";
  };



  const obtenerValorDetalleCamara = (camara, campos, valorDefecto = "Sin dato") => {
    for (const campo of campos) {
      const valor = camara?.[campo];

      if (valor !== null && valor !== undefined && valor !== "") {
        return valor;
      }
    }

    return valorDefecto;
  };

  const mostrarSiNoDetalle = (valor) => {
    if (!valor) {
      return "Sin dato";
    }

    const valorNormalizado = String(valor).trim().toUpperCase();

    if (valorNormalizado === "SI" || valorNormalizado === "SÍ") {
      return "Sí";
    }

    if (valorNormalizado === "NO") {
      return "No";
    }

    return valor;
  };

  //const obtenerConvenio = (camara) => {
    //return (
      //camara.convenio?.nombreConvenio ||
      //camara.nombreConvenio ||
      //camara.convenio ||
      //"Sin convenio"
    //);
  //};


  // ABRIR Y CERRAR MODAL DE DETALLE
  // =========================================================
  const abrirDetalleCamara = (camara) => {
    setCamaraSeleccionada(camara);
    setMostrarDetalle(true);
  };

  const abrirEditarCamara = (camara) => {
    localStorage.setItem("camaraEditarSeleccionada", JSON.stringify(camara));

    navigate(`/camaras/editar/${camara.idCamara}`, {
      state: { camara },
    });
  };

  const cerrarDetalleCamara = () => {
    setCamaraSeleccionada(null);
    setMostrarDetalle(false);
  };


  // FUNCIONES PARA MOSTRAR NOMBRES EN SELECTS
  // =========================================================
  // Provincia y plataforma pueden venir con camelCase, snake_case o nombre simple.
  // Estas funciones evitan que el select quede vacío si cambia el DTO.
  const obtenerNombreProvinciaSelect = (provincia) => {
    return (
      provincia.nombreProvincia ||
      provincia.nombre ||
      provincia.nombre_provincia ||
      provincia.provincia ||
      ""
    );
  };

  const obtenerIdProvinciaSelect = (provincia) => {
    return (
      provincia.idProvincia ||
      provincia.id ||
      provincia.id_provincia ||
      ""
    );
  };

    const obtenerNombrePlataformaSelect = (plataforma) => {
    return (
      plataforma.nombrePlataforma ||
      plataforma.nombre ||
      plataforma.nombre_plataforma ||
      plataforma.plataforma ||
      ""
    );
  };

  const obtenerIdPlataformaSelect = (plataforma) => {
    return (
      plataforma.idPlataforma ||
      plataforma.id ||
      plataforma.id_plataforma ||
      obtenerNombrePlataformaSelect(plataforma)
    );
  };


  // FUNCIONES PARA MOSTRAR CONVENIOS EN EL SELECT

  const obtenerNombreConvenioSelect = (convenio) => {
    return (
      convenio.nombreConvenio ||
      convenio.nombre ||
      convenio.nombre_convenio ||
      convenio.convenio ||
      ""
    );
  };

  const obtenerIdConvenioSelect = (convenio) => {
    return (
      convenio.idConvenio ||
      convenio.id ||
      convenio.id_convenio ||
      obtenerNombreConvenioSelect(convenio)
    );
  };


  // OPCIONES ÚNICAS PARA SELECTS QUE AÚN SALEN DE LA PÁGINA ACTUAL
  // =========================================================
  // Estados y convenios todavía se generan desde las cámaras cargadas.
  // Luego se pueden mejorar creando estadoService.js y convenioService.js.
  const estados = [
    "FALLA TECNICA",
    "NO OPERATIVA",
    "OPERATIVA",
    "SIN SERVICIO",
  ];

  const opcionesAnchoBanda = ["0", "1", "2", "3", "3,5", "4", "5", "6", "10"];

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




  // MANEJO DE FILTROS SIMPLES
  // =========================================================
  // Sirve para estado, plataforma y convenio.
  // No consulta automáticamente el backend: para aplicar, se presiona Buscar.
  const manejarFiltro = (campo, valor) => {
    setFiltros((prevFiltros) => {
      if (campo === "estado") {
        return {
          ...prevFiltros,
          estado: valor,
          tipoDanoSinServicio:
            valor === "SIN SERVICIO" ? prevFiltros.tipoDanoSinServicio : "",
          tipoFallaTecnica:
            valor === "FALLA TECNICA" ? prevFiltros.tipoFallaTecnica : "",
        };
      }

      return {
        ...prevFiltros,
        [campo]: valor,
      };
    });
  };


  // CAMBIO DE PROVINCIA
  // =========================================================
  // Cuando seleccionas una provincia:
  // 1. Guarda el idProvincia.
  // 2. Limpia el cantón anterior.
  // 3. Consulta los cantones reales de esa provincia.
  
  const manejarCambioProvincia = async (e) => {
    const idProvincia = e.target.value;
    console.log("ID provincia seleccionada:", idProvincia);

    // Actualizamos los estados simples de inmediato
    setProvinciaSeleccionada(idProvincia);
    setCantonSeleccionado("");
    setCantones([]);

    // Actualizamos el estado agrupado de filtros
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      idProvincia,
      idCanton: "",
    }));

    // Si la opción seleccionada es la vacía, limpiamos cantones y salimos
    if (!idProvincia) {
      return;
    }

    try {
      // Hacemos la consulta directa usando la variable local efectiva
      const data = await obtenerCantonesPorProvincia(idProvincia);

      const lista = Array.isArray(data) ? data : data.content || [];

      console.log("Cantones recibidos:", lista);

      // Guardamos los cantones recibidos desde el backend
      setCantones(lista);
    } catch (error) {
      console.error("Error al cargar cantones por provincia:", error);
      setCantones([]);
    }
  };

  // =========================================================
  // CAMBIO DE CANTÓN
  // =========================================================
  // Guarda el idCanton seleccionado para enviarlo al backend al presionar Buscar.
  const manejarCambioCanton = (e) => {
    const idCanton = e.target.value;

    setCantonSeleccionado(idCanton);

    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      idCanton,
    }));
  };


  // BOTÓN BUSCAR
  // =========================================================
  // Aplica todos los filtros actuales desde la página 0.
  const aplicarBusqueda = () => {
    const textoBusqueda = busqueda.trim();

    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      busqueda: textoBusqueda,
    }));

    cargarCamarasFiltradas(0, {
      busqueda: textoBusqueda,
    });
  };

 
  // BOTÓN LIMPIAR
  // =========================================================
  // Limpia pantalla y vuelve a cargar la página 1 sin filtros.
  // Se pasan valores vacíos directamente a cargarCamarasFiltradas para evitar
  // problemas por la actualización asíncrona de useState.
  const limpiarFiltros = () => {
    setBusqueda("");

    setFiltros({
      idProvincia: "",
      idCanton: "",
      estado: "",
      plataforma: "",
      convenio: "",
      idMarca: "",
      idModelo: "",
      anchoBanda: "",
      fechaInstalacion: "",
    });

    setProvinciaSeleccionada("");
    setCantonSeleccionado("");
    setCantones([]);
    setModelosDisponibles([]);
    setPaginaActual(0);
    setTotalElementos(0);

    cargarCamarasFiltradas(0, {
      busqueda: "",
      idProvincia: "",
      idCanton: "",
      estado: "",
      plataforma: "",
      convenio: "",
      idMarca: "",
      idModelo: "",
      anchoBanda: "",
      tipoDanoSinServicio: "",
      tipoFallaTecnica: "",
      fechaInstalacion: "",
    });
  };

  
  // PAGINACIÓN
  // =========================================================
  // Importante: Anterior y Siguiente también usan cargarCamarasFiltradas.
  // Así se mantienen los filtros al cambiar de página.
  const irPaginaAnterior = () => {
    if (paginaActual > 0) {
      cargarCamarasFiltradas(paginaActual - 1);
    }
  };

  const irPaginaSiguiente = () => {
    if (paginaActual + 1 < totalPaginas) {
      cargarCamarasFiltradas(paginaActual + 1);
    }
  };


  // TABLA FINAL
  // =========================================================
  // Antes aquí había un filter local.
  // Ahora NO filtramos en React porque el backend ya devuelve la lista filtrada.
  const camarasFiltradas = camaras;

  //exportar camaras
  const manejarExportar = async () => {
    try {
      await exportarCamarasFiltradas({
        busqueda: busqueda.trim(),
        idProvincia: provinciaSeleccionada,
        idCanton: cantonSeleccionado,
        estado: filtros.estado,
        plataforma: filtros.plataforma,
        convenio: filtros.convenio,
        idMarca: filtros.idMarca,
        idModelo: filtros.idModelo,
        anchoBanda: filtros.anchoBanda,
        tipoDanoSinServicio: filtros.tipoDanoSinServicio,
        tipoFallaTecnica: filtros.tipoFallaTecnica,
        fechaInstalacion: filtros.fechaInstalacion,
      });
    } catch (error) {
      console.error("Error al exportar cámaras:", error);
      alert("No se pudo exportar el archivo.");
    }
  };

  const abrirNuevaCamara = () => {
    navigate("/camaras/nueva");
  };

  const abrirCambioCamaraGeneral = () => {
    localStorage.removeItem("camaraCambioSeleccionada");
    navigate("/camaras/cambio");
  };

  const abrirEliminarCamara = () => {
    navigate("/camaras/eliminar");
  };

  const abrirEnMaps = () => {
    if (!camaraSeleccionada?.latitud || !camaraSeleccionada?.longitud) {
      alert("Esta cámara no tiene coordenadas registradas.");
      return;
    }

    const url = `https://www.google.com/maps?q=${camaraSeleccionada.latitud},${camaraSeleccionada.longitud}`;
    window.open(url, "_blank");
  };

  const copiarCoordenadas = async () => {
    if (!camaraSeleccionada?.latitud || !camaraSeleccionada?.longitud) {
      alert("Esta cámara no tiene coordenadas registradas.");
      return;
    }

    const coordenadas = `${camaraSeleccionada.latitud}, ${camaraSeleccionada.longitud}`;

    try {
      await navigator.clipboard.writeText(coordenadas);
      alert("Coordenadas copiadas.");
    } catch (error) {
      console.error("Error al copiar coordenadas:", error);
      alert("No se pudieron copiar las coordenadas.");
    }
  };


  const limpiarFiltroIndividual = (campo) => {
    const valoresActuales = {
      busqueda: busqueda.trim(),
      idProvincia: provinciaSeleccionada,
      idCanton: cantonSeleccionado,
      estado: filtros.estado,
      plataforma: filtros.plataforma,
      convenio: filtros.convenio,
      idMarca: filtros.idMarca,
      idModelo: filtros.idModelo,
      anchoBanda: filtros.anchoBanda,
      fechaInstalacion: filtros.fechaInstalacion,
    };

    const valoresLimpios = {
      ...valoresActuales,
      [campo]: "",
    };

    if (campo === "busqueda") {
      setBusqueda("");
    }

    if (campo === "idProvincia") {
      valoresLimpios.idCanton = "";
      setProvinciaSeleccionada("");
      setCantonSeleccionado("");
      setCantones([]);
    }

    if (campo === "idCanton") {
      setCantonSeleccionado("");
    }

    if (campo === "idMarca") {
      valoresLimpios.idModelo = "";
      setModelosDisponibles([]);
    }

    if (campo === "estado") {
      valoresLimpios.tipoDanoSinServicio = "";
      valoresLimpios.tipoFallaTecnica = "";
    }

    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      ...valoresLimpios,
    }));

    setPaginaActual(0);
    cargarCamarasFiltradas(0, valoresLimpios);
  };

  const hayFiltrosActivos =
    busqueda.trim() ||
    provinciaSeleccionada ||
    cantonSeleccionado ||
    filtros.estado ||
    filtros.plataforma ||
    filtros.convenio ||
    filtros.idMarca ||
    filtros.idModelo ||
    filtros.anchoBanda ||
    filtros.tipoDanoSinServicio ||
    filtros.tipoFallaTecnica ||
    filtros.fechaInstalacion;

  
  //const cargarMarcas = async () => {
    //try {
      //const data = await obtenerMarcas();
      //setMarcasDisponibles(data);
    //} catch (error) {
      //console.error("Error al cargar marcas:", error);
    //}
   //};
  
  const cargarModelosPorMarca = async (idMarca) => {
    try {
      if (!idMarca) {
        setModelosDisponibles([]);
        return;
      }

      const data = await obtenerModelosPorMarca(idMarca);
      const lista = Array.isArray(data) ? data : data.content || [];
      setModelosDisponibles(lista);
    } catch (error) {
      console.error("Error al cargar modelos:", error);
      setModelosDisponibles([]);
    }
  };

  

  const obtenerNombreMarcaSelect = (marca) => {
    return (
      marca.nombreMarca ||
      marca.nombre ||
      marca.nombre_marca ||
      marca.marca ||
      ""
    );
  };

  const obtenerIdMarcaSelect = (marca) => {
    return (
      marca.idMarca ||
      marca.id ||
      marca.id_marca ||
      ""
    );
  };

  const obtenerNombreModeloSelect = (modelo) => {
    return (
      modelo.nombreModelo ||
      modelo.nombre ||
      modelo.nombre_modelo ||
      modelo.modelo ||
      ""
    );
  };

  const obtenerIdModeloSelect = (modelo) => {
    return (
      modelo.idModelo ||
      modelo.id ||
      modelo.id_modelo ||
      ""
    );
  };

  const manejarCambioMarca = (e) => {
    const idMarca = e.target.value;

    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      idMarca,
      idModelo: "",
    }));

    setModelosDisponibles([]);

    if (idMarca) {
      cargarModelosPorMarca(idMarca);
    }
  };

  const manejarCambioModelo = (e) => {
    const idModelo = e.target.value;

    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      idModelo,
    }));
  };

  return (
    <div className="camaras-page">
      {/* =====================================================
          SIDEBAR IZQUIERDO
          ===================================================== */}
      <aside className="camaras-sidebar">
        <div className="logo-box">
          <img src={logo} alt="VisionControl" className="logo-box-img" />
        </div>

        <nav className="sidebar-menu">
          <button onClick={() => navigate("/dashboard")}>
            <MdDashboard className="sidebar-icon" />
            Dashboard
          </button>

          <button
            className={location.pathname.startsWith("/camaras") ? "activo" : ""}
            onClick={() => navigate("/camaras")}
          >
            <FaVideo className="sidebar-icon" />
            Cámaras
          </button>

          <button onClick={() => navigate("/convenios")}>
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
        {/* =====================================================
            ENCABEZADO SUPERIOR
            ===================================================== */}
        <header className="camaras-header">
          <div>
            <h2>Sistema de Inventario de Cámaras</h2>
            <p>Consulta operativa de cámaras registradas en el sistema</p>
          </div>

          <UserHeaderActions
            username={username}
            rol={rol}
            onCerrarSesion={cerrarSesion}
          />
        </header>

        {/* =====================================================
            PANEL DE BÚSQUEDA Y FILTROS
            ===================================================== */}
        <section className="filtros-panel">
          <div className="buscador-principal">
            {/* Input principal de búsqueda.
                Busca por código, IP, nombre o dirección cuando se presiona Buscar o Enter. */}
            <input
              type="text"
              placeholder="Buscar por código, IP, nombre o dirección..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  aplicarBusqueda();
                }
              }}
            />

            <div className="acciones-busqueda">
              <button onClick={aplicarBusqueda}>Buscar</button>

              <button
                type="button"
                className="btn-limpiar"
                onClick={limpiarFiltros}
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="filtros-grid">
            {/* SELECT PROVINCIA: carga provincias reales del backend. */}
            <select
              value={provinciaSeleccionada}
              onChange={manejarCambioProvincia}
            >
              <option value="">Seleccione una provincia</option>

              {provinciasDisponibles.map((provincia) => {
                const idProvincia = obtenerIdProvinciaSelect(provincia);

                return (
                  <option
                    key={idProvincia}
                    value={idProvincia}
                  >
                    {obtenerNombreProvinciaSelect(provincia)}
                  </option>
                );
              })}
            </select>

            {/* SELECT CANTÓN: solo se habilita luego de escoger una provincia. */}
            <select
              value={cantonSeleccionado}
              onChange={manejarCambioCanton}
              disabled={!provinciaSeleccionada}
            >
              <option value="">
                {provinciaSeleccionada ? "Seleccione un cantón" : "Primero seleccione provincia"}
              </option>

              {cantones.map((canton) => (
                <option
                  key={canton.idCanton}
                  value={canton.idCanton}
                >
                  {canton.nombreCanton}
                </option>
              ))}
            </select>

            {/* SELECT ESTADO: por ahora sale desde los datos de la página cargada. */}
            <select
              value={filtros.estado}
              onChange={(e) => manejarFiltro("estado", e.target.value)}
            >
              <option value="">Todos los estados</option>
              {estados.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>

          

            {filtros.estado === "SIN SERVICIO" && (
              <select
                value={filtros.tipoDanoSinServicio}
                onChange={(e) =>
                  manejarFiltro("tipoDanoSinServicio", e.target.value)
                }
              >
                <option value="">Todos los tipos de daño</option>

                {opcionesTipoDanoSinServicio.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            )}

            {filtros.estado === "FALLA TECNICA" && (
              <select
                value={filtros.tipoFallaTecnica}
                onChange={(e) =>
                  manejarFiltro("tipoFallaTecnica", e.target.value)
                }
              >
                <option value="">Todos los tipos de falla</option>

                {opcionesTipoFallaTecnica.map((opcion) => (
                  <option key={opcion} value={opcion}>
                    {opcion}
                  </option>
                ))}
              </select>
            )}



            {/* SELECT PLATAFORMA: carga plataformas reales del backend. */}
            <select
              value={filtros.plataforma}
              onChange={(e) => manejarFiltro("plataforma", e.target.value)}
            >
              <option value="">Todas las plataformas</option>

              {plataformasDisponibles.map((plataforma) => {
                const nombrePlataforma = obtenerNombrePlataformaSelect(plataforma);

                return (
                  <option
                    key={obtenerIdPlataformaSelect(plataforma)}
                    value={nombrePlataforma}
                  >
                    {nombrePlataforma}
                  </option>
                );
              })}
            </select>

            {/* SELECT CONVENIO: carga convenios reales desde el backend. */}
            <select
              value={filtros.convenio}
              onChange={(e) => manejarFiltro("convenio", e.target.value)}
            >
              <option value="">Todos los convenios</option>

              {conveniosDisponibles.map((convenio) => {
                const nombreConvenio = obtenerNombreConvenioSelect(convenio);

                return (
                  <option
                    key={obtenerIdConvenioSelect(convenio)}
                    value={nombreConvenio}
                  >
                    {nombreConvenio}
                  </option>
                );
              })}
            </select>

            {/* SELECT MARCA: carga marcas reales desde el backend. */}
            <select
              value={filtros.idMarca}
              onChange={manejarCambioMarca}
            >
              <option value="">Todas las marcas</option>

              {marcasDisponibles.map((marca) => {
                const idMarca = obtenerIdMarcaSelect(marca);
                const nombreMarca = obtenerNombreMarcaSelect(marca);

                return (
                  <option key={idMarca} value={idMarca}>
                    {nombreMarca}
                  </option>
                );
              })}
            </select>

            {/* SELECT MODELO: se habilita luego de escoger una marca. */}
            <select
              value={filtros.idModelo}
              onChange={manejarCambioModelo}
              disabled={!filtros.idMarca}
            >
              <option value="">
                {filtros.idMarca ? "Todos los modelos" : "Primero seleccione marca"}
              </option>

              {modelosDisponibles.map((modelo) => {
                const idModelo = obtenerIdModeloSelect(modelo);
                const nombreModelo = obtenerNombreModeloSelect(modelo);

                return (
                  <option key={idModelo} value={idModelo}>
                    {nombreModelo}
                  </option>
                );
              })}
            </select>

            {/* SELECT ANCHO DE BANDA */}
            <select
              value={filtros.anchoBanda}
              onChange={(e) => manejarFiltro("anchoBanda", e.target.value)}
            >
              <option value="">Todos los anchos de banda</option>

              {opcionesAnchoBanda.map((valor) => (
                <option key={valor} value={valor}>
                  {valor}
                </option>
              ))}
            </select>

            {/* SELECT FECHA DE INSTALACIÓN */}
            <select
              value={filtros.fechaInstalacion}
              onChange={(e) => manejarFiltro("fechaInstalacion", e.target.value)}
            >
              <option value="">Todas las fechas de instalación</option>

              {fechasInstalacionDisponibles.map((fecha) => (
                <option key={fecha} value={fecha}>
                  {fecha}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* =====================================================
            TABLA DE CÁMARAS
            ===================================================== */}
        

        {hayFiltrosActivos && (
          <div className="filtros-activos">
            <span className="filtros-activos-titulo">Filtros activos:</span>

            {busqueda.trim() && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("busqueda")}
              >
                Búsqueda: {busqueda.trim()} ×
              </button>
            )}

            {provinciaSeleccionada && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("idProvincia")}
              >
                Provincia seleccionada ×
              </button>
            )}

            {cantonSeleccionado && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("idCanton")}
              >
                Cantón seleccionado ×
              </button>
            )}

            {filtros.estado && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("estado")}
              >
                Estado: {filtros.estado} ×
              </button>
            )}

            {filtros.plataforma && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("plataforma")}
              >
                Plataforma: {filtros.plataforma} ×
              </button>
            )}

            {filtros.convenio && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("convenio")}
              >
                Convenio: {filtros.convenio} ×
              </button>
            )}

            {filtros.idMarca && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("idMarca")}
              >
                Marca seleccionada ×
              </button>
            )}

            {filtros.idModelo && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("idModelo")}
              >
                Modelo seleccionado ×
              </button>
            )}

            {filtros.anchoBanda && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("anchoBanda")}
              >
                Ancho banda: {filtros.anchoBanda} ×
              </button>
            )}

            {filtros.tipoDanoSinServicio && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("tipoDanoSinServicio")}
              >
                Tipo daño: {filtros.tipoDanoSinServicio} ×
              </button>
            )}

            {filtros.tipoFallaTecnica && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("tipoFallaTecnica")}
              >
                Tipo falla: {filtros.tipoFallaTecnica} ×
              </button>
            )}

            {filtros.fechaInstalacion && (
              <button
                className="chip-filtro"
                onClick={() => limpiarFiltroIndividual("fechaInstalacion")}
              >
                Fecha instalación: {filtros.fechaInstalacion} ×
              </button>
            )}
          </div>
        )}

        <section className="tabla-panel">
          <div className="tabla-header">
            <div>
              <h3>Cámaras Registradas</h3>
              <p className="total-camaras">
                {totalElementos} cámaras encontradas
              </p>
              <p>
                Página {paginaActual + 1} de {totalPaginas || 1}
              </p>
            </div>

            <div className="tabla-acciones tabla-header-acciones">
              {puedeEditar && (
                <button
                  type="button"
                  className="btn-nueva-camara"
                  onClick={abrirNuevaCamara}
                >
                  <FaPlus className="btn-icon" />
                  Nueva cámara
                </button>
              )}

              {puedeEditar && (
                <button
                  type="button"
                  className="btn-cambio-camara-header"
                  onClick={abrirCambioCamaraGeneral}
                >
                  <FaExchangeAlt className="btn-icon" />
                  Cambio de cámara
                </button>
              )}

              {esSuperAdmin && (
                <button
                  type="button"
                  className="btn-cambio-camara-header"
                  onClick={abrirEliminarCamara}
                >
                  <FaPowerOff className="btn-icon" />
                  Activar / desactivar
                </button>
              )}

              <button
                type="button"
                className="btn-exportar"
                onClick={manejarExportar}
              >
                <FaDownload className="btn-icon" />
                Descargar
              </button>
            </div>
          </div>

          {cargando ? (
            <p className="sin-datos">Cargando cámaras...</p>
          ) : camarasFiltradas.length === 0 ? (
            <p className="sin-datos">No hay cámaras registradas.</p>
          ) : (
            <div className="tabla-contenedor">
              <table>
                <thead>
                  <tr>
                    <th>ID Punto</th>
                    <th>Nombre Cámara</th>
                    <th>Cantón</th>
                    <th>Dirección IP</th>
                    <th>Plataforma</th>
                    <th>FECHA INSTALACIÓN</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {camarasFiltradas.map((camara) => (
                    <tr key={camara.idCamara}>
                      <td>{camara.idPuntoOriginal || camara.idCamara}</td>
                      <td>{camara.nombreCamara || "Sin nombre"}</td>
                      <td>{obtenerCanton(camara)}</td>
                      <td>{camara.direccionIp || "Sin IP"}</td>
                      <td>{obtenerPlataforma(camara)}</td>
                      <td>{camara.fechaInstalacion || "Sin dato"}</td>
                      <td>
                        <span className={obtenerEstadoClase(camara.estadoActual)}>
                          {camara.estadoActual || "Sin estado"}
                        </span>
                      </td>
                      <td>
                        <div className="acciones-camara">
                          <button
                            type="button"
                            className="btn-ver"
                            onClick={() => abrirDetalleCamara(camara)}
                          >
                            <FaEye className="btn-icon" />
                            Ver
                          </button>

                          {puedeEditar && (
                            <button
                              type="button"
                              className="btn-editar-camara"
                              onClick={() => abrirEditarCamara(camara)}
                            >
                              <FaEdit className="btn-icon" />
                              Editar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINACIÓN: mantiene filtros porque llama cargarCamarasFiltradas. */}
          <div className="paginacion">
            <button
              disabled={paginaActual === 0}
              onClick={irPaginaAnterior}
            >
              Anterior
            </button>

            <span>{paginaActual + 1}</span>

            <button
              disabled={paginaActual + 1 >= totalPaginas}
              onClick={irPaginaSiguiente}
            >
              Siguiente
            </button>
          </div>
        </section>

        {/* =====================================================
            MODAL DE DETALLE DE CÁMARA
            ===================================================== */}
        {mostrarDetalle && camaraSeleccionada && (
          <div className="modal-detalle-overlay">
            <div className="modal-detalle-camara">
              <div className="modal-detalle-header">
                <div>
                  <h3>Detalle de Cámara</h3>
                  <p>{camaraSeleccionada.nombreCamara || "Sin nombre"}</p>
                </div>

                <button onClick={cerrarDetalleCamara}>✕</button>
              </div>

              <div className="detalle-grid">
                <div>
                  <span>ID Punto</span>
                  <strong>{camaraSeleccionada.idPuntoOriginal || camaraSeleccionada.idCamara}</strong>
                </div>

                <div>
                  <span>Nombre Cámara</span>
                  <strong>{camaraSeleccionada.nombreCamara || "Sin nombre"}</strong>
                </div>

                <div>
                  <span>Usuario alfanumérico</span>
                  <strong>
                    {camaraSeleccionada.usuarioAlfanumerico ||
                      camaraSeleccionada.usuario_alfanumerico ||
                      "Sin dato"}
                  </strong>
                </div>

                <div>
                  <span>A quién pertenece</span>
                  <strong>{obtenerAQuienPertenece(camaraSeleccionada)}</strong>
                </div>

                <div>
                  <span>Cantón</span>
                  <strong>{obtenerCanton(camaraSeleccionada)}</strong>
                </div>

                <div>
                  <span>Dirección IP</span>
                  <strong>{camaraSeleccionada.direccionIp || "Sin IP"}</strong>
                </div>

                <div>
                  <span>Plataforma</span>
                  <strong>{obtenerPlataforma(camaraSeleccionada)}</strong>
                </div>

                <div>
                  <span>Estado</span>
                  <strong>{camaraSeleccionada.estadoActual || "Sin estado"}</strong>
                </div>

                {String(camaraSeleccionada.estadoActual || "").trim().toUpperCase() ===
                  "SIN SERVICIO" && (
                  <div>
                    <span>Tipo de daño</span>
                    <strong>
                      {obtenerValorDetalleCamara(camaraSeleccionada, [
                        "tipoDanoSinServicio",
                        "tipo_dano_sin_servicio",
                      ])}
                    </strong>
                  </div>
                )}

                {String(camaraSeleccionada.estadoActual || "").trim().toUpperCase() ===
                  "FALLA TECNICA" && (
                  <div>
                    <span>Tipo de falla</span>
                    <strong>
                      {obtenerValorDetalleCamara(camaraSeleccionada, [
                        "tipoFallaTecnica",
                        "tipo_falla_tecnica",
                      ])}
                    </strong>
                  </div>
                )}

                <div>
                  <span>Fecha instalación</span>
                  <strong>{camaraSeleccionada.fechaInstalacion || "Sin dato"}</strong>
                </div>

                <div>
                  <span>Tipo Dispositivo</span>
                  <strong>{camaraSeleccionada.tipoDispositivo || "Sin dato"}</strong>
                </div>

                <div>
                  <span>Marca</span>
                  <strong>{camaraSeleccionada.nombreMarca || camaraSeleccionada.modelo?.marca?.nombreMarca || "Sin dato"}</strong>
                </div>

                <div>
                  <span>Modelo</span>
                  <strong>{camaraSeleccionada.nombreModelo || camaraSeleccionada.modelo?.nombreModelo || "Sin dato"}</strong>
                </div>

                <div>
                  <span>Piloto CNT</span>
                  <strong>{camaraSeleccionada.pilotoCnt || "Sin dato"}</strong>
                </div>

                <div>
                  <span>Ancho Banda</span>
                  <strong>{camaraSeleccionada.anchoBanda || "Sin dato"}</strong>
                </div>

                <div>
                  <span>Conversor</span>
                  <strong>{mostrarConversor(camaraSeleccionada)}</strong>
                </div>

                <div>
                  <span>Poste</span>
                  <strong>{mostrarPoste(camaraSeleccionada)}</strong>
                </div>
                <div>
                  <span>Brazo</span>
                  <strong>{mostrarBrazo(camaraSeleccionada)}</strong>
                </div>

                <div>
                  <span>Descripción daño</span>
                  <strong>
                    {obtenerValorDetalleCamara(camaraSeleccionada, [
                      "descripcionDano",
                      "descripcion_dano",
                    ])}
                  </strong>
                </div>

                <div>
                  <span>Serie de la cámara</span>
                  <strong>
                    {obtenerValorDetalleCamara(camaraSeleccionada, [
                      "serieCamara",
                      "serie_camara",
                    ])}
                  </strong>
                </div>

                <div>
                  <span>Marca UPS</span>
                  <strong>
                    {obtenerValorDetalleCamara(camaraSeleccionada, [
                      "marcaUps",
                      "marca_ups",
                    ])}
                  </strong>
                </div>

                <div>
                  <span>Serie UPS</span>
                  <strong>
                    {obtenerValorDetalleCamara(camaraSeleccionada, [
                      "serieUps",
                      "serie_ups",
                    ])}
                  </strong>
                </div>

                <div>
                  <span>Estado UPS</span>
                  <strong>
                    {obtenerValorDetalleCamara(camaraSeleccionada, [
                      "estadoUps",
                      "estado_ups",
                    ])}
                  </strong>
                </div>

                <div>
                  <span>Abejas</span>
                  <strong>
                    {mostrarSiNoDetalle(
                      obtenerValorDetalleCamara(camaraSeleccionada, ["abejas"], "")
                    )}
                  </strong>
                </div>

                <div>
                  <span>Dirección</span>
                  <strong>{camaraSeleccionada.direccion || "Sin dirección"}</strong>
                </div>

                <div>
                  <span>Latitud</span>
                  <strong>{camaraSeleccionada.latitud || "Sin dato"}</strong>
                </div>

                <div>
                  <span>Longitud</span>
                  <strong>{camaraSeleccionada.longitud || "Sin dato"}</strong>
                </div>

                <div className="detalle-acciones">
                  <button className="btn-maps" onClick={abrirEnMaps}>
                    Ver en Google Maps
                  </button>

                  <button className="btn-copiar" onClick={copiarCoordenadas}>
                    Copiar coordenadas
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CamarasPage;