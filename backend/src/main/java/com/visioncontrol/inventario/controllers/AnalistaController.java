package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.AnalistaRequestDTO;
import com.visioncontrol.inventario.dto.response.AnalistaResponseDTO;
import com.visioncontrol.inventario.services.AnalistaService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;


import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/analistas")
@CrossOrigin(origins = "*")
@Tag(name = "Analistas", description = "Gestión de analistas del ECU911")
public class AnalistaController {

    private final AnalistaService analistaService;

    public AnalistaController(AnalistaService analistaService) {
        this.analistaService = analistaService;
    }

    @GetMapping
    public List<AnalistaResponseDTO> listarAnalistas() {
        return analistaService.listarAnalistas();
    }
    
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener Anaista por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Analista encontrado"),
            @ApiResponse(responseCode = "404", description = "Analista no encontrado")
    })
    @GetMapping("/{id}")
    public AnalistaResponseDTO obtenerAnalistaPorId(@PathVariable Integer id) {
        return analistaService.obtenerPorId(id);
    }

    @PreAuthorize("hasAuthority('SUPER_ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Crear Analista")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Analista creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    public AnalistaResponseDTO guardarAnalista(@Valid @RequestBody AnalistaRequestDTO dto) {
        return analistaService.guardarAnalista(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Actualizar Analista")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Analista actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Analista no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
        public AnalistaResponseDTO actualizarAnalista(
        @PathVariable Integer id,
        @Valid @RequestBody AnalistaRequestDTO dto) {
        return analistaService.actualizarAnalista(id, dto);
    }

    @PreAuthorize("hasAuthority('SUPER_ADMIN') or hasRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar Analista")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Analista eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Analista no encontrado")
    })
    @DeleteMapping("/{id}")
    public String eliminarAnalista(@PathVariable Integer id) {
        analistaService.eliminarAnalista(id);
        return "Analista eliminado correctamente";
    }
}
