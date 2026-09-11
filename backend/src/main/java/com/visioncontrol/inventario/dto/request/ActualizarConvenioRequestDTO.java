package com.visioncontrol.inventario.dto.request;

import java.time.LocalDate;

public class ActualizarConvenioRequestDTO {

    private Integer idConvenio;

    private String costoEnlace;
    private String fechaConvenioOriginal;
    private LocalDate fechaConvenioInicio;
    private LocalDate fechaConvenioFin;
    private String estadoFechaConvenio;
    private LocalDate fechaInicialPago;
    private String proveedorEnlace;
    private String responsablePago;
    private String direccionIp;
    private String direccion;

    public Integer getIdConvenio() {
        return idConvenio;
    }

    public void setIdConvenio(Integer idConvenio) {
        this.idConvenio = idConvenio;
    }

    public String getCostoEnlace() {
        return costoEnlace;
    }

    public void setCostoEnlace(String costoEnlace) {
        this.costoEnlace = costoEnlace;
    }

    public String getFechaConvenioOriginal() {
        return fechaConvenioOriginal;
    }

    public void setFechaConvenioOriginal(String fechaConvenioOriginal) {
        this.fechaConvenioOriginal = fechaConvenioOriginal;
    }

    public LocalDate getFechaConvenioInicio() {
        return fechaConvenioInicio;
    }

    public void setFechaConvenioInicio(LocalDate fechaConvenioInicio) {
        this.fechaConvenioInicio = fechaConvenioInicio;
    }

    public LocalDate getFechaConvenioFin() {
        return fechaConvenioFin;
    }

    public void setFechaConvenioFin(LocalDate fechaConvenioFin) {
        this.fechaConvenioFin = fechaConvenioFin;
    }

    public String getEstadoFechaConvenio() {
        return estadoFechaConvenio;
    }

    public void setEstadoFechaConvenio(String estadoFechaConvenio) {
        this.estadoFechaConvenio = estadoFechaConvenio;
    }

    public LocalDate getFechaInicialPago() {
        return fechaInicialPago;
    }

    public void setFechaInicialPago(LocalDate fechaInicialPago) {
        this.fechaInicialPago = fechaInicialPago;
    }

    public String getProveedorEnlace() {
        return proveedorEnlace;
    }

    public void setProveedorEnlace(String proveedorEnlace) {
        this.proveedorEnlace = proveedorEnlace;
    }

    public String getResponsablePago() {
        return responsablePago;
    }

    public void setResponsablePago(String responsablePago) {
        this.responsablePago = responsablePago;
    }

    public String getDireccionIp() {
        return direccionIp;
    }

    public void setDireccionIp(String direccionIp) {
        this.direccionIp = direccionIp;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    
}