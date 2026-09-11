package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.response.HistorialEdicionCamaraResponseDTO;
import com.visioncontrol.inventario.entities.HistorialEdicionCamara;

public class HistorialEdicionCamaraMapper {

    public static HistorialEdicionCamaraResponseDTO toResponseDTO(
            HistorialEdicionCamara historial
    ) {
        HistorialEdicionCamaraResponseDTO dto =
                new HistorialEdicionCamaraResponseDTO();

        dto.setIdEdicion(historial.getIdEdicion());

        if (historial.getCamara() != null) {
            dto.setIdCamara(historial.getCamara().getIdCamara());
            dto.setIdPuntoOriginal(historial.getCamara().getIdPuntoOriginal());
            dto.setNombreCamara(historial.getCamara().getNombreCamara());
        }

        if (historial.getAnalista() != null) {
            dto.setIdAnalista(historial.getAnalista().getIdAnalista());
            dto.setNombreAnalista(historial.getAnalista().getNombreAnalista());
        }

        dto.setCampoModificado(historial.getCampoModificado());
        dto.setValorAnterior(historial.getValorAnterior());
        dto.setValorNuevo(historial.getValorNuevo());
        dto.setDetalle(historial.getDetalle());

        dto.setUsuarioRegistro(historial.getUsuarioRegistro());
        dto.setRolRegistro(historial.getRolRegistro());
        dto.setFechaEdicion(historial.getFechaEdicion());

        return dto;
    }
}