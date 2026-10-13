package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_notificaciones")
@Getter
@Setter
@NoArgsConstructor
public class HistorialNotificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_historial_notificacion")
    private Long idHistorialNotificacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_notificacion")
    private Notificacion notificacion;

    @Column(nullable = false, length = 80)
    private String tipo;

    @Column(nullable = false, length = 50)
    private String evento;

    @Column(length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String mensaje;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "conteo_anterior")
    private Integer conteoAnterior;

    @Column(name = "conteo_nuevo")
    private Integer conteoNuevo;

    @Column(name = "activa_anterior")
    private Boolean activaAnterior;

    @Column(name = "activa_nueva")
    private Boolean activaNueva;

    @Column(columnDefinition = "TEXT")
    private String observacion;

    @Column(name = "fecha_hora", nullable = false)
    private LocalDateTime fechaHora = LocalDateTime.now();

    @PrePersist
    public void prePersist() {
        if (fechaHora == null) {
            fechaHora = LocalDateTime.now();
        }
    }
}