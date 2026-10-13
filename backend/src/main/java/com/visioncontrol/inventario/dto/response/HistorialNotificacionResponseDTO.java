package com.visioncontrol.inventario.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HistorialNotificacionResponseDTO {

    private Long idHistorialNotificacion;
    private Long idNotificacion;

    private String tipo;
    private String evento;

    private String titulo;
    private String mensaje;
    private String detalle;

    private Integer conteoAnterior;
    private Integer conteoNuevo;

    private Boolean activaAnterior;
    private Boolean activaNueva;

    private String observacion;

    private LocalDateTime fechaHora;
}