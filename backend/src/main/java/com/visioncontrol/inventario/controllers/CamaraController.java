package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.ActualizarConvenioRequestDTO;
import com.visioncontrol.inventario.dto.request.CamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.CamaraResponseDTO;
import com.visioncontrol.inventario.services.CamaraService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.visioncontrol.inventario.dto.request.ReactivarCamaraRequestDTO;
import com.visioncontrol.inventario.dto.request.MotivoDesactivacionRequestDTO;

import java.time.LocalDate;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/camaras")
@CrossOrigin(origins = "*")
@Tag(name = "Cámaras", description = "Gestión de cámaras del ECU911")
public class CamaraController {

    private final CamaraService camaraService;

    public CamaraController(CamaraService camaraService) {
        this.camaraService = camaraService;
    }

    @GetMapping
    public List<CamaraResponseDTO> listarCamaras() {
        return camaraService.listarCamaras();
    }

    @Operation(summary = "Listar cámaras por estado")
    @GetMapping("/estado/{estado}")
    public List<CamaraResponseDTO> listarPorEstado(@PathVariable String estado) {
        return camaraService.listarPorEstado(estado);
    }

    @Operation(summary = "Listar cámaras por cantón")
    @GetMapping("/canton/{idCanton}")
    public List<CamaraResponseDTO> listarPorCanton(@PathVariable Integer idCanton) {
        return camaraService.listarPorCanton(idCanton);
    }

    @Operation(summary = "Listar cámaras por proveedor")
    @GetMapping("/proveedor/{idProveedor}")
    public List<CamaraResponseDTO> listarPorProveedor(@PathVariable Integer idProveedor) {
        return camaraService.listarPorProveedor(idProveedor);
    }

    @Operation(summary = "Listar cámaras por plataforma")
    @GetMapping("/plataforma/{idPlataforma}")
    public List<CamaraResponseDTO> listarPorPlataforma(@PathVariable Integer idPlataforma) {
        return camaraService.listarPorPlataforma(idPlataforma);
    }

