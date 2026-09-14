package com.boebel.api.repository;

import com.boebel.api.model.StudentSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentSessionRepository extends JpaRepository<StudentSession, UUID> {

    List<StudentSession> findByTicketCode(String ticketCode);

    Optional<StudentSession> findByStudentNameAndTicketCode(String studentName, String ticketCode);

    @Transactional
    void deleteByTicketCode(String ticketCode);
}
