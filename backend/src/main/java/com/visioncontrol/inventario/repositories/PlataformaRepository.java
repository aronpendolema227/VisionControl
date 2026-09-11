package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Plataforma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PlataformaRepository extends JpaRepository<Plataforma, Integer> {
    @Query("SELECT COUNT(p) > 0 FROM Plataforma p WHERE p.nombrePlataforma = :nombre")
    boolean existsByNombrePlataforma(@Param("nombre") String nombre);

}
