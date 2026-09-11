package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.ConvenioRequestDTO;
import com.visioncontrol.inventario.dto.response.ConvenioConsultaDTO;
import com.visioncontrol.inventario.dto.response.ConvenioResponseDTO;
import com.visioncontrol.inventario.dto.response.ConvenioResumenDTO;
import com.visioncontrol.inventario.services.ConvenioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;



@RestController
@RequestMapping("/api/convenios")
@CrossOrigin(origins = "*")
@Tag(name = "Convenios", description = "Gestión de convenios")
public class ConvenioController {

    private final ConvenioService convenioService;

    public ConvenioController(ConvenioService convenioService) {
        this.convenioService = convenioService;
    }

    @GetMapping
    public List<ConvenioResponseDTO> listarConvenios() {
        return convenioService.listarConvenios();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener resumen de convenios")
    @GetMapping("/resumen")
    public ConvenioResumenDTO obtenerResumenConvenios() {
        return convenioService.obtenerResumenConvenios();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Consultar convenios con resumen operativo")
    @GetMapping("/consulta")
    public List<ConvenioConsultaDTO> consultarConvenios() {
        return convenioService.consultarConvenios();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener Convenio por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Convenio encontrado"),
            @ApiResponse(responseCode = "404", description = "Convenio no encontrado")
    })
    @GetMapping("/{id}")
    public ConvenioResponseDTO obtenerConvenioPorId(@PathVariable Integer id) {
        return convenioService.obtenerPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear Convenio")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Convenio creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    public ConvenioResponseDTO guardarConvenio(@Valid @RequestBody ConvenioRequestDTO dto) {
        return convenioService.guardarConvenio(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar Convenio")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Convenio actualizado correctamente"),
            @ApiResponse(responseCode = "404", description = "Convenio no encontrado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public ConvenioResponseDTO actualizarConvenio(
            @PathVariable Integer id,
            @Valid @RequestBody ConvenioRequestDTO dto) {

        return convenioService.actualizarConvenio(id, dto);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar Convenio")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Convenio eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Convenio no encontrado")
    })
    @DeleteMapping("/{id}")
    public String eliminarConvenio(@PathVariable Integer id) {
        convenioService.eliminarConvenio(id);
        return "Convenio eliminado correctamente";
    }
}
