package com.FedericoFunes.app_service.services.impl;

import com.FedericoFunes.app_service.dtos.turnos.RequestTurnoDTO;
import com.FedericoFunes.app_service.dtos.turnos.ResponseTurnoDTO;
import com.FedericoFunes.app_service.entities.TurnoEntity;
import com.FedericoFunes.app_service.repositories.TurnoRepository;
import com.FedericoFunes.app_service.services.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TurnoServiceImpl implements TurnoService {
    private final TurnoRepository turnoRepository;

    private ResponseTurnoDTO entityToDTO(TurnoEntity turno) {
        return ResponseTurnoDTO.builder()
                .motivo(turno.getMotivo())
                .dia(turno.getDia())
                .hora(turno.getHora())
                .fullName(turno.getFullName())
                .email(turno.getEmail())
                .phone(turno.getPhone())
                .dni(turno.getDni())
                .build();
    }

    private TurnoEntity dtoToEntity(RequestTurnoDTO dto) {
        return TurnoEntity.builder()
                .motivo(dto.getMotivo())
                .dia(dto.getDia())
                .hora(dto.getHora())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .dni(dto.getDni())
                .build();
    }

    private TurnoEntity updateEntity(TurnoEntity entity, RequestTurnoDTO dto) {
        entity.setMotivo(dto.getMotivo());
        entity.setDia(dto.getDia());
        entity.setHora(dto.getHora());
        entity.setFullName(dto.getFullName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        entity.setDni(dto.getDni());
        return entity;
    }

    @Override
    public ResponseTurnoDTO createTurno(RequestTurnoDTO dto) {
        TurnoEntity turno = dtoToEntity(dto);
        return entityToDTO(turnoRepository.save(turno));
    }

    @Override
    public ResponseTurnoDTO updateTurno(RequestTurnoDTO dto, Long id) {
        TurnoEntity turno = turnoRepository.findById(id).orElseThrow(() -> new RuntimeException("Turno no encontrado"));
        return entityToDTO(turnoRepository.save(updateEntity(turno, dto)));
    }

    @Override
    public ResponseTurnoDTO getTurnoById(Long id) {
        return entityToDTO(turnoRepository.findById(id).orElseThrow(() -> new RuntimeException("Turno no encontrado")));
    }

    @Override
    public List<ResponseTurnoDTO> getAllTurnos() {
        List<ResponseTurnoDTO> turnos = new ArrayList<>();
        for (TurnoEntity entity : turnoRepository.findAll()) {
            turnos.add(entityToDTO(entity));
        }
        return turnos;
    }

    @Override
    public void deleteTurno(Long id) {
        turnoRepository.deleteById(id);
    }
}
