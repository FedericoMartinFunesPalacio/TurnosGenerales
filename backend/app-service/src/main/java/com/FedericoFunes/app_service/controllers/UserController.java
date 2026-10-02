package com.FedericoFunes.app_service.controllers;

import com.FedericoFunes.app_service.dtos.user.LoginUserDTO;
import com.FedericoFunes.app_service.dtos.user.RequestUserDTO;
import com.FedericoFunes.app_service.dtos.user.ResetPasswordDTO;
import com.FedericoFunes.app_service.dtos.user.ResponseUserDTO;
import com.FedericoFunes.app_service.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("*")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
public class UserController {
    private final UserService userService;

    @PostMapping("")
    public ResponseEntity<ResponseUserDTO> create(@RequestBody RequestUserDTO us) {
        return ResponseEntity.ok(userService.createUser(us));
    }

    @PutMapping("/login")
    public ResponseEntity<ResponseUserDTO> login(@RequestBody LoginUserDTO us) {
        return ResponseEntity.ok(userService.loginUser(us));
    }

    @PutMapping("/reset")
    public void reset(@RequestBody ResetPasswordDTO us) {
        userService.resetPassword(us);
    }
}
