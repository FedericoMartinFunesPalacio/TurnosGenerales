package com.FedericoFunes.app_service.services;

import com.FedericoFunes.app_service.dtos.user.LoginUserDTO;
import com.FedericoFunes.app_service.dtos.user.RequestUserDTO;
import com.FedericoFunes.app_service.dtos.user.ResetPasswordDTO;
import com.FedericoFunes.app_service.dtos.user.ResponseUserDTO;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    ResponseUserDTO createUser(RequestUserDTO requestUserDTO);
    ResponseUserDTO loginUser(LoginUserDTO login);
    void resetPassword(ResetPasswordDTO reset);
}
