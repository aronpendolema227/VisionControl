package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "plataformas")
@Getter
@Setter
@NoArgsConstructor
public class Plataforma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_plataforma")
    private Integer idPlataforma;

    @Column(name = "nombre_plataforma",nullable = false, unique = true)
    private String nombrePlataforma;
}
