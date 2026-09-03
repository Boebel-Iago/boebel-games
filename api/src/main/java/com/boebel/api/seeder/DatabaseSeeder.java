package com.boebel.api.seeder;

import com.boebel.api.model.Teacher;
import com.boebel.api.repository.TeacherRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    //Admin email from passwords.env
    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public DatabaseSeeder(TeacherRepository teacherRepository, PasswordEncoder passwordEncoder) {
        this.teacherRepository = teacherRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (teacherRepository.count() == 0) {

            Teacher admin = Teacher.builder()
                    .name("Iago Boebel")
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .build();

            teacherRepository.save(admin);

        }
    }
}
