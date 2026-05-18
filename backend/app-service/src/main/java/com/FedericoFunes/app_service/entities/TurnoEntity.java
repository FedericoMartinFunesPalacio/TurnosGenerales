package com.FedericoFunes.app_service.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity(name = "Turnos")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TurnoEntity {
    //DATOS DEL TURNO
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String motivo;

    @Column(nullable = false)
    private LocalDate dia;

    @Column(nullable = false)
    private LocalTime hora;

    @Lob
    @Column(columnDefinition = "BLOB", nullable = true)
    private byte[] archivoPdf;


    //DATOS DEL CONSUMIDOR
    @Column(nullable = false, name = "full_name")
    private String fullName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String dni;
}
