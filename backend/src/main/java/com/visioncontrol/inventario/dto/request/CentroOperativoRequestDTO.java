package com.visioncontrol.inventario.dto.request;

import lombok.Getter;
import lombok.Setter;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class CentroOperativoRequestDTO {

    @NotBlank(message = "El nombre del centro operativo es obligatorio")
    private String nombreCentro;

    @NotBlank(message = "El país es obligatorio")
    private String pais;

    @NotNull(message = "La latitud es obligatoria")
    private Double coLatitud;

    @NotNull(message = "La longitud es obligatoria")
    private Double coLongitud;

    private String ubicacionGeo;
}