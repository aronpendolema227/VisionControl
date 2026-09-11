package com.visioncontrol.inventario.dto.request;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class CantonRequestDTO {
    

    @NotBlank(message = "El nombre del cantón es obligatorio")
    private String nombreCanton;

    @NotNull(message = "Debe seleccionar una provincia")
    private Integer idProvincia;
}