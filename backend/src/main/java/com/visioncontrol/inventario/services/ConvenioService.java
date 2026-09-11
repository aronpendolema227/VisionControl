package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.ConvenioRequestDTO;
import com.visioncontrol.inventario.dto.response.ConvenioResponseDTO;
import com.visioncontrol.inventario.entities.Convenio;
import com.visioncontrol.inventario.mappers.ConvenioMapper;
import com.visioncontrol.inventario.repositories.ConvenioRepository;

import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.visioncontrol.inventario.dto.response.ConvenioConsultaDTO;
import com.visioncontrol.inventario.dto.response.ConvenioResumenDTO;
import java.util.ArrayList;

@Service
public class ConvenioService {

    private final ConvenioRepository convenioRepository;
    private final AuditoriaService auditoriaService;

    public ConvenioService(
            ConvenioRepository convenioRepository,
            AuditoriaService auditoriaService
    ) {
        this.convenioRepository = convenioRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<ConvenioResponseDTO> listarConvenios() {
        return convenioRepository.findAll()
                .stream()
                .map(ConvenioMapper::toResponseDTO)
                .toList();
    }

    public ConvenioResumenDTO obtenerResumenConvenios() {
        Object[] fila = convenioRepository.obtenerResumenConvenios();

        if (fila != null && fila.length == 1 && fila[0] instanceof Object[]) {
            fila = (Object[]) fila[0];
        }

        return new ConvenioResumenDTO(
                convertirAInteger(fila[0]),
                convertirAInteger(fila[1]),
                convertirAInteger(fila[2])
        );
    }

    public List<ConvenioConsultaDTO> consultarConvenios() {
        List<Object[]> filas = convenioRepository.obtenerConsultaConvenios();
        List<ConvenioConsultaDTO> resultado = new ArrayList<>();

        for (Object[] fila : filas) {
            resultado.add(new ConvenioConsultaDTO(
                    convertirAInteger(fila[0]),
                    convertirAString(fila[1]),
                    convertirAInteger(fila[2]),
                    convertirAInteger(fila[3]),
                    convertirAInteger(fila[4]),
                    convertirAString(fila[5]),
                    convertirAString(fila[6]),
                    convertirAString(fila[7]),
                    convertirAString(fila[8]),
                    convertirAString(fila[9]),
                    convertirAString(fila[10]),
                    convertirAString(fila[11]),
                    convertirAString(fila[12])
            ));
        }

        return resultado;
    }

    private Integer convertirAInteger(Object valor) {
        if (valor == null) {
            return 0;
        }

        if (valor instanceof Number numero) {
            return numero.intValue();
        }

        return Integer.parseInt(valor.toString());
    }

    private String convertirAString(Object valor) {
        if (valor == null) {
            return "Sin dato";
        }

        String texto = valor.toString().trim();

        return texto.isEmpty() ? "Sin dato" : texto;
    }

    public ConvenioResponseDTO obtenerPorId(Integer id) {
        Convenio convenio = convenioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Convenio no encontrado con ID: " + id));

        return ConvenioMapper.toResponseDTO(convenio);
    }

    public ConvenioResponseDTO guardarConvenio(ConvenioRequestDTO dto) {
        Convenio convenio = ConvenioMapper.toEntity(dto);
        Convenio guardado = convenioRepository.save(convenio);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "USUARIO",
                "CREAR",
                "CONVENIO",
                guardado.getIdConvenio(),
                "Se creó el convenio: " + guardado.getNombreConvenio()
        );

        return ConvenioMapper.toResponseDTO(guardado);
    }

    public ConvenioResponseDTO actualizarConvenio(Integer id, ConvenioRequestDTO dto) {
        Convenio convenio = convenioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Convenio no encontrado con ID: " + id));
        convenio.setNombreConvenio(dto.getNombreConvenio());
        convenio.setFechaConvenioOriginal(dto.getFechaConvenioOriginal());
        convenio.setFechaConvenioInicio(dto.getFechaConvenioInicio());
        convenio.setFechaConvenioFin(dto.getFechaConvenioFin());
        convenio.setEstadoFechaConvenio(dto.getEstadoFechaConvenio());
        convenio.setResponsablePago(dto.getResponsablePago());

        Convenio actualizado = convenioRepository.save(convenio);

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "USUARIO",
                "ACTUALIZAR",
                "CONVENIO",
                actualizado.getIdConvenio(),
                "Se actualizó el convenio: " + actualizado.getNombreConvenio()
        );

        return ConvenioMapper.toResponseDTO(actualizado);
    }

    public void eliminarConvenio(Integer id) {
        Convenio convenio = convenioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Convenio no encontrado con ID: " + id));

        auditoriaService.registrar(
                obtenerUsuarioAutenticado(),
                "USUARIO",
                "ELIMINAR",
                "CONVENIO",
                convenio.getIdConvenio(),
                "Se eliminó el convenio: " + convenio.getNombreConvenio()
        );

        convenioRepository.delete(convenio);
    }

    private String obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            return "SISTEMA";
        }

        return authentication.getName();
    }
}