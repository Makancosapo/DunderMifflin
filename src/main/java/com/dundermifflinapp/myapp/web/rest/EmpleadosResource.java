package com.dundermifflinapp.myapp.web.rest;

import com.dundermifflinapp.myapp.domain.Empleados;
import com.dundermifflinapp.myapp.repository.EmpleadosRepository;
import com.dundermifflinapp.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.dundermifflinapp.myapp.domain.Empleados}.
 */
@RestController
@RequestMapping("/api/empleados")
@Transactional
public class EmpleadosResource {

    private static final Logger LOG = LoggerFactory.getLogger(EmpleadosResource.class);

    private static final String ENTITY_NAME = "empleados";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EmpleadosRepository empleadosRepository;

    public EmpleadosResource(EmpleadosRepository empleadosRepository) {
        this.empleadosRepository = empleadosRepository;
    }

    /**
     * {@code POST  /empleados} : Create a new empleados.
     *
     * @param empleados the empleados to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new empleados, or with status {@code 400 (Bad Request)} if the empleados has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Empleados> createEmpleados(@RequestBody Empleados empleados) throws URISyntaxException {
        LOG.debug("REST request to save Empleados : {}", empleados);
        if (empleados.getId() != null) {
            throw new BadRequestAlertException("A new empleados cannot already have an ID", ENTITY_NAME, "idexists");
        }
        empleados = empleadosRepository.save(empleados);
        return ResponseEntity.created(new URI("/api/empleados/" + empleados.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, empleados.getId().toString()))
            .body(empleados);
    }

    /**
     * {@code PUT  /empleados/:id} : Updates an existing empleados.
     *
     * @param id the id of the empleados to save.
     * @param empleados the empleados to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated empleados,
     * or with status {@code 400 (Bad Request)} if the empleados is not valid,
     * or with status {@code 500 (Internal Server Error)} if the empleados couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Empleados> updateEmpleados(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Empleados empleados
    ) throws URISyntaxException {
        LOG.debug("REST request to update Empleados : {}, {}", id, empleados);
        if (empleados.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, empleados.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!empleadosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        empleados = empleadosRepository.save(empleados);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, empleados.getId().toString()))
            .body(empleados);
    }

    /**
     * {@code PATCH  /empleados/:id} : Partial updates given fields of an existing empleados, field will ignore if it is null
     *
     * @param id the id of the empleados to save.
     * @param empleados the empleados to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated empleados,
     * or with status {@code 400 (Bad Request)} if the empleados is not valid,
     * or with status {@code 404 (Not Found)} if the empleados is not found,
     * or with status {@code 500 (Internal Server Error)} if the empleados couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Empleados> partialUpdateEmpleados(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Empleados empleados
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Empleados partially : {}, {}", id, empleados);
        if (empleados.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, empleados.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!empleadosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Empleados> result = empleadosRepository
            .findById(empleados.getId())
            .map(existingEmpleados -> {
                if (empleados.getNombre() != null) {
                    existingEmpleados.setNombre(empleados.getNombre());
                }
                if (empleados.getApellido() != null) {
                    existingEmpleados.setApellido(empleados.getApellido());
                }
                if (empleados.getCorreo() != null) {
                    existingEmpleados.setCorreo(empleados.getCorreo());
                }
                if (empleados.getTelefono() != null) {
                    existingEmpleados.setTelefono(empleados.getTelefono());
                }

                return existingEmpleados;
            })
            .map(empleadosRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, empleados.getId().toString())
        );
    }

    /**
     * {@code GET  /empleados} : get all the empleados.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of empleados in body.
     */
    @GetMapping("")
    public List<Empleados> getAllEmpleados(@RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload) {
        LOG.debug("REST request to get all Empleados");
        if (eagerload) {
            return empleadosRepository.findAllWithEagerRelationships();
        } else {
            return empleadosRepository.findAll();
        }
    }

    /**
     * {@code GET  /empleados/:id} : get the "id" empleados.
     *
     * @param id the id of the empleados to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the empleados, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Empleados> getEmpleados(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Empleados : {}", id);
        Optional<Empleados> empleados = empleadosRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(empleados);
    }

    /**
     * {@code DELETE  /empleados/:id} : delete the "id" empleados.
     *
     * @param id the id of the empleados to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmpleados(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Empleados : {}", id);
        empleadosRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
