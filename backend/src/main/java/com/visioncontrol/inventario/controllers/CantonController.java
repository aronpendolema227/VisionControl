package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.CantonRequestDTO;
import com.visioncontrol.inventario.dto.response.CantonResponseDTO;
import com.visioncontrol.inventario.services.CantonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/cantones")
@CrossOrigin(origins = "*")
@Tag(name = "Cantones", description = "Operaciones CRUD para cantones")
public class CantonController {

    private final CantonService cantonService;

    public CantonController(CantonService cantonService) {
        this.cantonService = cantonService;
    }

    @Operation(summary = "Listar todos los cantones")
    @GetMapping
    public List<CantonResponseDTO> listarCantones() {
        return cantonService.listarCantones();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Listar cantones por provincia")
    @GetMapping("/provincia/{idProvincia}")
    public List<CantonResponseDTO> listarCantonesPorProvincia(@PathVariable Integer idProvincia) {
        return cantonService.listarCantonesPorProvincia(idProvincia);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener cantón por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cantón encontrado"),
            @ApiResponse(responseCode = "404", description = "Cantón no encontrado")
    })
    @GetMapping("/{id}")
    public CantonResponseDTO obtenerCantonPorId(@PathVariable Integer id) {
        return cantonService.obtenerPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear un nuevo cantón")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cantón creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    public CantonResponseDTO guardarCanton(
            @Valid @RequestBody CantonRequestDTO cantonRequestDTO) {

        return cantonService.guardarCanton(cantonRequestDTO);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar un cantón")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cantón actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Cantón no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public CantonResponseDTO actualizarCanton(
            @PathVariable Integer id,
            @Valid @RequestBody CantonRequestDTO cantonRequestDTO
    ) {

        return cantonService.actualizarCanton(id, cantonRequestDTO);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar un cantón")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cantón eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Cantón no encontrado")
    })
    @DeleteMapping("/{id}")
    public String eliminarCanton(@PathVariable Integer id) {
        cantonService.eliminarCanton(id);
        return "Cantón eliminado correctamente";
    }
}