package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnalistaResponseDTO {

    private Integer idAnalista;
    private String nombreAnalista;
    private String cargo;
    private String area;
    private String correo;
    private String telefono;
    private Boolean activo;
}