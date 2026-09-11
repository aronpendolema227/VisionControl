package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.MarcaRequestDTO;
import com.visioncontrol.inventario.dto.response.MarcaResponseDTO;
import com.visioncontrol.inventario.entities.Marca;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import com.visioncontrol.inventario.mappers.MarcaMapper;
import com.visioncontrol.inventario.repositories.MarcaRepository;
import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.BadRequestException;
import java.util.List;

@Service
public class MarcaService {

    private final MarcaRepository marcaRepository;

    public MarcaService(MarcaRepository marcaRepository) {
        this.marcaRepository = marcaRepository;
    }

    public List<MarcaResponseDTO> listarTodas() {
        return marcaRepository.findAll()
                .stream()
                .map(MarcaMapper::toDTO)
                .toList();
    }

    public MarcaResponseDTO buscarPorId(Integer id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con ID: " + id));

        return MarcaMapper.toDTO(marca);
    }

    public MarcaResponseDTO crear(MarcaRequestDTO request) {
        Marca marca = new Marca();
        marca.setNombreMarca(request.getNombre().trim().toUpperCase());
        
        if (marcaRepository.existsByNombreMarca(
            request.getNombre().trim().toUpperCase())) {

            throw new BadRequestException("Ya existe una marca con ese nombre");
        }

        Marca guardada = marcaRepository.save(marca);

        return MarcaMapper.toDTO(guardada);
    }

    public MarcaResponseDTO actualizar(Integer id, MarcaRequestDTO request) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con ID: " + id));

        marca.setNombreMarca(request.getNombre().trim().toUpperCase());

        Marca actualizada = marcaRepository.save(marca);

        return MarcaMapper.toDTO(actualizada);
    }

    public void eliminar(Integer id) {
        Marca marca = marcaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada con ID: " + id));

        marcaRepository.delete(marca);
    }
}
