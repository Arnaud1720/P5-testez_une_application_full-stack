package com.openclassrooms.starterjwt.TI;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class TeacherIntegrationTest {
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

        //when
        List<Teacher> all = teacherService.findAll();
        assertEquals(2, all.size());
        // on vérifie par noms
        assertTrue(all.stream().anyMatch(s -> s.getLastName().equals("Smith")));
        assertTrue(all.stream().anyMatch(s -> s.getLastName().equals("Smiht")));
        //then
    }

    @Test
    void givenSomeTeacher_whenFindById_thenReturnsThem() throws Exception {
        // Given
        Teacher t1 = Teacher.builder()
                .firstName("Jo")
                .lastName("Smith")
                .createdAt(LocalDateTime.now())
                .build();
        Teacher saved = teacherRepository.save(t1);

        // When
        Teacher found = teacherService.findById(saved.getId());

        // Then
        assertEquals("Jo", found.getFirstName());
        assertEquals("Smith", found.getLastName());
        assertEquals(saved.getId(), found.getId());
    }


//    @Test
//    void givenTeacherExists_whenFindById_thenReturnsTeacher() {
//        // Given
//        Teacher teacher = new Teacher();
//        teacher.setId(1L);
//        teacher.setFirstName("Alan");
//        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));
//
//        // When
//        Teacher result = teacherService.findById(1L);
//
//        // Then
//        assertEquals("Alan", result.getFirstName());
//        verify(teacherRepository).findById(1L);
//    }
}
