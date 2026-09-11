package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "analistas")
@Getter
@Setter
@NoArgsConstructor
public class Analista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_analista")
    private Integer idAnalista;

    @Column(name = "nombre_analista", nullable = false)
    private String nombreAnalista;

    @Column(name = "grupo_operativo")
    private String grupoOperativo;

    @Column(name = "area")
    private String area;

    @Column(name = "correo")
    private String correo;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    @Column(name = "cargo")
    private String cargo;
}