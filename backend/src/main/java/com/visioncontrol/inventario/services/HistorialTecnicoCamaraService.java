package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.HistorialTecnicoCamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialTecnicoCamaraResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Camara;
import com.visioncontrol.inventario.entities.HistorialTecnicoCamara;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import com.visioncontrol.inventario.mappers.HistorialTecnicoCamaraMapper;
import com.visioncontrol.inventario.repositories.AnalistaRepository;
import com.visioncontrol.inventario.repositories.CamaraRepository;
import com.visioncontrol.inventario.repositories.HistorialTecnicoCamaraRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class HistorialTecnicoCamaraService {

    private final HistorialTecnicoCamaraRepository historialTecnicoCamaraRepository;
    private final CamaraRepository camaraRepository;
    private final AnalistaRepository analistaRepository;
    private final AuditoriaService auditoriaService;

    public HistorialTecnicoCamaraService(
            HistorialTecnicoCamaraRepository historialTecnicoCamaraRepository,
            CamaraRepository camaraRepository,
            AnalistaRepository analistaRepository,
            AuditoriaService auditoriaService
    ) {
        this.historialTecnicoCamaraRepository = historialTecnicoCamaraRepository;
        this.camaraRepository = camaraRepository;
        this.analistaRepository = analistaRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<HistorialTecnicoCamaraResponseDTO> listarHistorialTecnico() {
        return historialTecnicoCamaraRepository.findAll()
                .stream()
                .map(HistorialTecnicoCamaraMapper::toResponseDTO)
                .toList();
    }

    public HistorialTecnicoCamaraResponseDTO obtenerPorId(Integer idTecnico) {
        HistorialTecnicoCamara historial =
                historialTecnicoCamaraRepository.findById(idTecnico)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Historial técnico no encontrado con ID: " + idTecnico
                        ));

        return HistorialTecnicoCamaraMapper.toResponseDTO(historial);
    }

    public List<HistorialTecnicoCamaraResponseDTO> listarPorCamara(Integer idCamara) {
        return historialTecnicoCamaraRepository
                .findByCamaraIdCamaraOrderByFechaIntervencionDesc(idCamara)
                .stream()
                .map(HistorialTecnicoCamaraMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public HistorialTecnicoCamaraResponseDTO guardarHistorialTecnico(
            HistorialTecnicoCamaraRequestDTO dto
    ) {
        Camara camara = camaraRepository.findById(dto.getIdCamara())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cámara no encontrada con ID: " + dto.getIdCamara()
                ));

        Analista analista = analistaRepository.findById(dto.getIdAnalista())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Analista no encontrado con ID: " + dto.getIdAnalista()
                ));

        String estadoAnterior = obtenerValorNuevo(
                dto.getEstadoAnterior(),
                camara.getEstadoActual()
        );

        HistorialTecnicoCamara historial =
                HistorialTecnicoCamaraMapper.toEntity(dto);

        historial.setCamara(camara);
        historial.setAnalista(analista);
        historial.setEstadoAnterior(estadoAnterior);
        historial.setUsuarioRegistro(obtenerUsuarioAutenticado());
        historial.setRolRegistro(obtenerRolAutenticado());

        if (dto.getEstadoNuevo() != null && !dto.getEstadoNuevo().trim().isEmpty()) {
            camara.setEstadoActual(dto.getEstadoNuevo().trim());
            camara.setAnalista(analista);
            camaraRepository.save(camara);
        }

        HistorialTecnicoCamara guardado =
                historialTecnicoCamaraRepository.save(historial);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "CREAR",
                "HISTORIAL_TECNICO_CAMARA",
                guardado.getIdTecnico(),
                "Se registró una intervención técnica para la cámara: "
                        + camara.getNombreCamara()
        );

        return HistorialTecnicoCamaraMapper.toResponseDTO(guardado);
    }

    @Transactional
    public HistorialTecnicoCamaraResponseDTO actualizarHistorialTecnico(
            Integer idTecnico,
            HistorialTecnicoCamaraRequestDTO dto
    ) {
        HistorialTecnicoCamara historial =
                historialTecnicoCamaraRepository.findById(idTecnico)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Historial técnico no encontrado con ID: " + idTecnico
                        ));

        Camara camara = camaraRepository.findById(dto.getIdCamara())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cámara no encontrada con ID: " + dto.getIdCamara()
                ));

        Analista analista = analistaRepository.findById(dto.getIdAnalista())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Analista no encontrado con ID: " + dto.getIdAnalista()
                ));

        historial.setCamara(camara);
        historial.setAnalista(analista);
        historial.setFechaIntervencion(dto.getFechaIntervencion());
        historial.setTipoIntervencion(dto.getTipoIntervencion());
        historial.setEstadoAnterior(dto.getEstadoAnterior());
        historial.setEstadoNuevo(dto.getEstadoNuevo());
        historial.setTicketGlpi(dto.getTicketGlpi());
        historial.setDescripcionTecnica(dto.getDescripcionTecnica());
        historial.setDiagnostico(dto.getDiagnostico());
        historial.setAccionRealizada(dto.getAccionRealizada());
        historial.setResultado(dto.getResultado());
        historial.setFechaSeguimiento(dto.getFechaSeguimiento());
        historial.setObservacionSeguimiento(dto.getObservacionSeguimiento());
        historial.setResueltoGlpi(dto.getResueltoGlpi());

        if (dto.getEstadoNuevo() != null && !dto.getEstadoNuevo().trim().isEmpty()) {
            camara.setEstadoActual(dto.getEstadoNuevo().trim());
            camara.setAnalista(analista);
            camaraRepository.save(camara);
        }

        HistorialTecnicoCamara actualizado =
                historialTecnicoCamaraRepository.save(historial);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "ACTUALIZAR",
                "HISTORIAL_TECNICO_CAMARA",
                actualizado.getIdTecnico(),
                "Se actualizó una intervención técnica para la cámara: "
                        + camara.getNombreCamara()
        );

        return HistorialTecnicoCamaraMapper.toResponseDTO(actualizado);
    }

    public void eliminarHistorialTecnico(Integer idTecnico) {
        HistorialTecnicoCamara historial =
                historialTecnicoCamaraRepository.findById(idTecnico)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Historial técnico no encontrado con ID: " + idTecnico
                        ));

        historialTecnicoCamaraRepository.delete(historial);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "ELIMINAR",
                "HISTORIAL_TECNICO_CAMARA",
                historial.getIdTecnico(),
                "Se eliminó una intervención técnica ID: "
                        + historial.getIdTecnico()
        );
    }

    private String obtenerUsuarioAutenticado() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return "SISTEMA";
        }

        return authentication.getName();
    }

    private String obtenerRolAutenticado() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

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

    private String obtenerValorNuevo(String valorNuevo, String valorActual) {
        if (valorNuevo == null || valorNuevo.trim().isEmpty()) {
            return valorActual;
        }

        return valorNuevo.trim();
    }


    @Transactional(readOnly = true)
    public Page<HistorialTecnicoCamaraResponseDTO> listarHistorialTecnicoPaginado(Pageable pageable) {
        return historialTecnicoCamaraRepository
                .findAllByOrderByFechaIntervencionDescIdTecnicoDesc(pageable)
                .map(HistorialTecnicoCamaraMapper::toResponseDTO);
    }

} 