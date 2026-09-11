package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Auditoria;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AuditoriaRepository extends JpaRepository<Auditoria, Integer> {

    List<Auditoria> findTop10ByOrderByFechaHoraDesc();
    List<Auditoria> findAllByOrderByFechaHoraDesc();
    Page<Auditoria> findAllByOrderByFechaHoraDesc(Pageable pageable);
    @Query(
        value = """
                SELECT a.*
                FROM auditorias a
                LEFT JOIN usuarios u
                    ON LOWER(TRIM(u.username)) = LOWER(TRIM(a.username))
                LEFT JOIN analistas an
                    ON an.id_analista = u.id_analista
                WHERE (
                    CAST(a.id_auditoria AS TEXT) LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR CAST(a.id_registro AS TEXT) LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR UPPER(TRIM(COALESCE(a.username, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(a.rol, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(a.accion, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(a.entidad, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(a.detalle, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(u.nombre_completo, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(u.correo, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(an.nombre_analista, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(an.grupo_operativo, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR COALESCE(TO_CHAR(a.fecha_hora, 'YYYY-MM-DD'), '') LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(a.fecha_hora, 'DD/MM/YYYY'), '') LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(a.fecha_hora, 'HH24:MI'), '') LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                )
                ORDER BY a.fecha_hora DESC
                """,
        countQuery = """
                SELECT COUNT(*)
                FROM auditorias a
                LEFT JOIN usuarios u
                    ON LOWER(TRIM(u.username)) = LOWER(TRIM(a.username))
                LEFT JOIN analistas an
                    ON an.id_analista = u.id_analista
                WHERE (
                    CAST(a.id_auditoria AS TEXT) LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR CAST(a.id_registro AS TEXT) LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR UPPER(TRIM(COALESCE(a.username, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(a.rol, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(a.accion, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(a.entidad, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(a.detalle, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(u.nombre_completo, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(u.correo, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(an.nombre_analista, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR UPPER(TRIM(COALESCE(an.grupo_operativo, ''))) LIKE UPPER(CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%'))
                    OR COALESCE(TO_CHAR(a.fecha_hora, 'YYYY-MM-DD'), '') LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(a.fecha_hora, 'DD/MM/YYYY'), '') LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(a.fecha_hora, 'HH24:MI'), '') LIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                )
                """,
        nativeQuery = true
    )
    Page<Auditoria> buscarAuditoriasGeneral(
            @Param("busqueda") String busqueda,
            Pageable pageable
    );

}