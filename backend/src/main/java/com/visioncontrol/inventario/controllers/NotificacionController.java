package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.response.NotificacionResponseDTO;
import com.visioncontrol.inventario.services.NotificacionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.visioncontrol.inventario.dto.response.HistorialNotificacionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RestController
@RequestMapping("/api/notificaciones")
@CrossOrigin(origins = "*")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @PreAuthorize("hasAnyRole('SUPER_ADMIN','ANALISTA_OPERACIONES','ANALISTA_TECNOLOGIA','LECTOR','COORDINACION_ZONAL','OPERACION_ZONAL')")
    @GetMapping
    public List<NotificacionResponseDTO> listarNotificaciones(
            @RequestParam String rol
    ) {
        return notificacionService.listarNotificacionesActivasPorRol(rol);
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping("/historial")
    public Page<HistorialNotificacionResponseDTO> listarHistorialNotificaciones(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String tipo
    ) {
        int pageSeguro = Math.max(page, 0);
        int sizeSeguro = size <= 0 ? 20 : Math.min(size, 50);

        Pageable pageable = PageRequest.of(pageSeguro, sizeSeguro);

        return notificacionService.listarHistorialNotificaciones(pageable, tipo);
    }

}


