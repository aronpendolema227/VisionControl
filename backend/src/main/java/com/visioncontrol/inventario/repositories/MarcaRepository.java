package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MarcaRepository extends JpaRepository<Marca, Integer> {
    @Query("SELECT COUNT(m) > 0 FROM Marca m WHERE m.nombreMarca = :nombre")
    boolean existsByNombreMarca(@Param("nombre") String nombre);
}
