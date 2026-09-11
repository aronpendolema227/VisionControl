package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "historial_cambios_camara")
@Getter
@Setter
@NoArgsConstructor
public class HistorialCambioCamara {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cambio")
    private Integer idCambio;

    @ManyToOne
    @JoinColumn(name = "id_camara", nullable = false)
    private Camara camara;

    @ManyToOne
    @JoinColumn(name = "id_analista")
    private Analista analista;

    @Column(name = "fecha_cambio", nullable = false)
    private LocalDate fechaCambio;

    @Column(name = "tipo_cambio")
    private String tipoCambio;

    @Column(name = "motivo_cambio", columnDefinition = "TEXT")
    private String motivoCambio;

    @Column(name = "observacion_tecnica", columnDefinition = "TEXT")
    private String observacionTecnica;

    @Column(name = "nombre_camara_anterior")
    private String nombreCamaraAnterior;

    @Column(name = "nombre_camara_nueva")
    private String nombreCamaraNueva;

    @Column(name = "marca_anterior")
    private String marcaAnterior;

    @Column(name = "modelo_anterior")
    private String modeloAnterior;

    @Column(name = "marca_nueva")
    private String marcaNueva;

    @Column(name = "modelo_nuevo")
    private String modeloNuevo;

    @Column(name = "ip_anterior")
    private String ipAnterior;

    @Column(name = "ip_nueva")
    private String ipNueva;

    @Column(name = "estado_anterior")
    private String estadoAnterior;

    @Column(name = "estado_nuevo")
    private String estadoNuevo;

    @Column(name = "tipo_dano_sin_servicio_anterior", columnDefinition = "TEXT")
    private String tipoDanoSinServicioAnterior;

    @Column(name = "tipo_dano_sin_servicio_nuevo", columnDefinition = "TEXT")
    private String tipoDanoSinServicioNuevo;

    @Column(name = "tipo_falla_tecnica_anterior", columnDefinition = "TEXT")
    private String tipoFallaTecnicaAnterior;

    @Column(name = "tipo_falla_tecnica_nuevo", columnDefinition = "TEXT")
    private String tipoFallaTecnicaNuevo;

    @Column(name = "tipo_dispositivo_anterior")
    private String tipoDispositivoAnterior;

    @Column(name = "tipo_dispositivo_nuevo")
    private String tipoDispositivoNuevo;

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