package com.visioncontrol.inventario.services;

import com.visioncontrol.inventario.dto.request.ProveedorRequestDTO;
import com.visioncontrol.inventario.dto.response.ProveedorResponseDTO;
import com.visioncontrol.inventario.entities.Proveedor;
import com.visioncontrol.inventario.mappers.ProveedorMapper;
import com.visioncontrol.inventario.repositories.ProveedorRepository;
import org.springframework.stereotype.Service;
import com.visioncontrol.inventario.exceptions.ResourceNotFoundException;
import java.util.List;
import com.visioncontrol.inventario.exceptions.BadRequestException;

@Service
public class ProveedorService {

    private final ProveedorRepository proveedorRepository;

    public ProveedorService(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    public List<ProveedorResponseDTO> listarProveedores() {
        return proveedorRepository.findAll()
                .stream()
                .map(ProveedorMapper::toResponseDTO)
                .toList();
    }

    public ProveedorResponseDTO obtenerPorId(Integer id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));
        return ProveedorMapper.toResponseDTO(proveedor);
    }

    public ProveedorResponseDTO guardarProveedor(ProveedorRequestDTO dto) {
        Proveedor proveedor = ProveedorMapper.toEntity(dto);

        if (proveedorRepository.existsByNombreProveedor(
            dto.getNombreProveedor().trim().toUpperCase())) {

            throw new BadRequestException("Ya existe un proveedor con ese nombre");
        }

        Proveedor guardado = proveedorRepository.save(proveedor);

        return ProveedorMapper.toResponseDTO(guardado);
    }

    public ProveedorResponseDTO actualizarProveedor(Integer id, ProveedorRequestDTO dto) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));
        proveedor.setNombreProveedor(dto.getNombreProveedor());

        Proveedor actualizado = proveedorRepository.save(proveedor);

        return ProveedorMapper.toResponseDTO(actualizado);
    }

    public void eliminarProveedor(Integer id) {
        Proveedor proveedor = proveedorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Proveedor no encontrado con ID: " + id));

        proveedorRepository.delete(proveedor);
    }
}
