package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.ConvenioRequestDTO;
import com.visioncontrol.inventario.dto.response.ConvenioResponseDTO;
import com.visioncontrol.inventario.entities.Convenio;

public class ConvenioMapper {

    public static ConvenioResponseDTO toResponseDTO(Convenio convenio) {
        ConvenioResponseDTO dto = new ConvenioResponseDTO();

        dto.setIdConvenio(convenio.getIdConvenio());
        dto.setNombreConvenio(convenio.getNombreConvenio());
        dto.setFechaConvenioOriginal(convenio.getFechaConvenioOriginal());
        dto.setFechaConvenioInicio(convenio.getFechaConvenioInicio());
        dto.setFechaConvenioFin(convenio.getFechaConvenioFin());
        dto.setEstadoFechaConvenio(convenio.getEstadoFechaConvenio());
        dto.setResponsablePago(convenio.getResponsablePago());

        return dto;
    }

    public static Convenio toEntity(ConvenioRequestDTO dto) {
        Convenio convenio = new Convenio();

        convenio.setNombreConvenio(dto.getNombreConvenio());
        convenio.setFechaConvenioOriginal(dto.getFechaConvenioOriginal());
        convenio.setFechaConvenioInicio(dto.getFechaConvenioInicio());
        convenio.setFechaConvenioFin(dto.getFechaConvenioFin());
        convenio.setEstadoFechaConvenio(dto.getEstadoFechaConvenio());
        convenio.setResponsablePago(dto.getResponsablePago());

        return convenio;
    }
}