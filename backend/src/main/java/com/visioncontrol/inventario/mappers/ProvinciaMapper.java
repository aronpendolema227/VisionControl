package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.response.ProvinciaResponseDTO;
import com.visioncontrol.inventario.entities.Provincia;

public class ProvinciaMapper {

    public static ProvinciaResponseDTO toDTO(Provincia provincia) {

        return new ProvinciaResponseDTO(
                provincia.getIdProvincia(),
                provincia.getNombreProvincia()
        );
    }
}
