package com.alpha.controller;

import com.alpha.model.ApplicationStatus;
import com.alpha.model.User;
import com.alpha.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
public class AdminController {

    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final ApplicationRepository applicationRepository;
    private final FundingOpportunityRepository opportunityRepository;

    public AdminController(UserRepository userRepository,
                           BusinessRepository businessRepository,
                           ApplicationRepository applicationRepository,
                           FundingOpportunityRepository opportunityRepository) {
        this.userRepository = userRepository;
        this.businessRepository = businessRepository;
        this.applicationRepository = applicationRepository;
        this.opportunityRepository = opportunityRepository;
    }

    @GetMapping("/api/health")
    public ResponseEntity<?> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("platform", "ALPHA — Digital Entrepreneurship Ecosystem");
        response.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/api/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("founders", userRepository.findByRole(com.alpha.model.Role.FOUNDER).size());
        stats.put("investors", userRepository.findByRole(com.alpha.model.Role.INVESTOR).size());
        stats.put("mentors", userRepository.findByRole(com.alpha.model.Role.MENTOR).size());
        stats.put("totalBusinesses", businessRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        stats.put("funded", applicationRepository.countByStatus(ApplicationStatus.FUNDED));
        stats.put("shortlisted", applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED));
        stats.put("eligibilityPassed", applicationRepository.countByStatus(ApplicationStatus.ELIGIBILITY_PASSED));
        stats.put("eligibilityFailed", applicationRepository.countByStatus(ApplicationStatus.ELIGIBILITY_FAILED));
        stats.put("activeOpportunities", opportunityRepository.findByActive(true).size());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/api/admin/users/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateUser(@PathVariable Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) return ResponseEntity.notFound().build();
        user.setActive(false);
        return ResponseEntity.ok(userRepository.save(user));
    }
}
