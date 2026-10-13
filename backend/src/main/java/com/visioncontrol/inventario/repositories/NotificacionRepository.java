package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {

    Optional<Notificacion> findByTipo(String tipo);

    @Query("""
        SELECT n
        FROM Notificacion n
        WHERE n.activa = true
        AND n.rolesDestino LIKE CONCAT('%|', :rol, '|%')
        ORDER BY n.fechaActualizacion DESC
    """)
    List<Notificacion> listarActivasPorRol(@Param("rol") String rol);
}