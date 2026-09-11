package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.ProvinciaRequestDTO;
import com.visioncontrol.inventario.dto.response.ProvinciaResponseDTO;
import com.visioncontrol.inventario.entities.Provincia;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import com.visioncontrol.inventario.mappers.ProvinciaMapper;
import com.visioncontrol.inventario.repositories.ProvinciaRepository;
import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.BadRequestException;
import java.util.List;

@Service
public class ProvinciaService {

    private final ProvinciaRepository provinciaRepository;

    public ProvinciaService(ProvinciaRepository provinciaRepository) {
        this.provinciaRepository = provinciaRepository;
    }

    public List<ProvinciaResponseDTO> listarTodas() {
        return provinciaRepository.findAll()
                .stream()
                .map(ProvinciaMapper::toDTO)
                .toList();
    }

    public ProvinciaResponseDTO buscarPorId(Integer id) {
        Provincia provincia = provinciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provincia no encontrada con ID: " + id));

        return ProvinciaMapper.toDTO(provincia);
    }

    public ProvinciaResponseDTO crear(ProvinciaRequestDTO request) {
        Provincia provincia = new Provincia();
        provincia.setNombreProvincia(request.getNombre().trim().toUpperCase());
        
        if (provinciaRepository.existsByNombreProvincia(
            request.getNombre().trim().toUpperCase())) {

            throw new BadRequestException("Ya existe una provincia con ese nombre");
        }

        Provincia guardada = provinciaRepository.save(provincia);

        return ProvinciaMapper.toDTO(guardada);
    }

    public ProvinciaResponseDTO actualizar(Integer id, ProvinciaRequestDTO request) {
        Provincia provincia = provinciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provincia no encontrada con ID: " + id));

        provincia.setNombreProvincia(request.getNombre().trim().toUpperCase());

        Provincia actualizada = provinciaRepository.save(provincia);

        return ProvinciaMapper.toDTO(actualizada);
    }

    public void eliminar(Integer id) {
        Provincia provincia = provinciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Provincia no encontrada con ID: " + id));

        provinciaRepository.delete(provincia);
    }
}