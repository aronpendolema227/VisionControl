package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.HistorialNotificacion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HistorialNotificacionRepository extends JpaRepository<HistorialNotificacion, Long> {

    List<HistorialNotificacion> findTop20ByOrderByFechaHoraDesc();

    List<HistorialNotificacion> findByTipoOrderByFechaHoraDesc(String tipo);
}