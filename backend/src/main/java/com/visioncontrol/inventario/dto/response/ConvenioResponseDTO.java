package com.visioncontrol.inventario.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ConvenioResponseDTO {

    private Integer idConvenio;
    private String nombreConvenio;
    private LocalDate fechaConvenioOriginal;
    private LocalDate fechaConvenioInicio;
    private LocalDate fechaConvenioFin;
    private String estadoFechaConvenio;
    private String responsablePago;
}
