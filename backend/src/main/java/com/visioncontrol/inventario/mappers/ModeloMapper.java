package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.ModeloRequestDTO;
import com.visioncontrol.inventario.dto.response.ModeloResponseDTO;
import com.visioncontrol.inventario.entities.Marca;
import com.visioncontrol.inventario.entities.Modelo;

public class ModeloMapper {

    public static ModeloResponseDTO toResponseDTO(Modelo modelo) {
        ModeloResponseDTO dto = new ModeloResponseDTO();

        dto.setIdModelo(modelo.getIdModelo());
        dto.setNombreModelo(modelo.getNombreModelo());

        if (modelo.getMarca() != null) {
            dto.setIdMarca(modelo.getMarca().getIdMarca());
            dto.setNombreMarca(modelo.getMarca().getNombreMarca());
        }

        return dto;
    }

    public static Modelo toEntity(ModeloRequestDTO dto) {
        Modelo modelo = new Modelo();

        modelo.setNombreModelo(dto.getNombreModelo());

        Marca marca = new Marca();
        marca.setIdMarca(dto.getIdMarca());

        modelo.setMarca(marca);

        return modelo;
    }
}