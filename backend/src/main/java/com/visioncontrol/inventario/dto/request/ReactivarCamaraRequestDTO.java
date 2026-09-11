package com.visioncontrol.inventario.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReactivarCamaraRequestDTO {

    @NotBlank(message = "Debe indicar el estado con el que se reactivará la cámara")
    private String estadoActual;

    private String motivo;
}