package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.HistorialNovedadRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialNovedadResponseDTO;
import com.visioncontrol.inventario.entities.HistorialNovedad;
import com.visioncontrol.inventario.mappers.HistorialNovedadMapper;
import com.visioncontrol.inventario.repositories.HistorialNovedadRepository;

import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.security.core.GrantedAuthority;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.ArrayList;
import java.util.Objects;


@Transactional(readOnly = true)//ojo
@Service
public class HistorialNovedadService {

    private final HistorialNovedadRepository historialNovedadRepository;
    private final AuditoriaService auditoriaService;

    public HistorialNovedadService(
            HistorialNovedadRepository historialNovedadRepository,
            AuditoriaService auditoriaService
    ) {
        this.historialNovedadRepository = historialNovedadRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<HistorialNovedadResponseDTO> listarHistorial() {
        return historialNovedadRepository.findAll()
                .stream()
                .map(HistorialNovedadMapper::toResponseDTO)
                .toList();
    }

    public HistorialNovedadResponseDTO obtenerPorId(Integer id) {
        HistorialNovedad historial = historialNovedadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novedad no encontrada con ID: " + id));
        return HistorialNovedadMapper.toResponseDTO(historial);
    }
    @Transactional
    public HistorialNovedadResponseDTO guardarHistorial(HistorialNovedadRequestDTO dto) {
        HistorialNovedad historial = HistorialNovedadMapper.toEntity(dto);
        HistorialNovedad guardado = historialNovedadRepository.save(historial);

        auditoriaService.registrar(
            obtenerUsuarioAutenticado(),
            obtenerRolAutenticado(),
            "CREAR",
            "HISTORIAL_NOVEDAD",
            guardado.getIdNovedad(),
            "Se creó una novedad/reporte operativo ID: "
                    + guardado.getIdNovedad()
                    + " para la cámara ID: "
                    + dto.getIdCamara()
                    + ". Estado operativo: "
                    + dto.getEstadoOperativo()
                    + ". Ticket GLPI: "
                    + (dto.getTicketGlpi() != null ? dto.getTicketGlpi() : "Sin ticket")
        );

        return HistorialNovedadMapper.toResponseDTO(guardado);
    }
    @Transactional
    public HistorialNovedadResponseDTO actualizarHistorial(Integer id, HistorialNovedadRequestDTO dto) {

        HistorialNovedad historialExistente = historialNovedadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novedad no encontrada con ID: " + id));

        List<String> cambios = new ArrayList<>();

        agregarCambio(
                cambios,
                "Fecha revisión",
                historialExistente.getFechaRevision(),
                dto.getFechaRevision()
        );

        agregarCambio(
                cambios,
                "Estado operativo",
                historialExistente.getEstadoOperativo(),
                dto.getEstadoOperativo()
        );

        agregarCambio(
                cambios,
                "Ticket GLPI",
                historialExistente.getTicketGlpi(),
                dto.getTicketGlpi()
        );

        agregarCambio(
                cambios,
                "Observaciones",
                historialExistente.getObservaciones(),
                dto.getObservaciones()
        );

        agregarCambio(
                cambios,
                "Novedades",
                historialExistente.getNovedades(),
                dto.getNovedades()
        );

        agregarCambio(
                cambios,
                "Presenta daño",
                historialExistente.getPresentaDano(),
                dto.getPresentaDano()
        );

        agregarCambio(
                cambios,
                "Descripción daño",
                historialExistente.getDescripcionDano(),
                dto.getDescripcionDano()
        );

        agregarCambio(
                cambios,
                "Fecha seguimiento",
                historialExistente.getFechaSeguimiento(),
                dto.getFechaSeguimiento()
        );

        agregarCambio(
                cambios,
                "Detalle seguimiento",
                historialExistente.getSeguimientoDetalle(),
                dto.getSeguimientoDetalle()
        );

        agregarCambio(
                cambios,
                "Resuelto GLPI",
                historialExistente.getResueltoGlpi(),
                dto.getResueltoGlpi()
        );

        agregarCambio(
                cambios,
                "Fecha solución",
                historialExistente.getFechaSolucion(),
                dto.getFechaSolucion()
        );

        HistorialNovedad historialActualizado = HistorialNovedadMapper.toEntity(dto);
        historialActualizado.setIdNovedad(id);

        HistorialNovedad guardado = historialNovedadRepository.save(historialActualizado);

        String detalleAuditoria;

        if (cambios.isEmpty()) {
            detalleAuditoria = "Se guardó el reporte operativo ID: "
                    + guardado.getIdNovedad()
                    + ", pero no se detectaron cambios en los campos.";
        } else {
            detalleAuditoria = "Se editó el reporte operativo ID: "
                    + guardado.getIdNovedad()
                    + " de la cámara ID: "
                    + dto.getIdCamara()
                    + ". Cambios realizados: "
                    + String.join(" | ", cambios);
        }

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "ACTUALIZAR",
                "HISTORIAL_NOVEDAD",
                guardado.getIdNovedad(),
                detalleAuditoria
        );

        return HistorialNovedadMapper.toResponseDTO(guardado);
    }
    @Transactional
    public void eliminarHistorial(Integer id) {
        HistorialNovedad historial = historialNovedadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Novedad no encontrada con ID: " + id));

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                obtenerRolAutenticado(),
                "ELIMINAR",
                "HISTORIAL_NOVEDAD",
                historial.getIdNovedad(),
                "Se eliminó la novedad ID: " + historial.getIdNovedad()
        );

        historialNovedadRepository.delete(historial);
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

    private void agregarCambio(
            List<String> cambios,
            String campo,
            Object valorAnterior,
            Object valorNuevo
    ) {
        String anterior = normalizarValor(valorAnterior);
        String nuevo = normalizarValor(valorNuevo);

        if (!Objects.equals(anterior, nuevo)) {
            cambios.add(campo + ": " + anterior + " → " + nuevo);
        }
    }

    private String normalizarValor(Object valor) {
        if (valor == null) {
            return "Sin valor";
        }

        String texto = String.valueOf(valor).trim();

        if (texto.isEmpty()) {
            return "Sin valor";
        }

        if ("true".equalsIgnoreCase(texto)) {
            return "Sí";
        }

        if ("false".equalsIgnoreCase(texto)) {
            return "No";
        }

        return texto;
    }

    

    @Transactional(readOnly = true)
    public Page<HistorialNovedadResponseDTO> listarHistorialPaginado(Pageable pageable) {
        return listarHistorialPaginado(pageable, null);
    }

    @Transactional(readOnly = true)
    public Page<HistorialNovedadResponseDTO> listarHistorialPaginado(
            Pageable pageable,
            String busquedaGeneral
    ) {
        if (busquedaGeneral == null || busquedaGeneral.trim().isEmpty()) {
            return historialNovedadRepository
                    .findAllByOrderByFechaRevisionDescIdNovedadDesc(pageable)
                    .map(HistorialNovedadMapper::toResponseDTO);
        }

        return historialNovedadRepository
                .buscarHistorialOperacionesGeneral(busquedaGeneral.trim(), pageable)
                .map(HistorialNovedadMapper::toResponseDTO);
    }

}
