package com.openclassrooms.starterjwt.TI;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")                              // <- lit src/test/resources/application-test.properties
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
public class LoginIT {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;
    @Autowired org.springframework.core.env.Environment env;
    @Autowired javax.sql.DataSource ds;


    @BeforeEach
    void cleanup() {
        userRepository.deleteAll();
    }

    @Test
    void pingDb() throws Exception {
        System.out.println("DS URL=" + env.getProperty("spring.datasource.url"));
        try (var c = ds.getConnection(); var s = c.createStatement()) {
            var rs = s.executeQuery("SELECT 1");
            rs.next(); // si ça passe, la connexion marche
        }
    }


    @Test
    void login_ok_returns_jwt_and_user_payload() throws Exception {
        // Arrange: user existant
        User u = new User(
                "john@example.com", "Doe", "John",
                passwordEncoder.encode("secret"), false);
        u = userRepository.save(u);

        LoginRequest payload = new LoginRequest();
        payload.setEmail("john@example.com");
        payload.setPassword("secret");

        // Act + Assert
        mockMvc.perform(post("/api/auth/login") // <-- adapte si besoin
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload))
                        .with(csrf())) // utile si CSRF n'est pas désactivé
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.id").value(u.getId().intValue()))
                .andExpect(jsonPath("$.username").value("john@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.admin").value(false));
    }

    @Test
    void login_ko_bad_password_returns_401() throws Exception {
        User u = new User(
                "amy@example.com", "Pond", "Amy",
                passwordEncoder.encode("rightpass"), false);
        userRepository.save(u);

        LoginRequest payload = new LoginRequest();
        payload.setEmail("amy@example.com");
        payload.setPassword("wrongpass");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload))
                        .with(csrf()))
                .andExpect(status().isUnauthorized()); // selon ta config Security, 401 est le cas standard
    }

    @Test
    void register_ok_creates_user_and_returns_message() throws Exception {
        userRepository.deleteAll();

        SignupRequest req = new SignupRequest();
        req.setEmail("new@ex.com");
        req.setFirstName("New");
        req.setLastName("User");
        req.setPassword("Secr3t!");

        MvcResult res = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req))
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("User registered successfully!"))
                .andReturn();

        // (debug) Voir la réponse réelle si ça casse
        System.out.println("REGISTER RESPONSE: " + res.getResponse().getContentAsString());

        User saved = userRepository.findByEmail("new@ex.com").orElseThrow(
                () -> new AssertionError("User not created in DB"));
        assertThat(passwordEncoder.matches("Secr3t!", saved.getPassword())).isTrue();
        assertThat(saved.isAdmin()).isFalse(); // si attendu
    }


    @Test
    void register_ko_email_taken_returns_400() throws Exception {
        userRepository.deleteAll();
        userRepository.save(new User(
                "taken@ex.com", "Taken", "Already",
                passwordEncoder.encode("xPassword1"), false));

        SignupRequest req = new SignupRequest();
        req.setEmail("taken@ex.com");
        req.setFirstName("Alice");
        req.setLastName("Wonderland");
        req.setPassword("xPassword1");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req))
                        .with(csrf()))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }}

