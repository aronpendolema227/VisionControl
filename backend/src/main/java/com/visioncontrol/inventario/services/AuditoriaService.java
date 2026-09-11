package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.response.AuditoriaResponseDTO;
import com.visioncontrol.inventario.entities.Auditoria;
import com.visioncontrol.inventario.entities.Usuario;
import com.visioncontrol.inventario.mappers.AuditoriaMapper;
import com.visioncontrol.inventario.repositories.AuditoriaRepository;
import com.visioncontrol.inventario.repositories.UsuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class AuditoriaService {

    private final AuditoriaRepository auditoriaRepository;
    private final UsuarioRepository usuarioRepository;

    public AuditoriaService(
            AuditoriaRepository auditoriaRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.auditoriaRepository = auditoriaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public void registrar(
            String username,
            String rol,
            String accion,
            String entidad,
            Integer idRegistro,
            String detalle
    ) {

        Auditoria auditoria = new Auditoria();

        auditoria.setUsername(username);
        auditoria.setRol(rol);
        auditoria.setAccion(accion);
        auditoria.setEntidad(entidad);
        auditoria.setIdRegistro(idRegistro);
        auditoria.setDetalle(detalle);

        auditoriaRepository.save(auditoria);
    }

    @Transactional(readOnly = true)
    public List<AuditoriaResponseDTO> listarAuditorias() {
        return auditoriaRepository.findAllByOrderByFechaHoraDesc()
                .stream()
                .map(this::mapearAuditoriaConUsuario)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditoriaResponseDTO> obtenerBitacoraReciente() {
        return auditoriaRepository.findTop10ByOrderByFechaHoraDesc()
                .stream()
                .map(this::mapearAuditoriaConUsuario)
                .toList();
    }

    @Transactional(readOnly = true)
    public Page<AuditoriaResponseDTO> listarAuditoriasPaginadas(Pageable pageable) {
        return listarAuditoriasPaginadas(pageable, null);
    }

    @Transactional(readOnly = true)
    public Page<AuditoriaResponseDTO> listarAuditoriasPaginadas(
            Pageable pageable,
            String busquedaGeneral
    ) {
        if (busquedaGeneral == null || busquedaGeneral.trim().isEmpty()) {
            return auditoriaRepository.findAllByOrderByFechaHoraDesc(pageable)
                    .map(this::mapearAuditoriaConUsuario);
        }

        return auditoriaRepository.buscarAuditoriasGeneral(busquedaGeneral.trim(), pageable)
                .map(this::mapearAuditoriaConUsuario);
    }

    private AuditoriaResponseDTO mapearAuditoriaConUsuario(Auditoria auditoria) {
        Usuario usuario = null;

        if (auditoria.getUsername() != null && !auditoria.getUsername().trim().isEmpty()) {
            usuario = usuarioRepository
                    .findByUsernameIgnoreCase(auditoria.getUsername().trim())
                    .orElse(null);
        }

        return AuditoriaMapper.toResponseDTO(auditoria, usuario);
    }
}