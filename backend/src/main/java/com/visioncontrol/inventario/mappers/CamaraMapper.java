package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.CamaraRequestDTO;
import com.visioncontrol.inventario.dto.response.CamaraResponseDTO;
import com.visioncontrol.inventario.entities.*;

public class CamaraMapper {

    public static CamaraResponseDTO toResponseDTO(Camara camara) {

        CamaraResponseDTO dto = new CamaraResponseDTO();

        dto.setIdCamara(camara.getIdCamara());
        dto.setIdPuntoOriginal(camara.getIdPuntoOriginal());
        dto.setNombreCamara(camara.getNombreCamara());
        dto.setDireccion(camara.getDireccion());
        dto.setUsuarioAlfanumerico(camara.getUsuarioAlfanumerico());
        dto.setLatitud(camara.getLatitud());
        dto.setLongitud(camara.getLongitud());
        dto.setDireccionIp(camara.getDireccionIp());
        dto.setTipoDispositivo(camara.getTipoDispositivo());
        dto.setFechaInstalacion(camara.getFechaInstalacion());
        dto.setAnio(camara.getAnio());
        dto.setEstadoActual(camara.getEstadoActual());
        dto.setAQuienPertenece(camara.getAQuienPertenece());
        dto.setObservaciones(camara.getObservaciones());
        dto.setPilotoCnt(camara.getPilotoCnt());
        dto.setAnchoBanda(camara.getAnchoBanda());
        dto.setConversor(camara.getConversor());
        dto.setPoste(camara.getPoste());
        dto.setBrazo(camara.getBrazo());
        dto.setDescripcionDano(camara.getDescripcionDano());
        dto.setTipoDanoSinServicio(camara.getTipoDanoSinServicio());
        dto.setTipoFallaTecnica(camara.getTipoFallaTecnica());
        dto.setSerieCamara(camara.getSerieCamara());
        dto.setMarcaUps(camara.getMarcaUps());
        dto.setSerieUps(camara.getSerieUps());
        dto.setEstadoUps(camara.getEstadoUps());
        dto.setAbejas(camara.getAbejas());
        dto.setActivo(camara.getActivo());
        dto.setMotivoDesactivacion(camara.getMotivoDesactivacion());
        dto.setFechaDesactivacion(camara.getFechaDesactivacion());
        dto.setUsuarioDesactivacion(camara.getUsuarioDesactivacion());
        dto.setRolDesactivacion(camara.getRolDesactivacion());
        if (camara.getDetalleConvenioCamara() != null) {
            DetalleConvenioCamara detalle = camara.getDetalleConvenioCamara();

            dto.setEstadoConvenio(detalle.getEstadoConvenio());
            dto.setFechaConvenioOriginal(detalle.getFechaConvenioOriginal());
            dto.setFechaConvenioInicio(detalle.getFechaConvenioInicio());
            dto.setFechaConvenioReferencia(detalle.getFechaConvenioReferencia());
            dto.setFechaConvenioFin(detalle.getFechaConvenioFin());
            dto.setEstadoFechaConvenio(detalle.getEstadoFechaConvenio());
            dto.setFechaInicialPago(detalle.getFechaInicialPago());
            dto.setFechaInicialPagoOriginal(detalle.getFechaInicialPagoOriginal());
            dto.setProveedorEnlace(detalle.getProveedorEnlace());
            dto.setResponsablePago(detalle.getResponsablePago());
            dto.setCostoEnlace(detalle.getCostoEnlace());
        } else {
            dto.setFechaConvenioOriginal(camara.getFechaConvenioOriginal());
            dto.setFechaConvenioInicio(camara.getFechaConvenioInicio());
            dto.setFechaConvenioFin(camara.getFechaConvenioFin());
            dto.setEstadoFechaConvenio(camara.getEstadoFechaConvenio());
            dto.setFechaInicialPago(camara.getFechaInicialPago());
            dto.setProveedorEnlace(camara.getProveedorEnlace());
            dto.setResponsablePago(camara.getResponsablePago());
            dto.setCostoEnlace(camara.getCostoEnlace());
            if (camara.getConvenio() != null) {
                dto.setEstadoConvenio(camara.getConvenio().getNombreConvenio());
            }
        }
        

        if (camara.getCanton() != null) {
            dto.setIdCanton(camara.getCanton().getIdCanton());
            dto.setNombreCanton(camara.getCanton().getNombreCanton());

            if (camara.getCanton().getProvincia() != null) {
                dto.setIdProvincia(camara.getCanton().getProvincia().getIdProvincia());
                dto.setNombreProvincia(camara.getCanton().getProvincia().getNombreProvincia());
            }
        }

        if (camara.getModelo() != null) {
            dto.setIdModelo(camara.getModelo().getIdModelo());
            dto.setNombreModelo(camara.getModelo().getNombreModelo());

            if (camara.getModelo().getMarca() != null) {
                dto.setNombreMarca(camara.getModelo().getMarca().getNombreMarca());
            }
        }

        if (camara.getPlataforma() != null) {
            dto.setIdPlataforma(camara.getPlataforma().getIdPlataforma());
            dto.setNombrePlataforma(camara.getPlataforma().getNombrePlataforma());
        }

        if (camara.getProveedor() != null) {
            dto.setIdProveedor(camara.getProveedor().getIdProveedor());
            dto.setNombreProveedor(camara.getProveedor().getNombreProveedor());
        }

        if (camara.getCentroOperativo() != null) {
            dto.setIdCentro(camara.getCentroOperativo().getIdCentro());
            dto.setNombreCentro(camara.getCentroOperativo().getNombreCentro());
        }

        if (camara.getConvenio() != null) {
            dto.setIdConvenio(camara.getConvenio().getIdConvenio());
            dto.setNombreConvenio(camara.getConvenio().getNombreConvenio());
        }
                return dto;
            }

