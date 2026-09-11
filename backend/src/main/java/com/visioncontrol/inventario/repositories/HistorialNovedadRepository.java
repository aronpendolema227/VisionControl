package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.HistorialNovedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HistorialNovedadRepository extends JpaRepository<HistorialNovedad, Integer> {

    Page<HistorialNovedad> findAllByOrderByFechaRevisionDescIdNovedadDesc(Pageable pageable);

    @Query(
        value = """
                SELECT h.*
                FROM historial_novedades h
                LEFT JOIN camaras c ON c.id_camara = h.id_camara
                LEFT JOIN analistas a ON a.id_analista = h.id_analista
                WHERE (
                    CAST(h.id_novedad AS TEXT) ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR CAST(h.id_camara AS TEXT) ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR CAST(c.id_punto_original AS TEXT) ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(c.nombre_camara, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.estado_operativo, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.ticket_glpi, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.observaciones, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.novedades, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.presenta_dano, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.descripcion_dano, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.seguimiento_detalle, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(a.nombre_completo, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(h.fecha_revision, 'YYYY-MM-DD'), '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(h.fecha_revision, 'DD/MM/YYYY'), '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(h.fecha_seguimiento, 'YYYY-MM-DD'), '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(h.fecha_solucion, 'YYYY-MM-DD'), '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR (
                        CASE
                            WHEN h.resuelto_glpi IS TRUE THEN 'SI'
                            WHEN h.resuelto_glpi IS FALSE THEN 'NO'
                            ELSE 'SIN DATO'
                        END
                    ) ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                )
                ORDER BY h.fecha_revision DESC NULLS LAST, h.id_novedad DESC
                """,
        countQuery = """
                SELECT COUNT(*)
                FROM historial_novedades h
                LEFT JOIN camaras c ON c.id_camara = h.id_camara
                LEFT JOIN analistas a ON a.id_analista = h.id_analista
                WHERE (
                    CAST(h.id_novedad AS TEXT) ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR CAST(h.id_camara AS TEXT) ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR CAST(c.id_punto_original AS TEXT) ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(c.nombre_camara, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.estado_operativo, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.ticket_glpi, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.observaciones, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.novedades, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.presenta_dano, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.descripcion_dano, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(h.seguimiento_detalle, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(a.nombre_completo, '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(h.fecha_revision, 'YYYY-MM-DD'), '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(h.fecha_revision, 'DD/MM/YYYY'), '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(h.fecha_seguimiento, 'YYYY-MM-DD'), '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR COALESCE(TO_CHAR(h.fecha_solucion, 'YYYY-MM-DD'), '') ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                    OR (
                        CASE
                            WHEN h.resuelto_glpi IS TRUE THEN 'SI'
                            WHEN h.resuelto_glpi IS FALSE THEN 'NO'
                            ELSE 'SIN DATO'
                        END
                    ) ILIKE CONCAT('%', TRIM(CAST(:busqueda AS TEXT)), '%')
                )
                """,
        nativeQuery = true
    )
    Page<HistorialNovedad> buscarHistorialOperacionesGeneral(
            @Param("busqueda") String busqueda,
            Pageable pageable
    );

    @Query("""
        SELECT COUNT(h)
        FROM HistorialNovedad h
        WHERE h.ticketGlpi IS NOT NULL
        AND TRIM(h.ticketGlpi) <> ''
        AND (h.resueltoGlpi = false OR h.resueltoGlpi IS NULL)
        """)
    Long contarGlpiActivos();

    @Query("""
        SELECT COUNT(h)
        FROM HistorialNovedad h
        WHERE (h.resueltoGlpi = false OR h.resueltoGlpi IS NULL)
        AND (
                LOWER(COALESCE(h.novedades, '')) LIKE '%conect%'
                OR LOWER(COALESCE(h.descripcionDano, '')) LIKE '%conect%'
                OR LOWER(COALESCE(h.observaciones, '')) LIKE '%conect%'
        )
        """)
    Long contarNovedadesConectividad();

    @Query("""
        SELECT COUNT(h)
        FROM HistorialNovedad h
        WHERE (h.resueltoGlpi = false OR h.resueltoGlpi IS NULL)
        AND (
                LOWER(COALESCE(h.novedades, '')) LIKE '%manten%'
                OR LOWER(COALESCE(h.descripcionDano, '')) LIKE '%manten%'
                OR LOWER(COALESCE(h.observaciones, '')) LIKE '%manten%'
                OR LOWER(COALESCE(h.presentaDano, '')) IN ('si', 'sí', 'true')
        )
        """)
    Long contarNovedadesMantenimiento();

    @Query(value = """
        SELECT fecha_revision, COUNT(*)
        FROM historial_novedades
        WHERE fecha_revision >= CURRENT_DATE - INTERVAL '6 days'
        AND ticket_glpi IS NOT NULL
        AND TRIM(ticket_glpi) <> ''
        GROUP BY fecha_revision
        ORDER BY fecha_revision
        """, nativeQuery = true)
    List<Object[]> contarTicketsUltimos7Dias();

    @Query(value = """
        WITH ultimo_reporte AS (
            SELECT DISTINCT ON (h.id_camara)
                h.id_camara,
                TO_CHAR(h.fecha_revision, 'YYYY-MM-DD') AS fecha_revision,
                h.estado_operativo,
                h.ticket_glpi,
                h.observaciones,
                h.novedades,
                h.presenta_dano,
                h.descripcion_dano,
                TO_CHAR(h.fecha_seguimiento, 'YYYY-MM-DD') AS fecha_seguimiento,
                h.seguimiento_detalle,
                CASE
                    WHEN h.resuelto_glpi IS TRUE THEN 'SI'
                    WHEN h.resuelto_glpi IS FALSE THEN 'NO'
                    ELSE ''
                END AS resuelto_glpi,
                TO_CHAR(h.fecha_solucion, 'YYYY-MM-DD') AS fecha_solucion,
                COALESCE(a.nombre_completo, '') AS nombre_analista
            FROM historial_novedades h
            LEFT JOIN analistas a ON a.id_analista = h.id_analista
            WHERE h.id_camara IN (:idsCamaras)
            ORDER BY h.id_camara, h.fecha_revision DESC NULLS LAST, h.id_novedad DESC
        )
        SELECT *
        FROM ultimo_reporte
        """, nativeQuery = true)
    List<Object[]> buscarUltimosReportesPorCamaras(
            @Param("idsCamaras") List<Integer> idsCamaras
    );
}
