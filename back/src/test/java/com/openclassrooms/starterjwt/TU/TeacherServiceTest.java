package com.openclassrooms.starterjwt.TU;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {
    @InjectMocks
    TeacherService teacherService;
    @Mock
    TeacherRepository teacherRepository;

    @Test
    void givenTeachersExist_whenFindAll_thenReturnsFullList() {
        // --- Given ---
        Teacher s1 = Teacher.builder()
                .id(306L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .firstName("aaaaa")
                .lastName("bbbb")
                .build();

        Teacher s2 = Teacher.builder()
                .id(402L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .firstName("aaaaa")
                .lastName("bbbb")
                .build();

        List<Teacher> mockedList = List.of(s1, s2);
        when(teacherRepository.findAll()).thenReturn(mockedList);

        // --- When ---
        List<Teacher> result = teacherService.findAll();

        // --- Then ---
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(306L, result.get(0).getId().longValue());
        assertEquals(402L, result.get(1).getId().longValue());
        verify(teacherRepository).findAll();
    }

    @Test
    void givenExistingTeacherId_whenFindById_thenReturnsTeacher() {
        // Given
        Long teacherId = 1L;
        Teacher teacher = new Teacher();        // ← un Teacher, pas un User
        teacher.setId(teacherId);
        teacher.setFirstName("Dupont");
        teacher.setLastName("test");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());


        // Ici, on stubbe findById pour qu’il renvoie un Optional<Teacher> valide
        when(teacherRepository.findById(teacherId))
                .thenReturn(Optional.of(teacher));

        // When
        Teacher result = teacherService.findById(teacherId);

        // Then
        assertNotNull(result);
        assertEquals(teacher, result);
        verify(teacherRepository).findById(teacherId);
    }
}
