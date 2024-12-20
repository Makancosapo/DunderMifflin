package com.dundermifflinapp.myapp.web.rest;

import com.dundermifflinapp.myapp.domain.Departamentos;
import com.dundermifflinapp.myapp.repository.DepartamentosRepository;
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
 * REST controller for managing {@link com.dundermifflinapp.myapp.domain.Departamentos}.
 */
@RestController
@RequestMapping("/api/departamentos")
@Transactional
public class DepartamentosResource {

    private static final Logger LOG = LoggerFactory.getLogger(DepartamentosResource.class);

    private static final String ENTITY_NAME = "departamentos";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DepartamentosRepository departamentosRepository;

    public DepartamentosResource(DepartamentosRepository departamentosRepository) {
        this.departamentosRepository = departamentosRepository;
    }

    /**
     * {@code POST  /departamentos} : Create a new departamentos.
     *
     * @param departamentos the departamentos to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new departamentos, or with status {@code 400 (Bad Request)} if the departamentos has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Departamentos> createDepartamentos(@RequestBody Departamentos departamentos) throws URISyntaxException {
        LOG.debug("REST request to save Departamentos : {}", departamentos);
        if (departamentos.getId() != null) {
            throw new BadRequestAlertException("A new departamentos cannot already have an ID", ENTITY_NAME, "idexists");
        }
        departamentos = departamentosRepository.save(departamentos);
        return ResponseEntity.created(new URI("/api/departamentos/" + departamentos.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, departamentos.getId().toString()))
            .body(departamentos);
    }

    /**
     * {@code PUT  /departamentos/:id} : Updates an existing departamentos.
     *
     * @param id the id of the departamentos to save.
     * @param departamentos the departamentos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated departamentos,
     * or with status {@code 400 (Bad Request)} if the departamentos is not valid,
     * or with status {@code 500 (Internal Server Error)} if the departamentos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Departamentos> updateDepartamentos(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Departamentos departamentos
    ) throws URISyntaxException {
        LOG.debug("REST request to update Departamentos : {}, {}", id, departamentos);
        if (departamentos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, departamentos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!departamentosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        departamentos = departamentosRepository.save(departamentos);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, departamentos.getId().toString()))
            .body(departamentos);
    }

    /**
     * {@code PATCH  /departamentos/:id} : Partial updates given fields of an existing departamentos, field will ignore if it is null
     *
     * @param id the id of the departamentos to save.
     * @param departamentos the departamentos to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated departamentos,
     * or with status {@code 400 (Bad Request)} if the departamentos is not valid,
     * or with status {@code 404 (Not Found)} if the departamentos is not found,
     * or with status {@code 500 (Internal Server Error)} if the departamentos couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Departamentos> partialUpdateDepartamentos(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Departamentos departamentos
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Departamentos partially : {}, {}", id, departamentos);
        if (departamentos.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, departamentos.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!departamentosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Departamentos> result = departamentosRepository
            .findById(departamentos.getId())
            .map(existingDepartamentos -> {
                if (departamentos.getNombre() != null) {
                    existingDepartamentos.setNombre(departamentos.getNombre());
                }
                if (departamentos.getUbicacion() != null) {
                    existingDepartamentos.setUbicacion(departamentos.getUbicacion());
                }
                if (departamentos.getPresupuesto() != null) {
                    existingDepartamentos.setPresupuesto(departamentos.getPresupuesto());
                }

                return existingDepartamentos;
            })
            .map(departamentosRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, departamentos.getId().toString())
        );
    }

    /**
     * {@code GET  /departamentos} : get all the departamentos.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of departamentos in body.
     */
    @GetMapping("")
    public List<Departamentos> getAllDepartamentos(
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get all Departamentos");
        if (eagerload) {
            return departamentosRepository.findAllWithEagerRelationships();
        } else {
            return departamentosRepository.findAll();
        }
    }

    /**
     * {@code GET  /departamentos/:id} : get the "id" departamentos.
     *
     * @param id the id of the departamentos to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the departamentos, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Departamentos> getDepartamentos(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Departamentos : {}", id);
        Optional<Departamentos> departamentos = departamentosRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(departamentos);
    }

    /**
     * {@code DELETE  /departamentos/:id} : delete the "id" departamentos.
     *
     * @param id the id of the departamentos to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartamentos(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Departamentos : {}", id);
        departamentosRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
