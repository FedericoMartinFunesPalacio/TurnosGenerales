package com.FedericoFunes.app_service.services;

import com.FedericoFunes.app_service.dtos.turnos.RequestTurnoDTO;
import com.FedericoFunes.app_service.dtos.turnos.ResponseTurnoDTO;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public interface TurnoService {
    ResponseTurnoDTO createTurno(RequestTurnoDTO turno);
    ResponseTurnoDTO updateTurno(RequestTurnoDTO turno, Long id);
    ResponseTurnoDTO getTurnoById(Long id);
    List<ResponseTurnoDTO> getAllTurnos();
    void deleteTurno(Long id);
}
