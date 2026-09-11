package com.visioncontrol.inventario.dto.request;

import jakarta.validation.constraints.NotBlank;

public class MarcaRequestDTO {

    @NotBlank(message = "El nombre de la marca es obligatorio")
    private String nombre;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
