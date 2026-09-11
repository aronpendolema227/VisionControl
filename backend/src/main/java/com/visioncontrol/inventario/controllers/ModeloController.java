package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.ModeloRequestDTO;
import com.visioncontrol.inventario.dto.response.ModeloResponseDTO;
import com.visioncontrol.inventario.services.ModeloService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/modelos")
@CrossOrigin(origins = "*")
@Tag(name = "Modelos", description = "Operaciones CRUD para modelos de cámaras")
public class ModeloController {

    private final ModeloService modeloService;

    public ModeloController(ModeloService modeloService) {
        this.modeloService = modeloService;
    }

    @Operation(summary = "Listar todos los modelos")
    @GetMapping
    public List<ModeloResponseDTO> listarModelos() {
        return modeloService.listarModelos();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Listar modelos por marca")
    @GetMapping("/marca/{idMarca}")
    public List<ModeloResponseDTO> listarModelosPorMarca(@PathVariable Integer idMarca) {
        return modeloService.listarModelosPorMarca(idMarca);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener modelo por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "... encontrado"),
        @ApiResponse(responseCode = "404", description = "... no encontrado")
    })
    @GetMapping("/{id}")
    public ModeloResponseDTO obtenerModeloPorId(@PathVariable Integer id) {
        return modeloService.obtenerPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear un nuevo modelo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Modelo creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    public ModeloResponseDTO guardarModelo(
            @Valid @RequestBody ModeloRequestDTO dto) {
        return modeloService.guardarModelo(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar un modelo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Modelo actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Modelo no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public ModeloResponseDTO actualizarModelo(
            @PathVariable Integer id,
            @Valid @RequestBody ModeloRequestDTO dto) {
        return modeloService.actualizarModelo(id, dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar un modelo")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Modelo eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Modelo no encontrado")
    })
    @DeleteMapping("/{id}")
    public String eliminarModelo(@PathVariable Integer id) {
        modeloService.eliminarModelo(id);
        return "Modelo eliminado correctamente";
    }
}