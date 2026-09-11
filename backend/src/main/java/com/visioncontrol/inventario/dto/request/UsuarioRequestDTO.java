package com.visioncontrol.inventario.dto.request;

import com.visioncontrol.inventario.security.Rol;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequestDTO {

    @NotBlank(message = "El username es obligatorio")
    private String username;

    
    private String password;

    @NotBlank(message = "El nombre completo es obligatorio")
    private String nombreCompleto;

    @Email(message = "Correo inválido")
    @NotBlank(message = "El correo es obligatorio")
    private String correo;

    @NotNull(message = "El rol es obligatorio")
    private Rol rol;

    @NotNull(message = "Debe indicar si el usuario está activo")
    private Boolean activo;

    @NotBlank(message = "El cargo es obligatorio")
    private String cargo;

    @NotBlank(message = "El área es obligatoria")
    private String area;

    private String telefono;

    private String grupoOperativo;
}
