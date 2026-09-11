package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "centros_operativos")
@Getter
@Setter
@NoArgsConstructor
public class CentroOperativo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_centro")
    private Integer idCentro;

    @Column(name =  "nombre_centro",nullable = false, unique = true)
    private String nombreCentro;

    private String pais;
    
    @Column(name = "co_latitud")
    private Double coLatitud;

    @Column(name = "co_longitud")
    private Double coLongitud;

    @Column(name =  "ubicacion_geo",columnDefinition = "TEXT")
    private String ubicacionGeo;
}