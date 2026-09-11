package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CentroOperativoResponseDTO {

    private Integer idCentro;
    private String nombreCentro;
    private String pais;
    private Double coLatitud;
    private Double coLongitud;
    private String ubicacionGeo;
}