package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.response.HistorialEliminacionCamaraResponseDTO;
import com.visioncontrol.inventario.entities.HistorialEliminacionCamara;

public class HistorialEliminacionCamaraMapper {

    public static HistorialEliminacionCamaraResponseDTO toResponseDTO(
            HistorialEliminacionCamara historial
    ) {
        HistorialEliminacionCamaraResponseDTO dto =
                new HistorialEliminacionCamaraResponseDTO();

        dto.setIdEliminacion(historial.getIdEliminacion());

        if (historial.getCamara() != null) {
            dto.setIdCamara(historial.getCamara().getIdCamara());
        }

        dto.setIdPuntoOriginal(historial.getIdPuntoOriginal());
        dto.setNombreCamara(historial.getNombreCamara());

        if (historial.getAnalista() != null) {
            dto.setIdAnalista(historial.getAnalista().getIdAnalista());
            dto.setNombreAnalista(historial.getAnalista().getNombreAnalista());
        }

        dto.setEstadoAnterior(historial.getEstadoAnterior());
        dto.setMotivo(historial.getMotivo());

        dto.setUsuarioRegistro(historial.getUsuarioRegistro());
        dto.setRolRegistro(historial.getRolRegistro());
        dto.setFechaEliminacion(historial.getFechaEliminacion());

        return dto;
    }
}