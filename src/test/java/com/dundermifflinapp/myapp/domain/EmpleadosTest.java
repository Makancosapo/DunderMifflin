package com.dundermifflinapp.myapp.domain;

import static com.dundermifflinapp.myapp.domain.DepartamentosTestSamples.*;
import static com.dundermifflinapp.myapp.domain.EmpleadosTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.dundermifflinapp.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EmpleadosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Empleados.class);
        Empleados empleados1 = getEmpleadosSample1();
        Empleados empleados2 = new Empleados();
        assertThat(empleados1).isNotEqualTo(empleados2);

        empleados2.setId(empleados1.getId());
        assertThat(empleados1).isEqualTo(empleados2);

        empleados2 = getEmpleadosSample2();
        assertThat(empleados1).isNotEqualTo(empleados2);
    }

    @Test
    void departamentoTest() {
        Empleados empleados = getEmpleadosRandomSampleGenerator();
        Departamentos departamentosBack = getDepartamentosRandomSampleGenerator();

        empleados.setDepartamento(departamentosBack);
        assertThat(empleados.getDepartamento()).isEqualTo(departamentosBack);

        empleados.departamento(null);
        assertThat(empleados.getDepartamento()).isNull();
    }
}
