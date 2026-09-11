package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.response.ReporteCamaraDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReporteService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public Page<ReporteCamaraDTO> listarCamarasReporte(
            Integer idProvincia,
            Integer idCanton,
            String estadoActual,
            Integer idMarca,
            LocalDate fechaInstalacion,
            String busquedaGeneral,
            int page,
            int size
    ) {
        int pageSeguro = Math.max(page, 0);
        int sizeSeguro = size <= 0 ? 20 : Math.min(size, 100);

        Pageable pageable = PageRequest.of(pageSeguro, sizeSeguro);

        String select = """
                SELECT
                    c.id_camara,
                    c.id_punto_original,
                    c.nombre_camara,

                    p.nombre_provincia AS provincia,
                    ca.nombre_canton AS canton,
                    c.direccion,
                    c.estado_actual,
                    c.fecha_instalacion,

                    ma.nombre_marca AS marca,
                    mo.nombre_modelo AS modelo,
                    pl.nombre_plataforma AS plataforma,

                    c.cambio_de_camara,
                    c.a_quien_pertenece,

                    a.nombre_analista,
                    a.grupo_operativo,

                    hn.fecha_revision,
                    hn.estado_operativo,
                    hn.ticket_glpi,
                    hn.observaciones,
                    hn.novedades,
                    hn.presenta_dano,
                    hn.descripcion_dano,
                    hn.fecha_seguimiento,
                    hn.seguimiento_detalle,
                    hn.resuelto_glpi,
                    hn.fecha_solucion
                """;

        String from = """
                FROM camaras c
                LEFT JOIN cantones ca ON ca.id_canton = c.id_canton
                LEFT JOIN provincias p ON p.id_provincia = ca.id_provincia
                LEFT JOIN modelos mo ON mo.id_modelo = c.id_modelo
                LEFT JOIN marcas ma ON ma.id_marca = mo.id_marca
                LEFT JOIN plataformas pl ON pl.id_plataforma = c.id_plataforma
                LEFT JOIN analistas a ON a.id_analista = c.id_analista

                LEFT JOIN LATERAL (
                    SELECT hn.*
                    FROM historial_novedades hn
                    WHERE hn.id_camara = c.id_camara
                    ORDER BY hn.fecha_revision DESC NULLS LAST, hn.id_novedad DESC
                    LIMIT 1
                ) hn ON true
                """;

        String fromCount = """
            FROM camaras c
            LEFT JOIN cantones ca ON ca.id_canton = c.id_canton
            LEFT JOIN provincias p ON p.id_provincia = ca.id_provincia
            LEFT JOIN modelos mo ON mo.id_modelo = c.id_modelo
            LEFT JOIN marcas ma ON ma.id_marca = mo.id_marca
            LEFT JOIN plataformas pl ON pl.id_plataforma = c.id_plataforma
            LEFT JOIN analistas a ON a.id_analista = c.id_analista

            LEFT JOIN LATERAL (
                SELECT hn.*
                FROM historial_novedades hn
                WHERE hn.id_camara = c.id_camara
                ORDER BY hn.fecha_revision DESC NULLS LAST, hn.id_novedad DESC
                LIMIT 1
            ) hn ON true
            """;

        StringBuilder where = new StringBuilder(" WHERE 1 = 1 ");

        if (idProvincia != null) {
            where.append(" AND p.id_provincia = :idProvincia ");
        }

        if (idCanton != null) {
            where.append(" AND ca.id_canton = :idCanton ");
        }

        if (estadoActual != null && !estadoActual.trim().isEmpty()) {
            where.append(" AND UPPER(TRIM(c.estado_actual)) = UPPER(TRIM(:estadoActual)) ");
        }

        if (idMarca != null) {
            where.append(" AND ma.id_marca = :idMarca ");
        }

        if (fechaInstalacion != null) {
            where.append(" AND c.fecha_instalacion = :fechaInstalacion ");
        }

        if (busquedaGeneral != null && !busquedaGeneral.trim().isEmpty()) {
            where.append("""
                    AND (
                        UPPER(TRIM(COALESCE(hn.ticket_glpi, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(c.nombre_camara, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR CAST(c.id_punto_original AS TEXT) LIKE CONCAT('%', TRIM(:busquedaGeneral), '%')
                        OR UPPER(TRIM(COALESCE(p.nombre_provincia, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(ca.nombre_canton, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(ma.nombre_marca, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(mo.nombre_modelo, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(pl.nombre_plataforma, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(c.estado_actual, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(c.a_quien_pertenece, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(a.nombre_analista, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR UPPER(TRIM(COALESCE(a.grupo_operativo, ''))) LIKE UPPER(CONCAT('%', TRIM(:busquedaGeneral), '%'))
                        OR COALESCE(TO_CHAR(c.fecha_instalacion, 'YYYY-MM-DD'), '') LIKE CONCAT('%', TRIM(:busquedaGeneral), '%')
                    )
                    """);
        }

        String orderBy = " ORDER BY c.id_punto_original ASC ";

        Query query = entityManager.createNativeQuery(select + from + where + orderBy);
        aplicarParametros(query, idProvincia, idCanton, estadoActual, idMarca, fechaInstalacion, busquedaGeneral);

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<?> resultados = query.getResultList();

        List<ReporteCamaraDTO> contenido = resultados.stream()
                .map(row -> mapearReporteCamara((Object[]) row))
                .toList();

        Query countQuery = entityManager.createNativeQuery("SELECT COUNT(*) " + fromCount + where);
        aplicarParametros(countQuery, idProvincia, idCanton, estadoActual, idMarca, fechaInstalacion, busquedaGeneral);

        Long total = ((Number) countQuery.getSingleResult()).longValue();

        return new PageImpl<>(contenido, pageable, total);
    }

    private void aplicarParametros(
            Query query,
            Integer idProvincia,
            Integer idCanton,
            String estadoActual,
            Integer idMarca,
            LocalDate fechaInstalacion,
            String busquedaGeneral
    ) {
        if (idProvincia != null) {
            query.setParameter("idProvincia", idProvincia);
        }

        if (idCanton != null) {
            query.setParameter("idCanton", idCanton);
        }

        if (estadoActual != null && !estadoActual.trim().isEmpty()) {
            query.setParameter("estadoActual", estadoActual);
        }

        if (idMarca != null) {
            query.setParameter("idMarca", idMarca);
        }

        if (fechaInstalacion != null) {
            query.setParameter("fechaInstalacion", fechaInstalacion);
        }

        if (busquedaGeneral != null && !busquedaGeneral.trim().isEmpty()) {
            query.setParameter("busquedaGeneral", busquedaGeneral);
        }

    }

    private ReporteCamaraDTO mapearReporteCamara(Object[] row) {
        return new ReporteCamaraDTO(
        toInteger(row[0]),        // idCamara
        toInteger(row[1]),        // idPuntoOriginal
        toStringValue(row[2]),    // nombreCamara

        toStringValue(row[3]),    // provincia
        toStringValue(row[4]),    // canton
        toStringValue(row[5]),    // direccion
        toStringValue(row[6]),    // estadoActual
        toLocalDate(row[7]),      // fechaInstalacion

        toStringValue(row[8]),    // marca
        toStringValue(row[9]),    // modelo
        toStringValue(row[10]),   // plataforma

        toStringValue(row[11]),   // cambioDeCamara
        toStringValue(row[12]),   // aQuienPertenece

        toStringValue(row[13]),   // nombreAnalista
        toStringValue(row[14]),   // grupoOperativo

        toLocalDate(row[15]),     // fechaRevision
        toStringValue(row[16]),   // estadoOperativo
        toStringValue(row[17]),   // ticketGlpi
        toStringValue(row[18]),   // observaciones
        toStringValue(row[19]),   // novedades
        toStringValue(row[20]),   // presentaDano
        toStringValue(row[21]),   // descripcionDano
        toLocalDate(row[22]),     // fechaSeguimiento
        toStringValue(row[23]),   // seguimientoDetalle
        toBoolean(row[24]),       // resueltoGlpi
        toLocalDate(row[25])      // fechaSolucion

        );
    }

    private Integer toInteger(Object value) {
        if (value == null) {
            return null;
        }

        return ((Number) value).intValue();
    }

    private String toStringValue(Object value) {
        if (value == null) {
            return null;
        }

        return value.toString();
    }

    private LocalDate toLocalDate(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof LocalDate localDate) {
            return localDate;
        }

        if (value instanceof Date sqlDate) {
            return sqlDate.toLocalDate();
        }

        return LocalDate.parse(value.toString());
    }

    private Boolean toBoolean(Object value) {
        if (value == null) {
            return null;
        }

        if (value instanceof Boolean bool) {
            return bool;
        }

        if (value instanceof Number number) {
            return number.intValue() == 1;
        }

        return Boolean.parseBoolean(value.toString());
    }
}
