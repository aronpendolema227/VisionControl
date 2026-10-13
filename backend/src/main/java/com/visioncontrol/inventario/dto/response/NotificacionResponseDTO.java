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
public class NotificacionResponseDTO {

    private Long idNotificacion;
    private String tipo;
    private String titulo;
    private String mensaje;
    private String detalle;

    private String accionTexto;
    private String prioridad;
    private String etiqueta;
    private String ruta;
    private String stateJson;

    private String lecturaId;
    private Integer conteoActual;

    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}