package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.PlataformaRequestDTO;
import com.visioncontrol.inventario.dto.response.PlataformaResponseDTO;
import com.visioncontrol.inventario.services.PlataformaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/plataformas")
@CrossOrigin(origins = "*")
@Tag(name = "Plataformas", description = "Operaciones CRUD para plataformas")
public class PlataformaController {

    private final PlataformaService plataformaService;

    public PlataformaController(PlataformaService plataformaService) {
        this.plataformaService = plataformaService;
    }

    @Operation(summary = "Listar todas las plataformas")
    @GetMapping
    public List<PlataformaResponseDTO> listarPlataformas() {
        return plataformaService.listarPlataformas();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener plataforma por ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Plataforma encontrado"),
        @ApiResponse(responseCode = "404", description = "Plataforma no encontrado")
    })  
    @GetMapping("/{id}")
    public PlataformaResponseDTO obtenerPlataformaPorId(@PathVariable Integer id) {
        return plataformaService.obtenerPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear una nueva plataforma")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Plataforma creado correctamente"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    public PlataformaResponseDTO guardarPlataforma(@Valid @RequestBody PlataformaRequestDTO dto) {
        return plataformaService.guardarPlataforma(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar una plataforma")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Plataforma actualizado correctamente"),
        @ApiResponse(responseCode = "404", description = "Plataforma no encontrado"),
        @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public PlataformaResponseDTO actualizarPlataforma(
            @PathVariable Integer id,
            @Valid @RequestBody PlataformaRequestDTO dto
    ) {
        return plataformaService.actualizarPlataforma(id, dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar una plataforma")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Plataforma eliminado correctamente"),
        @ApiResponse(responseCode = "404", description = "Plataforma no encontrado")
    })
    @DeleteMapping("/{id}")
    public String eliminarPlataforma(@PathVariable Integer id) {
        plataformaService.eliminarPlataforma(id);
        return "Plataforma eliminada correctamente";
    }
}
