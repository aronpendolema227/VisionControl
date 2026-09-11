package com.visioncontrol.inventario.controllers;

import com.visioncontrol.inventario.dto.request.UsuarioRequestDTO;
import com.visioncontrol.inventario.dto.response.UsuarioResponseDTO;
import com.visioncontrol.inventario.services.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import com.visioncontrol.inventario.dto.request.CambiarPasswordRequestDTO;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
@Tag(name = "Usuarios", description = "Gestión de usuarios y roles del sistema")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Listar todos los usuarios")
    @GetMapping
    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioService.listarUsuarios();
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Obtener usuario por ID")
    @GetMapping("/{id}")
    public UsuarioResponseDTO obtenerPorId(@PathVariable Integer id) {
        return usuarioService.obtenerPorId(id);
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Crear nuevo usuario")
    @PostMapping
    public UsuarioResponseDTO crearUsuario(@Valid @RequestBody UsuarioRequestDTO dto) {
        return usuarioService.crearUsuario(dto);
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Actualizar usuario")
    @PutMapping("/{id}")
    public UsuarioResponseDTO actualizarUsuario(
            @PathVariable Integer id,
            @Valid @RequestBody UsuarioRequestDTO dto
    ) {
        return usuarioService.actualizarUsuario(id, dto);
    }

    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Eliminar usuario")
    @DeleteMapping("/{id}")
    public String eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id);
        return "Usuario eliminado correctamente";
    }

    @Operation(summary = "Desactivar usuario")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @PutMapping("/{id}/desactivar")
    public UsuarioResponseDTO desactivarUsuario(@PathVariable Integer id) {
        return usuarioService.desactivarUsuario(id);
    }

    @Operation(summary = "Activar usuario")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @PutMapping("/{id}/activar")
    public UsuarioResponseDTO activarUsuario(@PathVariable Integer id) {
        return usuarioService.activarUsuario(id);
    }

    @Operation(summary = "Cambiar contraseña de usuario")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @PutMapping("/{id}/cambiar-password")
    public UsuarioResponseDTO cambiarPassword(
            @PathVariable Integer id,
            @Valid @RequestBody CambiarPasswordRequestDTO dto
    ) {
        return usuarioService.cambiarPassword(id, dto.getNuevaPassword());
    }
}