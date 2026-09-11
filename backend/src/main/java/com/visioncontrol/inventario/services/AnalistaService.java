package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.AnalistaRequestDTO;
import com.visioncontrol.inventario.dto.response.AnalistaResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.mappers.AnalistaMapper;
import com.visioncontrol.inventario.repositories.AnalistaRepository;

import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class AnalistaService {

    private final AnalistaRepository analistaRepository;
    private final AuditoriaService auditoriaService;

    public AnalistaService(
            AnalistaRepository analistaRepository,
            AuditoriaService auditoriaService
    ) {
        this.analistaRepository = analistaRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<AnalistaResponseDTO> listarAnalistas() {
        return analistaRepository.findAll()
                .stream()
                .map(AnalistaMapper::toResponseDTO)
                .toList();
    }

    public AnalistaResponseDTO obtenerPorId(Integer id) {
        Analista analista = analistaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analista no encontrado con ID: " + id));

        return AnalistaMapper.toResponseDTO(analista);
    }

    public AnalistaResponseDTO guardarAnalista(AnalistaRequestDTO dto) {
        Analista analista = AnalistaMapper.toEntity(dto);
        Analista guardado = analistaRepository.save(analista);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "USUARIO",
                "CREAR",
                "ANALISTA",
                guardado.getIdAnalista(),
                "Se creó el analista: " + guardado.getNombreAnalista()
        );

        return AnalistaMapper.toResponseDTO(guardado);
    }

    public AnalistaResponseDTO actualizarAnalista(Integer id, AnalistaRequestDTO dto) {
        Analista analista = analistaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analista no encontrado con ID: " + id));

            analista.setNombreAnalista(dto.getNombreAnalista());
            analista.setCargo(dto.getCargo());
            analista.setArea(dto.getArea());
            analista.setCorreo(dto.getCorreo());
            analista.setTelefono(dto.getTelefono());
            analista.setActivo(dto.getActivo());

        Analista actualizado = analistaRepository.save(analista);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "USUARIO",
                "ACTUALIZAR",
                "ANALISTA",
                actualizado.getIdAnalista(),
                "Se actualizó el analista: " + actualizado.getNombreAnalista()
        );

        return AnalistaMapper.toResponseDTO(actualizado);
    }

    public void eliminarAnalista(Integer id) {
        Analista analista = analistaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analista no encontrado con ID: " + id));

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "USUARIO",
                "ELIMINAR",
                "ANALISTA",
                analista.getIdAnalista(),
                "Se eliminó el analista: " + analista.getNombreAnalista()
        );

        analistaRepository.delete(analista);
    }

    private String obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return "SISTEMA";
        }

        return authentication.getName();
    }
}
