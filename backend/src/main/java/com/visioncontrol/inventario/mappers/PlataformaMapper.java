package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.PlataformaRequestDTO;
import com.visioncontrol.inventario.dto.response.PlataformaResponseDTO;
import com.visioncontrol.inventario.entities.Plataforma;

public class PlataformaMapper {

    public static PlataformaResponseDTO toResponseDTO(Plataforma plataforma) {
        PlataformaResponseDTO dto = new PlataformaResponseDTO();

        dto.setIdPlataforma(plataforma.getIdPlataforma());
        dto.setNombrePlataforma(plataforma.getNombrePlataforma());

        return dto;
    }

    public static Plataforma toEntity(PlataformaRequestDTO dto) {
        Plataforma plataforma = new Plataforma();

        plataforma.setNombrePlataforma(dto.getNombrePlataforma());

        return plataforma;
    }
}
