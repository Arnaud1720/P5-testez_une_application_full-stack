package com.openclassrooms.starterjwt.TI;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import javax.validation.ConstraintViolationException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class SessionIntegrationTest {
    @Autowired
    private SessionService sessionService;

    @Autowired
    private SessionRepository sessionRepository;

    @BeforeEach
    void cleanDatabase() {
        sessionRepository.deleteAll();

    }

    @Test
    public void givenExistingSessionId_whenFindById_thenReturnsSession() {
        // --- Given ---
        Session s = new Session();
        s.setName("TI Session 1");
        s.setDate(new Date());
        s.setDescription("Description TI 1");
        Session saved = sessionRepository.save(s);
        Long sessionId = saved.getId();
        assertNotNull(sessionId);

        // --- When ---
        Session result = sessionService.getById(sessionId);

        // --- Then ---
        assertNotNull(result);
        assertEquals(sessionId, result.getId());
        assertEquals("TI Session 1", result.getName());

        Optional<Session> fromDb = sessionRepository.findById(sessionId);
        assertTrue(fromDb.isPresent());
        assertEquals("TI Session 1", fromDb.get().getName());
    }

    @Test
    void givenSessionsExist_whenFindAll_thenReturnsFullList() {
        // --- Given ---
        Session s1 = new Session();
        s1.setName("TI All 1");
        s1.setDate(new Date());
        s1.setDescription("Desc All 1");
        Session saved1 = sessionRepository.save(s1);

        Session s2 = new Session();
        s2.setName("TI All 2");
        s2.setDate(new Date());
        s2.setDescription("Desc All 2");
        Session saved2 = sessionRepository.save(s2);

        // --- When ---
        List<Session> result = sessionService.findAll();

        // --- Then ---
        assertNotNull(result);
        assertEquals(2, result.size());
        boolean found1 = result.stream().anyMatch(sess -> sess.getId().equals(saved1.getId()));
        boolean found2 = result.stream().anyMatch(sess -> sess.getId().equals(saved2.getId()));
        assertTrue(found1);
        assertTrue(found2);
    }

    @Test
    void givenNoSessions_whenFindAll_thenReturnsEmptyList() {
        // --- Given ---
        // Base déjà vide après @BeforeEach

        // --- When ---
        List<Session> result = sessionService.findAll();

        // --- Then ---
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void givenExistingSessionAndId_whenUpdate_thenSessionIsUpdatedInDatabase() {
        // --- Given ---
        Session original = new Session();
        original.setName("Original Name");
        original.setDate(new Date());
        original.setDescription("Original Desc");
        Session savedOriginal = sessionRepository.save(original);
        Long existingId = savedOriginal.getId();

        Session toUpdate = new Session();
        toUpdate.setName("Updated Name");
        toUpdate.setDate(new Date(System.currentTimeMillis() + 86400000)); // + 1 jour
        toUpdate.setDescription("Updated Desc");

        // --- When ---
        Session updatedResult = sessionService.update(existingId, toUpdate);

        // --- Then ---
        assertNotNull(updatedResult);
        assertEquals(existingId, updatedResult.getId());
        assertEquals("Updated Name", updatedResult.getName());
        assertEquals("Updated Desc", updatedResult.getDescription());

        Optional<Session> fromDb = sessionRepository.findById(existingId);
        assertTrue(fromDb.isPresent());
        assertEquals("Updated Name", fromDb.get().getName());
    }

    @Test
    void givenInvalidUpdateData_whenUpdate_thenThrowsConstraintViolation() {
        // --- Given ---
        Session original = new Session();
        original.setName("Name");
        original.setDate(new Date());
        original.setDescription("Desc");
        Session savedOriginal = sessionRepository.save(original);
        Long id = savedOriginal.getId();

        Session toUpdate = new Session();
        toUpdate.setName("");
        toUpdate.setDate(null);
        toUpdate.setDescription("X");     // supposons que @Size(min=…) soit plus long
        toUpdate.setId(id);

        // --- When & Then ---
        assertThrows(ConstraintViolationException.class, () -> {
            sessionService.update(id, toUpdate);
        });
    }

}
