package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.response.DashboardResponseDTO;
import com.visioncontrol.inventario.services.DashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.visioncontrol.inventario.dto.response.DashboardTicketsDTO;

import com.visioncontrol.inventario.dto.response.DashboardCantonDTO;

import com.visioncontrol.inventario.dto.response.AuditoriaResponseDTO;
import com.visioncontrol.inventario.services.AuditoriaService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuditoriaService auditoriaService;

    public DashboardController(
        DashboardService dashboardService,
        AuditoriaService auditoriaService
    ) {
        this.dashboardService = dashboardService;
        this.auditoriaService = auditoriaService;
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @GetMapping("/resumen")
    public DashboardResponseDTO obtenerResumen() {
        return dashboardService.obtenerResumen();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @GetMapping("/tickets-ultimos-7-dias")
    public List<DashboardTicketsDTO> obtenerTicketsUltimos7Dias() {
        return dashboardService.obtenerTicketsUltimos7Dias();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @GetMapping("/rendimiento-cantones")
    public List<DashboardCantonDTO> obtenerRendimientoPorCanton() {
        return dashboardService.obtenerRendimientoPorCanton();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA', 'ANALISTA_TECNOLOGIA','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @GetMapping("/bitacora-reciente")
    public List<AuditoriaResponseDTO> obtenerBitacoraReciente() {
        return auditoriaService.obtenerBitacoraReciente();
    }
}
