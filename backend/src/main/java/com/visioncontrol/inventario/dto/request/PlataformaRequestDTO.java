package com.visioncontrol.inventario.dto.request;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
public class PlataformaRequestDTO {

    @NotBlank(message = "El nombre de la plataforma es obligatorio")
    private String nombrePlataforma;
}
