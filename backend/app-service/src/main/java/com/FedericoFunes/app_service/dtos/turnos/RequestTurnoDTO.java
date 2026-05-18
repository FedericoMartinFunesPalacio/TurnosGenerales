package com.FedericoFunes.app_service.dtos.turnos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
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
public class RequestTurnoDTO {
    //DATOS DEL TURNO
    @NotBlank
    @NotNull
    private String motivo;

    @NotBlank
    @NotNull
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dia;

    @NotBlank
    @NotNull
    @JsonFormat(pattern = "HH:mm")
    private LocalTime hora;

    //DATOS DEL CONSUMIDOR
    @NotBlank
    @NotNull
    @JsonProperty("full_name")
    private String fullName;

    @NotBlank
    @NotNull
    @Email
    private String email;

    @NotBlank
    @NotNull
    private String phone;

    @NotBlank
    @NotNull
    private String dni;
}
