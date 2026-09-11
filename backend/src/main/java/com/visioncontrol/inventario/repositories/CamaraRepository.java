package com.visioncontrol.inventario.repositories;

import com.visioncontrol.inventario.entities.Camara;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;


public interface CamaraRepository extends JpaRepository<Camara, Integer>, JpaSpecificationExecutor<Camara> {

    @Query("SELECT c FROM Camara c WHERE c.estadoActual = :estado")
    List<Camara> findByEstadoCamara(@Param("estado") String estado);

    @Query("SELECT c FROM Camara c WHERE c.canton.idCanton = :idCanton")
    List<Camara> findByCantonId(@Param("idCanton") Integer idCanton);

    @Query("SELECT c FROM Camara c WHERE c.proveedor.idProveedor = :idProveedor")
    List<Camara> findByProveedorId(@Param("idProveedor") Integer idProveedor);

    @Query("SELECT c FROM Camara c WHERE c.plataforma.idPlataforma = :idPlataforma")
    List<Camara> findByPlataformaId(@Param("idPlataforma") Integer idPlataforma);

    @Query("""
        SELECT COUNT(c)
        FROM Camara c
        WHERE c.activo IS NULL OR c.activo = true
        """)
    Long contarTotalCamaras();

    @Query("""
        SELECT COUNT(c)
        FROM Camara c
        WHERE (c.activo IS NULL OR c.activo = true)
        AND UPPER(TRIM(c.estadoActual)) = UPPER(TRIM(:estado))
        """)
    Long contarPorEstado(@Param("estado") String estado);

    @Query("""
        SELECT COUNT(c)
        FROM Camara c
        WHERE (c.activo IS NULL OR c.activo = true)
        AND UPPER(TRIM(c.estadoActual)) <> UPPER(TRIM(:estado))
        """)
    Long contarDiferentesDeEstado(@Param("estado") String estado);

    @Query(value = """
        SELECT
            COALESCE(ca.nombre_canton, 'SIN CANTÓN') AS canton,
            SUM(CASE WHEN UPPER(TRIM(c.estado_actual)) = 'OPERATIVA' THEN 1 ELSE 0 END) AS operativas,
            SUM(CASE WHEN UPPER(TRIM(c.estado_actual)) <> 'OPERATIVA'
                        OR c.estado_actual IS NULL THEN 1 ELSE 0 END) AS caidas,
            ROUND(
                (
                    SUM(CASE WHEN UPPER(TRIM(c.estado_actual)) = 'OPERATIVA' THEN 1 ELSE 0 END)::numeric
                    / NULLIF(COUNT(c.id_camara), 0)
                ) * 100,
                1
            ) AS porcentaje
        FROM camaras c
        LEFT JOIN cantones ca ON ca.id_canton = c.id_canton
        WHERE (c.activo IS NULL OR c.activo = true)
        GROUP BY ca.nombre_canton
        HAVING COUNT(c.id_camara) >= 10
        ORDER BY COUNT(c.id_camara) DESC, caidas DESC
        LIMIT 14
        """, nativeQuery = true)
    List<Object[]> obtenerRendimientoPorCanton();

    @Query(
    value = """
        SELECT DISTINCT c.*
        FROM camaras c
        LEFT JOIN cantones ca ON ca.id_canton = c.id_canton
        LEFT JOIN provincias p ON p.id_provincia = ca.id_provincia
        LEFT JOIN plataformas pl ON pl.id_plataforma = c.id_plataforma
        LEFT JOIN modelos mo ON mo.id_modelo = c.id_modelo
        LEFT JOIN marcas ma ON ma.id_marca = mo.id_marca
        LEFT JOIN convenios co ON co.id_convenio = c.id_convenio
        LEFT JOIN historial_novedades h ON h.id_camara = c.id_camara
        WHERE (
            :busqueda IS NULL
            OR TRIM(:busqueda) = ''
            OR CAST(c.id_camara AS TEXT) ILIKE CONCAT('%', :busqueda, '%')
            OR CAST(c.id_punto_original AS TEXT) ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.nombre_camara, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.direccion_ip, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.direccion, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.estado_actual, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.usuario_alfanumerico, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.piloto_cnt, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.ancho_banda, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(ca.nombre_canton, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(p.nombre_provincia, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(pl.nombre_plataforma, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(ma.nombre_marca, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(mo.nombre_modelo, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(co.nombre_convenio, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(h.ticket_glpi, '') ILIKE CONCAT('%', :busqueda, '%')
        )
        ORDER BY c.id_punto_original ASC
            """,
        countQuery = """
            SELECT COUNT(DISTINCT c.id_camara)
            FROM camaras c
            LEFT JOIN cantones ca ON ca.id_canton = c.id_canton
            LEFT JOIN provincias p ON p.id_provincia = ca.id_provincia
            LEFT JOIN plataformas pl ON pl.id_plataforma = c.id_plataforma
            LEFT JOIN modelos mo ON mo.id_modelo = c.id_modelo
            LEFT JOIN marcas ma ON ma.id_marca = mo.id_marca
            LEFT JOIN convenios co ON co.id_convenio = c.id_convenio
            LEFT JOIN historial_novedades h ON h.id_camara = c.id_camara
            WHERE (
                :busqueda IS NULL
                OR TRIM(:busqueda) = ''
                OR CAST(c.id_camara AS TEXT) ILIKE CONCAT('%', :busqueda, '%')
                OR CAST(c.id_punto_original AS TEXT) ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(c.nombre_camara, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(c.direccion_ip, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(c.direccion, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(c.estado_actual, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(c.usuario_alfanumerico, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(c.piloto_cnt, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(c.ancho_banda, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(ca.nombre_canton, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(p.nombre_provincia, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(pl.nombre_plataforma, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(ma.nombre_marca, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(mo.nombre_modelo, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(co.nombre_convenio, '') ILIKE CONCAT('%', :busqueda, '%')
                OR COALESCE(h.ticket_glpi, '') ILIKE CONCAT('%', :busqueda, '%')
            )
            """,
        nativeQuery = true
    )
    Page<Camara> buscarCamarasParaCambio(
            @Param("busqueda") String busqueda,
            Pageable pageable
    );

