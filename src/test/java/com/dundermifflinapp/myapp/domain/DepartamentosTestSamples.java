package com.dundermifflinapp.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DepartamentosTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Departamentos getDepartamentosSample1() {
        return new Departamentos().id(1L).nombre("nombre1").ubicacion("ubicacion1");
    }

    public static Departamentos getDepartamentosSample2() {
        return new Departamentos().id(2L).nombre("nombre2").ubicacion("ubicacion2");
    }

    public static Departamentos getDepartamentosRandomSampleGenerator() {
        return new Departamentos()
            .id(longCount.incrementAndGet())
            .nombre(UUID.randomUUID().toString())
            .ubicacion(UUID.randomUUID().toString());
    }
}
