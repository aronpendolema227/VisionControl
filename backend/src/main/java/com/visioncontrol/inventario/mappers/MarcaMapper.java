package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.response.MarcaResponseDTO;
import com.visioncontrol.inventario.entities.Marca;

public class MarcaMapper {

    public static MarcaResponseDTO toDTO(Marca marca) {
        return new MarcaResponseDTO(
                marca.getIdMarca(),
                marca.getNombreMarca()
        );
    }
}