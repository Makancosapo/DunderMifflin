package com.dundermifflinapp.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class JefesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Jefes getJefesSample1() {
        return new Jefes().id(1L).nombre("nombre1").telefono("telefono1");
    }

    public static Jefes getJefesSample2() {
        return new Jefes().id(2L).nombre("nombre2").telefono("telefono2");
    }

    public static Jefes getJefesRandomSampleGenerator() {
        return new Jefes().id(longCount.incrementAndGet()).nombre(UUID.randomUUID().toString()).telefono(UUID.randomUUID().toString());
    }
}
