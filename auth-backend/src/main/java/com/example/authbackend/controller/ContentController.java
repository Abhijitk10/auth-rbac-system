package com.example.authbackend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Content", description = "Role-protected content endpoints")
public class ContentController {

    @GetMapping("/public")
    @Operation(summary = "Public endpoint", description = "Accessible by everyone, no token required")
    public Map<String, String> publicEndpoint() {
        return Map.of(
            "message", "This is PUBLIC content — no authentication required.",
            "access", "ALL"
        );
    }

    @GetMapping("/user")
    @Operation(
        summary = "User endpoint",
        description = "Accessible by USER and ADMIN roles",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public Map<String, String> userEndpoint(Authentication authentication) {
        return Map.of(
            "message", "Hello, " + authentication.getName() + "! Welcome to the User Dashboard.",
            "access", "USER + ADMIN",
            "role", authentication.getAuthorities().iterator().next().getAuthority()
        );
    }

    @GetMapping("/admin")
    
    @Operation(
        summary = "Admin endpoint",
        description = "Accessible by ADMIN role only",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    public Map<String, String> adminEndpoint(Authentication authentication) {
        return Map.of(
            "message", "Hello, " + authentication.getName() + "! You have ADMIN privileges.",
            "access", "ADMIN ONLY",
            "role", authentication.getAuthorities().iterator().next().getAuthority()
        );
    }
}
