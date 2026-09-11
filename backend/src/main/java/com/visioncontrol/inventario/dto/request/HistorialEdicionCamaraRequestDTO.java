package com.visioncontrol.inventario.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HistorialEdicionCamaraRequestDTO {

    @NotNull(message = "Debe seleccionar una cámara")
    private Integer idCamara;

    private Integer idAnalista;

    @NotBlank(message = "El campo modificado es obligatorio")
    private String campoModificado;

    private String valorAnterior;
    private String valorNuevo;

    private String detalle;
}