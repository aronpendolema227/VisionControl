package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Getter
@Setter
@NoArgsConstructor
public class Notificacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notificacion")
    private Long idNotificacion;

    @Column(nullable = false, unique = true, length = 80)
    private String tipo;

    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String mensaje;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "accion_texto", length = 120)
    private String accionTexto;

    @Column(length = 80)
    private String prioridad;

    @Column(length = 50)
    private String etiqueta;

    @Column(length = 120)
    private String ruta;

    @Column(name = "state_json", columnDefinition = "TEXT")
    private String stateJson;

    @Column(name = "roles_destino", nullable = false, columnDefinition = "TEXT")
    private String rolesDestino;

    @Column(name = "conteo_actual", nullable = false)
    private Integer conteoActual = 0;

    @Column(name = "lectura_id", nullable = false, length = 120)
    private String lecturaId;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();

    @Column(name = "fecha_actualizacion", nullable = false)
    private LocalDateTime fechaActualizacion = LocalDateTime.now();

    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }

        if (fechaActualizacion == null) {
            fechaActualizacion = LocalDateTime.now();
        }

        if (activa == null) {
            activa = true;
        }

        if (conteoActual == null) {
            conteoActual = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        fechaActualizacion = LocalDateTime.now();
    }
}