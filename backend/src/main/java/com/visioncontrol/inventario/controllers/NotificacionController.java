package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.response.NotificacionResponseDTO;
import com.visioncontrol.inventario.services.NotificacionService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
}
