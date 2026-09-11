package com.visioncontrol.inventario.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HistorialTecnicoCamaraRequestDTO {

    @NotNull(message = "Debe seleccionar una cámara")
    private Integer idCamara;

    @NotNull(message = "Debe seleccionar un analista")
    private Integer idAnalista;

    @NotNull(message = "La fecha de intervención es obligatoria")
    private LocalDate fechaIntervencion;

    @NotBlank(message = "El tipo de intervención es obligatorio")
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
}