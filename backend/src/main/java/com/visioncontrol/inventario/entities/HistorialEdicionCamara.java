package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "historial_edicion_camara")
@Getter
@Setter
@NoArgsConstructor
public class HistorialEdicionCamara {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_edicion")
    private Integer idEdicion;

    @ManyToOne
    @JoinColumn(name = "id_camara", nullable = false)
    private Camara camara;

    @ManyToOne
    @JoinColumn(name = "id_analista")
    private Analista analista;

    @Column(name = "campo_modificado", nullable = false)
    private String campoModificado;

    @Column(name = "valor_anterior", columnDefinition = "TEXT")
    private String valorAnterior;

    @Column(name = "valor_nuevo", columnDefinition = "TEXT")
    private String valorNuevo;

    @Column(name = "detalle", columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "usuario_registro")
    private String usuarioRegistro;

    @Column(name = "rol_registro")
    private String rolRegistro;

    @Column(name = "fecha_edicion")
    private LocalDateTime fechaEdicion;

    @PrePersist
    public void prePersist() {
        if (fechaEdicion == null) {
            fechaEdicion = LocalDateTime.now();
        }
    }
}