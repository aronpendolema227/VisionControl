package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.PlataformaRequestDTO;
import com.visioncontrol.inventario.dto.response.PlataformaResponseDTO;
import com.visioncontrol.inventario.entities.Plataforma;
import com.visioncontrol.inventario.mappers.PlataformaMapper;
import com.visioncontrol.inventario.repositories.PlataformaRepository;

import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import java.util.List;
import com.visioncontrol.inventario.exceptions.BadRequestException;
@Service
public class PlataformaService {

    private final PlataformaRepository plataformaRepository;

    public PlataformaService(PlataformaRepository plataformaRepository) {
        this.plataformaRepository = plataformaRepository;
    }

    public List<PlataformaResponseDTO> listarPlataformas() {
        return plataformaRepository.findAll()
                .stream()
                .map(PlataformaMapper::toResponseDTO)
                .toList();
    }

    public PlataformaResponseDTO obtenerPorId(Integer id) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plataforma no encontrada con ID: " + id));

        return PlataformaMapper.toResponseDTO(plataforma);
    }

    public PlataformaResponseDTO guardarPlataforma(PlataformaRequestDTO dto) {
        Plataforma plataforma = PlataformaMapper.toEntity(dto);
        Plataforma guardada = plataformaRepository.save(plataforma);

        return PlataformaMapper.toResponseDTO(guardada);
    }

    public PlataformaResponseDTO actualizarPlataforma(Integer id, PlataformaRequestDTO dto) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plataforma no encontrada con ID: " + id));
        plataforma.setNombrePlataforma(dto.getNombrePlataforma());
        
        if (plataformaRepository.existsByNombrePlataforma(
            dto.getNombrePlataforma().trim().toUpperCase())) {

            throw new BadRequestException("Ya existe una plataforma con ese nombre");
        }

        Plataforma actualizada = plataformaRepository.save(plataforma);

        return PlataformaMapper.toResponseDTO(actualizada);
    }

    public void eliminarPlataforma(Integer id) {
        Plataforma plataforma = plataformaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plataforma no encontrada con ID: " + id));

        plataformaRepository.delete(plataforma);
    }
}