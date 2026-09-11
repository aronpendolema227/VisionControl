package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.HistorialCambioCamara;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HistorialCambioCamaraRepository extends JpaRepository<HistorialCambioCamara, Integer> {
    Page<HistorialCambioCamara> findAllByOrderByFechaCambioDescIdCambioDesc(Pageable pageable);

    List<HistorialCambioCamara> findByCamaraIdCamaraOrderByFechaCambioDesc(Integer idCamara);
}