    public static Camara toEntity(CamaraRequestDTO dto) {

        Camara camara = new Camara();

        camara.setIdPuntoOriginal(dto.getIdPuntoOriginal());
        camara.setNombreCamara(dto.getNombreCamara());
        camara.setDireccion(dto.getDireccion());
        camara.setUsuarioAlfanumerico(dto.getUsuarioAlfanumerico());
        camara.setLatitud(dto.getLatitud());
        camara.setLongitud(dto.getLongitud());
        camara.setDireccionIp(dto.getDireccionIp());
        camara.setTipoDispositivo(dto.getTipoDispositivo());
        camara.setFechaInstalacion(dto.getFechaInstalacion());
        camara.setAnio(dto.getAnio());
        camara.setEstadoActual(dto.getEstadoActual());
        camara.setAQuienPertenece(dto.getAQuienPertenece());
        camara.setObservaciones(dto.getObservaciones());
        camara.setPilotoCnt(dto.getPilotoCnt());
        camara.setAnchoBanda(dto.getAnchoBanda());
        camara.setConversor(dto.getConversor());
        camara.setPoste(dto.getPoste());
        camara.setBrazo(dto.getBrazo());
        camara.setDescripcionDano(dto.getDescripcionDano());
        camara.setTipoDanoSinServicio(dto.getTipoDanoSinServicio());
        camara.setTipoFallaTecnica(dto.getTipoFallaTecnica());
        camara.setSerieCamara(dto.getSerieCamara());
        camara.setMarcaUps(dto.getMarcaUps());
        camara.setSerieUps(dto.getSerieUps());
        camara.setEstadoUps(dto.getEstadoUps());
        camara.setAbejas(dto.getAbejas());
        camara.setActivo(true);

        if (dto.getIdAnalista() != null) {
            Analista analista = new Analista();
            analista.setIdAnalista(dto.getIdAnalista());
            camara.setAnalista(analista);
        }

        camara.setFechaConvenioOriginal(dto.getFechaConvenioOriginal());
        camara.setFechaConvenioInicio(dto.getFechaConvenioInicio());
        camara.setFechaConvenioFin(dto.getFechaConvenioFin());
        camara.setEstadoFechaConvenio(dto.getEstadoFechaConvenio());
        camara.setFechaInicialPago(dto.getFechaInicialPago());
        camara.setProveedorEnlace(dto.getProveedorEnlace());
        camara.setResponsablePago(dto.getResponsablePago());
        camara.setCostoEnlace(dto.getCostoEnlace());

        if (dto.getIdCanton() != null) {
            Canton canton = new Canton();
            canton.setIdCanton(dto.getIdCanton());
            camara.setCanton(canton);
        }

        if (dto.getIdModelo() != null) {
            Modelo modelo = new Modelo();
            modelo.setIdModelo(dto.getIdModelo());
            camara.setModelo(modelo);
        }

        if (dto.getIdPlataforma() != null) {
            Plataforma plataforma = new Plataforma();
            plataforma.setIdPlataforma(dto.getIdPlataforma());
            camara.setPlataforma(plataforma);
        }

        if (dto.getIdProveedor() != null) {
            Proveedor proveedor = new Proveedor();
            proveedor.setIdProveedor(dto.getIdProveedor());
            camara.setProveedor(proveedor);
        }

        if (dto.getIdCentro() != null) {
            CentroOperativo centro = new CentroOperativo();
            centro.setIdCentro(dto.getIdCentro());
            camara.setCentroOperativo(centro);
        }

        if (dto.getIdConvenio() != null) {
            Convenio convenio = new Convenio();
            convenio.setIdConvenio(dto.getIdConvenio());
            camara.setConvenio(convenio);
        }

        return camara;
    }
}