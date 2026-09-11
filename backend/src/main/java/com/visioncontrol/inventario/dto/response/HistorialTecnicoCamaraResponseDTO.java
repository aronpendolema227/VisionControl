package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class HistorialTecnicoCamaraResponseDTO {

    private Integer idTecnico;

    private Integer idCamara;
    private Integer idPuntoOriginal;
    private String nombreCamara;

    private Integer idAnalista;
    private String nombreAnalista;

    private LocalDate fechaIntervencion;
    private String tipoIntervencion;

    private String estadoAnterior;
    private String estadoNuevo;

    private String ticketGlpi;

    private String descripcionTecnica;
    private String diagnostico;
    private String accionRealizada;
    private String resultado;

    private LocalDate fechaSeguimiento;
    private String observacionSeguimiento;
    private Boolean resueltoGlpi;

    private String usuarioRegistro;
    private String rolRegistro;
    private LocalDateTime fechaRegistro;
}