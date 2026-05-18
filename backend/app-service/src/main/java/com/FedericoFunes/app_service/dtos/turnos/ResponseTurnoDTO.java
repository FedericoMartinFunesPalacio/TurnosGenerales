package com.FedericoFunes.app_service.dtos.turnos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseTurnoDTO {
    //DATOS DEL TURNO
    private String motivo;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dia;

    @JsonFormat(pattern = "HH:mm")
    private LocalTime hora;


    //DATOS DEL CONSUMIDOR
    @JsonProperty("full_name")
    private String fullName;

    @Email
    private String email;

    private String phone;

    private String dni;
}
