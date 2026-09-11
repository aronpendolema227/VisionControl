package com.visioncontrol.inventario.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambiarPasswordRequestDTO {

    @NotBlank(message = "La nueva contraseña es obligatoria")
    private String nuevaPassword;
}
