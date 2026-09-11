package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class HistorialEliminacionCamaraResponseDTO {

    private Integer idEliminacion;

    private Integer idCamara;
    private Integer idPuntoOriginal;
    private String nombreCamara;

    private Integer idAnalista;
    private String nombreAnalista;

    private String estadoAnterior;
    private String motivo;

    private String usuarioRegistro;
    private String rolRegistro;
    private LocalDateTime fechaEliminacion;
}