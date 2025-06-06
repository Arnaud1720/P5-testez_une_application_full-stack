package com.openclassrooms.starterjwt.TU;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {
    @InjectMocks
    SessionService sessionService;
    @Mock
    SessionRepository sessionRepository;

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

}
