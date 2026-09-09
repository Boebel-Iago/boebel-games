package com.boebel.api.repository;

import com.boebel.api.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TeacherRepository extends JpaRepository<Teacher, UUID> {

    Optional<Teacher> findByEmail(String email);

}
