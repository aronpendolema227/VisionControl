package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.response.HistorialEdicionCamaraResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Camara;
import com.visioncontrol.inventario.entities.HistorialEdicionCamara;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import com.visioncontrol.inventario.mappers.HistorialEdicionCamaraMapper;
import com.visioncontrol.inventario.repositories.HistorialEdicionCamaraRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class HistorialEdicionCamaraService {

    private final HistorialEdicionCamaraRepository historialEdicionCamaraRepository;

    public HistorialEdicionCamaraService(
            HistorialEdicionCamaraRepository historialEdicionCamaraRepository
    ) {
        this.historialEdicionCamaraRepository = historialEdicionCamaraRepository;
    }

    public List<HistorialEdicionCamaraResponseDTO> listarHistorialEdicion() {
        return historialEdicionCamaraRepository.findAll()
                .stream()
                .map(HistorialEdicionCamaraMapper::toResponseDTO)
                .toList();
    }

    public HistorialEdicionCamaraResponseDTO obtenerPorId(Integer idEdicion) {
        HistorialEdicionCamara historial =
                historialEdicionCamaraRepository.findById(idEdicion)
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Historial de edición no encontrado con ID: " + idEdicion
                        ));

        return HistorialEdicionCamaraMapper.toResponseDTO(historial);
    }

    public List<HistorialEdicionCamaraResponseDTO> listarPorCamara(
            Integer idCamara
    ) {
        return historialEdicionCamaraRepository
                .findByCamaraIdCamaraOrderByFechaEdicionDesc(idCamara)
                .stream()
                .map(HistorialEdicionCamaraMapper::toResponseDTO)
                .toList();
    }

    public void registrarCambioCampo(
            Camara camara,
            Integer idAnalista,
            String campoModificado,
            Object valorAnterior,
            Object valorNuevo,
            String usuarioRegistro,
            String rolRegistro
    ) {
        String anterior = convertirValor(valorAnterior);
        String nuevo = convertirValor(valorNuevo);

        if (Objects.equals(anterior, nuevo)) {
            return;
        }

        HistorialEdicionCamara historial = new HistorialEdicionCamara();

        historial.setCamara(camara);

        if (idAnalista != null) {
            Analista analista = new Analista();
            analista.setIdAnalista(idAnalista);
            historial.setAnalista(analista);
        } else if (camara.getAnalista() != null) {
            historial.setAnalista(camara.getAnalista());
        }

        historial.setCampoModificado(campoModificado);
        historial.setValorAnterior(anterior);
        historial.setValorNuevo(nuevo);

        historial.setDetalle(
                "Se modificó el campo '" + campoModificado
                        + "' de la cámara "
                        + camara.getNombreCamara()
        );

        historial.setUsuarioRegistro(usuarioRegistro);
        historial.setRolRegistro(rolRegistro);

        historialEdicionCamaraRepository.save(historial);
    }

    private String convertirValor(Object valor) {
        if (valor == null) {
            return "";
        }

        return valor.toString().trim();
    }

    @Transactional(readOnly = true)
    public Page<HistorialEdicionCamaraResponseDTO> listarHistorialEdicionPaginado(Pageable pageable) {
        return historialEdicionCamaraRepository
                .findAllByOrderByFechaEdicionDescIdEdicionDesc(pageable)
                .map(HistorialEdicionCamaraMapper::toResponseDTO);
    }

}