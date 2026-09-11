package com.visioncontrol.inventario.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "auditorias")
@Getter
@Setter
@NoArgsConstructor
public class Auditoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_auditoria")
    private Integer idAuditoria;

    private String username;

    private String rol;

    private String accion;

    private String entidad;

    @Column(name = "id_registro")
    private Integer idRegistro;

    @Column(columnDefinition = "TEXT")
    private String detalle;

    @Column(name = "fecha_hora")
    private LocalDateTime fechaHora = LocalDateTime.now();
}