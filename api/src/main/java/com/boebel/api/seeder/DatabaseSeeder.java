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
        // Busca o admin pelo email ou cria um novo se não existir
        Teacher admin = teacherRepository.findByEmail(adminEmail).orElse(
                Teacher.builder()
                        .name("Administrador")
                        .email(adminEmail)
                        .build()
        );

        // Sempre sobrescreve a senha com a que está no .env atual
        admin.setPassword(passwordEncoder.encode(adminPassword));

        teacherRepository.save(admin);
    }
}
