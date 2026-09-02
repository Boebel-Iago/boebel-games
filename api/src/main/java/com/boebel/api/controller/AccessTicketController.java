package com.boebel.api.controller;

import com.boebel.api.dto.TicketRequestDTO;
import com.boebel.api.model.AccessTicket;
import com.boebel.api.service.AccessTicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tickets")
public class AccessTicketController {

    private final AccessTicketService accessTicketService;

    public AccessTicketController(AccessTicketService accessTicketService) {
        this.accessTicketService = accessTicketService;
    }

    //Endpoint to generate a new code
    @PostMapping
    public ResponseEntity<AccessTicket> createTicket(@RequestBody TicketRequestDTO ticketRequestDTO) {
        AccessTicket newTicket = accessTicketService.generateTicket(
                ticketRequestDTO.maxUses(),
                ticketRequestDTO.hoursValid()
        );

        //Return the created ticket with the http status 201(Created)
        return ResponseEntity.status(HttpStatus.CREATED).body(newTicket);
    }

}
