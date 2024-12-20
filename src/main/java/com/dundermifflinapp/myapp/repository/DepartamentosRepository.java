package com.dundermifflinapp.myapp.repository;

import com.dundermifflinapp.myapp.domain.Departamentos;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Departamentos entity.
 */
@Repository
public interface DepartamentosRepository extends JpaRepository<Departamentos, Long> {
    default Optional<Departamentos> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Departamentos> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Departamentos> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select departamentos from Departamentos departamentos left join fetch departamentos.nombrejefe",
        countQuery = "select count(departamentos) from Departamentos departamentos"
    )
    Page<Departamentos> findAllWithToOneRelationships(Pageable pageable);

    @Query("select departamentos from Departamentos departamentos left join fetch departamentos.nombrejefe")
    List<Departamentos> findAllWithToOneRelationships();

    @Query("select departamentos from Departamentos departamentos left join fetch departamentos.nombrejefe where departamentos.id =:id")
    Optional<Departamentos> findOneWithToOneRelationships(@Param("id") Long id);
}
