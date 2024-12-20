package com.dundermifflinapp.myapp.web.rest;

import com.dundermifflinapp.myapp.domain.Jefes;
import com.dundermifflinapp.myapp.repository.JefesRepository;
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
 * REST controller for managing {@link com.dundermifflinapp.myapp.domain.Jefes}.
 */
@RestController
@RequestMapping("/api/jefes")
@Transactional
public class JefesResource {

    private static final Logger LOG = LoggerFactory.getLogger(JefesResource.class);

    private static final String ENTITY_NAME = "jefes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JefesRepository jefesRepository;

    public JefesResource(JefesRepository jefesRepository) {
        this.jefesRepository = jefesRepository;
    }

    /**
     * {@code POST  /jefes} : Create a new jefes.
     *
     * @param jefes the jefes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jefes, or with status {@code 400 (Bad Request)} if the jefes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Jefes> createJefes(@RequestBody Jefes jefes) throws URISyntaxException {
        LOG.debug("REST request to save Jefes : {}", jefes);
        if (jefes.getId() != null) {
            throw new BadRequestAlertException("A new jefes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        jefes = jefesRepository.save(jefes);
        return ResponseEntity.created(new URI("/api/jefes/" + jefes.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, jefes.getId().toString()))
            .body(jefes);
    }

    /**
     * {@code PUT  /jefes/:id} : Updates an existing jefes.
     *
     * @param id the id of the jefes to save.
     * @param jefes the jefes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jefes,
     * or with status {@code 400 (Bad Request)} if the jefes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jefes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Jefes> updateJefes(@PathVariable(value = "id", required = false) final Long id, @RequestBody Jefes jefes)
        throws URISyntaxException {
        LOG.debug("REST request to update Jefes : {}, {}", id, jefes);
        if (jefes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jefes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jefesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        jefes = jefesRepository.save(jefes);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jefes.getId().toString()))
            .body(jefes);
    }

    /**
     * {@code PATCH  /jefes/:id} : Partial updates given fields of an existing jefes, field will ignore if it is null
     *
     * @param id the id of the jefes to save.
     * @param jefes the jefes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jefes,
     * or with status {@code 400 (Bad Request)} if the jefes is not valid,
     * or with status {@code 404 (Not Found)} if the jefes is not found,
     * or with status {@code 500 (Internal Server Error)} if the jefes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Jefes> partialUpdateJefes(@PathVariable(value = "id", required = false) final Long id, @RequestBody Jefes jefes)
        throws URISyntaxException {
        LOG.debug("REST request to partial update Jefes partially : {}, {}", id, jefes);
        if (jefes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, jefes.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!jefesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Jefes> result = jefesRepository
            .findById(jefes.getId())
            .map(existingJefes -> {
                if (jefes.getNombre() != null) {
                    existingJefes.setNombre(jefes.getNombre());
                }
                if (jefes.getTelefono() != null) {
                    existingJefes.setTelefono(jefes.getTelefono());
                }

                return existingJefes;
            })
            .map(jefesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, jefes.getId().toString())
        );
    }

    /**
     * {@code GET  /jefes} : get all the jefes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jefes in body.
     */
    @GetMapping("")
    public List<Jefes> getAllJefes() {
        LOG.debug("REST request to get all Jefes");
        return jefesRepository.findAll();
    }

    /**
     * {@code GET  /jefes/:id} : get the "id" jefes.
     *
     * @param id the id of the jefes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jefes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Jefes> getJefes(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Jefes : {}", id);
        Optional<Jefes> jefes = jefesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(jefes);
    }

    /**
     * {@code DELETE  /jefes/:id} : delete the "id" jefes.
     *
     * @param id the id of the jefes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJefes(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Jefes : {}", id);
        jefesRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
