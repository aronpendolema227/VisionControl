package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.CentroOperativoRequestDTO;
import com.visioncontrol.inventario.dto.response.CentroOperativoResponseDTO;
import com.visioncontrol.inventario.entities.CentroOperativo;

public class CentroOperativoMapper {

    public static CentroOperativoResponseDTO toResponseDTO(CentroOperativo centro) {
        CentroOperativoResponseDTO dto = new CentroOperativoResponseDTO();

        dto.setIdCentro(centro.getIdCentro());
        dto.setNombreCentro(centro.getNombreCentro());
        dto.setPais(centro.getPais());
        dto.setCoLatitud(centro.getCoLatitud());
        dto.setCoLongitud(centro.getCoLongitud());
        dto.setUbicacionGeo(centro.getUbicacionGeo());

        return dto;
    }

    public static CentroOperativo toEntity(CentroOperativoRequestDTO dto) {
        CentroOperativo centro = new CentroOperativo();

        centro.setNombreCentro(dto.getNombreCentro());
        centro.setPais(dto.getPais());
        centro.setCoLatitud(dto.getCoLatitud());
        centro.setCoLongitud(dto.getCoLongitud());
        centro.setUbicacionGeo(dto.getUbicacionGeo());

        return centro;
    }
}
