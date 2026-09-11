package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HistorialEdicionCamaraResponseDTO {

    private Integer idEdicion;

    private Integer idCamara;
    private Integer idPuntoOriginal;
    private String nombreCamara;

    private Integer idAnalista;
    private String nombreAnalista;

    private String campoModificado;
    private String valorAnterior;
    private String valorNuevo;

    private String detalle;

    private String usuarioRegistro;
    private String rolRegistro;
    private LocalDateTime fechaEdicion;
}