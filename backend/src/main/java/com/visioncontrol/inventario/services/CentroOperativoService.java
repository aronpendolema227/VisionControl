package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.CentroOperativoRequestDTO;
import com.visioncontrol.inventario.dto.response.CentroOperativoResponseDTO;
import com.visioncontrol.inventario.entities.CentroOperativo;
import com.visioncontrol.inventario.mappers.CentroOperativoMapper;
import com.visioncontrol.inventario.repositories.CentroOperativoRepository;

import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import java.util.List;

@Service
public class CentroOperativoService {

    private final CentroOperativoRepository centroOperativoRepository;

    public CentroOperativoService(
            CentroOperativoRepository centroOperativoRepository
    ) {
        this.centroOperativoRepository = centroOperativoRepository;
    }

    public List<CentroOperativoResponseDTO> listarCentros() {
        return centroOperativoRepository.findAll()
                .stream()
                .map(CentroOperativoMapper::toResponseDTO)
                .toList();
    }

    public CentroOperativoResponseDTO obtenerPorId(Integer id) {
        CentroOperativo centro = centroOperativoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                "Centro operativo no encontrado con ID: " + id));

        return CentroOperativoMapper.toResponseDTO(centro);
    }

    public CentroOperativoResponseDTO guardarCentro(CentroOperativoRequestDTO dto) {
        CentroOperativo centro = CentroOperativoMapper.toEntity(dto);
        CentroOperativo centroGuardado = centroOperativoRepository.save(centro);

        return CentroOperativoMapper.toResponseDTO(centroGuardado);
    }

    public CentroOperativoResponseDTO actualizarCentro(Integer id, CentroOperativoRequestDTO dto) {
        CentroOperativo centroExistente = centroOperativoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                "Centro operativo no encontrado con ID: " + id));

        centroExistente.setNombreCentro(dto.getNombreCentro());
        centroExistente.setPais(dto.getPais());
        centroExistente.setCoLatitud(dto.getCoLatitud());
        centroExistente.setCoLongitud(dto.getCoLongitud());
        centroExistente.setUbicacionGeo(dto.getUbicacionGeo());

        CentroOperativo centroActualizado = centroOperativoRepository.save(centroExistente);

        return CentroOperativoMapper.toResponseDTO(centroActualizado);
    }

    public void eliminarCentro(Integer id) {
        centroOperativoRepository.deleteById(id);
    }
}
