package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.response.HistorialEliminacionCamaraResponseDTO;
import com.visioncontrol.inventario.services.HistorialEliminacionCamaraService;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/historial-eliminacion-camara")
@CrossOrigin(origins = "*")
public class HistorialEliminacionCamaraController {

    private final HistorialEliminacionCamaraService historialEliminacionCamaraService;

    public HistorialEliminacionCamaraController(
            HistorialEliminacionCamaraService historialEliminacionCamaraService
    ) {
        this.historialEliminacionCamaraService =
                historialEliminacionCamaraService;
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public List<HistorialEliminacionCamaraResponseDTO> listarHistorialEliminacion() {
        return historialEliminacionCamaraService.listarHistorialEliminacion();
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/{idEliminacion}")
    public HistorialEliminacionCamaraResponseDTO obtenerPorId(
            @PathVariable Integer idEliminacion
    ) {
        return historialEliminacionCamaraService.obtenerPorId(idEliminacion);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/camara/{idCamara}")
    public List<HistorialEliminacionCamaraResponseDTO> listarPorCamara(
            @PathVariable Integer idCamara
    ) {
        return historialEliminacionCamaraService.listarPorCamara(idCamara);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/paginado")
    public Page<HistorialEliminacionCamaraResponseDTO> listarHistorialEliminacionPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int pageSeguro = Math.max(page, 0);
        int sizeSeguro = size <= 0 ? 20 : Math.min(size, 100);

        Pageable pageable = PageRequest.of(pageSeguro, sizeSeguro);

        return historialEliminacionCamaraService.listarHistorialEliminacionPaginado(pageable);
    }

}