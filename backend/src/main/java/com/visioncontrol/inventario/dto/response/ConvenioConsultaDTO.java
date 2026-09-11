package com.visioncontrol.inventario.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ConvenioConsultaDTO {

    private Integer idConvenio;
    private String nombreConvenio;

    private Integer totalCamaras;
    private Integer totalProvincias;
    private Integer totalCantones;

    private String fechaConvenioOriginal;
    private String fechaConvenioInicio;
    private String fechaConvenioFin;
    private String estadoFechaConvenio;
    private String fechaInicialPago;

    private String proveedorEnlace;
    private String responsablePago;
    private String costoEnlace;
}