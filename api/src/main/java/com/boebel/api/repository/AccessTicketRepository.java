package com.boebel.api.repository;

import com.boebel.api.model.AccessTicket;
import com.boebel.api.model.Teacher;
import jakarta.persistence.Access;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AccessTicketRepository extends JpaRepository<AccessTicket, UUID> {

    // Verify if a teacher has active tickets (count)
    long countByTeacher(Teacher teacher);

    // List all tickets for a teacher
    List<AccessTicket> findAllByTeacher(Teacher teacher);

    Optional<AccessTicket> findByCode(String code);
}
