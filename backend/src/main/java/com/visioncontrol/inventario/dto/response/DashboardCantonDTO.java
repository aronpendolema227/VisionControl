package com.visioncontrol.inventario.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardCantonDTO {

    private String canton;
    private Long operativas;
    private Long caidas;
    private Double porcentaje;
}
