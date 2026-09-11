package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Convenio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ConvenioRepository extends JpaRepository<Convenio, Integer> {

    @Query(value = """
        SELECT
            COUNT(DISTINCT co.id_convenio) AS total_convenios,
            COUNT(DISTINCT d.id_camara) AS total_camaras_asociadas,
            COUNT(DISTINCT p.id_provincia) AS total_provincias_con_convenios
        FROM convenios co
        LEFT JOIN detalle_convenio_camara d
            ON d.id_convenio_estado = co.id_convenio
        LEFT JOIN camaras c
            ON c.id_camara = d.id_camara
        LEFT JOIN cantones ca
            ON ca.id_canton = c.id_canton
        LEFT JOIN provincias p
            ON p.id_provincia = ca.id_provincia
        """, nativeQuery = true)
    Object[] obtenerResumenConvenios();

    @Query(value = """
        SELECT
            co.id_convenio,
            co.nombre_convenio,

            COUNT(DISTINCT d.id_camara) AS total_camaras,
            COUNT(DISTINCT p.id_provincia) AS total_provincias,
            COUNT(DISTINCT ca.id_canton) AS total_cantones,

            CASE
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.fecha_convenio_original), '')) = 0 THEN 'Sin dato'
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.fecha_convenio_original), '')) = 1 THEN MAX(NULLIF(TRIM(d.fecha_convenio_original), ''))
                ELSE 'Varios'
            END AS fecha_convenio_original,

            CASE
                WHEN COUNT(DISTINCT d.fecha_convenio_inicio) = 0 THEN 'Sin dato'
                WHEN COUNT(DISTINCT d.fecha_convenio_inicio) = 1 THEN TO_CHAR(MAX(d.fecha_convenio_inicio), 'YYYY-MM-DD')
                ELSE 'Varios'
            END AS fecha_convenio_inicio,

            CASE
                WHEN COUNT(DISTINCT d.fecha_convenio_fin) = 0 THEN 'Sin dato'
                WHEN COUNT(DISTINCT d.fecha_convenio_fin) = 1 THEN TO_CHAR(MAX(d.fecha_convenio_fin), 'YYYY-MM-DD')
                ELSE 'Varios'
            END AS fecha_convenio_fin,

            CASE
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.estado_fecha_convenio), '')) = 0 THEN
                    CASE
                        WHEN COUNT(DISTINCT d.fecha_convenio_fin) = 0 THEN 'Sin dato'
                        WHEN COUNT(DISTINCT d.fecha_convenio_fin) = 1 AND MAX(d.fecha_convenio_fin) < CURRENT_DATE THEN 'Vencido'
                        WHEN COUNT(DISTINCT d.fecha_convenio_fin) = 1 AND MAX(d.fecha_convenio_fin) >= CURRENT_DATE THEN 'Vigente'
                        ELSE 'Varios'
                    END
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.estado_fecha_convenio), '')) = 1 THEN MAX(NULLIF(TRIM(d.estado_fecha_convenio), ''))
                ELSE 'Varios'
            END AS estado_fecha_convenio,

            CASE
                WHEN COUNT(DISTINCT d.fecha_inicial_pago) = 0 THEN 'Sin dato'
                WHEN COUNT(DISTINCT d.fecha_inicial_pago) = 1 THEN TO_CHAR(MAX(d.fecha_inicial_pago), 'YYYY-MM-DD')
                ELSE 'Varios'
            END AS fecha_inicial_pago,

            CASE
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.proveedor_enlace), '')) = 0 THEN 'Sin dato'
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.proveedor_enlace), '')) = 1 THEN MAX(NULLIF(TRIM(d.proveedor_enlace), ''))
                ELSE 'Varios'
            END AS proveedor_enlace,

            CASE
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.responsable_pago), '')) = 0 THEN 'Sin dato'
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.responsable_pago), '')) = 1 THEN MAX(NULLIF(TRIM(d.responsable_pago), ''))
                ELSE 'Varios'
            END AS responsable_pago,

            CASE
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.costo_enlace), '')) = 0 THEN 'Sin dato'
                WHEN COUNT(DISTINCT NULLIF(TRIM(d.costo_enlace), '')) = 1 THEN MAX(NULLIF(TRIM(d.costo_enlace), ''))
                ELSE 'Varios'
            END AS costo_enlace

        FROM convenios co
        LEFT JOIN detalle_convenio_camara d
            ON d.id_convenio_estado = co.id_convenio
        LEFT JOIN camaras c
            ON c.id_camara = d.id_camara
        LEFT JOIN cantones ca
            ON ca.id_canton = c.id_canton
        LEFT JOIN provincias p
            ON p.id_provincia = ca.id_provincia
        GROUP BY co.id_convenio, co.nombre_convenio
        ORDER BY co.id_convenio
        """, nativeQuery = true)
    List<Object[]> obtenerConsultaConvenios();
}