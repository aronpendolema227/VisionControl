package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.ProvinciaRequestDTO;
import com.visioncontrol.inventario.dto.response.ProvinciaResponseDTO;
import com.visioncontrol.inventario.services.ProvinciaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/provincias")
@Tag(name = "Provincias", description = "Operaciones CRUD para provincias")
public class ProvinciaController {

    private final ProvinciaService provinciaService;

    public ProvinciaController(ProvinciaService provinciaService) {
        this.provinciaService = provinciaService;
    }

    @Operation(summary = "Listar todas las provincias")
    @GetMapping
    public List<ProvinciaResponseDTO> listarProvincias() {
        return provinciaService.listarTodas();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener provincia por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Provincia encontrada"),
            @ApiResponse(responseCode = "404", description = "Provincia no encontrada")
    })
    @GetMapping("/{id}")
    public ProvinciaResponseDTO buscarPorId(@PathVariable Integer id) {
        return provinciaService.buscarPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear una nueva provincia")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Provincia creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o provincia duplicada")
    })
    @PostMapping
    public ProvinciaResponseDTO crear(@Valid @RequestBody ProvinciaRequestDTO request) {
        return provinciaService.crear(request);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar una provincia")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Provincia actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Provincia no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public ProvinciaResponseDTO actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody ProvinciaRequestDTO request
    ) {
        return provinciaService.actualizar(id, request);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar una provincia")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Provincia eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Provincia no encontrado")
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        provinciaService.eliminar(id);
    }
}