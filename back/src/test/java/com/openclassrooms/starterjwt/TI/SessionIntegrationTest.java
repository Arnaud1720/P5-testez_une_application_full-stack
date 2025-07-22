package com.openclassrooms.starterjwt.TI;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
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

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDatabase() {
        sessionRepository.deleteAll();

    }

    // 1) test create(Session)
    @Test
    void whenCreate_thenSessionIsPersisted() {
        Session s = new Session();
        s.setName("Nouvelle TI");
        s.setDate(new Date());
        s.setDescription("Desc TI create");

        Session saved = sessionService.create(s);
        assertNotNull(saved.getId(), "L'ID doit être généré");
        assertEquals("Nouvelle TI", saved.getName());

        // Vérification directe en base
        Optional<Session> fromDb = sessionRepository.findById(saved.getId());
        assertTrue(fromDb.isPresent());
        assertEquals("Desc TI create", fromDb.get().getDescription());
    }


    // 2) test delete(Long)
    @Test
    void givenExistingSession_whenDelete_thenGoneFromDatabase() {
        Session s = new Session();
        s.setName("TI à supprimer");
        s.setDate(new Date());
        s.setDescription("Desc");
        Session saved = sessionRepository.save(s);

        sessionService.delete(saved.getId());

        assertFalse(sessionRepository.findById(saved.getId()).isPresent(),
                "La session ne doit plus exister");
    }

    // 3) findAll()
    @Test
    void givenSomeSessions_whenFindAll_thenReturnsThem() {
        Session s1 = new Session(); s1.setName("A"); s1.setDate(new Date()); s1.setDescription("A");
        Session s2 = new Session(); s2.setName("B"); s2.setDate(new Date()); s2.setDescription("B");
        sessionRepository.saveAll(List.of(s1, s2));

        List<Session> all = sessionService.findAll();
        assertEquals(2, all.size());
        // on vérifie par noms
        assertTrue(all.stream().anyMatch(s -> s.getName().equals("A")));
        assertTrue(all.stream().anyMatch(s -> s.getName().equals("B")));
    }

    // 4) getById(Long)
    @Test
    void givenUnknownId_whenGetById_thenReturnsNull() {
        assertNull(sessionService.getById(999L));
    }

    @Test
    void givenKnownId_whenGetById_thenReturnsSession() {
        Session s = sessionRepository.save(new Session()
                .setName("TI getById")
                .setDate(new Date())
                .setDescription("D"));
        Session fetched = sessionService.getById(s.getId());
        assertNotNull(fetched);
        assertEquals("TI getById", fetched.getName());
    }

    // 5) update(Long, Session)
    @Test
    void givenExistingId_whenUpdate_thenSessionUpdated() {
        Session orig = sessionRepository.save(new Session()
                .setName("Before")
                .setDate(new Date())
                .setDescription("Desc"));
        Session toUpdate = new Session()
                .setName("After")
                .setDate(new Date())
                .setDescription("NewDesc");
        Session updated = sessionService.update(orig.getId(), toUpdate);

        assertEquals(orig.getId(), updated.getId());
        assertEquals("After", updated.getName());
        // relecture en base
        Session fromDb = sessionRepository.findById(orig.getId()).orElseThrow();
        assertEquals("NewDesc", fromDb.getDescription());
    }

    // 6) participate(Long, Long)
    @Test
    void givenValidSessionAndUser_whenParticipate_thenUserInSession() {
        User u = userRepository.save(new User().setEmail("a@b.com").setFirstName("A").setLastName("B").setPassword("pwd"));
        Session s = sessionRepository.save(new Session()
                .setName("TI P")
                .setDate(new Date())
                .setDescription("D"));

        sessionService.participate(s.getId(), u.getId());

        Session fromDb = sessionRepository.findById(s.getId()).orElseThrow();
        assertTrue(fromDb.getUsers().stream().anyMatch(x -> x.getId().equals(u.getId())));
    }

    @Test
    void givenAlreadyParticipating_whenParticipate_thenBadRequest() {
        User u = userRepository.save(new User().setEmail("x@x.com").setFirstName("X").setLastName("X").setPassword("pwd"));
        Session s = sessionRepository.save(new Session()
                .setName("TI P2")
                .setDate(new Date())
                .setDescription("D")
                .setUsers(List.of(u)));

        assertThrows(BadRequestException.class,
                () -> sessionService.participate(s.getId(), u.getId()));
    }

    @Test
    void givenUnknownSessionOrUser_whenParticipate_thenNotFound() {
        // session inconnue
        assertThrows(NotFoundException.class,
                () -> sessionService.participate(111L, 222L));
        // session valide, user manquant
        Session s = sessionRepository.save(new Session()
                .setName("TI P3")
                .setDate(new Date())
                .setDescription("D"));
        assertThrows(NotFoundException.class,
                () -> sessionService.participate(s.getId(), 999L));
    }

    // 7) noLongerParticipate(Long, Long)
    @Test
    void givenParticipatingUser_whenNoLongerParticipate_thenRemoved() {
        User u = userRepository.save(new User().setEmail("r@r.com").setFirstName("R").setLastName("R").setPassword("pwd"));
        Session s = sessionRepository.save(new Session()
                .setName("TI NP")
                .setDate(new Date())
                .setDescription("D")
                .setUsers(List.of(u)));

        sessionService.noLongerParticipate(s.getId(), u.getId());

        Session after = sessionRepository.findById(s.getId()).orElseThrow();
        assertTrue(after.getUsers().isEmpty());
    }

    @Test
    void givenNotParticipatingUser_whenNoLongerParticipate_thenBadRequest() {
        Session s = sessionRepository.save(new Session()
                .setName("TI NP2")
                .setDate(new Date())
                .setDescription("D")
                .setUsers(List.of()));
        assertThrows(BadRequestException.class,
                () -> sessionService.noLongerParticipate(s.getId(), 123L));
    }

    @Test
    void givenUnknownSession_whenNoLongerParticipate_thenNotFound() {
        assertThrows(NotFoundException.class,
                () -> sessionService.noLongerParticipate(555L, 1L));
    }

}
