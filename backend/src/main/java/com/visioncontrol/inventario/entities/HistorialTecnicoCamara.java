package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_tecnico_camara")
@Getter
@Setter
@NoArgsConstructor
public class HistorialTecnicoCamara {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_tecnico")
    private Integer idTecnico;

    @ManyToOne
    @JoinColumn(name = "id_camara", nullable = false)
    private Camara camara;

    @ManyToOne
    @JoinColumn(name = "id_analista")
    private Analista analista;

    @Column(name = "fecha_intervencion", nullable = false)
    private LocalDate fechaIntervencion;

    @Column(name = "tipo_intervencion")
    private String tipoIntervencion;

    @Column(name = "estado_anterior")
    private String estadoAnterior;

    @Column(name = "estado_nuevo")
    private String estadoNuevo;

    @Column(name = "ticket_glpi")
    private String ticketGlpi;

    @Column(name = "descripcion_tecnica", columnDefinition = "TEXT")
    private String descripcionTecnica;

    @Column(name = "diagnostico", columnDefinition = "TEXT")
    private String diagnostico;

    @Column(name = "accion_realizada", columnDefinition = "TEXT")
    private String accionRealizada;

    @Column(name = "resultado", columnDefinition = "TEXT")
    private String resultado;

    @Column(name = "fecha_seguimiento")
    private LocalDate fechaSeguimiento;

    @Column(name = "observacion_seguimiento", columnDefinition = "TEXT")
    private String observacionSeguimiento;

    @Column(name = "resuelto_glpi")
    private Boolean resueltoGlpi;

    @Column(name = "usuario_registro")
    private String usuarioRegistro;

    @Column(name = "rol_registro")
    private String rolRegistro;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @PrePersist
    public void prePersist() {
        if (fechaRegistro == null) {
            fechaRegistro = LocalDateTime.now();
        }
    }
}