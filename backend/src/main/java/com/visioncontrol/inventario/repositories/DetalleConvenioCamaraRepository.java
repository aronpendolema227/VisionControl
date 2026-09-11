package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.DetalleConvenioCamara;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DetalleConvenioCamaraRepository extends JpaRepository<DetalleConvenioCamara, Integer> {

    Optional<DetalleConvenioCamara> findByCamara_IdCamara(Integer idCamara);

    List<DetalleConvenioCamara> findByCamara_IdCamaraIn(List<Integer> idsCamaras);

    @Query("""
        SELECT DISTINCT d.fechaConvenioInicio
        FROM DetalleConvenioCamara d
        WHERE d.fechaConvenioInicio IS NOT NULL
        ORDER BY d.fechaConvenioInicio ASC
        """)
    List<LocalDate> listarFechasInicioConvenioDisponibles();
}