    @Operation(summary = "Listar cámaras con paginación")
    @GetMapping("/paginado")
    public Page<CamaraResponseDTO> listarCamarasPaginadas(Pageable pageable) {
        return camaraService.listarCamarasPaginadas(pageable);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Filtrar cámaras con búsqueda, filtros y paginación")
    @GetMapping("/filtrar")
    public Page<CamaraResponseDTO> filtrarCamaras(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Integer idProvincia,
            @RequestParam(required = false) Integer idCanton,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String plataforma,
            @RequestParam(required = false) String convenio,
            @RequestParam(required = false) Integer idMarca,
            @RequestParam(required = false) Integer idModelo,
            @RequestParam(required = false) String anchoBanda,
            @RequestParam(required = false) String pilotoCnt,
            @RequestParam(required = false) String tipoDanoSinServicio,
            @RequestParam(required = false) String tipoFallaTecnica,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fechaInstalacion,
            Pageable pageable
    ) {
        return camaraService.filtrarCamaras(
                busqueda,
                idProvincia,
                idCanton,
                estado,
                plataforma,
                convenio,
                idMarca,
                idModelo,
                anchoBanda,
                pilotoCnt,
                tipoDanoSinServicio,
                tipoFallaTecnica,
                fechaInstalacion,
                pageable
        );
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Exportar cámaras filtradas")
    @GetMapping("/exportar")
    public ResponseEntity<byte[]> exportarCamaras(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Integer idProvincia,
            @RequestParam(required = false) Integer idCanton,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String plataforma,
            @RequestParam(required = false) String convenio,
            @RequestParam(required = false) Integer idMarca,
            @RequestParam(required = false) Integer idModelo,
            @RequestParam(required = false) String anchoBanda,
            @RequestParam(required = false) String pilotoCnt,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fechaInstalacion
    ) {
        byte[] archivo = camaraService.exportarCamarasFiltradas(
                busqueda,
                idProvincia,
                idCanton,
                estado,
                plataforma,
                convenio,
                idMarca,
                idModelo,
                anchoBanda,
                pilotoCnt,
                fechaInstalacion
        );

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=camaras_filtradas.csv")
                .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                .body(archivo);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Filtrar cámaras por datos de convenio")
    @GetMapping("/convenios/filtrar")
    public Page<CamaraResponseDTO> filtrarCamarasPorConvenio(
            @RequestParam(required = false) Integer idProvincia,
            @RequestParam(required = false) Integer idCanton,
            @RequestParam(required = false) String estadoConvenio,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate fechaConvenioInicio,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return camaraService.filtrarCamarasPorConvenio(
                idProvincia,
                idCanton,
                estadoConvenio,
                fechaConvenioInicio,
                page,
                size
        );
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Listar fechas de inicio de convenio disponibles")
    @GetMapping("/convenios/fechas-inicio")
    public List<LocalDate> listarFechasInicioConvenioDisponibles() {
        return camaraService.listarFechasInicioConvenioDisponibles();
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Listar fechas de instalación disponibles")
    @GetMapping("/fechas-instalacion")
    public List<LocalDate> listarFechasInstalacionDisponibles() {
        return camaraService.listarFechasInstalacionDisponibles();
    }
    
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @GetMapping("/buscar-cambio")
    public Page<CamaraResponseDTO> buscarCamarasParaCambio(
            @RequestParam(required = false) String busqueda,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return camaraService.buscarCamarasParaCambio(busqueda, page, size);
    }
    
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Validar duplicados de cámara")
    @GetMapping("/validar-duplicados")
    public Map<String, Boolean> validarDuplicadosCamara(
            @RequestParam(required = false) Integer idPuntoOriginal,
            @RequestParam(required = false) String nombreCamara,
            @RequestParam(required = false) String direccionIp
    ) {
        return camaraService.validarDuplicadosCamara(
                idPuntoOriginal,
                nombreCamara,
                direccionIp
        );
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Buscar cámaras para activar o desactivar")
    @GetMapping("/activar-desactivar/buscar")
    public Page<CamaraResponseDTO> buscarCamarasActivarDesactivar(
            @RequestParam(required = false) String busqueda,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return camaraService.buscarCamarasActivarDesactivar(
                busqueda,
                activo,
                page,
                size
        );
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @Operation(summary = "Obtener cámara por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cámara encontrada"),
            @ApiResponse(responseCode = "404", description = "Cámara no encontrada")
    })
    
    

    @GetMapping("/{id}")
    public CamaraResponseDTO obtenerPorId(@PathVariable Integer id) {
        return camaraService.obtenerPorId(id);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Crear Camara")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Camara creada correctamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o duplicados")
    })
    @PostMapping
    public CamaraResponseDTO guardarCamara(@Valid @RequestBody CamaraRequestDTO dto) {
        return camaraService.guardarCamara(dto);
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @Operation(summary = "Actualizar Camara")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Camara actualizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Camara no encontrada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PutMapping("/{id}")
    public CamaraResponseDTO actualizarCamara(
            @PathVariable Integer id,
            @Valid @RequestBody CamaraRequestDTO dto
    ) {
        return camaraService.actualizarCamara(id, dto);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Desactivar cámara con motivo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cámara desactivada correctamente"),
            @ApiResponse(responseCode = "404", description = "Cámara no encontrada"),
            @ApiResponse(responseCode = "400", description = "Debe ingresar un motivo")
    })
    @PatchMapping("/{id}/desactivar")
    public CamaraResponseDTO desactivarCamara(
            @PathVariable Integer id,
            @Valid @RequestBody MotivoDesactivacionRequestDTO request
    ) {
        return camaraService.desactivarCamara(id, request.getMotivo());
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @Operation(summary = "Reactivar cámara")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cámara reactivada correctamente"),
            @ApiResponse(responseCode = "404", description = "Cámara no encontrada"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos")
    })
    @PatchMapping("/{id}/reactivar")
    public CamaraResponseDTO reactivarCamara(
            @PathVariable Integer id,
            @Valid @RequestBody ReactivarCamaraRequestDTO request
    ) {
        return camaraService.reactivarCamara(
                id,
                request.getEstadoActual(),
                request.getMotivo()
        );
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_TECNOLOGIA')")
    @PatchMapping("/{idCamara}/convenio")
    public ResponseEntity<CamaraResponseDTO> actualizarConvenioCamara(
            @PathVariable Integer idCamara,
            @RequestBody ActualizarConvenioRequestDTO request
    ) {
        CamaraResponseDTO response = camaraService.actualizarConvenioCamara(
                idCamara,
                request
        );

        return ResponseEntity.ok(response);
    }
    
}