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
        Teacher l1 = Teacher.builder()
                .id(306L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .firstName("aaaaa")
                .lastName("bbbb")
                .build();

        Teacher l2 = Teacher.builder()
                .id(402L)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .firstName("aaaaa")
                .lastName("bbbb")
                .build();

        List<Teacher> mockedList = List.of(l1, l2);
        when(teacherRepository.findAll()).thenReturn(mockedList);

        List<Teacher> result = teacherService.findAll();
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(306L, result.get(0).getId().longValue());
        assertEquals(402L, result.get(1).getId().longValue());
        verify(teacherRepository).findAll();
    }

    @Test
    void givenExistingTeacherId_whenFindById_thenReturnsTeacher() {
        Long teacherId = 1L;
        Teacher teacher = new Teacher();
        teacher.setId(teacherId);
        teacher.setFirstName("Dupont");
        teacher.setLastName("test");
        teacher.setCreatedAt(LocalDateTime.now());
        teacher.setUpdatedAt(LocalDateTime.now());


        when(teacherRepository.findById(teacherId))
                .thenReturn(Optional.of(teacher));
        Teacher result = teacherService.findById(teacherId);
        assertNotNull(result);
        assertEquals(teacher, result);
        verify(teacherRepository).findById(teacherId);
    }
}
