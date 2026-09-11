package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.CamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.CamaraResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Camara;
import com.visioncontrol.inventario.entities.Canton;
import com.visioncontrol.inventario.entities.CentroOperativo;
import com.visioncontrol.inventario.entities.Convenio;
import com.visioncontrol.inventario.entities.Modelo;
import com.visioncontrol.inventario.entities.Plataforma;
import com.visioncontrol.inventario.entities.Proveedor;
import com.visioncontrol.inventario.entities.DetalleConvenioCamara;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import com.visioncontrol.inventario.mappers.CamaraMapper;
import com.visioncontrol.inventario.repositories.CamaraRepository;
import com.visioncontrol.inventario.repositories.ConvenioRepository;
import com.visioncontrol.inventario.repositories.DetalleConvenioCamaraRepository;


import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.visioncontrol.inventario.dto.request.ActualizarConvenioRequestDTO;


import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.visioncontrol.inventario.exceptions.BadRequestException;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;



@Service
public class CamaraService {

    private final CamaraRepository camaraRepository;
    private final AuditoriaService auditoriaService;
    private final ConvenioRepository convenioRepository;
    private final DetalleConvenioCamaraRepository detalleConvenioCamaraRepository;
    private final HistorialEdicionCamaraService historialEdicionCamaraService;
    private final HistorialEliminacionCamaraService historialEliminacionCamaraService;


    public CamaraService(
        CamaraRepository camaraRepository,
        AuditoriaService auditoriaService,
        ConvenioRepository convenioRepository,
        DetalleConvenioCamaraRepository detalleConvenioCamaraRepository,
        HistorialEdicionCamaraService historialEdicionCamaraService,
        HistorialEliminacionCamaraService historialEliminacionCamaraService
    ) {
        this.camaraRepository = camaraRepository;
        this.auditoriaService = auditoriaService;
        this.convenioRepository = convenioRepository;
        this.detalleConvenioCamaraRepository = detalleConvenioCamaraRepository;
        this.historialEdicionCamaraService = historialEdicionCamaraService;
        this.historialEliminacionCamaraService = historialEliminacionCamaraService;
    }

    public List<CamaraResponseDTO> listarCamaras() {
        return camaraRepository.findAll()
                .stream()
                .map(CamaraMapper::toResponseDTO)
                .toList();
    }

    public List<CamaraResponseDTO> listarPorEstado(String estado) {
        return camaraRepository.findByEstadoCamara(estado)
                .stream()
                .map(CamaraMapper::toResponseDTO)
                .toList();
    }

    public List<CamaraResponseDTO> listarPorCanton(Integer idCanton) {
        return camaraRepository.findByCantonId(idCanton)
                .stream()
                .map(CamaraMapper::toResponseDTO)
                .toList();
    }

    public List<CamaraResponseDTO> listarPorProveedor(Integer idProveedor) {
        return camaraRepository.findByProveedorId(idProveedor)
                .stream()
                .map(CamaraMapper::toResponseDTO)
                .toList();
    }

    public List<CamaraResponseDTO> listarPorPlataforma(Integer idPlataforma) {
        return camaraRepository.findByPlataformaId(idPlataforma)
                .stream()
                .map(CamaraMapper::toResponseDTO)
                .toList();
    }

    // Método antiguo: se mantiene para no romper procesos existentes.
    @Transactional(readOnly = true)
    public Page<CamaraResponseDTO> filtrarCamaras(
            String busqueda,
            Integer idProvincia,
            Integer idCanton,
            String estado,
            String plataforma,
            String convenio,
            Pageable pageable
    ) {
        return filtrarCamaras(
            busqueda,
            idProvincia,
            idCanton,
            estado,
            plataforma,
            convenio,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            pageable
        );
    }

    // Método nuevo: incluye filtros por marca, modelo, ancho de banda y piloto CNT.
    @Transactional(readOnly = true)
    public Page<CamaraResponseDTO> filtrarCamaras(
        String busqueda,
        Integer idProvincia,
        Integer idCanton,
        String estado,
        String plataforma,
        String convenio,
        Integer idMarca,
        Integer idModelo,
        String anchoBanda,
        String pilotoCnt,
        String tipoDanoSinServicio,
        String tipoFallaTecnica,
        LocalDate fechaInstalacion,
        Pageable pageable
    ) {
        Pageable pageableOrdenado = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("idPuntoOriginal").ascending()
        );

        Specification<Camara> spec = construirSpecificationCamaras(
                busqueda,
                idProvincia,
                idCanton,
                estado,
                plataforma,
                convenio,
                idMarca,
                idModelo,
                anchoBanda,
                pilotoCnt,
                tipoDanoSinServicio,
                tipoFallaTecnica,
                fechaInstalacion
        );

