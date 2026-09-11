package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.HistorialTecnicoCamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialTecnicoCamaraResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Camara;
import com.visioncontrol.inventario.entities.HistorialTecnicoCamara;

public class HistorialTecnicoCamaraMapper {

    public static HistorialTecnicoCamaraResponseDTO toResponseDTO(
            HistorialTecnicoCamara historial
    ) {
        HistorialTecnicoCamaraResponseDTO dto =
                new HistorialTecnicoCamaraResponseDTO();

        dto.setIdTecnico(historial.getIdTecnico());

        if (historial.getCamara() != null) {
            dto.setIdCamara(historial.getCamara().getIdCamara());
            dto.setIdPuntoOriginal(historial.getCamara().getIdPuntoOriginal());
            dto.setNombreCamara(historial.getCamara().getNombreCamara());
        }

        if (historial.getAnalista() != null) {
            dto.setIdAnalista(historial.getAnalista().getIdAnalista());
            dto.setNombreAnalista(historial.getAnalista().getNombreAnalista());
        }

        dto.setFechaIntervencion(historial.getFechaIntervencion());
        dto.setTipoIntervencion(historial.getTipoIntervencion());

        dto.setEstadoAnterior(historial.getEstadoAnterior());
        dto.setEstadoNuevo(historial.getEstadoNuevo());

        dto.setTicketGlpi(historial.getTicketGlpi());

        dto.setDescripcionTecnica(historial.getDescripcionTecnica());
        dto.setDiagnostico(historial.getDiagnostico());
        dto.setAccionRealizada(historial.getAccionRealizada());
        dto.setResultado(historial.getResultado());

        dto.setFechaSeguimiento(historial.getFechaSeguimiento());
        dto.setObservacionSeguimiento(historial.getObservacionSeguimiento());
        dto.setResueltoGlpi(historial.getResueltoGlpi());

        dto.setUsuarioRegistro(historial.getUsuarioRegistro());
        dto.setRolRegistro(historial.getRolRegistro());
        dto.setFechaRegistro(historial.getFechaRegistro());

        return dto;
    }

    public static HistorialTecnicoCamara toEntity(
            HistorialTecnicoCamaraRequestDTO dto
    ) {
        HistorialTecnicoCamara historial = new HistorialTecnicoCamara();

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

        historial.setFechaIntervencion(dto.getFechaIntervencion());
        historial.setTipoIntervencion(dto.getTipoIntervencion());

        historial.setEstadoAnterior(dto.getEstadoAnterior());
        historial.setEstadoNuevo(dto.getEstadoNuevo());

        historial.setTicketGlpi(dto.getTicketGlpi());

        historial.setDescripcionTecnica(dto.getDescripcionTecnica());
        historial.setDiagnostico(dto.getDiagnostico());
        historial.setAccionRealizada(dto.getAccionRealizada());
        historial.setResultado(dto.getResultado());

        historial.setFechaSeguimiento(dto.getFechaSeguimiento());
        historial.setObservacionSeguimiento(dto.getObservacionSeguimiento());
        historial.setResueltoGlpi(dto.getResueltoGlpi());

        return historial;
    }
}
