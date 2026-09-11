package com.visioncontrol.inventario.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GenerarPassword {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String passwordEncriptada = encoder.encode("Admin123*");

        System.out.println(passwordEncriptada);
    }
}