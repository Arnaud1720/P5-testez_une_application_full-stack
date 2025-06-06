package com.openclassrooms.starterjwt.TU;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)

public class UserServiceTest {
    @InjectMocks
    private UserService userService;
    @Mock
    private UserRepository userRepository;

    @Test
    void givenExistingUserId_whenFindById_thenReturnsUser() {
        // Given
        Long userId = 1L;
        User user = new User(); // ou un user mock
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // When
        User result = userService.findById(userId);

        // Then
        assertNotNull(result);                      // on vérifie que le résultat n’est pas null
        assertEquals(user, result);                 // et que c’est bien le user attendu
        verify(userRepository).findById(userId);    // vérifie qu’on a bien appelé le repository
    }
    @Test
    void givenUnknownUserId_whenFindById_thenReturnsNull() {
        // Given
        Long userId = 42L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // When
        User result = userService.findById(userId);

        // Then
        assertNull(result);                         // ici on vérifie qu’on a bien null
        verify(userRepository).findById(userId);    // et qu’on a bien appelé le repository
    }

    @Test
    void givenUserId_whenDelete_thenCallsRepository() {
        // Given
        Long userId = 1L;

        // When
        userService.delete(userId);

        // Then
        verify(userRepository).deleteById(userId);
    }
}
