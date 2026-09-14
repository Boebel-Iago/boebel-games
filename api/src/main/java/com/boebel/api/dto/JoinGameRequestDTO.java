package com.boebel.api.dto;

public class JoinGameRequest {
    private String ticketCode;
    private String studentName;

    // Getters e Setters
    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }
}