package com.visioncontrol.inventario.mappers;

import com.visioncontrol.inventario.dto.request.ProveedorRequestDTO;
import com.visioncontrol.inventario.dto.response.ProveedorResponseDTO;
import com.visioncontrol.inventario.entities.Proveedor;

public class ProveedorMapper {

    public static ProveedorResponseDTO toResponseDTO(Proveedor proveedor) {
        ProveedorResponseDTO dto = new ProveedorResponseDTO();

        dto.setIdProveedor(proveedor.getIdProveedor());
        dto.setNombreProveedor(proveedor.getNombreProveedor());

        return dto;
    }

    public static Proveedor toEntity(ProveedorRequestDTO dto) {
        Proveedor proveedor = new Proveedor();

        proveedor.setNombreProveedor(dto.getNombreProveedor());

        return proveedor;
    }
}