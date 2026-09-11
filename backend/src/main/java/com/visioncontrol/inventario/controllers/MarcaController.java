package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.MarcaRequestDTO;
import com.visioncontrol.inventario.dto.response.MarcaResponseDTO;
import com.visioncontrol.inventario.services.MarcaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/marcas")
@Tag(name = "Marcas", description = "Operaciones CRUD para marcas de cámaras")
public class MarcaController {

    private final MarcaService marcaService;

    public MarcaController(MarcaService marcaService) {
        this.marcaService = marcaService;
    }

    @Operation(summary = "Listar todas las marcas")
    @GetMapping
    public List<MarcaResponseDTO> listarMarcas() {
        return marcaService.listarTodas();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener marca por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Marca encontrado"),
        @ApiResponse(responseCode = "404", description = "Marca no encontrado")
    })
    @GetMapping("/{id}")
    public MarcaResponseDTO buscarPorId(@PathVariable Integer id) {
        return marcaService.buscarPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear una nueva marca")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Marca creada correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MarcaResponseDTO crear(@Valid @RequestBody MarcaRequestDTO request) {
        return marcaService.crear(request);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar una marca")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Marca actualizada correctamente"),
        @ApiResponse(responseCode = "404", description = "Marca no encontrada"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public MarcaResponseDTO actualizar(
            @PathVariable Integer id,
            @Valid @RequestBody MarcaRequestDTO request
    ) {
        return marcaService.actualizar(id, request);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar una marca")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "marca eliminada correctamente"),
        @ApiResponse(responseCode = "404", description = "marca no encontrada")
    })
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Integer id) {
        marcaService.eliminar(id);
    }
}
