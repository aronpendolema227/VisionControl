package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuditoriaResponseDTO {

    private Integer idAuditoria;
    private String username;
    private String rol;
    private String accion;
    private String entidad;
    private Integer idRegistro;
    private String detalle;
    private LocalDateTime fechaHora;
    private String nombreUsuario;
    private String nombreAnalista;
    private String grupoOperativo;
}
