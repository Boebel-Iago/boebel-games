package com.boebel.api.repository;

import com.boebel.api.model.AccessTicket;
import com.boebel.api.model.Teacher;
import jakarta.persistence.Access;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccessTicketRepository extends JpaRepository<AccessTicket, UUID> {

    //Verify if an teacher has an activate ticket
    boolean existsByTeacher(Teacher teacher);

    Optional<AccessTicket> findByTeacher(Teacher teacher);

    Optional<AccessTicket> findByCode(String code);}
