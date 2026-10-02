package com.FedericoFunes.app_service.controllers;

import com.FedericoFunes.app_service.dtos.turnos.RequestTurnoDTO;
import com.FedericoFunes.app_service.dtos.turnos.ResponseTurnoDTO;
import com.FedericoFunes.app_service.services.TurnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/turnos")
public class TurnoController {
    private final TurnoService turnoService;

    @GetMapping("")
    public ResponseEntity<List<ResponseTurnoDTO>> getAllTurnos() {
        return ResponseEntity.ok(turnoService.getAllTurnos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseTurnoDTO> getTurnoById(@PathVariable Long id) {
        return ResponseEntity.ok(turnoService.getTurnoById(id));
    }

    @PostMapping("")
    public ResponseEntity<ResponseTurnoDTO> createTurno(@RequestBody RequestTurnoDTO turno) {
        return ResponseEntity.ok(turnoService.createTurno(turno));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseTurnoDTO> updateTurno(@RequestBody RequestTurnoDTO turno, @PathVariable Long id) {
        return ResponseEntity.ok(turnoService.updateTurno(turno, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTurno(@PathVariable Long id) {
        turnoService.deleteTurno(id);
        return ResponseEntity.noContent().build();
    }
}

