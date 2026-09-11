package com.visioncontrol.inventario.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalistaRequestDTO {

    @NotBlank(message = "El nombre del analista es obligatorio")
    private String nombreAnalista;

    @NotBlank(message = "El cargo es obligatorio")
    private String cargo;

    @NotBlank(message = "El área es obligatoria")
    private String area;

    @Email(message = "Correo inválido")
    private String correo;

    private String telefono;

    @NotNull(message = "Debe indicar si el analista está activo")
    private Boolean activo;
}