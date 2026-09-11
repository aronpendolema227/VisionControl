package com.visioncontrol.inventario.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class HistorialNovedadRequestDTO {

    @NotNull(message = "La fecha de revisión es obligatoria")
    private LocalDate fechaRevision;

    @NotBlank(message = "El estado operativo es obligatorio")
    private String estadoOperativo;

    private String ticketGlpi;
    private String observaciones;
    private String novedades;

    @NotBlank(message = "Debe indicar si presenta daño")
    private String presentaDano;

    private String descripcionDano;
    private LocalDate fechaSeguimiento;
    private String seguimientoDetalle;

    @NotNull(message = "Debe indicar si está resuelto en GLPI")
    private Boolean resueltoGlpi;

    private LocalDate fechaSolucion;

    @NotNull(message = "Debe seleccionar una cámara")
    private Integer idCamara;

    @NotNull(message = "Debe seleccionar un analista")
    private Integer idAnalista;
}