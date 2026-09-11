package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.ModeloRequestDTO;
import com.visioncontrol.inventario.dto.response.ModeloResponseDTO;
import com.visioncontrol.inventario.entities.Modelo;
import com.visioncontrol.inventario.mappers.ModeloMapper;
import com.visioncontrol.inventario.repositories.ModeloRepository;

import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import java.util.List;
import com.visioncontrol.inventario.exceptions.BadRequestException;
@Service
public class ModeloService {

    private final ModeloRepository modeloRepository;

    public ModeloService(ModeloRepository modeloRepository) {
        this.modeloRepository = modeloRepository;
    }

    public List<ModeloResponseDTO> listarModelos() {
        return modeloRepository.findAll()
                .stream()
                .map(ModeloMapper::toResponseDTO)
                .toList();
    }

    public List<ModeloResponseDTO> listarModelosPorMarca(Integer idMarca) {
        return modeloRepository.findByMarcaId(idMarca)
                .stream()
                .map(ModeloMapper::toResponseDTO)
                .toList();
    }

    public ModeloResponseDTO obtenerPorId(Integer id) {
        Modelo modelo = modeloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modelo no encontrado con ID: " + id));
        return ModeloMapper.toResponseDTO(modelo);
    }

    public ModeloResponseDTO guardarModelo(ModeloRequestDTO dto) {
        Modelo modelo = ModeloMapper.toEntity(dto);

        if (modeloRepository.existsByNombreModelo(
            dto.getNombreModelo().trim().toUpperCase())) {

            throw new BadRequestException("Ya existe un modelo con ese nombre");
        }

        Modelo modeloGuardado = modeloRepository.save(modelo);

        return ModeloMapper.toResponseDTO(modeloGuardado);
    }

    public ModeloResponseDTO actualizarModelo(Integer id, ModeloRequestDTO dto) {
        Modelo modeloExistente = modeloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modelo no encontrado con ID: " + id));

        modeloExistente.setNombreModelo(dto.getNombreModelo());

        if (dto.getIdMarca() != null) {
            modeloExistente.getMarca().setIdMarca(dto.getIdMarca());
        }

        Modelo modeloActualizado = modeloRepository.save(modeloExistente);

        return ModeloMapper.toResponseDTO(modeloActualizado);
    }

    public void eliminarModelo(Integer id) {
        Modelo modelo = modeloRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Modelo no encontrado con ID: " + id));

        modeloRepository.delete(modelo);
    }
}