package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.CantonRequestDTO;
import com.visioncontrol.inventario.dto.response.CantonResponseDTO;
import com.visioncontrol.inventario.entities.Canton;
import com.visioncontrol.inventario.mappers.CantonMapper;
import com.visioncontrol.inventario.repositories.CantonRepository;

import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import java.util.List;
import com.visioncontrol.inventario.exceptions.BadRequestException;
@Service
public class CantonService {

    private final CantonRepository cantonRepository;

    public CantonService(CantonRepository cantonRepository) {
        this.cantonRepository = cantonRepository;
    }

    public List<CantonResponseDTO> listarCantones() {
        return cantonRepository.findAll()
                .stream()
                .map(CantonMapper::toResponseDTO)
                .toList();
    }

    public List<CantonResponseDTO> listarCantonesPorProvincia(Integer idProvincia) {
        return cantonRepository.findByProvinciaId(idProvincia)
                .stream()
                .map(CantonMapper::toResponseDTO)
                .toList();
    }

    public CantonResponseDTO obtenerPorId(Integer id) {
        Canton canton = cantonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cantón no encontrado con ID: " + id));

        return CantonMapper.toResponseDTO(canton);
    }

    public CantonResponseDTO guardarCanton(CantonRequestDTO cantonRequestDTO) {
        Canton canton = CantonMapper.toEntity(cantonRequestDTO);
        if (cantonRepository.existsByNombreCanton(
                cantonRequestDTO.getNombreCanton().trim().toUpperCase())) {

            throw new BadRequestException("Ya existe un cantón con ese nombre");
        }
        Canton cantonGuardado = cantonRepository.save(canton);
        return CantonMapper.toResponseDTO(cantonGuardado);
    }

    public CantonResponseDTO actualizarCanton(Integer id, CantonRequestDTO cantonRequestDTO) {
        Canton cantonExistente = cantonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cantón no encontrado con ID: " + id));

        cantonExistente.setNombreCanton(cantonRequestDTO.getNombreCanton());

        if (cantonRequestDTO.getIdProvincia() != null) {
            cantonExistente.getProvincia().setIdProvincia(cantonRequestDTO.getIdProvincia());
        }

        Canton cantonActualizado = cantonRepository.save(cantonExistente);

        return CantonMapper.toResponseDTO(cantonActualizado);
    }

    public void eliminarCanton(Integer id) {
    Canton canton = cantonRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Cantón no encontrado con ID: " + id));

    cantonRepository.delete(canton);
}
}