package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "detalle_convenio_camara")
@Getter
@Setter
@NoArgsConstructor
public class DetalleConvenioCamara {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_detalle_convenio")
    private Integer idDetalleConvenio;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_camara", nullable = false, unique = true)
    private Camara camara;

    @Column(name = "id_punto_original", nullable = false)
    private Integer idPuntoOriginal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_convenio_estado", nullable = false)
    private Convenio convenioEstado;

    @Column(name = "estado_convenio")
    private String estadoConvenio;

    @Column(name = "costo_enlace")
    private String costoEnlace;

    @Column(name = "fecha_convenio_original")
    private String fechaConvenioOriginal;

    @Column(name = "fecha_convenio_inicio")
    private LocalDate fechaConvenioInicio;

    @Column(name = "fecha_convenio_referencia")
    private LocalDate fechaConvenioReferencia;

    @Column(name = "fecha_convenio_fin")
    private LocalDate fechaConvenioFin;

    @Column(name = "estado_fecha_convenio")
    private String estadoFechaConvenio;

    @Column(name = "fecha_inicial_pago")
    private LocalDate fechaInicialPago;

    @Column(name = "fecha_inicial_pago_original")
    private String fechaInicialPagoOriginal;

    @Column(name = "proveedor_enlace")
    private String proveedorEnlace;

    @Column(name = "responsable_pago")
    private String responsablePago;

    @Column(name = "fuente")
    private String fuente;

    @Column(name = "fecha_carga")
    private LocalDateTime fechaCarga;

    @PrePersist
    public void prePersist() {
        if (fuente == null || fuente.trim().isEmpty()) {
            fuente = "SISTEMA";
        }

        if (fechaCarga == null) {
            fechaCarga = LocalDateTime.now();
        }
    }
}