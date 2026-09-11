package com.visioncontrol.inventario.dto.request;

import jakarta.validation.constraints.NotBlank;

public class ProvinciaRequestDTO {

    @NotBlank(message = "El nombre de la provincia es obligatorio")
    private String nombre;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
