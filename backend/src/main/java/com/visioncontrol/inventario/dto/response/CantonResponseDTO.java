package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CantonResponseDTO {

    private Integer idCanton;
    private String nombreCanton;
    private Integer idProvincia;
    private String nombreProvincia;
}
