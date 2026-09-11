package com.visioncontrol.inventario.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class ModeloRequestDTO {

    @NotBlank(message = "El nombre del modelo es obligatorio")
    private String nombreModelo;

    @NotNull(message = "Debe seleccionar una marca")
    private Integer idMarca;
}
