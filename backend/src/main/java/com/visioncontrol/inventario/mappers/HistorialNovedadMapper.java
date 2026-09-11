package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.HistorialNovedadRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialNovedadResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Camara;
import com.visioncontrol.inventario.entities.HistorialNovedad;

public class HistorialNovedadMapper {

    public static HistorialNovedadResponseDTO toResponseDTO(HistorialNovedad historial) {
        HistorialNovedadResponseDTO dto = new HistorialNovedadResponseDTO();

        dto.setIdNovedad(historial.getIdNovedad());
        dto.setFechaRevision(historial.getFechaRevision());
        dto.setEstadoOperativo(historial.getEstadoOperativo());
        dto.setTicketGlpi(historial.getTicketGlpi());
        dto.setObservaciones(historial.getObservaciones());
        dto.setNovedades(historial.getNovedades());
        dto.setPresentaDano(historial.getPresentaDano());
        dto.setDescripcionDano(historial.getDescripcionDano());
        dto.setFechaSeguimiento(historial.getFechaSeguimiento());
        dto.setSeguimientoDetalle(historial.getSeguimientoDetalle());
        dto.setResueltoGlpi(historial.getResueltoGlpi());
        dto.setFechaSolucion(historial.getFechaSolucion());

        if (historial.getCamara() != null) {
            dto.setIdCamara(historial.getCamara().getIdCamara());
            dto.setIdPuntoOriginal(historial.getCamara().getIdPuntoOriginal());
            dto.setNombreCamara(historial.getCamara().getNombreCamara());
        }

        if (historial.getAnalista() != null) {
            dto.setIdAnalista(historial.getAnalista().getIdAnalista());
            dto.setNombreAnalista(historial.getAnalista().getNombreAnalista());
        }

        return dto;
    }

    public static HistorialNovedad toEntity(HistorialNovedadRequestDTO dto) {
        HistorialNovedad historial = new HistorialNovedad();

        historial.setFechaRevision(dto.getFechaRevision());
        historial.setEstadoOperativo(dto.getEstadoOperativo());
        historial.setTicketGlpi(dto.getTicketGlpi());
        historial.setObservaciones(dto.getObservaciones());
        historial.setNovedades(dto.getNovedades());
        historial.setPresentaDano(dto.getPresentaDano());
        historial.setDescripcionDano(dto.getDescripcionDano());
        historial.setFechaSeguimiento(dto.getFechaSeguimiento());
        historial.setSeguimientoDetalle(dto.getSeguimientoDetalle());
        historial.setResueltoGlpi(dto.getResueltoGlpi());
        historial.setFechaSolucion(dto.getFechaSolucion());

        if (dto.getIdCamara() != null) {
            Camara camara = new Camara();
            camara.setIdCamara(dto.getIdCamara());
            historial.setCamara(camara);
        }

        if (dto.getIdAnalista() != null) {
            Analista analista = new Analista();
            analista.setIdAnalista(dto.getIdAnalista());
            historial.setAnalista(analista);
        }

        return historial;
    }
}