package com.FedericoFunes.app_service.dtos.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginUserDTO {

    @NotBlank
    @NotNull
    private String ussername;

    @NotBlank
    @NotNull
    private String password;
}
