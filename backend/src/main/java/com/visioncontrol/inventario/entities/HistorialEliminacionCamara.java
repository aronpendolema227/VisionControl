package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_eliminacion_camara")
@Getter
@Setter
@NoArgsConstructor
public class HistorialEliminacionCamara {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_eliminacion")
    private Integer idEliminacion;

    @ManyToOne
    @JoinColumn(name = "id_camara", nullable = false)
    private Camara camara;

    @ManyToOne
    @JoinColumn(name = "id_analista")
    private Analista analista;

    @Column(name = "id_punto_original")
    private Integer idPuntoOriginal;

    @Column(name = "nombre_camara")
    private String nombreCamara;

    @Column(name = "estado_anterior")
    private String estadoAnterior;

    @Column(name = "motivo", columnDefinition = "TEXT", nullable = false)
    private String motivo;

    @Column(name = "usuario_registro")
    private String usuarioRegistro;

    @Column(name = "rol_registro")
    private String rolRegistro;

    @Column(name = "fecha_eliminacion")
    private LocalDateTime fechaEliminacion;

    @PrePersist
    public void prePersist() {
        if (fechaEliminacion == null) {
            fechaEliminacion = LocalDateTime.now();
        }
    }
}