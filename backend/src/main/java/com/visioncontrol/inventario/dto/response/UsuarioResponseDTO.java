package com.visioncontrol.inventario.dto.response;

import com.visioncontrol.inventario.security.Rol;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioResponseDTO {

    private Integer idUsuario;
    private String username;
    private String nombreCompleto;
    private String correo;
    private Rol rol;
    private Boolean activo;
    private Integer idAnalista;
    private String nombreAnalista;
    private String cargo;
    private String area;
    private String telefono;
    private String grupoOperativo;
}