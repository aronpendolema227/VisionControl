package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.HistorialEliminacionCamara;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HistorialEliminacionCamaraRepository
        extends JpaRepository<HistorialEliminacionCamara, Integer> {
            Page<HistorialEliminacionCamara> findAllByOrderByFechaEliminacionDescIdEliminacionDesc(Pageable pageable);

    List<HistorialEliminacionCamara> findByCamaraIdCamaraOrderByFechaEliminacionDesc(
            Integer idCamara
    );
} 