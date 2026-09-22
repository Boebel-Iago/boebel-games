package com.boebel.api.service;

import com.boebel.api.repository.TeacherRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Serviço que implementa {@link UserDetailsService} do Spring Security.
 * Responsável por carregar as informações do usuário (Teacher) através do e-mail
 * para realizar o processo de autenticação.
 */
@Service
public class AuthorizationService implements UserDetailsService {

    private final TeacherRepository teacherRepository;

    public AuthorizationService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    /**
     * Carrega o usuário (professor) pelo nome de usuário (e-mail).
     * @param username o e-mail do professor a ser buscado.
     * @return os detalhes do usuário (UserDetails) encontrados no banco de dados.
     * @throws UsernameNotFoundException se o e-mail não for encontrado no banco de dados.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return teacherRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado."));
    }
}
