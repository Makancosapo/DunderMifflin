package com.dundermifflinapp.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

/**
 * A Departamentos.
 */
@Entity
@Table(name = "departamentos")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Departamentos implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "ubicacion")
    private String ubicacion;

    @Column(name = "presupuesto", precision = 21, scale = 2)
    private BigDecimal presupuesto;

    @ManyToOne(fetch = FetchType.LAZY)
    private Jefes nombrejefe;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Departamentos id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return this.nombre;
    }

    public Departamentos nombre(String nombre) {
        this.setNombre(nombre);
        return this;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getUbicacion() {
        return this.ubicacion;
    }

    public Departamentos ubicacion(String ubicacion) {
        this.setUbicacion(ubicacion);
        return this;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public BigDecimal getPresupuesto() {
        return this.presupuesto;
    }

    public Departamentos presupuesto(BigDecimal presupuesto) {
        this.setPresupuesto(presupuesto);
        return this;
    }

    public void setPresupuesto(BigDecimal presupuesto) {
        this.presupuesto = presupuesto;
    }

    public Jefes getNombrejefe() {
        return this.nombrejefe;
    }

    public void setNombrejefe(Jefes jefes) {
        this.nombrejefe = jefes;
    }

    public Departamentos nombrejefe(Jefes jefes) {
        this.setNombrejefe(jefes);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Departamentos)) {
            return false;
        }
        return getId() != null && getId().equals(((Departamentos) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Departamentos{" +
            "id=" + getId() +
            ", nombre='" + getNombre() + "'" +
            ", ubicacion='" + getUbicacion() + "'" +
            ", presupuesto=" + getPresupuesto() +
            "}";
    }
}