        return camaraRepository.findAll(spec, pageableOrdenado)
                .map(CamaraMapper::toResponseDTO);
    }

    // Método antiguo: se mantiene para que los reportes/exportaciones actuales sigan funcionando.
    public byte[] exportarCamarasFiltradas(
            String busqueda,
            Integer idProvincia,
            Integer idCanton,
            String estado,
            String plataforma,
            String convenio
    ) {
        return exportarCamarasFiltradas(
                busqueda,
                idProvincia,
                idCanton,
                estado,
                plataforma,
                convenio,
                null,
                null,
                null,
                null,
                null
        );
    }

    // Método nuevo: exporta respetando también los filtros nuevos.
    @Transactional(readOnly = true)
    public byte[] exportarCamarasFiltradas(
        String busqueda,
        Integer idProvincia,
        Integer idCanton,
        String estado,
        String plataforma,
        String convenio,
        Integer idMarca,
        Integer idModelo,
        String anchoBanda,
        String pilotoCnt,
        LocalDate fechaInstalacion
    ) {
        List<Object[]> filas = camaraRepository.exportarCamarasConUltimoReporte(
                busqueda,
                idProvincia,
                idCanton,
                estado,
                plataforma,
                convenio,
                idMarca,
                idModelo,
                anchoBanda,
                pilotoCnt,
                fechaInstalacion
        );

        String[] encabezados = {
                "ID Punto Original",
                "Nombre Cámara",
                "Provincia",
                "Cantón",
                "Dirección",
                "Usuario Alfanumérico",
                "Latitud",
                "Longitud",
                "Marca",
                "Modelo",
                "Plataforma",
                "Tipo Dispositivo",
                "Dirección IP",
                "Estado Actual",
                "A quién pertenece",
                "Piloto CNT",
                "Ancho Banda",
                "Fecha Instalación",
                "Año",
                "Cambio de Cámara",
                "Observaciones Cámara",

                "Convenio",
                "Costo Enlace",
                "Fecha Convenio Original",
                "Fecha Convenio Inicio",
                "Fecha Convenio Referencia",
                "Fecha Convenio Fin",
                "Estado Fecha Convenio",
                "Fecha Inicial Pago",
                "Fecha Inicial Pago Original",
                "Proveedor Enlace",
                "Responsable Pago",

                "Reporte Fecha Revisión",
                "Reporte Estado Operativo",
                "Reporte Ticket GLPI",
                "Reporte Observaciones Operaciones",
                "Reporte Novedades Tecnología",
                "Reporte Presenta Daño",
                "Reporte Descripción Daño",
                "Reporte Fecha Seguimiento",
                "Reporte Seguimiento Detalle",
                "Reporte Resuelto GLPI",
                "Reporte Fecha Solución",
                "Reporte Analista"
        };

        StringBuilder csv = new StringBuilder();

        csv.append("\uFEFF");

        for (int i = 0; i < encabezados.length; i++) {
            csv.append(valorCsv(encabezados[i]));

            if (i < encabezados.length - 1) {
                csv.append(",");
            }
        }

        csv.append("\n");

        for (Object[] fila : filas) {
            for (int i = 0; i < encabezados.length; i++) {
                Object valor = i < fila.length ? fila[i] : "";
                csv.append(valorCsv(valor));

                if (i < encabezados.length - 1) {
                    csv.append(",");
                }
            }

            csv.append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Transactional(readOnly = true)
    public Page<CamaraResponseDTO> filtrarCamarasPorConvenio(
        Integer idProvincia,
        Integer idCanton,
        String estadoConvenio,
        LocalDate fechaConvenioInicio,
        int page,
        int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("idPuntoOriginal").ascending()
        );

        Specification<Camara> specification = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<Object, Object> cantonJoin = root.join("canton", JoinType.LEFT);
            Join<Object, Object> provinciaJoin = cantonJoin.join("provincia", JoinType.LEFT);
            Join<Object, Object> detalleJoin = root.join("detalleConvenioCamara", JoinType.LEFT);

            /*
             * El módulo Convenios ahora debe leer el detalle real desde
             * detalle_convenio_camara. La relación camaras.id_convenio se mantiene
             * solo como estado general SI / NO / EN TRÁMITE / NO APLICA.
             */
            predicates.add(cb.isNotNull(detalleJoin.get("idDetalleConvenio")));

            if (idProvincia != null) {
                predicates.add(cb.equal(
                        provinciaJoin.get("idProvincia"),
                        idProvincia
                ));
            }

            if (idCanton != null) {
                predicates.add(cb.equal(
                        cantonJoin.get("idCanton"),
                        idCanton
                ));
            }

            if (estadoConvenio != null && !estadoConvenio.trim().isEmpty()) {
                String estado = estadoConvenio.trim().toUpperCase();

                if (estado.equals("PENDIENTE") || estado.equals("NO APLICA")) {
                    predicates.add(cb.equal(
                            cb.upper(detalleJoin.get("estadoFechaConvenio")),
                            estado
                    ));
                }

                if (estado.equals("VIGENTE")) {
                    predicates.add(cb.and(
                            cb.isNotNull(detalleJoin.get("fechaConvenioInicio")),
                            cb.or(
                                    cb.equal(
                                            cb.upper(detalleJoin.get("estadoFechaConvenio")),
                                            "VIGENTE"
                                    ),
                                    cb.isNull(detalleJoin.get("fechaConvenioFin")),
                                    cb.greaterThanOrEqualTo(
                                            detalleJoin.<LocalDate>get("fechaConvenioFin"),
                                            LocalDate.now()
                                    )
                            ),
                            cb.or(
                                    cb.isNull(detalleJoin.get("estadoFechaConvenio")),
                                    cb.notEqual(
                                            cb.upper(detalleJoin.get("estadoFechaConvenio")),
                                            "PENDIENTE"
                                    )
                            ),
                            cb.or(
                                    cb.isNull(detalleJoin.get("estadoFechaConvenio")),
                                    cb.notEqual(
                                            cb.upper(detalleJoin.get("estadoFechaConvenio")),
                                            "NO APLICA"
                                    )
                            )
                    ));
                }

                if (estado.equals("VENCIDO")) {
                    predicates.add(cb.and(
                            cb.isNotNull(detalleJoin.get("fechaConvenioFin")),
                            cb.lessThan(
                                    detalleJoin.<LocalDate>get("fechaConvenioFin"),
                                    LocalDate.now()
                            )
                    ));
                }

                if (estado.equals("SIN DATO")) {
                    predicates.add(cb.or(
                            cb.isNull(detalleJoin.get("estadoFechaConvenio")),
                            cb.equal(
                                    cb.trim(detalleJoin.<String>get("estadoFechaConvenio")),
                                    ""
                            )
                    ));
                }
            }

            if (fechaConvenioInicio != null) {
                predicates.add(cb.equal(
                        detalleJoin.get("fechaConvenioInicio"),
                        fechaConvenioInicio
                ));
            }

            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return camaraRepository.findAll(specification, pageable)
                .map(CamaraMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public List<java.time.LocalDate> listarFechasInicioConvenioDisponibles() {
        return detalleConvenioCamaraRepository.listarFechasInicioConvenioDisponibles();
    }

    @Transactional(readOnly = true)
    public List<LocalDate> listarFechasInstalacionDisponibles() {
        return camaraRepository.listarFechasInstalacionDisponibles();
    }

    private Specification<Camara> construirSpecificationCamaras(
        String busqueda,
        Integer idProvincia,
        Integer idCanton,
        String estado,
        String plataforma,
        String convenio,
        Integer idMarca,
        Integer idModelo,
        String anchoBanda,
        String pilotoCnt,
        String tipoDanoSinServicio,
        String tipoFallaTecnica,
        LocalDate fechaInstalacion
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<Object, Object> cantonJoin = root.join("canton", JoinType.LEFT);
            Join<Object, Object> provinciaJoin = cantonJoin.join("provincia", JoinType.LEFT);
            Join<Object, Object> plataformaJoin = root.join("plataforma", JoinType.LEFT);
            Join<Object, Object> convenioJoin = root.join("convenio", JoinType.LEFT);
            Join<Object, Object> modeloJoin = root.join("modelo", JoinType.LEFT);
            Join<Object, Object> marcaJoin = modeloJoin.join("marca", JoinType.LEFT);

            predicates.add(cb.or(
                    cb.isNull(root.get("activo")),
                    cb.isTrue(root.get("activo"))
            ));

            if (busqueda != null && !busqueda.trim().isEmpty()) {
                String texto = "%" + busqueda.trim().toLowerCase() + "%";

                predicates.add(cb.or(
                        cb.like(root.get("idCamara").as(String.class), texto),
                        cb.like(root.get("idPuntoOriginal").as(String.class), texto),
                        cb.like(cb.lower(root.get("nombreCamara")), texto),
                        cb.like(cb.lower(root.get("direccionIp")), texto),
                        cb.like(cb.lower(root.get("direccion")), texto),
                        cb.like(cb.lower(root.get("estadoActual")), texto),
                        cb.like(cb.lower(cantonJoin.get("nombreCanton")), texto),
                        cb.like(cb.lower(provinciaJoin.get("nombreProvincia")), texto),
                        cb.like(cb.lower(plataformaJoin.get("nombrePlataforma")), texto),
                        cb.like(cb.lower(convenioJoin.get("nombreConvenio")), texto),
                        cb.like(cb.lower(modeloJoin.get("nombreModelo")), texto),
                        cb.like(cb.lower(marcaJoin.get("nombreMarca")), texto),
                        cb.like(cb.lower(root.get("pilotoCnt")), texto),
                        cb.like(cb.lower(root.get("anchoBanda")), texto)
                ));
            }

            if (idProvincia != null) {
                predicates.add(cb.equal(
                        provinciaJoin.get("idProvincia"),
                        idProvincia
                ));
            }

            if (idCanton != null) {
                predicates.add(cb.equal(
                        cantonJoin.get("idCanton"),
                        idCanton
                ));
            }

            if (estado != null && !estado.trim().isEmpty()) {
                predicates.add(cb.equal(
                        cb.upper(root.get("estadoActual")),
                        estado.trim().toUpperCase()
                ));
            }

            if (plataforma != null && !plataforma.trim().isEmpty()) {
                predicates.add(cb.equal(
                        cb.upper(plataformaJoin.get("nombrePlataforma")),
                        plataforma.trim().toUpperCase()
                ));
            }

            if (convenio != null && !convenio.trim().isEmpty()) {
                predicates.add(cb.equal(
                        cb.upper(convenioJoin.get("nombreConvenio")),
                        convenio.trim().toUpperCase()
                ));
            }

            if (idMarca != null) {
                predicates.add(cb.equal(
                        marcaJoin.get("idMarca"),
                        idMarca
                ));
            }

            if (idModelo != null) {
                predicates.add(cb.equal(
                        modeloJoin.get("idModelo"),
                        idModelo
                ));
            }

            if (anchoBanda != null && !anchoBanda.trim().isEmpty()) {
                predicates.add(cb.equal(
                        cb.upper(root.get("anchoBanda")),
                        anchoBanda.trim().toUpperCase()
                ));
            }

            if (pilotoCnt != null && !pilotoCnt.trim().isEmpty()) {
                String textoPiloto = "%" + pilotoCnt.trim().toLowerCase() + "%";

                predicates.add(cb.like(
                        cb.lower(root.get("pilotoCnt")),
                        textoPiloto
                ));
            }

            if (tipoDanoSinServicio != null && !tipoDanoSinServicio.trim().isEmpty()) {
                predicates.add(cb.equal(
                        cb.upper(root.get("tipoDanoSinServicio")),
                        tipoDanoSinServicio.trim().toUpperCase()
                ));
            }

            if (tipoFallaTecnica != null && !tipoFallaTecnica.trim().isEmpty()) {
                predicates.add(cb.equal(
                        cb.upper(root.get("tipoFallaTecnica")),
                        tipoFallaTecnica.trim().toUpperCase()
                ));
            }

            if (fechaInstalacion != null) {
                predicates.add(cb.equal(
                        root.get("fechaInstalacion"),
                        fechaInstalacion
                ));
            }

            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Specification<Camara> construirSpecificationActivarDesactivar(
        String busqueda,
        Boolean activo
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<Object, Object> cantonJoin = root.join("canton", JoinType.LEFT);
            Join<Object, Object> provinciaJoin = cantonJoin.join("provincia", JoinType.LEFT);
            Join<Object, Object> plataformaJoin = root.join("plataforma", JoinType.LEFT);
            Join<Object, Object> modeloJoin = root.join("modelo", JoinType.LEFT);
            Join<Object, Object> marcaJoin = modeloJoin.join("marca", JoinType.LEFT);

            if (activo != null) {
                if (activo) {
                    predicates.add(cb.or(
                            cb.isNull(root.get("activo")),
                            cb.isTrue(root.get("activo"))
                    ));
                } else {
                    predicates.add(cb.isFalse(root.get("activo")));
                }
            }

            if (busqueda != null && !busqueda.trim().isEmpty()) {
                String texto = "%" + busqueda.trim().toLowerCase() + "%";

                predicates.add(cb.or(
                        cb.like(root.get("idCamara").as(String.class), texto),
                        cb.like(root.get("idPuntoOriginal").as(String.class), texto),
                        cb.like(cb.lower(root.get("nombreCamara")), texto),
                        cb.like(cb.lower(root.get("direccionIp")), texto),
                        cb.like(cb.lower(root.get("direccion")), texto),
                        cb.like(cb.lower(root.get("estadoActual")), texto),
                        cb.like(cb.lower(cantonJoin.get("nombreCanton")), texto),
                        cb.like(cb.lower(provinciaJoin.get("nombreProvincia")), texto),
                        cb.like(cb.lower(plataformaJoin.get("nombrePlataforma")), texto),
                        cb.like(cb.lower(modeloJoin.get("nombreModelo")), texto),
                        cb.like(cb.lower(marcaJoin.get("nombreMarca")), texto),
                        cb.like(cb.lower(root.get("pilotoCnt")), texto),
                        cb.like(cb.lower(root.get("anchoBanda")), texto)
                ));
            }

            query.distinct(true);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private String valorCsv(Object valor) {
        if (valor == null) {
            return "";
        }

        String texto = valor.toString();
        texto = texto.replace("\"", "\"\"");

        return "\"" + texto + "\"";
    }

    @Transactional(readOnly = true)
    public Page<CamaraResponseDTO> listarCamarasPaginadas(Pageable pageable) {
        Pageable pageableOrdenado = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("idPuntoOriginal").ascending()
        );

        return camaraRepository.findAll(pageableOrdenado)
                .map(CamaraMapper::toResponseDTO);
    }


    @Transactional(readOnly = true)
    public Page<CamaraResponseDTO> buscarCamarasParaCambio(
        String busqueda,
        int page,
        int size
    ) {
        Pageable pageable = PageRequest.of(page, size);

        return camaraRepository.buscarCamarasParaCambio(busqueda, pageable)
                .map(CamaraMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public Page<CamaraResponseDTO> buscarCamarasActivarDesactivar(
        String busqueda,
        Boolean activo,
        int page,
        int size
    ) {
        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("idPuntoOriginal").ascending()
        );

        Specification<Camara> spec = construirSpecificationActivarDesactivar(
                busqueda,
                activo
        );

        return camaraRepository.findAll(spec, pageable)
                .map(CamaraMapper::toResponseDTO);
    }

    @Transactional(readOnly = true)
    public CamaraResponseDTO obtenerPorId(Integer id) {
        Camara camara = camaraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cámara no encontrada con ID: " + id));

        return CamaraMapper.toResponseDTO(camara);
    }

    @Transactional
    public CamaraResponseDTO guardarCamara(CamaraRequestDTO dto) {
        validarDuplicadosAlCrear(dto);
        Camara camara = CamaraMapper.toEntity(dto);
        Camara camaraGuardada = camaraRepository.save(camara);

        guardarOActualizarDetalleConvenioCamara(
                camaraGuardada,
                dto.getIdConvenio(),
                dto.getCostoEnlace(),
                dto.getFechaConvenioOriginal(),
                dto.getFechaConvenioInicio(),
                dto.getFechaConvenioFin(),
                dto.getEstadoFechaConvenio(),
                dto.getFechaInicialPago(),
                dto.getProveedorEnlace(),
                dto.getResponsablePago()
        );

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "USUARIO",
                "CREAR",
                "CAMARA",
                camaraGuardada.getIdCamara(),
                "Se creó la cámara: " + camaraGuardada.getNombreCamara()
        );

        return CamaraMapper.toResponseDTO(camaraGuardada);
    }

    @Transactional
    public CamaraResponseDTO actualizarCamara(Integer id, CamaraRequestDTO dto) {

        Camara camaraExistente = camaraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cámara no encontrada con ID: " + id));

        String usuarioRegistro = obtenerUsuarioAutenticado();
        String rolRegistro = obtenerRolAutenticado();
        Integer idAnalistaRegistro = dto.getIdAnalista();

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "ID punto original",
                camaraExistente.getIdPuntoOriginal(),
                dto.getIdPuntoOriginal(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Nombre cámara",
                camaraExistente.getNombreCamara(),
                dto.getNombreCamara(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Dirección",
                camaraExistente.getDireccion(),
                dto.getDireccion(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Usuario alfanumérico",
                camaraExistente.getUsuarioAlfanumerico(),
                dto.getUsuarioAlfanumerico(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Latitud",
                camaraExistente.getLatitud(),
                dto.getLatitud(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Longitud",
                camaraExistente.getLongitud(),
                dto.getLongitud(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Dirección IP",
                camaraExistente.getDireccionIp(),
                dto.getDireccionIp(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Tipo dispositivo",
                camaraExistente.getTipoDispositivo(),
                dto.getTipoDispositivo(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Fecha instalación",
                camaraExistente.getFechaInstalacion(),
                dto.getFechaInstalacion(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Año",
                camaraExistente.getAnio(),
                dto.getAnio(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Estado actual",
                camaraExistente.getEstadoActual(),
                dto.getEstadoActual(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "A quién pertenece",
                camaraExistente.getAQuienPertenece(),
                dto.getAQuienPertenece(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Piloto CNT",
                camaraExistente.getPilotoCnt(),
                dto.getPilotoCnt(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Ancho de banda",
                camaraExistente.getAnchoBanda(),
                dto.getAnchoBanda(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Conversor",
                camaraExistente.getConversor(),
                dto.getConversor(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Poste",
                camaraExistente.getPoste(),
                dto.getPoste(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Brazo",
                camaraExistente.getBrazo(),
                dto.getBrazo(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
            camaraExistente,
            idAnalistaRegistro,
            "Descripción daño",
            camaraExistente.getDescripcionDano(),
            dto.getDescripcionDano(),
            usuarioRegistro,
            rolRegistro
        );

        registrarCambioEdicion(
            camaraExistente,
            idAnalistaRegistro,
            "Tipo daño sin servicio",
            camaraExistente.getTipoDanoSinServicio(),
            dto.getTipoDanoSinServicio(),
            usuarioRegistro,
            rolRegistro
        );

        registrarCambioEdicion(
            camaraExistente,
            idAnalistaRegistro,
            "Tipo falla técnica",
            camaraExistente.getTipoFallaTecnica(),
            dto.getTipoFallaTecnica(),
            usuarioRegistro,
            rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Serie de la cámara",
                camaraExistente.getSerieCamara(),
                dto.getSerieCamara(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Marca UPS",
                camaraExistente.getMarcaUps(),
                dto.getMarcaUps(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Serie UPS",
                camaraExistente.getSerieUps(),
                dto.getSerieUps(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Estado UPS",
                camaraExistente.getEstadoUps(),
                dto.getEstadoUps(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Abejas",
                camaraExistente.getAbejas(),
                dto.getAbejas(),
                usuarioRegistro,
                rolRegistro
        );

        registrarCambioEdicion(
                camaraExistente,
                idAnalistaRegistro,
                "Observaciones",
                camaraExistente.getObservaciones(),
                dto.getObservaciones(),
                usuarioRegistro,
                rolRegistro
        );

        if (dto.getIdAnalista() != null) {
            registrarCambioEdicion(
                    camaraExistente,
                    idAnalistaRegistro,
                    "ID analista",
                    camaraExistente.getAnalista() != null
                            ? camaraExistente.getAnalista().getIdAnalista()
                            : null,
                    dto.getIdAnalista(),
                    usuarioRegistro,
                    rolRegistro
            );
        }

        if (dto.getIdCanton() != null) {
            registrarCambioEdicion(
                    camaraExistente,
                    idAnalistaRegistro,
                    "ID cantón",
                    camaraExistente.getCanton() != null
                            ? camaraExistente.getCanton().getIdCanton()
                            : null,
                    dto.getIdCanton(),
                    usuarioRegistro,
                    rolRegistro
            );
        }

        if (dto.getIdModelo() != null) {
            registrarCambioEdicion(
                    camaraExistente,
                    idAnalistaRegistro,
                    "ID modelo",
                    camaraExistente.getModelo() != null
                            ? camaraExistente.getModelo().getIdModelo()
                            : null,
                    dto.getIdModelo(),
                    usuarioRegistro,
                    rolRegistro
            );
        }

        if (dto.getIdPlataforma() != null) {
            registrarCambioEdicion(
                    camaraExistente,
                    idAnalistaRegistro,
                    "ID plataforma",
                    camaraExistente.getPlataforma() != null
                            ? camaraExistente.getPlataforma().getIdPlataforma()
                            : null,
                    dto.getIdPlataforma(),
                    usuarioRegistro,
                    rolRegistro
            );
        }

        if (dto.getIdProveedor() != null) {
            registrarCambioEdicion(
                    camaraExistente,
                    idAnalistaRegistro,
                    "ID proveedor",
                    camaraExistente.getProveedor() != null
                            ? camaraExistente.getProveedor().getIdProveedor()
                            : null,
                    dto.getIdProveedor(),
                    usuarioRegistro,
                    rolRegistro
            );
        }

        if (dto.getIdCentro() != null) {
            registrarCambioEdicion(
                    camaraExistente,
                    idAnalistaRegistro,
                    "ID centro operativo",
                    camaraExistente.getCentroOperativo() != null
                            ? camaraExistente.getCentroOperativo().getIdCentro()
                            : null,
                    dto.getIdCentro(),
                    usuarioRegistro,
                    rolRegistro
            );
        }

        if (dto.getIdConvenio() != null) {
            registrarCambioEdicion(
                    camaraExistente,
                    idAnalistaRegistro,
                    "ID convenio",
                    camaraExistente.getConvenio() != null
                            ? camaraExistente.getConvenio().getIdConvenio()
                            : null,
                    dto.getIdConvenio(),
                    usuarioRegistro,
                    rolRegistro
            );
        }

        camaraExistente.setIdPuntoOriginal(dto.getIdPuntoOriginal());
        camaraExistente.setNombreCamara(dto.getNombreCamara());
        camaraExistente.setDireccion(dto.getDireccion());
        camaraExistente.setUsuarioAlfanumerico(dto.getUsuarioAlfanumerico());
        camaraExistente.setLatitud(dto.getLatitud());
        camaraExistente.setLongitud(dto.getLongitud());
        camaraExistente.setDireccionIp(dto.getDireccionIp());
        camaraExistente.setTipoDispositivo(dto.getTipoDispositivo());
        camaraExistente.setFechaInstalacion(dto.getFechaInstalacion());
        camaraExistente.setAnio(dto.getAnio());
        camaraExistente.setEstadoActual(dto.getEstadoActual());
        camaraExistente.setAQuienPertenece(dto.getAQuienPertenece());
        camaraExistente.setPilotoCnt(dto.getPilotoCnt());
        camaraExistente.setAnchoBanda(dto.getAnchoBanda());
        camaraExistente.setConversor(dto.getConversor());
        camaraExistente.setPoste(dto.getPoste());
        camaraExistente.setBrazo(dto.getBrazo());
        camaraExistente.setDescripcionDano(dto.getDescripcionDano());
        camaraExistente.setTipoDanoSinServicio(
            "SIN SERVICIO".equalsIgnoreCase(dto.getEstadoActual())
                ? dto.getTipoDanoSinServicio()
                : null
        );
        camaraExistente.setTipoFallaTecnica(
            "FALLA TECNICA".equalsIgnoreCase(dto.getEstadoActual())
                ? dto.getTipoFallaTecnica()
                : null
        );
        camaraExistente.setSerieCamara(dto.getSerieCamara());
        camaraExistente.setMarcaUps(dto.getMarcaUps());
        camaraExistente.setSerieUps(dto.getSerieUps());
        camaraExistente.setEstadoUps(dto.getEstadoUps());
        camaraExistente.setAbejas(dto.getAbejas());

        if (dto.getIdAnalista() != null) {
            Analista analista = new Analista();
            analista.setIdAnalista(dto.getIdAnalista());
            camaraExistente.setAnalista(analista);
        }

        camaraExistente.setFechaConvenioOriginal(dto.getFechaConvenioOriginal());
        camaraExistente.setFechaConvenioInicio(dto.getFechaConvenioInicio());
        camaraExistente.setFechaConvenioFin(dto.getFechaConvenioFin());
        camaraExistente.setEstadoFechaConvenio(dto.getEstadoFechaConvenio());
        camaraExistente.setFechaInicialPago(dto.getFechaInicialPago());
        camaraExistente.setProveedorEnlace(dto.getProveedorEnlace());
        camaraExistente.setResponsablePago(dto.getResponsablePago());
        camaraExistente.setCostoEnlace(dto.getCostoEnlace());
        camaraExistente.setObservaciones(dto.getObservaciones());

        if (dto.getIdCanton() != null) {
            Canton canton = new Canton();
            canton.setIdCanton(dto.getIdCanton());
            camaraExistente.setCanton(canton);
        }

        if (dto.getIdModelo() != null) {
            Modelo modelo = new Modelo();
            modelo.setIdModelo(dto.getIdModelo());
            camaraExistente.setModelo(modelo);
        }

        if (dto.getIdPlataforma() != null) {
            Plataforma plataforma = new Plataforma();
            plataforma.setIdPlataforma(dto.getIdPlataforma());
            camaraExistente.setPlataforma(plataforma);
        }

        if (dto.getIdProveedor() != null) {
            Proveedor proveedor = new Proveedor();
            proveedor.setIdProveedor(dto.getIdProveedor());
            camaraExistente.setProveedor(proveedor);
        }

        if (dto.getIdCentro() != null) {
            CentroOperativo centro = new CentroOperativo();
            centro.setIdCentro(dto.getIdCentro());
            camaraExistente.setCentroOperativo(centro);
        }

        if (dto.getIdConvenio() != null) {
            Convenio convenio = new Convenio();
            convenio.setIdConvenio(dto.getIdConvenio());
            camaraExistente.setConvenio(convenio);
        }

        Camara guardada = camaraRepository.save(camaraExistente);

        guardarOActualizarDetalleConvenioCamara(
                guardada,
                dto.getIdConvenio(),
                dto.getCostoEnlace(),
                dto.getFechaConvenioOriginal(),
                dto.getFechaConvenioInicio(),
                dto.getFechaConvenioFin(),
                dto.getEstadoFechaConvenio(),
                dto.getFechaInicialPago(),
                dto.getProveedorEnlace(),
                dto.getResponsablePago()
        );

        auditoriaService.registrar(
                usuarioRegistro,
                rolRegistro,
                "ACTUALIZAR",
                "CAMARA",
                guardada.getIdCamara(),
                "Se actualizó la cámara: " + guardada.getNombreCamara()
        );

        return CamaraMapper.toResponseDTO(guardada);
    }

    private void registrarCambioEdicion(
        Camara camara,
        Integer idAnalista,
        String campoModificado,
        Object valorAnterior,
        Object valorNuevo,
        String usuarioRegistro,
        String rolRegistro
    ) {
        historialEdicionCamaraService.registrarCambioCampo(
                camara,
                idAnalista,
                campoModificado,
                valorAnterior,
                valorNuevo,
                usuarioRegistro,
                rolRegistro
        );
    }

    @Transactional
    public CamaraResponseDTO desactivarCamara(Integer id, String motivo) {

        if (motivo == null || motivo.trim().isEmpty()) {
            throw new BadRequestException(
                    "Debe ingresar el motivo de eliminación o desactivación."
            );
        }

        Camara camara = camaraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cámara no encontrada con ID: " + id
                ));

        if (Boolean.FALSE.equals(camara.getActivo())) {
            throw new BadRequestException("La cámara ya se encuentra desactivada.");
        }

        String usuarioRegistro = obtenerUsuarioAutenticado();
        String rolRegistro = obtenerRolAutenticado();
        String estadoAnterior = camara.getEstadoActual();

        historialEliminacionCamaraService.registrarEliminacion(
                camara,
                motivo.trim(),
                usuarioRegistro,
                rolRegistro,
                estadoAnterior
        );

        camara.setActivo(false);
        camara.setMotivoDesactivacion(motivo.trim());
        camara.setFechaDesactivacion(LocalDateTime.now());
        camara.setUsuarioDesactivacion(usuarioRegistro);
        camara.setRolDesactivacion(rolRegistro);
        camara.setEstadoActual("DESACTIVADA");

        Camara camaraDesactivada = camaraRepository.save(camara);

        auditoriaService.registrar(
                usuarioRegistro,
                rolRegistro,
                "ELIMINAR",
                "CAMARA",
                camaraDesactivada.getIdCamara(),
                "Se desactivó la cámara: "
                        + camaraDesactivada.getNombreCamara()
                        + ". Motivo: "
                        + motivo.trim()
        );

        return CamaraMapper.toResponseDTO(camaraDesactivada);
    }

    @Transactional
    public CamaraResponseDTO reactivarCamara(
            Integer id,
            String estadoActual,
            String motivo
    ) {
        if (estadoActual == null || estadoActual.trim().isEmpty()) {
            throw new BadRequestException(
                    "Debe indicar el estado con el que se reactivará la cámara."
            );
        }

        Camara camara = camaraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cámara no encontrada con ID: " + id
                ));

        if (!Boolean.FALSE.equals(camara.getActivo())) {
            throw new BadRequestException("La cámara ya se encuentra activa.");
        }

        String usuarioRegistro = obtenerUsuarioAutenticado();
        String rolRegistro = obtenerRolAutenticado();

        camara.setActivo(true);
        camara.setEstadoActual(estadoActual.trim().toUpperCase());

        camara.setMotivoDesactivacion(null);
        camara.setFechaDesactivacion(null);
        camara.setUsuarioDesactivacion(null);
        camara.setRolDesactivacion(null);

        Camara camaraReactivada = camaraRepository.save(camara);

        String detalle = "Se reactivó la cámara: "
                + camaraReactivada.getNombreCamara()
                + ". Estado asignado: "
                + camaraReactivada.getEstadoActual();

        if (motivo != null && !motivo.trim().isEmpty()) {
            detalle += ". Motivo: " + motivo.trim();
        }

        auditoriaService.registrar(
                usuarioRegistro,
                rolRegistro,
                "REACTIVAR",
                "CAMARA",
                camaraReactivada.getIdCamara(),
                detalle
        );

        return CamaraMapper.toResponseDTO(camaraReactivada);
    }

    private String obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return "SISTEMA";
        }

        return authentication.getName();
    }

    private String obtenerRolAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getAuthorities() == null) {
            return "SISTEMA";
        }

        return authentication.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .map(rol -> rol.replace("ROLE_", ""))
                .orElse("SISTEMA");
    }

    @Transactional
    public CamaraResponseDTO actualizarConvenioCamara(
            
            Integer idCamara,
            ActualizarConvenioRequestDTO request
    ) {
        

        Camara camara = camaraRepository.findById(idCamara)
                .orElseThrow(() -> new ResourceNotFoundException("Cámara no encontrada con ID: " + idCamara));

        Convenio convenio = convenioRepository.findById(request.getIdConvenio())
                .orElseThrow(() -> new ResourceNotFoundException("Convenio no encontrado con ID: " + request.getIdConvenio()));

        camara.setConvenio(convenio);

        DetalleConvenioCamara detalle = detalleConvenioCamaraRepository
                .findByCamara_IdCamara(idCamara)
                .orElseGet(() -> {
                    DetalleConvenioCamara nuevoDetalle = new DetalleConvenioCamara();
                    nuevoDetalle.setCamara(camara);
                    nuevoDetalle.setIdPuntoOriginal(camara.getIdPuntoOriginal());
                    nuevoDetalle.setFuente("SISTEMA");
                    return nuevoDetalle;
                });

        detalle.setConvenioEstado(convenio);
        detalle.setEstadoConvenio(convenio.getNombreConvenio());
        detalle.setIdPuntoOriginal(camara.getIdPuntoOriginal());

        if (request.getCostoEnlace() != null) {
            detalle.setCostoEnlace(request.getCostoEnlace());
            camara.setCostoEnlace(request.getCostoEnlace());
        }

        if (request.getFechaConvenioOriginal() != null) {
            detalle.setFechaConvenioOriginal(request.getFechaConvenioOriginal());
            camara.setFechaConvenioOriginal(request.getFechaConvenioOriginal());
        }

        if (request.getFechaConvenioInicio() != null) {
            detalle.setFechaConvenioInicio(request.getFechaConvenioInicio());
            camara.setFechaConvenioInicio(request.getFechaConvenioInicio());
        }

        if (request.getFechaConvenioFin() != null) {
            detalle.setFechaConvenioFin(request.getFechaConvenioFin());
            camara.setFechaConvenioFin(request.getFechaConvenioFin());
        }

        if (request.getEstadoFechaConvenio() != null) {
            detalle.setEstadoFechaConvenio(request.getEstadoFechaConvenio());
            camara.setEstadoFechaConvenio(request.getEstadoFechaConvenio());
        }

        if (request.getFechaInicialPago() != null) {
            detalle.setFechaInicialPago(request.getFechaInicialPago());
            camara.setFechaInicialPago(request.getFechaInicialPago());
        }

        if (request.getProveedorEnlace() != null) {
            detalle.setProveedorEnlace(request.getProveedorEnlace());
            camara.setProveedorEnlace(request.getProveedorEnlace());
        }

        if (request.getResponsablePago() != null) {
            detalle.setResponsablePago(request.getResponsablePago());
            camara.setResponsablePago(request.getResponsablePago());
        }

        if (request.getDireccionIp() != null) {
            camara.setDireccionIp(request.getDireccionIp());
        }

        if (request.getDireccion() != null) {
            camara.setDireccion(request.getDireccion());
        }

        Camara camaraActualizada = camaraRepository.save(camara);
        detalleConvenioCamaraRepository.save(detalle);
    

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "ACTUALIZAR",
                "CONVENIO_CAMARA",
                camaraActualizada.getIdCamara(),
                "Se actualizó el convenio de la cámara: " + camaraActualizada.getNombreCamara()
        );

        return CamaraMapper.toResponseDTO(camaraActualizada);
    }

    public Map<String, Boolean> validarDuplicadosCamara(
        Integer idPuntoOriginal,
        String nombreCamara,
        String direccionIp
    ) {
        Map<String, Boolean> resultado = new HashMap<>();

        boolean idPuntoExiste = false;
        boolean nombreExiste = false;
        boolean ipExiste = false;

        if (idPuntoOriginal != null) {
            idPuntoExiste = camaraRepository.existsByIdPuntoOriginal(idPuntoOriginal);
        }

        if (nombreCamara != null && !nombreCamara.trim().isEmpty()) {
            nombreExiste = camaraRepository.existsByNombreCamaraLimpio(
                    nombreCamara.trim()
            );
        }

        if (direccionIp != null && !direccionIp.trim().isEmpty()) {
            ipExiste = camaraRepository.existsByDireccionIpLimpia(
                    direccionIp.trim()
            );
        }

        resultado.put("idPuntoOriginalExiste", idPuntoExiste);
        resultado.put("nombreCamaraExiste", nombreExiste);
        resultado.put("direccionIpExiste", ipExiste);

        return resultado;
    }

    private void validarDuplicadosAlCrear(CamaraRequestDTO dto) {
        Map<String, Boolean> duplicados = validarDuplicadosCamara(
                dto.getIdPuntoOriginal(),
                dto.getNombreCamara(),
                dto.getDireccionIp()
        );

        if (Boolean.TRUE.equals(duplicados.get("idPuntoOriginalExiste"))) {
            throw new BadRequestException("Ya existe una cámara con ese ID Punto.");
        }

        if (Boolean.TRUE.equals(duplicados.get("nombreCamaraExiste"))) {
            throw new BadRequestException("Ya existe una cámara con ese nombre.");
        }

        if (Boolean.TRUE.equals(duplicados.get("direccionIpExiste"))) {
            throw new BadRequestException("Ya existe una cámara con esa dirección IP.");
        }
    }

    private void guardarOActualizarDetalleConvenioCamara(
        Camara camara,
        Integer idConvenio,
        String costoEnlace,
        String fechaConvenioOriginal,
        LocalDate fechaConvenioInicio,
        LocalDate fechaConvenioFin,
        String estadoFechaConvenio,
        LocalDate fechaInicialPago,
        String proveedorEnlace,
        String responsablePago
    ) {
        if (idConvenio == null) {
            return;
        }

        Convenio convenio = convenioRepository.findById(idConvenio)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Convenio no encontrado con ID: " + idConvenio
                ));

        DetalleConvenioCamara detalle = detalleConvenioCamaraRepository
                .findByCamara_IdCamara(camara.getIdCamara())
                .orElseGet(() -> {
                    DetalleConvenioCamara nuevoDetalle = new DetalleConvenioCamara();
                    nuevoDetalle.setCamara(camara);
                    nuevoDetalle.setFuente("SISTEMA");
                    return nuevoDetalle;
                });

        detalle.setIdPuntoOriginal(camara.getIdPuntoOriginal());
        detalle.setConvenioEstado(convenio);
        detalle.setEstadoConvenio(convenio.getNombreConvenio());
        detalle.setCostoEnlace(costoEnlace);
        detalle.setFechaConvenioOriginal(fechaConvenioOriginal);
        detalle.setFechaConvenioInicio(fechaConvenioInicio);
        detalle.setFechaConvenioFin(fechaConvenioFin);
        detalle.setEstadoFechaConvenio(estadoFechaConvenio);
        detalle.setFechaInicialPago(fechaInicialPago);
        detalle.setProveedorEnlace(proveedorEnlace); 
        detalle.setResponsablePago(responsablePago);

        detalleConvenioCamaraRepository.save(detalle);
    }

}