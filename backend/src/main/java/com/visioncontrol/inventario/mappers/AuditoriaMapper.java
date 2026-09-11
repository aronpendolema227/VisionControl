package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.response.AuditoriaResponseDTO;
import com.visioncontrol.inventario.entities.Analista;
import com.visioncontrol.inventario.entities.Auditoria;
import com.visioncontrol.inventario.entities.Usuario;

public class AuditoriaMapper {

    public static AuditoriaResponseDTO toResponseDTO(Auditoria auditoria) {
        return toResponseDTO(auditoria, null);
    }

    public static AuditoriaResponseDTO toResponseDTO(
            Auditoria auditoria,
            Usuario usuario
    ) {
        AuditoriaResponseDTO dto = new AuditoriaResponseDTO();

        dto.setIdAuditoria(auditoria.getIdAuditoria());
        dto.setUsername(auditoria.getUsername());
        dto.setRol(auditoria.getRol());
        dto.setAccion(auditoria.getAccion());
        dto.setEntidad(auditoria.getEntidad());
        dto.setIdRegistro(auditoria.getIdRegistro());
        dto.setDetalle(auditoria.getDetalle());
        dto.setFechaHora(auditoria.getFechaHora());

        if (usuario != null) {
            dto.setNombreUsuario(usuario.getNombreCompleto());

            Analista analista = usuario.getAnalista();

            if (analista != null) {
                dto.setNombreAnalista(analista.getNombreAnalista());
                dto.setGrupoOperativo(analista.getGrupoOperativo());
            }
        }

        return dto;
    }
}