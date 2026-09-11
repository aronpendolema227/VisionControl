package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class HistorialCambioCamaraResponseDTO {

    private Integer idCambio;

    private Integer idCamara;
    private Integer idPuntoOriginal;
    private String nombreCamara;

    private Integer idAnalista;
    private String nombreAnalista;

    private LocalDate fechaCambio;
    private String tipoCambio;
    private String motivoCambio;
    private String observacionTecnica;

    private String nombreCamaraAnterior;
    private String nombreCamaraNueva;

    private String marcaAnterior;
    private String modeloAnterior;
    private String marcaNueva;
    private String modeloNuevo;

    private String ipAnterior;
    private String ipNueva;

    private String estadoAnterior;
    private String estadoNuevo;

    private String tipoDanoSinServicioAnterior;
    private String tipoDanoSinServicioNuevo;

    private String tipoFallaTecnicaAnterior;
    private String tipoFallaTecnicaNuevo;

    private String usuarioRegistro;
    private String rolRegistro;
    private LocalDateTime fechaRegistro;
}