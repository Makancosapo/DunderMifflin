package com.dundermifflinapp.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EmpleadosTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Empleados getEmpleadosSample1() {
        return new Empleados().id(1L).nombre("nombre1").apellido("apellido1").correo("correo1").telefono("telefono1");
    }

    public static Empleados getEmpleadosSample2() {
        return new Empleados().id(2L).nombre("nombre2").apellido("apellido2").correo("correo2").telefono("telefono2");
    }

    public static Empleados getEmpleadosRandomSampleGenerator() {
        return new Empleados()
            .id(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .apellido(UUID.randomUUID().toString())
            .correo(UUID.randomUUID().toString())
            .telefono(UUID.randomUUID().toString());
    }
}
