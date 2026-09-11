package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.HistorialCambioCamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialCambioCamaraResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Camara;
import com.visioncontrol.inventario.entities.HistorialCambioCamara;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import com.visioncontrol.inventario.mappers.HistorialCambioCamaraMapper;
import com.visioncontrol.inventario.repositories.AnalistaRepository;
import com.visioncontrol.inventario.repositories.CamaraRepository;
import com.visioncontrol.inventario.repositories.HistorialCambioCamaraRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.visioncontrol.inventario.entities.Modelo;
import com.visioncontrol.inventario.entities.Plataforma;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import com.visioncontrol.inventario.exceptions.BadRequestException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class HistorialCambioCamaraService {

    private final HistorialCambioCamaraRepository historialCambioCamaraRepository;
    private final CamaraRepository camaraRepository;
    private final AnalistaRepository analistaRepository;
    private final AuditoriaService auditoriaService;

    public HistorialCambioCamaraService(
            HistorialCambioCamaraRepository historialCambioCamaraRepository,
            CamaraRepository camaraRepository,
            AnalistaRepository analistaRepository,
            AuditoriaService auditoriaService
    ) {
        this.historialCambioCamaraRepository = historialCambioCamaraRepository;
        this.camaraRepository = camaraRepository;
        this.analistaRepository = analistaRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<HistorialCambioCamaraResponseDTO> listarCambios() {
        return historialCambioCamaraRepository.findAll()
                .stream()
                .map(HistorialCambioCamaraMapper::toResponseDTO)
                .toList();
    }

    public List<HistorialCambioCamaraResponseDTO> listarPorCamara(Integer idCamara) {
        return historialCambioCamaraRepository
                .findByCamaraIdCamaraOrderByFechaCambioDesc(idCamara)
                .stream()
                .map(HistorialCambioCamaraMapper::toResponseDTO)
                .toList();
    }

    public HistorialCambioCamaraResponseDTO obtenerPorId(Integer idCambio) {
        HistorialCambioCamara historial = historialCambioCamaraRepository.findById(idCambio)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cambio de cámara no encontrado con ID: " + idCambio
                ));

        return HistorialCambioCamaraMapper.toResponseDTO(historial);
    }

    @Transactional
    public HistorialCambioCamaraResponseDTO guardarCambio(HistorialCambioCamaraRequestDTO dto) {
        Camara camara = camaraRepository.findById(dto.getIdCamara())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cámara no encontrada con ID: " + dto.getIdCamara()
                ));

        String nombreAnterior = camara.getNombreCamara();
        String ipAnterior = camara.getDireccionIp();
        String estadoAnterior = camara.getEstadoActual();
        String tipoDispositivoAnterior = camara.getTipoDispositivo();

        String tipoDanoSinServicioAnterior = camara.getTipoDanoSinServicio();
        String tipoFallaTecnicaAnterior = camara.getTipoFallaTecnica();

        String nombreNuevo = obtenerValorNuevo(dto.getNombreCamaraNueva(), nombreAnterior);
        String ipNueva = obtenerValorNuevo(dto.getIpNueva(), ipAnterior);
        String estadoNuevo = obtenerValorNuevo(dto.getEstadoNuevo(), estadoAnterior);
        String tipoDanoSinServicioNuevo =
        "SIN SERVICIO".equalsIgnoreCase(estadoNuevo)
                ? obtenerValorNuevo(
                        dto.getTipoDanoSinServicioNuevo(),
                        tipoDanoSinServicioAnterior
                )
                : null;
        String tipoFallaTecnicaNuevo =
        "FALLA TECNICA".equalsIgnoreCase(estadoNuevo)
                ? obtenerValorNuevo(
                        dto.getTipoFallaTecnicaNuevo(),
                        tipoFallaTecnicaAnterior
                )
                : null;
        String tipoDispositivoNuevo = obtenerValorNuevo(
                dto.getTipoDispositivoNuevo(),
                tipoDispositivoAnterior
        );

        validarDuplicadosCambio(
                camara.getIdCamara(),
                nombreAnterior,
                nombreNuevo,
                ipAnterior,
                ipNueva
        );

        Analista analista = null;

        if (dto.getIdAnalista() != null) {
            analista = analistaRepository.findById(dto.getIdAnalista())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Analista no encontrado con ID: " + dto.getIdAnalista()
                    ));
        }

        camara.setNombreCamara(nombreNuevo);
        camara.setDireccionIp(ipNueva);
        camara.setEstadoActual(estadoNuevo);
        camara.setTipoDanoSinServicio(tipoDanoSinServicioNuevo);
        camara.setTipoFallaTecnica(tipoFallaTecnicaNuevo);
        camara.setTipoDispositivo(tipoDispositivoNuevo);

        if (dto.getIdModeloNuevo() != null) {
            Modelo modelo = new Modelo();
            modelo.setIdModelo(dto.getIdModeloNuevo());
            camara.setModelo(modelo);
        }

        if (dto.getIdPlataformaNueva() != null) {
            Plataforma plataforma = new Plataforma();
            plataforma.setIdPlataforma(dto.getIdPlataformaNueva());
            camara.setPlataforma(plataforma);
        }

        if (dto.getIdPuntoNuevo() != null) {
            camara.setIdPuntoOriginal(dto.getIdPuntoNuevo());
        }

        camara.setPilotoCnt(obtenerValorNuevo(dto.getPilotoCntNuevo(), camara.getPilotoCnt()));
        camara.setAnchoBanda(obtenerValorNuevo(dto.getAnchoBandaNuevo(), camara.getAnchoBanda()));

        if (dto.getLatitudNueva() != null) {
            camara.setLatitud(dto.getLatitudNueva());
        }

        if (dto.getLongitudNueva() != null) {
            camara.setLongitud(dto.getLongitudNueva());
        }

        camara.setConversor(obtenerValorNuevo(dto.getConversorNuevo(), camara.getConversor()));
        camara.setPoste(obtenerValorNuevo(dto.getPosteNuevo(), camara.getPoste()));
        camara.setBrazo(obtenerValorNuevo(dto.getBrazoNuevo(), camara.getBrazo()));

        camara.setAQuienPertenece(
                obtenerValorNuevo(dto.getAQuienPerteneceNuevo(), camara.getAQuienPertenece())
        );

        if (dto.getFechaInstalacionNueva() != null) {
            camara.setFechaInstalacion(dto.getFechaInstalacionNueva());
        }

        camara.setDireccion(obtenerValorNuevo(dto.getDireccionNueva(), camara.getDireccion()));
        camara.setObservaciones(
                obtenerValorNuevo(dto.getObservacionesNuevas(), camara.getObservaciones())
        );

        camara.setFechaConvenioOriginal(
                obtenerValorNuevo(dto.getFechaConvenioOriginalNueva(), camara.getFechaConvenioOriginal())
        );

        if (dto.getFechaConvenioInicioNueva() != null) {
            camara.setFechaConvenioInicio(dto.getFechaConvenioInicioNueva());
        }

        if (dto.getFechaConvenioFinNueva() != null) {
            camara.setFechaConvenioFin(dto.getFechaConvenioFinNueva());
        }

        camara.setEstadoFechaConvenio(
                obtenerValorNuevo(dto.getEstadoFechaConvenioNuevo(), camara.getEstadoFechaConvenio())
        );

        if (dto.getFechaInicialPagoNueva() != null) {
            camara.setFechaInicialPago(dto.getFechaInicialPagoNueva());
        }

        camara.setProveedorEnlace(
                obtenerValorNuevo(dto.getProveedorEnlaceNuevo(), camara.getProveedorEnlace())
        );

        camara.setResponsablePago(
                obtenerValorNuevo(dto.getResponsablePagoNuevo(), camara.getResponsablePago())
        );

        camara.setCostoEnlace(
                obtenerValorNuevo(dto.getCostoEnlaceNuevo(), camara.getCostoEnlace())
        );

        if (analista != null) {
            camara.setAnalista(analista);
        }

        Camara camaraActualizada = camaraRepository.save(camara);

        HistorialCambioCamara historial = HistorialCambioCamaraMapper.toEntity(dto);
        historial.setCamara(camaraActualizada);

        historial.setNombreCamaraAnterior(nombreAnterior);
        historial.setNombreCamaraNueva(nombreNuevo);
        historial.setIpAnterior(ipAnterior);
        historial.setIpNueva(ipNueva);
        historial.setEstadoAnterior(estadoAnterior);
        historial.setEstadoNuevo(estadoNuevo);
        historial.setTipoDanoSinServicioAnterior(tipoDanoSinServicioAnterior);
        historial.setTipoDanoSinServicioNuevo(tipoDanoSinServicioNuevo);
        historial.setTipoFallaTecnicaAnterior(tipoFallaTecnicaAnterior);
        historial.setTipoFallaTecnicaNuevo(tipoFallaTecnicaNuevo);
        historial.setTipoDispositivoAnterior(tipoDispositivoAnterior);
        historial.setTipoDispositivoNuevo(tipoDispositivoNuevo);

        if (analista != null) {
            historial.setAnalista(analista);
        }

        historial.setUsuarioRegistro(obtenerUsuarioAutenticado());
        historial.setRolRegistro(obtenerRolAutenticado());

        HistorialCambioCamara guardado = historialCambioCamaraRepository.save(historial);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "ACTUALIZAR",
                "CAMARA",
                camaraActualizada.getIdCamara(),
                "Se actualizó la ficha de la cámara por cambio técnico: "
                        + camaraActualizada.getNombreCamara()
        );

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "CREAR",
                "HISTORIAL_CAMBIO_CAMARA",
                guardado.getIdCambio(),
                "Se registró un cambio para la cámara: "
                        + camaraActualizada.getNombreCamara()
        );

        return HistorialCambioCamaraMapper.toResponseDTO(guardado);
    }

    public void eliminarCambio(Integer idCambio) {
        HistorialCambioCamara historial = historialCambioCamaraRepository.findById(idCambio)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cambio de cámara no encontrado con ID: " + idCambio
                ));

        historialCambioCamaraRepository.delete(historial);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "ELIMINAR",
                "HISTORIAL_CAMBIO_CAMARA",
                historial.getIdCambio(),
                "Se eliminó un cambio de cámara ID: " + historial.getIdCambio()
        );
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

    private void validarDuplicadosCambio(
        Integer idCamaraActual,
        String nombreAnterior,
        String nombreNuevo,
        String ipAnterior,
        String ipNueva
    ) {
        if (
                nombreNuevo != null
                && !nombreNuevo.trim().isEmpty()
                && !nombreNuevo.trim().equalsIgnoreCase(valorSeguro(nombreAnterior))
                && camaraRepository.existsByNombreCamaraLimpioExcluyendoId(
                        nombreNuevo.trim(),
                        idCamaraActual
                )
        ) {
            throw new BadRequestException("Ya existe otra cámara con ese nombre.");
        }

        if (
                ipNueva != null
                && !ipNueva.trim().isEmpty()
                && !ipNueva.trim().equalsIgnoreCase(valorSeguro(ipAnterior))
                && camaraRepository.existsByDireccionIpLimpiaExcluyendoId(
                        ipNueva.trim(),
                        idCamaraActual
                )
        ) {
            throw new BadRequestException("Ya existe otra cámara con esa dirección IP.");
        }
    }

    private String obtenerValorNuevo(String valorNuevo, String valorActual) {
        if (valorNuevo == null) {
            return valorActual;
        }

        String limpio = valorNuevo.trim();

        if (limpio.isEmpty()) {
            return valorActual;
        }

        return limpio;
    }

    private String valorSeguro(String valor) {
        if (valor == null) {
            return "";
        }

        return valor.trim();
    }

    @Transactional(readOnly = true)
    public Page<HistorialCambioCamaraResponseDTO> listarCambiosPaginado(Pageable pageable) {
        return historialCambioCamaraRepository
                .findAllByOrderByFechaCambioDescIdCambioDesc(pageable)
                .map(HistorialCambioCamaraMapper::toResponseDTO);
    }


}