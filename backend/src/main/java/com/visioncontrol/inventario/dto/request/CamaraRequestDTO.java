package com.visioncontrol.inventario.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class CamaraRequestDTO {

    @NotNull(message = "El punto original es obligatorio")
    private Integer idPuntoOriginal;

    @NotBlank(message = "El nombre de la cámara es obligatorio")
    private String nombreCamara;

    private String direccion;
    private String usuarioAlfanumerico;
    private Double latitud;
    private Double longitud;
    private String direccionIp;
    private String tipoDispositivo;
    private LocalDate fechaInstalacion;
    private Integer anio;

    @NotBlank(message = "El estado actual es obligatorio")
    private String estadoActual;

    @JsonProperty("aQuienPertenece")
    private String aQuienPertenece;
    private String observaciones;

    private String pilotoCnt;
    private String anchoBanda;

    private String conversor;
    private String poste;
    private String brazo;
    private String descripcionDano;
    private String tipoDanoSinServicio;
    private String tipoFallaTecnica;
    private String serieCamara;
    private String marcaUps;
    private String serieUps;
    private String estadoUps;
    private String abejas;
    private Integer idAnalista;


    private String fechaConvenioOriginal;
    private LocalDate fechaConvenioInicio;
    private LocalDate fechaConvenioFin;
    private String estadoFechaConvenio;
    private LocalDate fechaInicialPago;
    private String proveedorEnlace;
    private String responsablePago;
    private String costoEnlace;

    @NotNull(message = "Debe seleccionar un cantón")
    private Integer idCanton;

    @NotNull(message = "Debe seleccionar un modelo")
    private Integer idModelo;

    private Integer idPlataforma;
    private Integer idProveedor;
    private Integer idCentro;
    private Integer idConvenio;
}