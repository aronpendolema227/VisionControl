package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "historial_novedades")
@Getter
@Setter
@NoArgsConstructor
public class HistorialNovedad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_novedad")
    private Integer idNovedad;

    @Column(name = "fecha_revision")
    private LocalDate fechaRevision;

    @Column(name = "estado_operativo")
    private String estadoOperativo;

    @Column(name = "ticket_glpi")
    private String ticketGlpi;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @Column(columnDefinition = "TEXT")
    private String novedades;

    @Column(name = "presenta_dano")
    private String presentaDano;

    @Column(name = "descripcion_dano",columnDefinition = "TEXT")
    private String descripcionDano;

    @Column(name = "fecha_seguimiento")
    private LocalDate fechaSeguimiento;

    @Column(name = "seguimiento_detalle",columnDefinition = "TEXT")
    private String seguimientoDetalle;

    @Column(name = "resuelto_glpi")
    private Boolean resueltoGlpi;

    @Column(name = "fecha_solucion")
    private LocalDate fechaSolucion;

    @ManyToOne
    @JoinColumn(name = "id_camara")
    private Camara camara;

    @ManyToOne
    @JoinColumn(name = "id_analista")
    private Analista analista;
}