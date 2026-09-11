package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.HistorialCambioCamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialCambioCamaraResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Camara;
import com.visioncontrol.inventario.entities.HistorialCambioCamara;

public class HistorialCambioCamaraMapper {

    private HistorialCambioCamaraMapper() {
    }

    public static HistorialCambioCamara toEntity(HistorialCambioCamaraRequestDTO dto) {
        HistorialCambioCamara historial = new HistorialCambioCamara();

        Camara camara = new Camara();
        camara.setIdCamara(dto.getIdCamara());
        historial.setCamara(camara);

        if (dto.getIdAnalista() != null) {
            Analista analista = new Analista();
            analista.setIdAnalista(dto.getIdAnalista());
            historial.setAnalista(analista);
        }

        historial.setFechaCambio(dto.getFechaCambio());
        historial.setTipoCambio(dto.getTipoCambio());
        historial.setMotivoCambio(dto.getMotivoCambio());
        historial.setObservacionTecnica(dto.getObservacionTecnica());

        historial.setNombreCamaraAnterior(dto.getNombreCamaraAnterior());
        historial.setNombreCamaraNueva(dto.getNombreCamaraNueva());

        historial.setMarcaAnterior(dto.getMarcaAnterior());
        historial.setModeloAnterior(dto.getModeloAnterior());
        historial.setMarcaNueva(dto.getMarcaNueva());
        historial.setModeloNuevo(dto.getModeloNuevo());

        historial.setIpAnterior(dto.getIpAnterior());
        historial.setIpNueva(dto.getIpNueva());

        historial.setEstadoAnterior(dto.getEstadoAnterior());
        historial.setEstadoNuevo(dto.getEstadoNuevo());

        historial.setTipoDanoSinServicioAnterior(dto.getTipoDanoSinServicioAnterior());
        historial.setTipoDanoSinServicioNuevo(dto.getTipoDanoSinServicioNuevo());

        historial.setTipoFallaTecnicaAnterior(dto.getTipoFallaTecnicaAnterior());
        historial.setTipoFallaTecnicaNuevo(dto.getTipoFallaTecnicaNuevo());


        return historial;
    }

    public static HistorialCambioCamaraResponseDTO toResponseDTO(HistorialCambioCamara historial) {
        HistorialCambioCamaraResponseDTO dto = new HistorialCambioCamaraResponseDTO();

        dto.setIdCambio(historial.getIdCambio());

        if (historial.getCamara() != null) {
            dto.setIdCamara(historial.getCamara().getIdCamara());
            dto.setIdPuntoOriginal(historial.getCamara().getIdPuntoOriginal());
            dto.setNombreCamara(historial.getCamara().getNombreCamara());
        }

        if (historial.getAnalista() != null) {
            dto.setIdAnalista(historial.getAnalista().getIdAnalista());
            dto.setNombreAnalista(historial.getAnalista().getNombreAnalista());
        }

        dto.setFechaCambio(historial.getFechaCambio());
        dto.setTipoCambio(historial.getTipoCambio());
        dto.setMotivoCambio(historial.getMotivoCambio());
        dto.setObservacionTecnica(historial.getObservacionTecnica());

        dto.setNombreCamaraAnterior(historial.getNombreCamaraAnterior());
        dto.setNombreCamaraNueva(historial.getNombreCamaraNueva());

        dto.setMarcaAnterior(historial.getMarcaAnterior());
        dto.setModeloAnterior(historial.getModeloAnterior());
        dto.setMarcaNueva(historial.getMarcaNueva());
        dto.setModeloNuevo(historial.getModeloNuevo());

        dto.setIpAnterior(historial.getIpAnterior());
        dto.setIpNueva(historial.getIpNueva());

        dto.setEstadoAnterior(historial.getEstadoAnterior());
        dto.setEstadoNuevo(historial.getEstadoNuevo());

        dto.setTipoDanoSinServicioAnterior(
            historial.getTipoDanoSinServicioAnterior()
        );
        dto.setTipoDanoSinServicioNuevo(
            historial.getTipoDanoSinServicioNuevo()
        );

        dto.setTipoFallaTecnicaAnterior(
            historial.getTipoFallaTecnicaAnterior()
        );
        dto.setTipoFallaTecnicaNuevo(
            historial.getTipoFallaTecnicaNuevo()
        );

        dto.setUsuarioRegistro(historial.getUsuarioRegistro());
        dto.setRolRegistro(historial.getRolRegistro());
        dto.setFechaRegistro(historial.getFechaRegistro());

        return dto;
    }
}