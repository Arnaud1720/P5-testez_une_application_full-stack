package com.openclassrooms.starterjwt.TU;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {
    @InjectMocks
    SessionService sessionService;
    @Mock
    SessionRepository sessionRepository;
    @Mock
    UserRepository userRepository;
    @Test
    public void givenExistingUserId_whenFindById_thenReturnsUser(){
        //Given
        Long sessionId = 1L;
        Session session = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        //When
        Session result = sessionService.getById(sessionId);
        //Then
        assertNotNull(result);                      // on vérifie que le résultat n’est pas null
        assertEquals(session, result);                 // et que c’est bien le user attendu
        verify(sessionRepository).findById(sessionId);    // vérifie qu’on a bien appelé le repository
    }

    @Test
    public void givenExistingUserId_whenSessionId_Exception(){
        //Given
        Long sessionId = 3L;
        Session session = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        //When
        Session result = sessionService.getById(sessionId);
        //Then
        assertNotNull(result);                      // on vérifie que le résultat n’est pas null
        assertEquals(session, result);                 // et que c’est bien le user attendu
        verify(sessionRepository).findById(sessionId);    // vérifie qu’on a bien appelé le repository
    }


    @Test
    void givenSessionsExist_whenFindAll_thenReturnsFullList() {
        // --- Given ---
        Session s1 = Session.builder()
                .id(100L)
                .name("Session Alpha")
                .date(new Date())
                .description("Description Alpha")
                .build();
        Session s2 = Session.builder()
                .id(101L)
                .name("Session Beta")
                .date(new Date())
                .description("Description Beta")
                .build();

        List<Session> mockedList = List.of(s1, s2);
        when(sessionRepository.findAll()).thenReturn(mockedList);

        // --- When ---
        List<Session> result = sessionService.findAll();

        // --- Then ---
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(100L, result.get(0).getId().longValue());
        assertEquals(101L, result.get(1).getId().longValue());
        verify(sessionRepository).findAll();
    }
    @Test
    void givenNoSessions_whenFindAll_thenReturnsEmptyList() {
        // --- Given ---
        when(sessionRepository.findAll()).thenReturn(Collections.emptyList());

        // --- When ---
        List<Session> result = sessionService.findAll();

        // --- Then ---
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(sessionRepository).findAll();
    }
    @Test
    void givenSessionAndId_whenUpdate_thenSessionSavedWithThatId() {
        // --- Given ---
        Long id = 5L;
        // Crée une instance “brute” de Session (sans ID car on simule une mise à jour d’une session préexistante)
        Session inputSession = Session.builder()
                .name("Nouvelle session")
                .date(new Date())
                .description("Description mise à jour")
                .build();
        // Variante : on peut construire un deuxième objet pour simuler ce que la couche repository renvoie
        Session savedSession = Session.builder()
                .id(id)
                .name("Nouvelle session")
                .date(inputSession.getDate())
                .description("Description mise à jour")
                .build();

        // On dit à Mockito que, quand on appelle save(...) avec n’importe quelle Session,
        // il faut renvoyer savedSession.
        when(sessionRepository.save(any(Session.class))).thenReturn(savedSession);

        // --- When ---
        Session result = sessionService.update(id, inputSession);

        // --- Then ---
        // 1) L’objet retourné par update(...) doit être exactement savedSession
        assertNotNull(result);
        assertEquals(savedSession, result);

        // 2) Après l’appel à service.update(...), inputSession a dû recevoir l’ID 5L
        assertEquals(id, inputSession.getId());

        // 3) On vérifie bien que c’est “le même” inputSession (avec son ID mis à jour)
        //    qui a été passé à repository.save(...)
        verify(sessionRepository).save(inputSession);
    }
    @Test
    void givenSaveReturnsNull_whenUpdate_thenReturnsNull() {
        // --- Given ---
        Long id = 7L;
        Session inputSession = Session.builder()
                .name("Une session")
                .date(new Date())
                .description("Test Null")
                .build();

        // On force le repository à renvoyer null (par exemple si la BDD a un problème).
        when(sessionRepository.save(any(Session.class))).thenReturn(null);

        // --- When ---
        Session result = sessionService.update(id, inputSession);

        // --- Then ---
        // Si save(...) renvoie null, alors update(...) doit aussi renvoyer null
        assertNull(result);

        // On vérifie aussi que, même si save renvoie null, on a bien appelé save(...)
        // sur l’objet dont l’ID a été défini à 7L.
        assertEquals(id, inputSession.getId());
        verify(sessionRepository).save(inputSession);
    }

    @Test
    void givenValidIds_whenParticipate_thenUserAdded() {
        // --- Given ---
        Long sessionId = 1L, userId = 10L;

        Session session = Session.builder()
                .id(sessionId)
                .users(new ArrayList<>())
                .build();

        User user = new User();
        user.setId(userId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // --- When ---
        sessionService.participate(sessionId, userId);

        // --- Then ---
        // Vérifie que l’utilisateur a bien été ajouté à la liste
        assertTrue(session.getUsers().stream()
                .anyMatch(u -> u.getId().equals(userId)));

        // Et que la session (mise à jour) a bien été sauvegardée
        verify(sessionRepository).save(session);
    }

    @Test
    void givenUnknownSessionOrUser_whenParticipate_thenThrowsNotFound() {
        // --- Given ---
        when(sessionRepository.findById(5L)).thenReturn(Optional.empty());
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        // --- When / Then ---
        assertThrows(NotFoundException.class, () ->
                sessionService.participate(5L, 99L)
        );

        // On peut aussi tester l’autre branche (session existante mais user absent)
        Session existing = Session.builder().id(2L).users(new ArrayList<>()).build();
        when(sessionRepository.findById(2L)).thenReturn(Optional.of(existing));
        when(userRepository.findById(20L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () ->
                sessionService.participate(2L, 20L)
        );
    }

    @Test
    void givenAlreadyParticipating_whenParticipate_thenThrowsBadRequest() {
        // --- Given ---
        Long sessionId = 3L, userId = 30L;

        User user = new User(); user.setId(userId);
        Session session = Session.builder()
                .id(sessionId)
                .users(new ArrayList<>(List.of(user)))
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // --- When / Then ---
        assertThrows(BadRequestException.class, () ->
                sessionService.participate(sessionId, userId)
        );

        // Et on ne doit pas appeler save()
        verify(sessionRepository, never()).save(any());
    }

    @Test
    void givenParticipatingUser_whenNoLongerParticipate_thenUserRemoved() {
        // --- Given ---
        Long sessionId = 4L, userId = 40L;

        User user = new User(); user.setId(userId);
        Session session = Session.builder()
                .id(sessionId)
                .users(new ArrayList<>(List.of(user)))
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        // --- When ---
        sessionService.noLongerParticipate(sessionId, userId);

        // --- Then ---
        assertTrue(session.getUsers().isEmpty(), "La liste d’utilisateurs doit être vide");
        verify(sessionRepository).save(session);
    }

    @Test
    void givenUserNotParticipating_whenNoLongerParticipate_thenThrowsBadRequest() {
        Long sessionId = 8L,
                userId = 80L;

        Session session = Session.builder()
                .id(sessionId)
                .users(new ArrayList<>())  // liste vide → user pas présent
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () ->
                sessionService.noLongerParticipate(sessionId, userId)
        );
        verify(sessionRepository, never()).save(any());
    }
    @Test
    void givenUnknownSession_whenNoLongerParticipate_thenThrowsNotFound() {
        when(sessionRepository.findById(7L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () ->
                sessionService.noLongerParticipate(7L, 70L)
        );
        verify(sessionRepository, never()).save(any());
    }

}
