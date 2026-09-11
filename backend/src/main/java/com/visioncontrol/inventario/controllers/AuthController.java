package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.AuthRequestDTO;
import com.visioncontrol.inventario.dto.response.AuthResponseDTO;
import com.visioncontrol.inventario.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.visioncontrol.inventario.dto.request.CambiarMiPasswordRequestDTO;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticación", description = "Login y generación de token JWT")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @Operation(summary = "Iniciar sesión")
    @PostMapping("/login")
    public AuthResponseDTO login(@Valid @RequestBody AuthRequestDTO dto) {
        return authService.login(dto);
    }
    @Operation(summary = "Obtener usuario autenticado")
    @GetMapping("/me")
    public AuthResponseDTO obtenerUsuarioActual(Authentication authentication) {
        return authService.obtenerUsuarioActual(authentication.getName());
    }

    @Operation(summary = "Cambiar mi contraseña")
    @PutMapping("/cambiar-mi-password")
    public String cambiarMiPassword(
            Authentication authentication,
            @Valid @RequestBody CambiarMiPasswordRequestDTO dto
    ) {
        authService.cambiarMiPassword(authentication.getName(), dto);
        return "Contraseña actualizada correctamente";
    }
}