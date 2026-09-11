package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "convenios")
@Getter
@Setter
@NoArgsConstructor
public class Convenio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idConvenio;

    @Column(name = "nombre_convenio",nullable = false)
    private String nombreConvenio;

    @Column(name = "fecha_convenio_original")
    private LocalDate fechaConvenioOriginal;

    @Column(name = "fecha_convenio_inicio")
    private LocalDate fechaConvenioInicio;

    @Column(name = "fecha_convenio_fin")
    private LocalDate fechaConvenioFin;

    @Column(name = "estado_fecha_convenio")
    private String estadoFechaConvenio;

    @Column(name = "responsable_pago")
    private String responsablePago;
}