    boolean existsByIdPuntoOriginal(Integer idPuntoOriginal);

    @Query("""
        SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
        FROM Camara c
        WHERE UPPER(TRIM(c.nombreCamara)) = UPPER(TRIM(:nombreCamara))
        """)
    boolean existsByNombreCamaraLimpio(@Param("nombreCamara") String nombreCamara);

    @Query("""
        SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
        FROM Camara c
        WHERE c.direccionIp IS NOT NULL
        AND TRIM(c.direccionIp) <> ''
        AND UPPER(TRIM(c.direccionIp)) = UPPER(TRIM(:direccionIp))
        """)
    boolean existsByDireccionIpLimpia(@Param("direccionIp") String direccionIp);

    @Query("""
        SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
        FROM Camara c
        WHERE c.idPuntoOriginal = :idPuntoOriginal
        AND c.idCamara <> :idCamaraExcluir
        """)
    boolean existsByIdPuntoOriginalExcluyendoId(
            @Param("idPuntoOriginal") Integer idPuntoOriginal,
            @Param("idCamaraExcluir") Integer idCamaraExcluir
    );

    @Query("""
        SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
        FROM Camara c
        WHERE UPPER(TRIM(c.nombreCamara)) = UPPER(TRIM(:nombreCamara))
        AND c.idCamara <> :idCamaraExcluir
        """)
    boolean existsByNombreCamaraLimpioExcluyendoId(
            @Param("nombreCamara") String nombreCamara,
            @Param("idCamaraExcluir") Integer idCamaraExcluir
    );

