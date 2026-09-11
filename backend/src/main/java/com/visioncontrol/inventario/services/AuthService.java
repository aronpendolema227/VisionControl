package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.AuthRequestDTO;
import com.visioncontrol.inventario.dto.response.AuthResponseDTO;
import com.visioncontrol.inventario.entities.Usuario;
import com.visioncontrol.inventario.exceptions.BadRequestException;
import com.visioncontrol.inventario.repositories.UsuarioRepository;
import com.visioncontrol.inventario.security.JwtService;

import org.springframework.stereotype.Service;

import org.springframework.security.crypto.password.PasswordEncoder;
import com.visioncontrol.inventario.dto.request.CambiarMiPasswordRequestDTO;

import java.util.Optional;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UsuarioRepository usuarioRepository,
            JwtService jwtService,
            PasswordEncoder passwordEncoder
    ) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponseDTO login(AuthRequestDTO dto) {
        System.out.println("===== ENTRE AL LOGIN =====");
        System.out.println("Username recibido antes de buscar: [" + dto.getUsername() + "]");
        /* 
        Usuario usuario = usuarioRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new BadRequestException("Usuario o contraseña incorrectos"));
        */ 
        /*
            System.out.println("===== TODOS LOS USUARIOS =====");

            usuarioRepository.findAll().forEach(u -> {
                System.out.println(
                    "ID=" + u.getId_usuario()
                    + " USER=" + u.getUsername()
                    + " ACTIVO=" + u.getActivo()
                );
            });
         */
        

        String usernameLimpio = dto.getUsername().trim();

        Optional<Usuario> usuarioOpt =
            usuarioRepository.findByUsername(usernameLimpio);

        System.out.println("Usuario encontrado: " + usuarioOpt.isPresent());

        if (usuarioOpt.isEmpty()) {
                throw new BadRequestException("Usuario o contraseña incorrectos");
        }

            Usuario usuario = usuarioOpt.get();

                System.out.println("Usuario recibido: [" + dto.getUsername() + "]");
                System.out.println("Password recibido: [" + dto.getPassword() + "]");
                System.out.println("Password BD: [" + usuario.getPassword() + "]");
                System.out.println("Coincide: " + passwordEncoder.matches(dto.getPassword(), usuario.getPassword()));

        if (!passwordEncoder.matches(dto.getPassword(), usuario.getPassword())) {
            throw new BadRequestException("Usuario o contraseña incorrectos");
        }

        if (!usuario.getActivo()) {
            throw new BadRequestException("El usuario está desactivado");
        }

        String token = jwtService.generarToken(
                usuario.getUsername(),
                usuario.getRol().name()
        );

        return new AuthResponseDTO(
                token,
                usuario.getUsername(),
                usuario.getNombreCompleto(),
                usuario.getRol(),
                obtenerIdAnalista(usuario)
        );
    }

    public AuthResponseDTO obtenerUsuarioActual(String username) {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));

        return new AuthResponseDTO(
                null,
                usuario.getUsername(),
                usuario.getNombreCompleto(),
                usuario.getRol(),
                obtenerIdAnalista(usuario)
        );
    }

    private Integer obtenerIdAnalista(Usuario usuario) {
        if (usuario.getAnalista() == null) {
            return null;
        }

        return usuario.getAnalista().getIdAnalista();
    }

    public void cambiarMiPassword(String username, CambiarMiPasswordRequestDTO dto) {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new BadRequestException("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getPassword())) {
            throw new BadRequestException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(dto.getNuevaPassword()));

        usuarioRepository.save(usuario);
    }
}
