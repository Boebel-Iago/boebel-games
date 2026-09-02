package com.boebel.api.service;

import com.boebel.api.model.AccessTicket;
import com.boebel.api.repository.AccessTicketRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
public class AccessTicketService {

    private final AccessTicketRepository accessTicketRepository;

    public AccessTicketService(AccessTicketRepository accessTicketRepository) {
        this.accessTicketRepository = accessTicketRepository;
    }

    //Generate ticket for admin control
    public AccessTicket generateTicket(int maxUses, int hoursValid) {
        AccessTicket accessTicket = AccessTicket.builder()
                .code(generateRandomCode())
                .maxUses(maxUses)
                .expirationDate(LocalDateTime.now().plusHours(hoursValid))
                .build();
        return  accessTicketRepository.save(accessTicket);
    }

    //Generate the code for childrens in classroom uses for login in site
    private String generateRandomCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

}
