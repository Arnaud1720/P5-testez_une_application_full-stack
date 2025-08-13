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
        Long sessionId = 1L;
        Session session = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        Session result = sessionService.getById(sessionId);
        assertNotNull(result);
        assertEquals(session, result);
        verify(sessionRepository).findById(sessionId);
    }

    @Test
    public void givenExistingUserId_whenSessionId_Exception(){
        Long sessionId = 3L;
        Session session = new Session();
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        Session result = sessionService.getById(sessionId);
        assertNotNull(result);
        assertEquals(session, result);
        verify(sessionRepository).findById(sessionId);
    }


    @Test
    void givenSessionsExist_whenFindAll_thenReturnsFullList() {
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
        List<Session> result = sessionService.findAll();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(100L, result.get(0).getId().longValue());
        assertEquals(101L, result.get(1).getId().longValue());
        verify(sessionRepository).findAll();
    }
    @Test
    void givenNoSessions_whenFindAll_thenReturnsEmptyList() {
        when(sessionRepository.findAll()).thenReturn(Collections.emptyList());
        List<Session> result = sessionService.findAll();
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(sessionRepository).findAll();
    }
    @Test
    void givenSessionAndId_whenUpdate_thenSessionSavedWithThatId() {
        Long id = 5L;
        Session inputSession = Session.builder()
                .name("Nouvelle session")
                .date(new Date())
                .description("Description mise à jour")
                .build();
        Session savedSession = Session.builder()
                .id(id)
                .name("Nouvelle session")
                .date(inputSession.getDate())
                .description("Description mise à jour")
                .build();
        when(sessionRepository.save(any(Session.class))).thenReturn(savedSession);

        Session result = sessionService.update(id, inputSession);
        assertNotNull(result);
        assertEquals(savedSession, result);
        assertEquals(id, inputSession.getId());

        verify(sessionRepository).save(inputSession);
    }
    @Test
    void givenSaveReturnsNull_whenUpdate_thenReturnsNull() {
        Long id = 7L;
        Session inputSession = Session.builder()
                .name("Une session")
                .date(new Date())
                .description("Test Null")
                .build();

        when(sessionRepository.save(any(Session.class))).thenReturn(null);
        Session result = sessionService.update(id, inputSession);
        assertNull(result);
        assertEquals(id, inputSession.getId());
        verify(sessionRepository).save(inputSession);
    }

    @Test
    void givenValidIds_whenParticipate_thenUserAdded() {
        Long sessionId = 1L, userId = 10L;

        Session session = Session.builder()
                .id(sessionId)
                .users(new ArrayList<>())
                .build();

        User user = new User();
        user.setId(userId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        sessionService.participate(sessionId, userId);
        assertTrue(session.getUsers().stream()
                .anyMatch(u -> u.getId().equals(userId)));
        verify(sessionRepository).save(session);
    }

    @Test
    void givenUnknownSessionOrUser_whenParticipate_thenThrowsNotFound() {
        when(sessionRepository.findById(5L)).thenReturn(Optional.empty());
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () ->
                sessionService.participate(5L, 99L)
        );
        Session existing = Session.builder().id(2L).users(new ArrayList<>()).build();
        when(sessionRepository.findById(2L)).thenReturn(Optional.of(existing));
        when(userRepository.findById(20L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () ->
                sessionService.participate(2L, 20L)
        );
    }

    @Test
    void givenAlreadyParticipating_whenParticipate_thenThrowsBadRequest() {
        Long sessionId = 3L, userId = 30L;

        User user = new User(); user.setId(userId);
        Session session = Session.builder()
                .id(sessionId)
                .users(new ArrayList<>(List.of(user)))
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        assertThrows(BadRequestException.class, () ->
                sessionService.participate(sessionId, userId)
        );
        verify(sessionRepository, never()).save(any());
    }

    @Test
    void givenParticipatingUser_whenNoLongerParticipate_thenUserRemoved() {
        Long sessionId = 4L, userId = 40L;

        User user = new User(); user.setId(userId);
        Session session = Session.builder()
                .id(sessionId)
                .users(new ArrayList<>(List.of(user)))
                .build();

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        sessionService.noLongerParticipate(sessionId, userId);
        assertTrue(session.getUsers().isEmpty(), "La liste d’utilisateurs doit être vide");
        verify(sessionRepository).save(session);
    }

    @Test
    void givenUserNotParticipating_whenNoLongerParticipate_thenThrowsBadRequest() {
        Long sessionId = 8L,
                userId = 80L;

        Session session = Session.builder()
                .id(sessionId)
                .users(new ArrayList<>())
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
