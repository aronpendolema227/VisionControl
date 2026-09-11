package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.response.DashboardResponseDTO;
import com.visioncontrol.inventario.repositories.CamaraRepository;
import com.visioncontrol.inventario.repositories.HistorialNovedadRepository;
import org.springframework.stereotype.Service;

import com.visioncontrol.inventario.dto.response.DashboardTicketsDTO;
import java.time.LocalDate;
import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.visioncontrol.inventario.dto.response.DashboardCantonDTO;



@Service
public class DashboardService {

    private final CamaraRepository camaraRepository;
    private final HistorialNovedadRepository historialNovedadRepository;

    public DashboardService(
            CamaraRepository camaraRepository,
            HistorialNovedadRepository historialNovedadRepository
    ) {
        this.camaraRepository = camaraRepository;
        this.historialNovedadRepository = historialNovedadRepository;
    }

    public DashboardResponseDTO obtenerResumen() {

        Long totalCamaras = camaraRepository.contarTotalCamaras();

        Long operativas = camaraRepository.contarPorEstado("OPERATIVA");

        Long noOperativas = camaraRepository.contarDiferentesDeEstado("OPERATIVA");

        Long glpiActivos = historialNovedadRepository.contarGlpiActivos();

        Long conectividad = historialNovedadRepository.contarNovedadesConectividad();

        Long mantenimiento = historialNovedadRepository.contarNovedadesMantenimiento();

        return new DashboardResponseDTO(
                totalCamaras,
                operativas,
                noOperativas,
                glpiActivos,
                conectividad,
                mantenimiento
        );
    }

    public List<DashboardTicketsDTO> obtenerTicketsUltimos7Dias() {

        List<Object[]> resultados = historialNovedadRepository.contarTicketsUltimos7Dias();

        Map<LocalDate, Long> mapaResultados = new HashMap<>();

        for (Object[] fila : resultados) {
            LocalDate fecha;

            if (fila[0] instanceof Date fechaSql) {
                fecha = fechaSql.toLocalDate();
            } else {
                fecha = LocalDate.parse(fila[0].toString());
            }

            Long total = Long.parseLong(fila[1].toString());

            mapaResultados.put(fecha, total);
        }

        List<DashboardTicketsDTO> respuesta = new ArrayList<>();

        LocalDate hoy = LocalDate.now();

            for (int i = 6; i >= 0; i--) {
                LocalDate fecha = hoy.minusDays(i);

                respuesta.add(
                        new DashboardTicketsDTO(
                                obtenerNombreDia(fecha),
                                mapaResultados.getOrDefault(fecha, 0L)
                        )
                );
            }

            return respuesta;
    }

    private String obtenerNombreDia(LocalDate fecha) {
        return switch (fecha.getDayOfWeek()) {
            case MONDAY -> "Lun";
            case TUESDAY -> "Mar";
            case WEDNESDAY -> "Mié";
            case THURSDAY -> "Jue";
            case FRIDAY -> "Vie";
            case SATURDAY -> "Sáb";
            case SUNDAY -> "Dom";
        };
    }

    public List<DashboardCantonDTO> obtenerRendimientoPorCanton() {

        List<Object[]> resultados = camaraRepository.obtenerRendimientoPorCanton();

        List<DashboardCantonDTO> respuesta = new ArrayList<>();

        for (Object[] fila : resultados) {
            String canton = fila[0] != null ? fila[0].toString() : "SIN CANTÓN";

            Long operativas = fila[1] != null
                    ? ((Number) fila[1]).longValue()
                    : 0L;

            Long caidas = fila[2] != null
                    ? ((Number) fila[2]).longValue()
                    : 0L;

            Double porcentaje = fila[3] != null
                    ? ((Number) fila[3]).doubleValue()
                    : 0.0;

            respuesta.add(
                    new DashboardCantonDTO(
                            canton,
                            operativas,
                            caidas,
                            porcentaje
                    )
            );
        }

        return respuesta;
    }
}