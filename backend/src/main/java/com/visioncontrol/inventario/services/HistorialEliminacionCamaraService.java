package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.response.HistorialEliminacionCamaraResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Camara;
import com.visioncontrol.inventario.entities.HistorialEliminacionCamara;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import com.visioncontrol.inventario.mappers.HistorialEliminacionCamaraMapper;
import com.visioncontrol.inventario.repositories.HistorialEliminacionCamaraRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistorialEliminacionCamaraService {

    private final HistorialEliminacionCamaraRepository historialEliminacionCamaraRepository;

    public HistorialEliminacionCamaraService(
            HistorialEliminacionCamaraRepository historialEliminacionCamaraRepository
    ) {
        this.historialEliminacionCamaraRepository =
                historialEliminacionCamaraRepository;
    }

    public List<HistorialEliminacionCamaraResponseDTO> listarHistorialEliminacion() {
        return historialEliminacionCamaraRepository.findAll()
                .stream()
                .map(HistorialEliminacionCamaraMapper::toResponseDTO)
                .toList();
    }

    public HistorialEliminacionCamaraResponseDTO obtenerPorId(
            Integer idEliminacion
    ) {
        HistorialEliminacionCamara historial =
                historialEliminacionCamaraRepository.findById(idEliminacion)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Historial de eliminación no encontrado con ID: "
                                        + idEliminacion
                        ));

        return HistorialEliminacionCamaraMapper.toResponseDTO(historial);
    }

    public List<HistorialEliminacionCamaraResponseDTO> listarPorCamara(
            Integer idCamara
    ) {
        return historialEliminacionCamaraRepository
                .findByCamaraIdCamaraOrderByFechaEliminacionDesc(idCamara)
                .stream()
                .map(HistorialEliminacionCamaraMapper::toResponseDTO)
                .toList();
    }

    public void registrarEliminacion(
            Camara camara,
            String motivo,
            String usuarioRegistro,
            String rolRegistro,
            String estadoAnterior
    ) {
        HistorialEliminacionCamara historial =
                new HistorialEliminacionCamara();

        historial.setCamara(camara);

        if (camara.getAnalista() != null) {
            Analista analista = new Analista();
            analista.setIdAnalista(camara.getAnalista().getIdAnalista());
            historial.setAnalista(analista);
        }

        historial.setIdPuntoOriginal(camara.getIdPuntoOriginal());
        historial.setNombreCamara(camara.getNombreCamara());
        historial.setEstadoAnterior(estadoAnterior);
        historial.setMotivo(motivo);

        historial.setUsuarioRegistro(usuarioRegistro);
        historial.setRolRegistro(rolRegistro);

        historialEliminacionCamaraRepository.save(historial);
    }

    @Transactional(readOnly = true)
    public Page<HistorialEliminacionCamaraResponseDTO> listarHistorialEliminacionPaginado(Pageable pageable) {
        return historialEliminacionCamaraRepository
                .findAllByOrderByFechaEliminacionDescIdEliminacionDesc(pageable)
                .map(HistorialEliminacionCamaraMapper::toResponseDTO);
    }

} 