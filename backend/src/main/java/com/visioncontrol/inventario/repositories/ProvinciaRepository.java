package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;



public interface ProvinciaRepository extends JpaRepository<Provincia, Integer> {
    @Query("SELECT COUNT(p) > 0 FROM Provincia p WHERE p.nombreProvincia = :nombre")
    boolean existsByNombreProvincia(@Param("nombre") String nombre);
}
