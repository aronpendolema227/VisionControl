package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModeloResponseDTO {

    private Integer idModelo;
    private String nombreModelo;
    private Integer idMarca;
    private String nombreMarca;
}