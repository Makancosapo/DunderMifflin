package com.dundermifflinapp.myapp.domain;

import static com.dundermifflinapp.myapp.domain.DepartamentosTestSamples.*;
import static com.dundermifflinapp.myapp.domain.JefesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.dundermifflinapp.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DepartamentosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Departamentos.class);
        Departamentos departamentos1 = getDepartamentosSample1();
        Departamentos departamentos2 = new Departamentos();
        assertThat(departamentos1).isNotEqualTo(departamentos2);

        departamentos2.setId(departamentos1.getId());
        assertThat(departamentos1).isEqualTo(departamentos2);

        departamentos2 = getDepartamentosSample2();
        assertThat(departamentos1).isNotEqualTo(departamentos2);
    }

    @Test
    void nombrejefeTest() {
        Departamentos departamentos = getDepartamentosRandomSampleGenerator();
        Jefes jefesBack = getJefesRandomSampleGenerator();

        departamentos.setNombrejefe(jefesBack);
        assertThat(departamentos.getNombrejefe()).isEqualTo(jefesBack);

        departamentos.nombrejefe(null);
        assertThat(departamentos.getNombrejefe()).isNull();
    }
}
