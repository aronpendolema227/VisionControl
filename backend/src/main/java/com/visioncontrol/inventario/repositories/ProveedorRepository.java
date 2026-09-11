package com.visioncontrol.inventario.repositories;


import com.visioncontrol.inventario.entities.Proveedor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProveedorRepository extends JpaRepository<Proveedor, Integer> {
    @Query("SELECT COUNT(p) > 0 FROM Proveedor p WHERE p.nombreProveedor = :nombre")
    boolean existsByNombreProveedor(@Param("nombre") String nombre);

}
