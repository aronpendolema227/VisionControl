package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.HistorialTecnicoCamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialTecnicoCamaraResponseDTO;
import com.visioncontrol.inventario.services.HistorialTecnicoCamaraService;

import jakarta.validation.Valid;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/historial-tecnico-camara")
@CrossOrigin(origins = "*")
public class HistorialTecnicoCamaraController {

    private final HistorialTecnicoCamaraService historialTecnicoCamaraService;

    public HistorialTecnicoCamaraController(
            HistorialTecnicoCamaraService historialTecnicoCamaraService
    ) {
        this.historialTecnicoCamaraService = historialTecnicoCamaraService;
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping
    public List<HistorialTecnicoCamaraResponseDTO> listarHistorialTecnico() {
        return historialTecnicoCamaraService.listarHistorialTecnico();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/{idTecnico}")
    public HistorialTecnicoCamaraResponseDTO obtenerPorId(
            @PathVariable Integer idTecnico
    ) {
        return historialTecnicoCamaraService.obtenerPorId(idTecnico);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/camara/{idCamara}")
    public List<HistorialTecnicoCamaraResponseDTO> listarPorCamara(
            @PathVariable Integer idCamara
    ) {
        return historialTecnicoCamaraService.listarPorCamara(idCamara);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @PostMapping
    public ResponseEntity<HistorialTecnicoCamaraResponseDTO> guardarHistorialTecnico(
            @Valid @RequestBody HistorialTecnicoCamaraRequestDTO dto
    ) {
        HistorialTecnicoCamaraResponseDTO response =
                historialTecnicoCamaraService.guardarHistorialTecnico(dto);

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @PutMapping("/{idTecnico}")
    public ResponseEntity<HistorialTecnicoCamaraResponseDTO> actualizarHistorialTecnico(
            @PathVariable Integer idTecnico,
            @Valid @RequestBody HistorialTecnicoCamaraRequestDTO dto
    ) {
        HistorialTecnicoCamaraResponseDTO response =
                historialTecnicoCamaraService.actualizarHistorialTecnico(
                        idTecnico,
                        dto
                );

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @DeleteMapping("/{idTecnico}")
    public ResponseEntity<String> eliminarHistorialTecnico(
            @PathVariable Integer idTecnico
    ) {
        historialTecnicoCamaraService.eliminarHistorialTecnico(idTecnico);

        return ResponseEntity.ok("Historial técnico eliminado correctamente");
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/paginado")
    public Page<HistorialTecnicoCamaraResponseDTO> listarHistorialTecnicoPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        int pageSeguro = Math.max(page, 0);
        int sizeSeguro = size <= 0 ? 20 : Math.min(size, 100);

        Pageable pageable = PageRequest.of(pageSeguro, sizeSeguro);

        return historialTecnicoCamaraService.listarHistorialTecnicoPaginado(pageable);
    }

} 