package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.UsuarioRequestDTO;
import com.visioncontrol.inventario.dto.response.UsuarioResponseDTO;
import com.visioncontrol.inventario.entities.Usuario;
import com.visioncontrol.inventario.exceptions.BadRequestException;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import com.visioncontrol.inventario.mappers.UsuarioMapper;
import com.visioncontrol.inventario.repositories.AnalistaRepository;
import com.visioncontrol.inventario.repositories.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.visioncontrol.inventario.entities.Analista;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AnalistaRepository analistaRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditoriaService auditoriaService;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            AnalistaRepository analistaRepository,
            PasswordEncoder passwordEncoder,
            AuditoriaService auditoriaService
    ) {
        this.usuarioRepository = usuarioRepository;
        this.analistaRepository = analistaRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditoriaService = auditoriaService;
    }

    public List<UsuarioResponseDTO> listarUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioMapper::toResponseDTO)
                .toList();
    }

    public UsuarioResponseDTO obtenerPorId(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        return UsuarioMapper.toResponseDTO(usuario);
    }

    public UsuarioResponseDTO crearUsuario(UsuarioRequestDTO dto) {

        if (dto.getPassword() == null || dto.getPassword().isBlank()) {
            throw new IllegalArgumentException("La contraseña es obligatoria");
        }
        
        String usernameLimpio = dto.getUsername().trim();
        if (usuarioRepository.existsByUsername(usernameLimpio)) {
            throw new BadRequestException("Ya existe un usuario con ese username");
        }

        if (usuarioRepository.existsByCorreo(dto.getCorreo())) {
            throw new BadRequestException("Ya existe un usuario con ese correo");
        }

        Usuario usuario = UsuarioMapper.toEntity(dto);
        usuario.setUsername(usernameLimpio);
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            usuario.setPassword(
                passwordEncoder.encode(dto.getPassword())
            );
        }

        Analista analista = new Analista();

        analista.setNombreAnalista(dto.getNombreCompleto());
        analista.setCargo(dto.getCargo());
        analista.setArea(dto.getArea());
        analista.setCorreo(dto.getCorreo());
        analista.setTelefono(dto.getTelefono());
        analista.setActivo(true);
        if ("ANALISTA_OPERACIONES".equals(dto.getRol().name())) {
            if (dto.getGrupoOperativo() == null || dto.getGrupoOperativo().isBlank()) {
                throw new BadRequestException("El grupo operativo es obligatorio para analistas de operaciones");
            }

            analista.setGrupoOperativo(dto.getGrupoOperativo().trim());
        } else {
            analista.setGrupoOperativo(null);
        }

        Analista analistaGuardado = analistaRepository.save(analista);

        usuario.setAnalista(analistaGuardado);

        Usuario guardado = usuarioRepository.save(usuario);

                auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "SUPER_ADMIN",
                "CREAR",
                "USUARIO",
                guardado.getIdUsuario(),
                "Se creó el usuario: " + guardado.getUsername()
        );

        return UsuarioMapper.toResponseDTO(guardado);
    }

    public UsuarioResponseDTO actualizarUsuario(Integer id, UsuarioRequestDTO dto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        usuario.setUsername(dto.getUsername().trim());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setCorreo(dto.getCorreo());
        usuario.setRol(dto.getRol());
        usuario.setActivo(dto.getActivo());

        Analista analista = usuario.getAnalista();

        if (analista != null) {
            analista.setNombreAnalista(dto.getNombreCompleto());
            analista.setCargo(dto.getCargo());
            analista.setArea(dto.getArea());
            analista.setCorreo(dto.getCorreo());
            analista.setTelefono(dto.getTelefono());
            analista.setActivo(dto.getActivo());

            analistaRepository.save(analista);
            if ("ANALISTA_OPERACIONES".equals(dto.getRol().name())) {
                if (dto.getGrupoOperativo() == null || dto.getGrupoOperativo().isBlank()) {
                    throw new BadRequestException("El grupo operativo es obligatorio para analistas de operaciones");
                }

                analista.setGrupoOperativo(dto.getGrupoOperativo().trim());
            } else {
                analista.setGrupoOperativo(null);
            }
                    }

        Usuario actualizado = usuarioRepository.save(usuario);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "SUPER_ADMIN",
                "ACTUALIZAR",
                "USUARIO",
                actualizado.getIdUsuario(),
                "Se actualizó el usuario: " + actualizado.getUsername()
        );

        return UsuarioMapper.toResponseDTO(actualizado);
    }

    @Transactional
    public void eliminarUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "SUPER_ADMIN",
                "ELIMINAR",
                "USUARIO",
                usuario.getIdUsuario(),
                "Se eliminó el usuario: " + usuario.getUsername()
        );

        usuarioRepository.delete(usuario);
    }

    public UsuarioResponseDTO desactivarUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        usuario.setActivo(false);

        Usuario actualizado = usuarioRepository.save(usuario);

        return UsuarioMapper.toResponseDTO(actualizado);
    }

    public UsuarioResponseDTO activarUsuario(Integer id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        usuario.setActivo(true);

        Usuario actualizado = usuarioRepository.save(usuario);

        return UsuarioMapper.toResponseDTO(actualizado);
    }

    public UsuarioResponseDTO cambiarPassword(Integer id, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        usuario.setPassword(passwordEncoder.encode(nuevaPassword));

        Usuario actualizado = usuarioRepository.save(usuario);

        return UsuarioMapper.toResponseDTO(actualizado);
    }

    private String obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return "SISTEMA";
        }

        return authentication.getName();
    }
}