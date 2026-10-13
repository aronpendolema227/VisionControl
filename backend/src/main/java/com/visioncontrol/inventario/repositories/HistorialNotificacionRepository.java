package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.HistorialNotificacion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HistorialNotificacionRepository extends JpaRepository<HistorialNotificacion, Long> {

    Page<HistorialNotificacion> findAllByOrderByFechaHoraDesc(Pageable pageable);

    Page<HistorialNotificacion> findByTipoOrderByFechaHoraDesc(String tipo, Pageable pageable);
}