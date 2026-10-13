package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.response.ReporteCamaraDTO;
import com.visioncontrol.inventario.services.ReporteService;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteService reporteService;

    public ReporteController(ReporteService reporteService) {
        this.reporteService = reporteService;
    }

    @GetMapping("/camaras")
    public ResponseEntity<Page<ReporteCamaraDTO>> listarCamarasReporte(
            @RequestParam(required = false) Integer idProvincia,
            @RequestParam(required = false) Integer idCanton,
            @RequestParam(required = false) String estadoActual,
            @RequestParam(required = false) Integer idMarca,

            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fechaInstalacion,

            @RequestParam(required = false) String busquedaGeneral,
            @RequestParam(required = false) String ticketGlpi,
            @RequestParam(required = false, defaultValue = "false") Boolean soloGlpiActivos,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String textoBusqueda = busquedaGeneral != null && !busquedaGeneral.trim().isEmpty()
            ? busquedaGeneral
            : ticketGlpi;
        Page<ReporteCamaraDTO> reporte = reporteService.listarCamarasReporte(
                idProvincia,
                idCanton,
                estadoActual,
                idMarca,
                fechaInstalacion,
                textoBusqueda,
                soloGlpiActivos,
                page,
                size
        );

        return ResponseEntity.ok(reporte);
    }
}