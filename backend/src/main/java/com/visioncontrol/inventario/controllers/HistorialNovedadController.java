package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.HistorialNovedadRequestDTO;
import com.visioncontrol.inventario.dto.response.HistorialNovedadResponseDTO;
import com.visioncontrol.inventario.services.HistorialNovedadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


@RestController
@RequestMapping("/api/historial-novedades")
@CrossOrigin(origins = "*")
@Tag(name = "Historial de Novedades", description = "Gestión de novedades y seguimiento")
public class HistorialNovedadController {

    private final HistorialNovedadService historialNovedadService;

    public HistorialNovedadController(
            HistorialNovedadService historialNovedadService
    ) {
        this.historialNovedadService = historialNovedadService;
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @GetMapping
    public List<HistorialNovedadResponseDTO> listarHistorial() {
        return historialNovedadService.listarHistorial();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @GetMapping("/paginado")
    public Page<HistorialNovedadResponseDTO> listarHistorialPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String busquedaGeneral
    ) {
        int pageSeguro = Math.max(page, 0);
        int sizeSeguro = size <= 0 ? 20 : Math.min(size, 100);

        Pageable pageable = PageRequest.of(pageSeguro, sizeSeguro);

        return historialNovedadService.listarHistorialPaginado(pageable, busquedaGeneral);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener Historial Novedad por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historial Novedad encontrado"),
            @ApiResponse(responseCode = "404", description = "Historial Novedad no encontrado")
    })
    @GetMapping("/{id}")
    public HistorialNovedadResponseDTO obtenerHistorialPorId(@PathVariable Integer id) {
        return historialNovedadService.obtenerPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear Historial Novedad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historial Novedad creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    public HistorialNovedadResponseDTO guardarHistorial(
            @Valid @RequestBody HistorialNovedadRequestDTO dto) {
        return historialNovedadService.guardarHistorial(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar Historial Novedad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historial Novedad actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Historial Novedad no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public HistorialNovedadResponseDTO actualizarHistorial(
            @PathVariable Integer id,
            @Valid @RequestBody HistorialNovedadRequestDTO dto
    ) {
        return historialNovedadService.actualizarHistorial(id, dto);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar Historial Novedad")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Historial Novedad eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Historial Novedad no encontrado")
    })
    @DeleteMapping("/{id}")
    public String eliminarHistorial(@PathVariable Integer id) {
        historialNovedadService.eliminarHistorial(id);
        return "Novedad eliminada correctamente";
    }
}