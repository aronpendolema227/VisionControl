# Registro de Cambios - VisionControl

## Módulo de notificaciones

### Fecha
13 de octubre de 2026

### Descripción general
Se implementó un módulo de notificaciones para alertar a los usuarios sobre novedades operativas importantes dentro del sistema VisionControl.

El módulo permite visualizar alertas desde una campana ubicada en el encabezado del sistema, mostrando información relacionada con tickets GLPI activos, cámaras con novedades, novedades de conectividad y novedades de mantenimiento.

### Funcionalidades implementadas
- Campana de notificaciones en el encabezado.
- Contador de notificaciones nuevas.
- Panel desplegable de notificaciones.
- Texto de última actualización.
- Actualización manual mediante botón.
- Limpieza temporal de notificaciones.
- Actualización automática periódica.
- Diseño responsive para dispositivos móviles.
- Notificaciones persistidas en base de datos.
- Historial interno de cambios de notificaciones.
- Nuevos tipos de alertas operativas.

### Tipos de notificaciones agregadas
- Tickets GLPI activos.
- Cámaras con novedades.
- Novedades de conectividad.
- Novedades de mantenimiento.

### Cambios en base de datos
Se crearon nuevas tablas para almacenar las notificaciones y su historial:

- `notificaciones`
- `historial_notificaciones`

La tabla `notificaciones` almacena las alertas activas del sistema.

La tabla `historial_notificaciones` registra eventos importantes como creación, actualización, reactivación o resolución de una notificación.

### Archivos creados o modificados

#### Backend
- `Notificacion.java`
- `NotificacionRepository.java`
- `NotificacionService.java`
- `NotificacionController.java`
- `NotificacionResponseDTO.java`
- `HistorialNotificacion.java`
- `HistorialNotificacionRepository.java`
- `HistorialNotificacionResponseDTO.java`

#### Frontend
- `UserHeaderActions.jsx`
- `notificacionService.js`
- `notificaciones.css`

### Resultado
El sistema ahora cuenta con un módulo de notificaciones funcional, conectado al backend y a la base de datos, con historial interno y actualización automática/manual.

Esta mejora permite que los usuarios autorizados puedan identificar rápidamente novedades operativas importantes y acceder a los módulos correspondientes para dar seguimiento.