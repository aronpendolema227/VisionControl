package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.HistorialCambioCamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialCambioCamaraResponseDTO;
import com.visioncontrol.inventario.services.HistorialCambioCamaraService;

import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/historial-cambios-camara")
@CrossOrigin(origins = "*")
public class HistorialCambioCamaraController {

    private final HistorialCambioCamaraService historialCambioCamaraService;

    public HistorialCambioCamaraController(
            HistorialCambioCamaraService historialCambioCamaraService
    ) {
        this.historialCambioCamaraService = historialCambioCamaraService;
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping
    public List<HistorialCambioCamaraResponseDTO> listarCambios() {
        return historialCambioCamaraService.listarCambios();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/{idCambio}")
    public HistorialCambioCamaraResponseDTO obtenerPorId(
            @PathVariable Integer idCambio
    ) {
        return historialCambioCamaraService.obtenerPorId(idCambio);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/camara/{idCamara}")
    public List<HistorialCambioCamaraResponseDTO> listarPorCamara(
            @PathVariable Integer idCamara
    ) {
        return historialCambioCamaraService.listarPorCamara(idCamara);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @PostMapping
    public ResponseEntity<HistorialCambioCamaraResponseDTO> guardarCambio(
            @Valid @RequestBody HistorialCambioCamaraRequestDTO dto
    ) {
        HistorialCambioCamaraResponseDTO response =
                historialCambioCamaraService.guardarCambio(dto);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{idCambio}")
    public ResponseEntity<String> eliminarCambio(
            @PathVariable Integer idCambio
    ) {
        historialCambioCamaraService.eliminarCambio(idCambio);

        return ResponseEntity.ok("Cambio de cámara eliminado correctamente");
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/paginado")
    public Page<HistorialCambioCamaraResponseDTO> listarCambiosPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int pageSeguro = Math.max(page, 0);
        int sizeSeguro = size <= 0 ? 20 : Math.min(size, 100);

        Pageable pageable = PageRequest.of(pageSeguro, sizeSeguro);

        return historialCambioCamaraService.listarCambiosPaginado(pageable);
    }

}