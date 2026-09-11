package com.visioncontrol.inventario.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class ConvenioRequestDTO {

    @NotBlank(message = "El nombre del convenio es obligatorio")
    private String nombreConvenio;

    @NotNull(message = "La fecha original del convenio es obligatoria")
    private LocalDate fechaConvenioOriginal;

    @NotNull(message = "La fecha de inicio del convenio es obligatoria")
    private LocalDate fechaConvenioInicio;

    @NotNull(message = "La fecha de fin del convenio es obligatoria")
    private LocalDate fechaConvenioFin;

    @NotBlank(message = "El estado del convenio es obligatorio")
    private String estadoFechaConvenio;

    private String responsablePago;
}
