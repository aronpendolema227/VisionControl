package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.CantonRequestDTO;
import com.visioncontrol.inventario.dto.response.CantonResponseDTO;
import com.visioncontrol.inventario.entities.Canton;
import com.visioncontrol.inventario.entities.Provincia;

public class CantonMapper {

    public static CantonResponseDTO toResponseDTO(Canton canton) {
        CantonResponseDTO dto = new CantonResponseDTO();

        dto.setIdCanton(canton.getIdCanton());
        dto.setNombreCanton(canton.getNombreCanton());

        if (canton.getProvincia() != null) {
            dto.setIdProvincia(canton.getProvincia().getIdProvincia());
            dto.setNombreProvincia(canton.getProvincia().getNombreProvincia());
        }

        return dto;
    }

    public static Canton toEntity(CantonRequestDTO dto) {
        Canton canton = new Canton();
        canton.setNombreCanton(dto.getNombreCanton());

        Provincia provincia = new Provincia();
        provincia.setIdProvincia(dto.getIdProvincia());

        canton.setProvincia(provincia);

        return canton;
    }
}