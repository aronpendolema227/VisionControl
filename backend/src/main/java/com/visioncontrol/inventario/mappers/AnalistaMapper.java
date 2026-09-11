package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.AnalistaRequestDTO;
import com.visioncontrol.inventario.dto.response.AnalistaResponseDTO;
import com.visioncontrol.inventario.entities.Analista;

public class AnalistaMapper {

    public static AnalistaResponseDTO toResponseDTO(Analista analista) {
        AnalistaResponseDTO dto = new AnalistaResponseDTO();

        dto.setIdAnalista(analista.getIdAnalista());
        dto.setNombreAnalista(analista.getNombreAnalista());
        dto.setCargo(analista.getCargo());
        dto.setArea(analista.getArea());
        dto.setCorreo(analista.getCorreo());
        dto.setTelefono(analista.getTelefono());
        dto.setActivo(analista.getActivo());

        return dto;
    }

    public static Analista toEntity(AnalistaRequestDTO dto) {
        Analista analista = new Analista();

        analista.setNombreAnalista(dto.getNombreAnalista());
        analista.setCargo(dto.getCargo());
        analista.setArea(dto.getArea());
        analista.setCorreo(dto.getCorreo());
        analista.setTelefono(dto.getTelefono());
        analista.setActivo(dto.getActivo());

        return analista;
    }
}