    @Query("""
        SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END
        FROM Camara c
        WHERE c.direccionIp IS NOT NULL
        AND TRIM(c.direccionIp) <> ''
        AND UPPER(TRIM(c.direccionIp)) = UPPER(TRIM(:direccionIp))
        AND c.idCamara <> :idCamaraExcluir
        """)
    boolean existsByDireccionIpLimpiaExcluyendoId(
            @Param("direccionIp") String direccionIp,
            @Param("idCamaraExcluir") Integer idCamaraExcluir
    );

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
                a.nombre_completo AS nombre_analista
            FROM historial_novedades h
            LEFT JOIN analistas a ON a.id_analista = h.id_analista
            ORDER BY h.id_camara, h.fecha_revision DESC NULLS LAST, h.id_novedad DESC
        )
        SELECT
            c.id_punto_original,
            c.nombre_camara,
            COALESCE(p.nombre_provincia, ''),
            COALESCE(ca.nombre_canton, ''),
            COALESCE(c.direccion, ''),
            COALESCE(c.usuario_alfanumerico, ''),
            c.latitud,
            c.longitud,
            COALESCE(ma.nombre_marca, ''),
            COALESCE(mo.nombre_modelo, ''),
            COALESCE(pl.nombre_plataforma, ''),
            COALESCE(c.tipo_dispositivo, ''),
            COALESCE(c.direccion_ip, ''),
            COALESCE(c.estado_actual, ''),
            COALESCE(c.a_quien_pertenece, ''),
            COALESCE(c.piloto_cnt, ''),
            COALESCE(c.ancho_banda, ''),
            TO_CHAR(c.fecha_instalacion, 'YYYY-MM-DD'),
            c.anio,
            COALESCE(c.cambio_de_camara, ''),
            COALESCE(c.observaciones, ''),

            COALESCE(d.estado_convenio, co.nombre_convenio, ''),
            COALESCE(d.costo_enlace, ''),
            COALESCE(d.fecha_convenio_original, ''),
            TO_CHAR(d.fecha_convenio_inicio, 'YYYY-MM-DD'),
            TO_CHAR(d.fecha_convenio_referencia, 'YYYY-MM-DD'),
            TO_CHAR(d.fecha_convenio_fin, 'YYYY-MM-DD'),
            COALESCE(d.estado_fecha_convenio, ''),
            TO_CHAR(d.fecha_inicial_pago, 'YYYY-MM-DD'),
            COALESCE(d.fecha_inicial_pago_original, ''),
            COALESCE(d.proveedor_enlace, ''),
            COALESCE(d.responsable_pago, ''),

            COALESCE(ur.fecha_revision, ''),
            COALESCE(ur.estado_operativo, ''),
            COALESCE(ur.ticket_glpi, ''),
            COALESCE(ur.observaciones, ''),
            COALESCE(ur.novedades, ''),
            COALESCE(ur.presenta_dano, ''),
            COALESCE(ur.descripcion_dano, ''),
            COALESCE(ur.fecha_seguimiento, ''),
            COALESCE(ur.seguimiento_detalle, ''),
            COALESCE(ur.resuelto_glpi, ''),
            COALESCE(ur.fecha_solucion, ''),
            COALESCE(ur.nombre_analista, '')

        FROM camaras c
        LEFT JOIN cantones ca ON ca.id_canton = c.id_canton
        LEFT JOIN provincias p ON p.id_provincia = ca.id_provincia
        LEFT JOIN plataformas pl ON pl.id_plataforma = c.id_plataforma
        LEFT JOIN modelos mo ON mo.id_modelo = c.id_modelo
        LEFT JOIN marcas ma ON ma.id_marca = mo.id_marca
        LEFT JOIN convenios co ON co.id_convenio = c.id_convenio
        LEFT JOIN detalle_convenio_camara d ON d.id_camara = c.id_camara
        LEFT JOIN ultimo_reporte ur ON ur.id_camara = c.id_camara

        WHERE (c.activo IS NULL OR c.activo = true)

        AND (
            :busqueda IS NULL
            OR TRIM(:busqueda) = ''
            OR CAST(c.id_camara AS TEXT) ILIKE CONCAT('%', :busqueda, '%')
            OR CAST(c.id_punto_original AS TEXT) ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.nombre_camara, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.direccion_ip, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.direccion, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(c.estado_actual, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(ca.nombre_canton, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(p.nombre_provincia, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(pl.nombre_plataforma, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(ma.nombre_marca, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(mo.nombre_modelo, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(co.nombre_convenio, '') ILIKE CONCAT('%', :busqueda, '%')
            OR COALESCE(ur.ticket_glpi, '') ILIKE CONCAT('%', :busqueda, '%')
        )

        AND (:idProvincia IS NULL OR p.id_provincia = :idProvincia)
        AND (:idCanton IS NULL OR ca.id_canton = :idCanton)
        AND (:estado IS NULL OR TRIM(:estado) = '' OR UPPER(c.estado_actual) = UPPER(:estado))
        AND (:plataforma IS NULL OR TRIM(:plataforma) = '' OR UPPER(pl.nombre_plataforma) = UPPER(:plataforma))
        AND (:convenio IS NULL OR TRIM(:convenio) = '' OR UPPER(co.nombre_convenio) = UPPER(:convenio))
        AND (:idMarca IS NULL OR ma.id_marca = :idMarca)
        AND (:idModelo IS NULL OR mo.id_modelo = :idModelo)
        AND (:anchoBanda IS NULL OR TRIM(:anchoBanda) = '' OR UPPER(c.ancho_banda) = UPPER(:anchoBanda))
        AND (:pilotoCnt IS NULL OR TRIM(:pilotoCnt) = '' OR COALESCE(c.piloto_cnt, '') ILIKE CONCAT('%', :pilotoCnt, '%'))
        AND (:fechaInstalacion IS NULL OR c.fecha_instalacion = :fechaInstalacion)

        ORDER BY c.id_punto_original ASC
        """, nativeQuery = true)
    List<Object[]> exportarCamarasConUltimoReporte(
            @Param("busqueda") String busqueda,
            @Param("idProvincia") Integer idProvincia,
            @Param("idCanton") Integer idCanton,
            @Param("estado") String estado,
            @Param("plataforma") String plataforma,
            @Param("convenio") String convenio,
            @Param("idMarca") Integer idMarca,
            @Param("idModelo") Integer idModelo,
            @Param("anchoBanda") String anchoBanda,
            @Param("pilotoCnt") String pilotoCnt,
            @Param("fechaInstalacion") LocalDate fechaInstalacion
    );

    @Query("""
        SELECT DISTINCT c.fechaInstalacion
        FROM Camara c
        WHERE c.fechaInstalacion IS NOT NULL
        ORDER BY c.fechaInstalacion ASC
        """)
    List<LocalDate> listarFechasInstalacionDisponibles();

}