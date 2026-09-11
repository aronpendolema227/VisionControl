package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.ProveedorRequestDTO;
import com.visioncontrol.inventario.dto.response.ProveedorResponseDTO;
import com.visioncontrol.inventario.services.ProveedorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "*")
@Tag(name = "Proveedores", description = "Operaciones CRUD para proveedores")
public class ProveedorController {

    private final ProveedorService proveedorService;

    public ProveedorController(ProveedorService proveedorService) {
        this.proveedorService = proveedorService;
    }

    @Operation(summary = "Listar todos los proveedores")
    @GetMapping
    public List<ProveedorResponseDTO> listarProveedores() {
        return proveedorService.listarProveedores();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener proveedor por ID")
        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "Proveedor encontrado"),
                @ApiResponse(responseCode = "404", description = "Proveedor no encontrado")
        })
    @GetMapping("/{id}")
    public ProveedorResponseDTO obtenerProveedorPorId(@PathVariable Integer id) {
        return proveedorService.obtenerPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear proveedor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proveedor creado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o proveedor duplicado")
    })
    @PostMapping
    public ProveedorResponseDTO guardarProveedor(@Valid @RequestBody ProveedorRequestDTO dto) {
        return proveedorService.guardarProveedor(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar proveedor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proveedor actualizado correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Proveedor no encontrado")
    })
    @PutMapping("/{id}")
    public ProveedorResponseDTO actualizarProveedor(
            @PathVariable Integer id,
            @Valid @RequestBody ProveedorRequestDTO dto
    ) {
        return proveedorService.actualizarProveedor(id, dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    @Operation(summary = "Eliminar proveedor")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Proveedor eliminado correctamente"),
            @ApiResponse(responseCode = "404", description = "Proveedor no encontrado")
    })
    @DeleteMapping("/{id}")
    public String eliminarProveedor(@PathVariable Integer id) {
        proveedorService.eliminarProveedor(id);
        return "Proveedor eliminado correctamente";
    }
}