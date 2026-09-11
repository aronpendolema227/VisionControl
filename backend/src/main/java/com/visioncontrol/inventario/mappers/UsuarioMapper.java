package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.UsuarioRequestDTO;
import com.visioncontrol.inventario.dto.response.UsuarioResponseDTO;
import com.visioncontrol.inventario.entities.Usuario;

public class UsuarioMapper {

    public static UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();

        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setUsername(usuario.getUsername());
        dto.setNombreCompleto(usuario.getNombreCompleto());
        dto.setCorreo(usuario.getCorreo());
        dto.setRol(usuario.getRol());
        dto.setActivo(usuario.getActivo());

        if (usuario.getAnalista() != null) {
            dto.setIdAnalista(usuario.getAnalista().getIdAnalista());
            dto.setNombreAnalista(usuario.getAnalista().getNombreAnalista());
            dto.setCargo(usuario.getAnalista().getCargo());
            dto.setArea(usuario.getAnalista().getArea());
            dto.setTelefono(usuario.getAnalista().getTelefono());
            dto.setGrupoOperativo(usuario.getAnalista().getGrupoOperativo());
        }

        return dto;
    }

    public static Usuario toEntity(UsuarioRequestDTO dto) {
        Usuario usuario = new Usuario();

        usuario.setUsername(dto.getUsername());
        usuario.setPassword(dto.getPassword());
        usuario.setNombreCompleto(dto.getNombreCompleto());
        usuario.setCorreo(dto.getCorreo());
        usuario.setRol(dto.getRol());
        usuario.setActivo(dto.getActivo());

        return usuario;
    }
}