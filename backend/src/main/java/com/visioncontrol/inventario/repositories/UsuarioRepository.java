package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {

    Optional<Usuario> findByUsername(String username);

    Optional<Usuario> findByUsernameIgnoreCase(String username);

    boolean existsByUsername(String username);

    boolean existsByCorreo(String correo);
}