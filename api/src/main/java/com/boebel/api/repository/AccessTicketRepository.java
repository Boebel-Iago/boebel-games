package com.boebel.api.repository;

import com.boebel.api.model.AccessTicket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface AccessTicketRepository extends JpaRepository<AccessTicket, UUID> {

    Optional<AccessTicket> findByCode(String code);


}
