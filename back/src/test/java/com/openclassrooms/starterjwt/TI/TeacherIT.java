package com.openclassrooms.starterjwt.TI;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)

public class TeacherIT  {
    @Autowired
    private TeacherRepository teacherRepository;
    @Autowired
    private TeacherService teacherService;

    @Test
    void givenSomeTeacher_whenFindAll_thenReturnsThem() throws Exception {
        Teacher t1 = Teacher.builder()
                .id(1L)
                .firstName("Jo")
                .lastName("Smith")
                .updatedAt(null)
                .createdAt(LocalDateTime.now())
                .build();
        Teacher t2 = Teacher.builder()
                .id(2L)
                .firstName("Oj")
                .lastName("Smiht")
                .updatedAt(null)
                .createdAt(LocalDateTime.now())
                .build();
        teacherRepository.saveAll(List.of(t1, t2));

        List<Teacher> all = teacherService.findAll();
        assertEquals(2, all.size());
        assertTrue(all.stream().anyMatch(s -> s.getLastName().equals("Smith")));
        assertTrue(all.stream().anyMatch(s -> s.getLastName().equals("Smiht")));
    }

    @Test
    void givenSomeTeacher_whenFindById_thenReturnsThem() throws Exception {
        Teacher t1 = Teacher.builder()
                .firstName("Jo")
                .lastName("Smith")
                .createdAt(LocalDateTime.now())
                .build();
        Teacher saved = teacherRepository.save(t1);

        Teacher found = teacherService.findById(saved.getId());

        assertEquals("Jo", found.getFirstName());
        assertEquals("Smith", found.getLastName());
        assertEquals(saved.getId(), found.getId());
    }
}
