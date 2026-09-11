package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Canton;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CantonRepository extends JpaRepository<Canton, Integer> {

    @Query("SELECT COUNT(c) > 0 FROM Canton c WHERE c.nombreCanton = :nombre")
    boolean existsByNombreCanton(@Param("nombre") String nombre);

    @Query("SELECT c FROM Canton c WHERE c.provincia.idProvincia = :idProvincia ORDER BY c.nombreCanton ASC")
    List<Canton> findByProvinciaId(@Param("idProvincia") Integer idProvincia);
}