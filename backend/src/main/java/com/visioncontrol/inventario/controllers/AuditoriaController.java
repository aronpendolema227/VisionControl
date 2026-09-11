package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.response.AuditoriaResponseDTO;
import com.visioncontrol.inventario.services.AuditoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/auditorias")
@CrossOrigin(origins = "*")
@Tag(name = "Auditorías", description = "Consulta de acciones realizadas en el sistema")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    public AuditoriaController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @Operation(summary = "Listar auditorías")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public List<AuditoriaResponseDTO> listarAuditorias() {
        return auditoriaService.listarAuditorias();
    }


    @Operation(summary = "Listar auditorías con paginación")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/paginado")
    public Page<AuditoriaResponseDTO> listarAuditoriasPaginadas(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String busquedaGeneral
    ) {
        int pageSeguro = Math.max(page, 0);
        int sizeSeguro = size <= 0 ? 20 : Math.min(size, 50);

        Pageable pageable = PageRequest.of(pageSeguro, sizeSeguro);

        return auditoriaService.listarAuditoriasPaginadas(pageable, busquedaGeneral);
    }

}