package com.dundermifflinapp.myapp.web.rest;

import static com.dundermifflinapp.myapp.domain.JefesAsserts.*;
import static com.dundermifflinapp.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dundermifflinapp.myapp.IntegrationTest;
import com.dundermifflinapp.myapp.domain.Jefes;
import com.dundermifflinapp.myapp.repository.JefesRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link JefesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JefesResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFONO = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/jefes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private JefesRepository jefesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJefesMockMvc;

    private Jefes jefes;

    private Jefes insertedJefes;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Jefes createEntity() {
        return new Jefes().nombre(DEFAULT_NOMBRE).telefono(DEFAULT_TELEFONO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Jefes createUpdatedEntity() {
        return new Jefes().nombre(UPDATED_NOMBRE).telefono(UPDATED_TELEFONO);
    }

    @BeforeEach
    public void initTest() {
        jefes = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedJefes != null) {
            jefesRepository.delete(insertedJefes);
            insertedJefes = null;
        }
    }

    @Test
    @Transactional
    void createJefes() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Jefes
        var returnedJefes = om.readValue(
            restJefesMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jefes)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Jefes.class
        );

        // Validate the Jefes in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertJefesUpdatableFieldsEquals(returnedJefes, getPersistedJefes(returnedJefes));

        insertedJefes = returnedJefes;
    }

    @Test
    @Transactional
    void createJefesWithExistingId() throws Exception {
        // Create the Jefes with an existing ID
        jefes.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJefesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jefes)))
            .andExpect(status().isBadRequest());

        // Validate the Jefes in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllJefes() throws Exception {
        // Initialize the database
        insertedJefes = jefesRepository.saveAndFlush(jefes);

        // Get all the jefesList
        restJefesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jefes.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].telefono").value(hasItem(DEFAULT_TELEFONO)));
    }

    @Test
    @Transactional
    void getJefes() throws Exception {
        // Initialize the database
        insertedJefes = jefesRepository.saveAndFlush(jefes);

        // Get the jefes
        restJefesMockMvc
            .perform(get(ENTITY_API_URL_ID, jefes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jefes.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.telefono").value(DEFAULT_TELEFONO));
    }

    @Test
    @Transactional
    void getNonExistingJefes() throws Exception {
        // Get the jefes
        restJefesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingJefes() throws Exception {
        // Initialize the database
        insertedJefes = jefesRepository.saveAndFlush(jefes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the jefes
        Jefes updatedJefes = jefesRepository.findById(jefes.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedJefes are not directly saved in db
        em.detach(updatedJefes);
        updatedJefes.nombre(UPDATED_NOMBRE).telefono(UPDATED_TELEFONO);

        restJefesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJefes.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedJefes))
            )
            .andExpect(status().isOk());

        // Validate the Jefes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedJefesToMatchAllProperties(updatedJefes);
    }

    @Test
    @Transactional
    void putNonExistingJefes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jefes.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJefesMockMvc
            .perform(put(ENTITY_API_URL_ID, jefes.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jefes)))
            .andExpect(status().isBadRequest());

        // Validate the Jefes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJefes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jefes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJefesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(jefes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jefes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJefes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jefes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJefesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(jefes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Jefes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJefesWithPatch() throws Exception {
        // Initialize the database
        insertedJefes = jefesRepository.saveAndFlush(jefes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the jefes using partial update
        Jefes partialUpdatedJefes = new Jefes();
        partialUpdatedJefes.setId(jefes.getId());

        partialUpdatedJefes.nombre(UPDATED_NOMBRE);

        restJefesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJefes.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedJefes))
            )
            .andExpect(status().isOk());

        // Validate the Jefes in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertJefesUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedJefes, jefes), getPersistedJefes(jefes));
    }

    @Test
    @Transactional
    void fullUpdateJefesWithPatch() throws Exception {
        // Initialize the database
        insertedJefes = jefesRepository.saveAndFlush(jefes);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the jefes using partial update
        Jefes partialUpdatedJefes = new Jefes();
        partialUpdatedJefes.setId(jefes.getId());

        partialUpdatedJefes.nombre(UPDATED_NOMBRE).telefono(UPDATED_TELEFONO);

        restJefesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJefes.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedJefes))
            )
            .andExpect(status().isOk());

        // Validate the Jefes in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertJefesUpdatableFieldsEquals(partialUpdatedJefes, getPersistedJefes(partialUpdatedJefes));
    }

    @Test
    @Transactional
    void patchNonExistingJefes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jefes.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJefesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, jefes.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(jefes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jefes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJefes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jefes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJefesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(jefes))
            )
            .andExpect(status().isBadRequest());

        // Validate the Jefes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJefes() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        jefes.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJefesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(jefes)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Jefes in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJefes() throws Exception {
        // Initialize the database
        insertedJefes = jefesRepository.saveAndFlush(jefes);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the jefes
        restJefesMockMvc
            .perform(delete(ENTITY_API_URL_ID, jefes.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return jefesRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Jefes getPersistedJefes(Jefes jefes) {
        return jefesRepository.findById(jefes.getId()).orElseThrow();
    }

    protected void assertPersistedJefesToMatchAllProperties(Jefes expectedJefes) {
        assertJefesAllPropertiesEquals(expectedJefes, getPersistedJefes(expectedJefes));
    }

    protected void assertPersistedJefesToMatchUpdatableProperties(Jefes expectedJefes) {
        assertJefesAllUpdatablePropertiesEquals(expectedJefes, getPersistedJefes(expectedJefes));
    }
}
