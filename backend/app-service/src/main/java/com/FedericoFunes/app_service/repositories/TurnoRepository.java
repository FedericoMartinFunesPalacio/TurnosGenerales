package com.FedericoFunes.app_service.repositories;

import com.FedericoFunes.app_service.entities.TurnoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TurnoRepository extends JpaRepository<TurnoEntity, Long> {
}
