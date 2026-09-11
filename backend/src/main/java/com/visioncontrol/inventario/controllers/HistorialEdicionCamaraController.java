package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.response.HistorialEdicionCamaraResponseDTO;
import com.visioncontrol.inventario.services.HistorialEdicionCamaraService;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


import java.util.List;

@RestController
@RequestMapping("/api/historial-edicion-camara")
@CrossOrigin(origins = "*")
public class HistorialEdicionCamaraController {

    private final HistorialEdicionCamaraService historialEdicionCamaraService;

    public HistorialEdicionCamaraController(
            HistorialEdicionCamaraService historialEdicionCamaraService
    ) {
        this.historialEdicionCamaraService = historialEdicionCamaraService;
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping
    public List<HistorialEdicionCamaraResponseDTO> listarHistorialEdicion() {
        return historialEdicionCamaraService.listarHistorialEdicion();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/{idEdicion}")
    public HistorialEdicionCamaraResponseDTO obtenerPorId(
            @PathVariable Integer idEdicion
    ) {
        return historialEdicionCamaraService.obtenerPorId(idEdicion);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/camara/{idCamara}")
    public List<HistorialEdicionCamaraResponseDTO> listarPorCamara(
            @PathVariable Integer idCamara
    ) {
        return historialEdicionCamaraService.listarPorCamara(idCamara);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/paginado")
    public Page<HistorialEdicionCamaraResponseDTO> listarHistorialEdicionPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int pageSeguro = Math.max(page, 0);
        int sizeSeguro = size <= 0 ? 20 : Math.min(size, 100);

        Pageable pageable = PageRequest.of(pageSeguro, sizeSeguro);

        return historialEdicionCamaraService.listarHistorialEdicionPaginado(pageable);
    }

}