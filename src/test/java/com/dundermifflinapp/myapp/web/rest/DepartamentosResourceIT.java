package com.dundermifflinapp.myapp.web.rest;

import static com.dundermifflinapp.myapp.domain.DepartamentosAsserts.*;
import static com.dundermifflinapp.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static com.dundermifflinapp.myapp.web.rest.TestUtil.sameNumber;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.dundermifflinapp.myapp.IntegrationTest;
import com.dundermifflinapp.myapp.domain.Departamentos;
import com.dundermifflinapp.myapp.repository.DepartamentosRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link DepartamentosResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class DepartamentosResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_UBICACION = "AAAAAAAAAA";
    private static final String UPDATED_UBICACION = "BBBBBBBBBB";

    private static final BigDecimal DEFAULT_PRESUPUESTO = new BigDecimal(1);
    private static final BigDecimal UPDATED_PRESUPUESTO = new BigDecimal(2);

    private static final String ENTITY_API_URL = "/api/departamentos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DepartamentosRepository departamentosRepository;

    @Mock
    private DepartamentosRepository departamentosRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDepartamentosMockMvc;

    private Departamentos departamentos;

    private Departamentos insertedDepartamentos;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Departamentos createEntity() {
        return new Departamentos().nombre(DEFAULT_NOMBRE).ubicacion(DEFAULT_UBICACION).presupuesto(DEFAULT_PRESUPUESTO);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Departamentos createUpdatedEntity() {
        return new Departamentos().nombre(UPDATED_NOMBRE).ubicacion(UPDATED_UBICACION).presupuesto(UPDATED_PRESUPUESTO);
    }

    @BeforeEach
    public void initTest() {
        departamentos = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedDepartamentos != null) {
            departamentosRepository.delete(insertedDepartamentos);
            insertedDepartamentos = null;
        }
    }

    @Test
    @Transactional
    void createDepartamentos() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Departamentos
        var returnedDepartamentos = om.readValue(
            restDepartamentosMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(departamentos)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Departamentos.class
        );

        // Validate the Departamentos in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDepartamentosUpdatableFieldsEquals(returnedDepartamentos, getPersistedDepartamentos(returnedDepartamentos));

        insertedDepartamentos = returnedDepartamentos;
    }

    @Test
    @Transactional
    void createDepartamentosWithExistingId() throws Exception {
        // Create the Departamentos with an existing ID
        departamentos.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDepartamentosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(departamentos)))
            .andExpect(status().isBadRequest());

        // Validate the Departamentos in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDepartamentos() throws Exception {
        // Initialize the database
        insertedDepartamentos = departamentosRepository.saveAndFlush(departamentos);

        // Get all the departamentosList
        restDepartamentosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(departamentos.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].ubicacion").value(hasItem(DEFAULT_UBICACION)))
            .andExpect(jsonPath("$.[*].presupuesto").value(hasItem(sameNumber(DEFAULT_PRESUPUESTO))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDepartamentosWithEagerRelationshipsIsEnabled() throws Exception {
        when(departamentosRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDepartamentosMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(departamentosRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllDepartamentosWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(departamentosRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restDepartamentosMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(departamentosRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getDepartamentos() throws Exception {
        // Initialize the database
        insertedDepartamentos = departamentosRepository.saveAndFlush(departamentos);

        // Get the departamentos
        restDepartamentosMockMvc
            .perform(get(ENTITY_API_URL_ID, departamentos.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(departamentos.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.ubicacion").value(DEFAULT_UBICACION))
            .andExpect(jsonPath("$.presupuesto").value(sameNumber(DEFAULT_PRESUPUESTO)));
    }

    @Test
    @Transactional
    void getNonExistingDepartamentos() throws Exception {
        // Get the departamentos
        restDepartamentosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDepartamentos() throws Exception {
        // Initialize the database
        insertedDepartamentos = departamentosRepository.saveAndFlush(departamentos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the departamentos
        Departamentos updatedDepartamentos = departamentosRepository.findById(departamentos.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDepartamentos are not directly saved in db
        em.detach(updatedDepartamentos);
        updatedDepartamentos.nombre(UPDATED_NOMBRE).ubicacion(UPDATED_UBICACION).presupuesto(UPDATED_PRESUPUESTO);

        restDepartamentosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDepartamentos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDepartamentos))
            )
            .andExpect(status().isOk());

        // Validate the Departamentos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDepartamentosToMatchAllProperties(updatedDepartamentos);
    }

    @Test
    @Transactional
    void putNonExistingDepartamentos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departamentos.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDepartamentosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, departamentos.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(departamentos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Departamentos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDepartamentos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departamentos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDepartamentosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(departamentos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Departamentos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDepartamentos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departamentos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDepartamentosMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(departamentos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Departamentos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDepartamentosWithPatch() throws Exception {
        // Initialize the database
        insertedDepartamentos = departamentosRepository.saveAndFlush(departamentos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the departamentos using partial update
        Departamentos partialUpdatedDepartamentos = new Departamentos();
        partialUpdatedDepartamentos.setId(departamentos.getId());

        partialUpdatedDepartamentos.nombre(UPDATED_NOMBRE).ubicacion(UPDATED_UBICACION).presupuesto(UPDATED_PRESUPUESTO);

        restDepartamentosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDepartamentos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDepartamentos))
            )
            .andExpect(status().isOk());

        // Validate the Departamentos in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDepartamentosUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedDepartamentos, departamentos),
            getPersistedDepartamentos(departamentos)
        );
    }

    @Test
    @Transactional
    void fullUpdateDepartamentosWithPatch() throws Exception {
        // Initialize the database
        insertedDepartamentos = departamentosRepository.saveAndFlush(departamentos);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the departamentos using partial update
        Departamentos partialUpdatedDepartamentos = new Departamentos();
        partialUpdatedDepartamentos.setId(departamentos.getId());

        partialUpdatedDepartamentos.nombre(UPDATED_NOMBRE).ubicacion(UPDATED_UBICACION).presupuesto(UPDATED_PRESUPUESTO);

        restDepartamentosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDepartamentos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDepartamentos))
            )
            .andExpect(status().isOk());

        // Validate the Departamentos in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDepartamentosUpdatableFieldsEquals(partialUpdatedDepartamentos, getPersistedDepartamentos(partialUpdatedDepartamentos));
    }

    @Test
    @Transactional
    void patchNonExistingDepartamentos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departamentos.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDepartamentosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, departamentos.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(departamentos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Departamentos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDepartamentos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departamentos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDepartamentosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(departamentos))
            )
            .andExpect(status().isBadRequest());

        // Validate the Departamentos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDepartamentos() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        departamentos.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDepartamentosMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(departamentos)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Departamentos in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDepartamentos() throws Exception {
        // Initialize the database
        insertedDepartamentos = departamentosRepository.saveAndFlush(departamentos);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the departamentos
        restDepartamentosMockMvc
            .perform(delete(ENTITY_API_URL_ID, departamentos.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return departamentosRepository.count();
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

    protected Departamentos getPersistedDepartamentos(Departamentos departamentos) {
        return departamentosRepository.findById(departamentos.getId()).orElseThrow();
    }

    protected void assertPersistedDepartamentosToMatchAllProperties(Departamentos expectedDepartamentos) {
        assertDepartamentosAllPropertiesEquals(expectedDepartamentos, getPersistedDepartamentos(expectedDepartamentos));
    }

    protected void assertPersistedDepartamentosToMatchUpdatableProperties(Departamentos expectedDepartamentos) {
        assertDepartamentosAllUpdatablePropertiesEquals(expectedDepartamentos, getPersistedDepartamentos(expectedDepartamentos));
    }
}
