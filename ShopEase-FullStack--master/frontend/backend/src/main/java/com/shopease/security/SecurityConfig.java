package com.shopease.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            CustomUserDetailsService userDetailsService,
            CorsConfigurationSource corsConfigurationSource) {

        this.userDetailsService = userDetailsService;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());

        return provider;
    }

    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http)
            throws Exception {

        http
            .cors(cors ->
                cors.configurationSource(corsConfigurationSource)
            )

            .csrf(csrf ->
                csrf.disable()
            )

            .sessionManagement(session ->
                session
                    .sessionCreationPolicy(
                        SessionCreationPolicy.IF_REQUIRED
                    )
                    .maximumSessions(1)
            )

            .authenticationProvider(
                authenticationProvider()
            )

            .exceptionHandling(ex ->
                ex.authenticationEntryPoint(
                    new HttpStatusEntryPoint(
                        HttpStatus.UNAUTHORIZED
                    )
                )
            )

            .authorizeHttpRequests(auth ->
                auth

                    // Public endpoints
                    .requestMatchers("/api/health")
                    .permitAll()

                    .requestMatchers("/api/auth/**")
                    .permitAll()

                    .requestMatchers(
                        "GET",
                        "/api/products/**"
                    )
                    .permitAll()

                    .requestMatchers(
                        "GET",
                        "/api/categories/**"
                    )
                    .permitAll()

                    .requestMatchers(
                        "GET",
                        "/api/reviews/product/**"
                    )
                    .permitAll()

                    // Category - ADMIN only
                    .requestMatchers(
                        "POST",
                        "/api/categories/**"
                    )
                    .hasRole("ADMIN")

                    .requestMatchers(
                        "PUT",
                        "/api/categories/**"
                    )
                    .hasRole("ADMIN")

                    .requestMatchers(
                        "DELETE",
                        "/api/categories/**"
                    )
                    .hasRole("ADMIN")

                    // Product - ADMIN only
                    .requestMatchers(
                        "POST",
                        "/api/products/**"
                    )
                    .hasRole("ADMIN")

                    .requestMatchers(
                        "PUT",
                        "/api/products/**"
                    )
                    .hasRole("ADMIN")

                    .requestMatchers(
                        "DELETE",
                        "/api/products/**"
                    )
                    .hasRole("ADMIN")

                    // Order status - ADMIN only
                    .requestMatchers(
                        "PUT",
                        "/api/orders/*/status"
                    )
                    .hasRole("ADMIN")

                    // Admin endpoints
                    .requestMatchers("/api/admin/**")
                    .hasRole("ADMIN")

                    // Everything else requires login
                    .anyRequest()
                    .authenticated()
            );

        return http.build();
    }
}