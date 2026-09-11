package com.visioncontrol.inventario.dto.request;

import lombok.Getter;
import lombok.Setter;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;



import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class HistorialCambioCamaraRequestDTO {

    @NotNull(message = "Debe seleccionar una cámara")
    private Integer idCamara;

    private Integer idAnalista;

    @NotNull(message = "La fecha de cambio es obligatoria")
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

    private String tipoDispositivoAnterior;
    private String tipoDispositivoNuevo;

    private Integer idPuntoNuevo;

    private String pilotoCntAnterior;
    private String pilotoCntNuevo;

    private String anchoBandaAnterior;
    private String anchoBandaNuevo;

    private Double latitudAnterior;
    private Double latitudNueva;

    private Double longitudAnterior;
    private Double longitudNueva;

    private String conversorAnterior;
    private String conversorNuevo;

    private String posteAnterior;
    private String posteNuevo;

    private String brazoAnterior;
    private String brazoNuevo;

    private String plataformaAnterior;
    private String plataformaNueva;

    @JsonProperty("aQuienPerteneceAnterior")
    private String aQuienPerteneceAnterior;

    @JsonProperty("aQuienPerteneceNuevo")
    private String aQuienPerteneceNuevo;
    

    private LocalDate fechaInstalacionAnterior;
    private LocalDate fechaInstalacionNueva;

    private String direccionAnterior;
    private String direccionNueva;

    private String observacionesAnteriores;
    private String observacionesNuevas;

    private Integer idConvenioAnterior;
    private Integer idConvenioNuevo;

    private String fechaConvenioOriginalAnterior;
    private String fechaConvenioOriginalNueva;

    private LocalDate fechaConvenioInicioAnterior;
    private LocalDate fechaConvenioInicioNueva;

    private LocalDate fechaConvenioFinAnterior;
    private LocalDate fechaConvenioFinNueva;

    private String estadoFechaConvenioAnterior;
    private String estadoFechaConvenioNuevo;

    private LocalDate fechaInicialPagoAnterior;
    private LocalDate fechaInicialPagoNueva;

    private String proveedorEnlaceAnterior;
    private String proveedorEnlaceNuevo;

    private String responsablePagoAnterior;
    private String responsablePagoNuevo;

    private String costoEnlaceAnterior;
    private String costoEnlaceNuevo;

    private Integer idModeloNuevo;
    private Integer idPlataformaNueva;

    
}