package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HistorialNovedadResponseDTO {

    private Integer idNovedad;

    private LocalDate fechaRevision;
    private String estadoOperativo;
    private String ticketGlpi;
    private String observaciones;
    private String novedades;
    private String presentaDano;
    private String descripcionDano;
    private LocalDate fechaSeguimiento;
    private String seguimientoDetalle;
    private Boolean resueltoGlpi;
    private LocalDate fechaSolucion;

    private Integer idCamara;
    private Integer idPuntoOriginal;
    private String nombreCamara;

    private Integer idAnalista;
    private String nombreAnalista;
}
