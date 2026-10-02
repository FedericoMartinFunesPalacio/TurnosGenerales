package com.FedericoFunes.app_service.dtos.user;

import com.FedericoFunes.app_service.entities.Roles;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.management.relation.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseUserDTO {
    private String username;
    private Roles role;
}
