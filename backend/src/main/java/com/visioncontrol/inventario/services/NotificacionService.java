package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.response.NotificacionResponseDTO;
import com.visioncontrol.inventario.entities.Notificacion;
import com.visioncontrol.inventario.repositories.CamaraRepository;
import com.visioncontrol.inventario.repositories.HistorialNovedadRepository;
import com.visioncontrol.inventario.repositories.NotificacionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

    private static final String ROLES_OPERATIVOS =
            "|SUPER_ADMIN|ANALISTA_TECNOLOGIA|ANALISTA_OPERACIONES|";

    private final NotificacionRepository notificacionRepository;
    private final CamaraRepository camaraRepository;
    private final HistorialNovedadRepository historialNovedadRepository;

    public NotificacionService(
            NotificacionRepository notificacionRepository,
            CamaraRepository camaraRepository,
            HistorialNovedadRepository historialNovedadRepository
    ) {
        this.notificacionRepository = notificacionRepository;
        this.camaraRepository = camaraRepository;
        this.historialNovedadRepository = historialNovedadRepository;
    }

    @Transactional
    public List<NotificacionResponseDTO> listarNotificacionesActivasPorRol(String rol) {
        sincronizarNotificacionesOperativas();

        String rolNormalizado = normalizarRol(rol);

        return notificacionRepository.listarActivasPorRol(rolNormalizado)
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    private void sincronizarNotificacionesOperativas() {
        Long glpiActivos = historialNovedadRepository.contarGlpiActivos();
        Long camarasConNovedad = camaraRepository.contarDiferentesDeEstado("OPERATIVA");

        sincronizarGlpiActivos(glpiActivos);
        sincronizarCamarasConNovedad(camarasConNovedad);
    }

    private void sincronizarGlpiActivos(Long totalGlpiActivos) {
        int total = convertirAEnteroSeguro(totalGlpiActivos);

        if (total <= 0) {
            desactivarNotificacion("GLPI_ACTIVOS");
            return;
        }

        Notificacion notificacion = obtenerOCrear("GLPI_ACTIVOS");

        notificacion.setTitulo("Tickets GLPI activos");
        notificacion.setMensaje("Existen " + total + " tickets GLPI pendientes de seguimiento.");
        notificacion.setDetalle("Requiere revisión técnica o actualización del seguimiento.");
        notificacion.setAccionTexto("Ver reportes GLPI");
        notificacion.setPrioridad("Seguimiento técnico");
        notificacion.setEtiqueta("GLPI");
        notificacion.setRuta("/reportes");
        notificacion.setStateJson("{\"filtroNotificacion\":\"GLPI_ACTIVOS\",\"soloGlpiActivos\":true}");
        notificacion.setRolesDestino(ROLES_OPERATIVOS);
        notificacion.setConteoActual(total);
        notificacion.setLecturaId("glpi-activos-" + total);
        notificacion.setActiva(true);
        notificacion.setFechaResolucion(null);

        notificacionRepository.save(notificacion);
    }

    private void sincronizarCamarasConNovedad(Long totalCamarasConNovedad) {
        int total = convertirAEnteroSeguro(totalCamarasConNovedad);

        if (total <= 0) {
            desactivarNotificacion("CAMARAS_CON_NOVEDAD");
            return;
        }

        Notificacion notificacion = obtenerOCrear("CAMARAS_CON_NOVEDAD");

        notificacion.setTitulo("Cámaras con novedades");
        notificacion.setMensaje("Hay " + total + " cámaras no operativas o con novedades registradas.");
        notificacion.setDetalle("Requiere revisión operativa del estado de las cámaras.");
        notificacion.setAccionTexto("Ver cámaras filtradas");
        notificacion.setPrioridad("Control operativo");
        notificacion.setEtiqueta("CÁMARAS");
        notificacion.setRuta("/camaras");
        notificacion.setStateJson("{\"filtroNotificacion\":\"CAMARAS_CON_NOVEDAD\",\"estado\":\"NO OPERATIVA\"}");
        notificacion.setRolesDestino(ROLES_OPERATIVOS);
        notificacion.setConteoActual(total);
        notificacion.setLecturaId("camaras-no-operativas-" + total);
        notificacion.setActiva(true);
        notificacion.setFechaResolucion(null);

        notificacionRepository.save(notificacion);
    }

    private Notificacion obtenerOCrear(String tipo) {
        return notificacionRepository.findByTipo(tipo)
                .orElseGet(() -> {
                    Notificacion nueva = new Notificacion();
                    nueva.setTipo(tipo);
                    nueva.setFechaCreacion(LocalDateTime.now());
                    nueva.setActiva(true);
                    return nueva;
                });
    }

    private void desactivarNotificacion(String tipo) {
        notificacionRepository.findByTipo(tipo)
                .ifPresent(notificacion -> {
                    if (Boolean.TRUE.equals(notificacion.getActiva())) {
                        notificacion.setActiva(false);
                        notificacion.setConteoActual(0);
                        notificacion.setLecturaId(tipo.toLowerCase() + "-0");
                        notificacion.setFechaResolucion(LocalDateTime.now());
                        notificacionRepository.save(notificacion);
                    }
                });
    }

    private int convertirAEnteroSeguro(Long valor) {
        if (valor == null) {
            return 0;
        }

        if (valor > Integer.MAX_VALUE) {
            return Integer.MAX_VALUE;
        }

        return valor.intValue();
    }

    private String normalizarRol(String rol) {
        if (rol == null) {
            return "";
        }

        return rol
                .replace("ROLE_", "")
                .trim()
                .toUpperCase();
    }

    private NotificacionResponseDTO toResponseDTO(Notificacion notificacion) {
        return new NotificacionResponseDTO(
                notificacion.getIdNotificacion(),
                notificacion.getTipo(),
                notificacion.getTitulo(),
                notificacion.getMensaje(),
                notificacion.getDetalle(),
                notificacion.getAccionTexto(),
                notificacion.getPrioridad(),
                notificacion.getEtiqueta(),
                notificacion.getRuta(),
                notificacion.getStateJson(),
                notificacion.getLecturaId(),
                notificacion.getConteoActual(),
                notificacion.getFechaCreacion(),
                notificacion.getFechaActualizacion()
        );
    }
}
