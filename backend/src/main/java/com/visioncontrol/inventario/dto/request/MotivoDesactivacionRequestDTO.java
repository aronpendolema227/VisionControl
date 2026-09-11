package com.visioncontrol.inventario.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MotivoDesactivacionRequestDTO {

    @NotBlank(message = "Debe ingresar el motivo de eliminación o desactivación")
    private String motivo;
}