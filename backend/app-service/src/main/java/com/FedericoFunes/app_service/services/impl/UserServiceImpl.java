package com.FedericoFunes.app_service.services.impl;

import com.FedericoFunes.app_service.dtos.user.LoginUserDTO;
import com.FedericoFunes.app_service.dtos.user.RequestUserDTO;
import com.FedericoFunes.app_service.dtos.user.ResetPasswordDTO;
import com.FedericoFunes.app_service.dtos.user.ResponseUserDTO;
import com.FedericoFunes.app_service.entities.Roles;
import com.FedericoFunes.app_service.entities.UserEntity;
import com.FedericoFunes.app_service.repositories.UserRepository;
import com.FedericoFunes.app_service.services.EmailService;
import com.FedericoFunes.app_service.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public ResponseUserDTO createUser(RequestUserDTO requestUserDTO) {
        UserEntity userEntity = new UserEntity();

        userEntity.setUssername(requestUserDTO.getUsername());
        userEntity.setPassword(requestUserDTO.getPassword());
        userEntity.setEmail(requestUserDTO.getEmail());
        userEntity.setPhone(requestUserDTO.getPhone());
        if(requestUserDTO.getRole().equals(Roles.ADMIN)) {
            throw new ResponseStatusException(HttpStatusCode.valueOf(403), "Cannot assign admin role");
        }
        userEntity.setRole(requestUserDTO.getRole());


        userRepository.save(userEntity);

        ResponseUserDTO responseUserDTO = new ResponseUserDTO();

        responseUserDTO.setUsername(userEntity.getUssername());
        responseUserDTO.setRole(userEntity.getRole());
        return responseUserDTO;
    }

    @Override
    public ResponseUserDTO loginUser(LoginUserDTO login) {
        return userRepository.findByUssername(login.getUssername())
                .filter(userEntity -> userEntity.getPassword().equals(login.getPassword()))
                .map(userEntity -> {
                    ResponseUserDTO responseUserDTO = new ResponseUserDTO();
                    responseUserDTO.setUsername(userEntity.getUssername());
                    responseUserDTO.setRole(userEntity.getRole());
                    return responseUserDTO;
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatusCode.valueOf(401), "Usuario o contraseña inválidos"));
    }

    @Override
    public void resetPassword(ResetPasswordDTO reset) {
        UserEntity userReset = userRepository.findByUssername(reset.getUssername())
                .orElseThrow(() -> new ResponseStatusException(HttpStatusCode.valueOf(404), "Usuario no encontrado"));
        if (userReset.getEmail().equals(reset.getEmail())) {
            //ENVIAR EMAIL CON LINK DEL FORMULARIO DE RESETEO
            emailService.enviarCorreo(reset.getEmail(),
                    "Restablecimiento de contraseña",
                    "Haga clic en el siguiente enlace para restablecer su contraseña: ");
        }
        else {
            throw new ResponseStatusException(HttpStatusCode.valueOf(401), "Email no coincide con el registrado");
        }
    }
}
