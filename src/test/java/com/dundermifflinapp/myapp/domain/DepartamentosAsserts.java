package com.dundermifflinapp.myapp.domain;

import static com.dundermifflinapp.myapp.domain.AssertUtils.bigDecimalCompareTo;
import static org.assertj.core.api.Assertions.assertThat;

public class DepartamentosAsserts {

    /**
     * Asserts that the entity has all properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDepartamentosAllPropertiesEquals(Departamentos expected, Departamentos actual) {
        assertDepartamentosAutoGeneratedPropertiesEquals(expected, actual);
        assertDepartamentosAllUpdatablePropertiesEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all updatable properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDepartamentosAllUpdatablePropertiesEquals(Departamentos expected, Departamentos actual) {
        assertDepartamentosUpdatableFieldsEquals(expected, actual);
        assertDepartamentosUpdatableRelationshipsEquals(expected, actual);
    }

    /**
     * Asserts that the entity has all the auto generated properties (fields/relationships) set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDepartamentosAutoGeneratedPropertiesEquals(Departamentos expected, Departamentos actual) {
        assertThat(expected)
            .as("Verify Departamentos auto generated properties")
            .satisfies(e -> assertThat(e.getId()).as("check id").isEqualTo(actual.getId()));
    }

    /**
     * Asserts that the entity has all the updatable fields set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDepartamentosUpdatableFieldsEquals(Departamentos expected, Departamentos actual) {
        assertThat(expected)
            .as("Verify Departamentos relevant properties")
            .satisfies(e -> assertThat(e.getNombre()).as("check nombre").isEqualTo(actual.getNombre()))
            .satisfies(e -> assertThat(e.getUbicacion()).as("check ubicacion").isEqualTo(actual.getUbicacion()))
            .satisfies(e ->
                assertThat(e.getPresupuesto())
                    .as("check presupuesto")
                    .usingComparator(bigDecimalCompareTo)
                    .isEqualTo(actual.getPresupuesto())
            );
    }

    /**
     * Asserts that the entity has all the updatable relationships set.
     *
     * @param expected the expected entity
     * @param actual the actual entity
     */
    public static void assertDepartamentosUpdatableRelationshipsEquals(Departamentos expected, Departamentos actual) {
        assertThat(expected)
            .as("Verify Departamentos relationships")
            .satisfies(e -> assertThat(e.getNombrejefe()).as("check nombrejefe").isEqualTo(actual.getNombrejefe()));
    }
}
