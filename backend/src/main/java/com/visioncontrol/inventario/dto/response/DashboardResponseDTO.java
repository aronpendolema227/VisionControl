package com.visioncontrol.inventario.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DashboardResponseDTO {

    private Long totalCamaras;
    private Long operativas;
    private Long noOperativas;
    private Long glpiActivos;

    private Long conectividad;
    private Long mantenimiento;
}
