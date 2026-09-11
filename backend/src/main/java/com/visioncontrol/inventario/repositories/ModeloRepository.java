package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Modelo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ModeloRepository extends JpaRepository<Modelo, Integer> {
    @Query("SELECT COUNT(m) > 0 FROM Modelo m WHERE m.nombreModelo = :nombre")
    boolean existsByNombreModelo(@Param("nombre") String nombre);

    @Query("SELECT m FROM Modelo m WHERE m.marca.idMarca = :idMarca ORDER BY m.nombreModelo ASC")
    List<Modelo> findByMarcaId(@Param("idMarca") Integer idMarca);

}