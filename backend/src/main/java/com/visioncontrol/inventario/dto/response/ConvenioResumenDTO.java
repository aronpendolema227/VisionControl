package com.visioncontrol.inventario.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ConvenioResumenDTO {

    private Integer totalConvenios;
    private Integer totalCamarasAsociadas;
    private Integer totalProvinciasConConvenios;
}
