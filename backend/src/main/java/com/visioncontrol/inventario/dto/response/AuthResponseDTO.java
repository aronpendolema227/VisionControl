package com.visioncontrol.inventario.dto.response;

import com.visioncontrol.inventario.security.Rol;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponseDTO {

    private String token;
    private String username;
    private String nombreCompleto;
    private Rol rol;
    private Integer idAnalista;
}