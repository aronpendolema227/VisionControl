package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.HistorialTecnicoCamara;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HistorialTecnicoCamaraRepository
        extends JpaRepository<HistorialTecnicoCamara, Integer> {
            Page<HistorialTecnicoCamara> findAllByOrderByFechaIntervencionDescIdTecnicoDesc(Pageable pageable);

    List<HistorialTecnicoCamara> findByCamaraIdCamaraOrderByFechaIntervencionDesc(
            Integer idCamara
    );
} 