package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.CentroOperativoRequestDTO;
import com.visioncontrol.inventario.dto.response.CentroOperativoResponseDTO;
import com.visioncontrol.inventario.services.CentroOperativoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/centros-operativos")
@CrossOrigin(origins = "*")
@Tag(name = "Centros Operativos", description = "Gestión de centros operativos")
public class CentroOperativoController {

    private final CentroOperativoService centroOperativoService;

    public CentroOperativoController(
            CentroOperativoService centroOperativoService
    ) {
        this.centroOperativoService = centroOperativoService;
    }

    @GetMapping
    public List<CentroOperativoResponseDTO> listarCentros() {
        return centroOperativoService.listarCentros();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener Centro Operativo por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Centro Operativo encontrado"),
            @ApiResponse(responseCode = "404", description = "Centro Operativo no encontrado")
    })
    @GetMapping("/{id}")
    public CentroOperativoResponseDTO obtenerCentroPorId(@PathVariable Integer id) {
        return centroOperativoService.obtenerPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear Centro Operativo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Centro Operativo creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    public CentroOperativoResponseDTO guardarCentro(@Valid @RequestBody CentroOperativoRequestDTO dto) {
        return centroOperativoService.guardarCentro(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar Centro Operativo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Centro Operativo actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Centro Operativo no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public CentroOperativoResponseDTO actualizarCentro(
            @PathVariable Integer id,
            @Valid @RequestBody CentroOperativoRequestDTO dto
    ) {
        return centroOperativoService.actualizarCentro(id, dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar Centro Operativo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Centro Operativo eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Centro Operativo no encontrado")
    })
    @DeleteMapping("/{id}")
    public String eliminarCentro(@PathVariable Integer id) {
        centroOperativoService.eliminarCentro(id);
        return "Centro operativo eliminado correctamente";
    }
}
