package com.visioncontrol.inventario.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReporteCamaraDTO {

    private Integer idCamara;
    private Integer idPuntoOriginal;
    private String nombreCamara;

    private String provincia;
    private String canton;
    private String direccion;
    private String estadoActual;
    private LocalDate fechaInstalacion;

    private String marca;
    private String modelo;
    private String plataforma;

    private String cambioDeCamara;
    private String aQuienPertenece;

    private String nombreAnalista;
    private String grupoOperativo;

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
}