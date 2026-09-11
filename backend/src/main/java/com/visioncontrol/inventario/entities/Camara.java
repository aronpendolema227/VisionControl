package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "camaras")
@Getter
@Setter
@NoArgsConstructor
public class Camara {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_camara")
    private Integer idCamara;

    @Column(name = "id_punto_original",unique = true)
    private Integer idPuntoOriginal;

    @Column(name = "nombre_camara",nullable = false, length = 150)
    private String nombreCamara;

    @Column(columnDefinition = "TEXT")
    private String direccion;

    @Column(name = "usuario_alfanumerico")
    private String usuarioAlfanumerico;

    private Double latitud;

    private Double longitud;

    @Column(name = "direccion_ip",length = 45)
    private String direccionIp;

    @Column(name = "tipo_dispositivo")
    private String tipoDispositivo;

    @Column(name = "fecha_instalacion")
    private LocalDate fechaInstalacion;

    private Integer anio;

    @Column(name = "estado_actual")
    private String estadoActual;

    @Column(name = "a_quien_pertenece")
    private String aQuienPertenece;

    @Column(name = "cambio_de_camara")
    private String cambioDeCamara;

    @ManyToOne
    @JoinColumn(name = "id_analista")
    private Analista analista;

    @Column(columnDefinition = "TEXT")
    private String observaciones;

    @ManyToOne
    @JoinColumn(name = "id_canton")
    private Canton canton;

    @ManyToOne
    @JoinColumn(name = "id_modelo")
    private Modelo modelo;

    @ManyToOne
    @JoinColumn(name = "id_plataforma")
    private Plataforma plataforma;

    @ManyToOne
    @JoinColumn(name = "id_proveedor")
    private Proveedor proveedor;

    @ManyToOne
    @JoinColumn(name = "id_centro")
    private CentroOperativo centroOperativo;

    @ManyToOne
    @JoinColumn(name = "id_convenio")
    private Convenio convenio;

    @Column(name = "piloto_cnt")
    private String pilotoCnt;

    @Column(name = "ancho_banda")
    private String anchoBanda;

    @Column(name = "fecha_convenio_original")
    private String fechaConvenioOriginal;

    @Column(name = "fecha_convenio_inicio")
    private LocalDate fechaConvenioInicio;

    @Column(name = "fecha_convenio_fin")
    private LocalDate fechaConvenioFin;

    @Column(name = "estado_fecha_convenio")
    private String estadoFechaConvenio;

    @Column(name = "fecha_inicial_pago")
    private LocalDate fechaInicialPago;

    @Column(name = "proveedor_enlace")
    private String proveedorEnlace;

    @Column(name = "responsable_pago")
    private String responsablePago;

    @Column(name = "costo_enlace")
    private String costoEnlace;

    @Column(name = "conversor")
    private String conversor;

    @Column(name = "poste")
    private String poste;

    @Column(name = "brazo")
    private String brazo;

    @Column(name = "descripcion_dano", columnDefinition = "TEXT")
    private String descripcionDano;

    @Column(name = "tipo_dano_sin_servicio", columnDefinition = "TEXT")
    private String tipoDanoSinServicio;

    @Column(name = "tipo_falla_tecnica", columnDefinition = "TEXT")
    private String tipoFallaTecnica;

    @Column(name = "serie_camara")
    private String serieCamara;

    @Column(name = "marca_ups")
    private String marcaUps;

    @Column(name = "serie_ups")
    private String serieUps;

    @Column(name = "estado_ups")
    private String estadoUps;

    @Column(name = "abejas")
    private String abejas;

    @Column(name = "activo")
    private Boolean activo = true;

    @Column(name = "motivo_desactivacion", columnDefinition = "TEXT")
    private String motivoDesactivacion;

    @Column(name = "fecha_desactivacion")
    private LocalDateTime fechaDesactivacion;

    @Column(name = "usuario_desactivacion")
    private String usuarioDesactivacion;

    @Column(name = "rol_desactivacion")
    private String rolDesactivacion;

    @OneToOne(mappedBy = "camara", fetch = FetchType.LAZY)
    private DetalleConvenioCamara detalleConvenioCamara;

}