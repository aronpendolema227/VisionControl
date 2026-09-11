package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;

@Getter
@Setter
public class CamaraResponseDTO {

    private Integer idCamara;
    private Integer idPuntoOriginal;
    private String nombreCamara;
    private String direccion;
    private String usuarioAlfanumerico;
    private Double latitud;
    private Double longitud;
    private String direccionIp;
    private String tipoDispositivo;
    private LocalDate fechaInstalacion;
    private Integer anio;
    private String estadoActual;
    @JsonProperty("aQuienPertenece")
    private String aQuienPertenece;
    private String observaciones;

    private Integer idProvincia;
    private String nombreProvincia;

    private Integer idCanton;
    private String nombreCanton;

    private Integer idModelo;
    private String nombreModelo;

    private Integer idPlataforma;
    private String nombrePlataforma;

    private Integer idProveedor;
    private String nombreProveedor;

    private Integer idCentro;
    private String nombreCentro;
    private Integer idConvenio;
    private String nombreConvenio;

    private String fechaConvenioOriginal;
    private LocalDate fechaConvenioInicio;
    private LocalDate fechaConvenioFin;

    private LocalDate fechaInicialPago;
    private String proveedorEnlace;
    private String responsablePago;
    private String costoEnlace;


    private String estadoFechaConvenio;

    private String pilotoCnt;
    private String anchoBanda;
    private String nombreMarca;

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
    
    private Boolean activo;
    private String motivoDesactivacion;
    private LocalDateTime fechaDesactivacion;
    private String usuarioDesactivacion;
    private String rolDesactivacion;

    private String cambioDeCamara;

    private String estadoConvenio;
    private LocalDate fechaConvenioReferencia;
    private String fechaInicialPagoOriginal;

    private String ultimoReporteFechaRevision;
    private String ultimoReporteEstadoOperativo;
    private String ultimoReporteTicketGlpi;
    private String ultimoReporteObservaciones;
    private String ultimoReporteNovedades;
    private String ultimoReportePresentaDano;
    private String ultimoReporteDescripcionDano;
    private String ultimoReporteFechaSeguimiento;
    private String ultimoReporteSeguimientoDetalle;
    private String ultimoReporteResueltoGlpi;
    private String ultimoReporteFechaSolucion;
    private String ultimoReporteAnalista;

}