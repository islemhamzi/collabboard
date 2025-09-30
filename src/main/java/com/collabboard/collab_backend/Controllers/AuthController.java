package com.collabboard.collab_backend.Controllers;

import com.collabboard.collab_backend.Models.Role;
import com.collabboard.collab_backend.Models.User;
import com.collabboard.collab_backend.Repositories.RoleRepository;
import com.collabboard.collab_backend.Repositories.UserRepository;
import com.collabboard.collab_backend.Config.JwtUtil;
import com.collabboard.collab_backend.Services.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // ------------------- REGISTER -------------------
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return "Error: Username is already taken!";
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return "Error: Email is already in use!";
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Set<Role> roles = new HashSet<>();

        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            // Assign default ROLE_USER
            Role userRole = roleRepository.findByName("ROLE_USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role not found."));
            roles.add(userRole);
        } else {
            // Assign roles from request
            for (Role r : user.getRoles()) {
                Role role = roleRepository.findByName(r.getName())
                        .orElseThrow(() -> new RuntimeException("Error: Role not found."));
                roles.add(role);
            }
        }

        user.setRoles(roles);
        userRepository.save(user);

        return "User registered successfully!";
    }


    // ------------------- LOGIN -------------------
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> loginData) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginData.get("username"), loginData.get("password")
                    )
            );

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            // Extract role names from UserDetails
            Set<String> roles = userDetails.getAuthorities().stream()
                    .map(auth -> auth.getAuthority())
                    .collect(Collectors.toSet());

            String token = jwtUtil.generateToken(userDetails.getUsername(), roles);

            return Map.of("token", token); // JWT now contains roles
        } catch (AuthenticationException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }

}
