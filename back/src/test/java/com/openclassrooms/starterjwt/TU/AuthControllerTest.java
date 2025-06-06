package com.openclassrooms.starterjwt.TU;

import com.openclassrooms.starterjwt.controllers.AuthController;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.openclassrooms.starterjwt.models.User;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthControllerTest {
    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthController authController;

    @Test
    void givenEmailNotTaken_whenRegisterUser_thenReturnsSuccess() {
        // Given
        SignupRequest request = new SignupRequest(
                "arnaud1720@gmail.com", "DERISBOURG", "Arnaud", "#Chester33980H1"
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");

        // When
        ResponseEntity<?> response = authController.registerUser(request);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());

        MessageResponse body = (MessageResponse) response.getBody();
        assertNotNull(body);
        assertEquals("User registered successfully!", body.getMessage());

        verify(userRepository).save(any(User.class));
    }

    @Test
    void givenEmailAlreadyExists_whenRegisterUser_thenReturnsBadRequest() {
        // Given
        SignupRequest request = new SignupRequest(
                "arnaud1720@gmail.com", "DERISBOURG", "Arnaud", "#Chester33980H1"
        );

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // When
        ResponseEntity<?> response = authController.registerUser(request);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());

        MessageResponse body = (MessageResponse) response.getBody();
        assertNotNull(body);
        assertEquals("Error: Email is already taken!", body.getMessage());

        verify(userRepository, never()).save(any(User.class));
    }
}

