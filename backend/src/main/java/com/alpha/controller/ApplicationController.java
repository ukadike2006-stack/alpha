package com.alpha.controller;

import com.alpha.model.*;
import com.alpha.repository.UserRepository;
import com.alpha.repository.BusinessRepository;
import com.alpha.service.ApplicationService;
import com.alpha.service.MatchingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final MatchingService matchingService;
    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;

    public ApplicationController(ApplicationService applicationService,
                                 MatchingService matchingService,
                                 UserRepository userRepository,
                                 BusinessRepository businessRepository) {
        this.applicationService = applicationService;
        this.matchingService = matchingService;
        this.userRepository = userRepository;
        this.businessRepository = businessRepository;
    }

    public record ApplicationRequest(Long businessId, Long opportunityId, FundingType preferredType) {}
    public record ReviewRequest(boolean approve, String notes) {}

    public record ApplicationSummary(
        Long id,
        String founderName,
        String businessName,
        ApplicationStatus status,
        FundingType fundingType,
        boolean fullyEligible,
        String rejectionReason,
        LocalDateTime submittedAt
    ) {
        public static ApplicationSummary from(Application app) {
            return new ApplicationSummary(
                app.getId(),
                app.getFounder().getFullName(),
                app.getBusiness().getBusinessName(),
                app.getStatus(),
                app.getFundingType(),
                app.isFullyEligible(),
                app.getRejectionReason(),
                app.getSubmittedAt()
            );
        }
    }

    @PostMapping("/submit")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<?> submit(@RequestBody ApplicationRequest request, @AuthenticationPrincipal UserDetails userDetails) {
        User founder = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Application app = applicationService.submit(founder, request.businessId(), request.opportunityId(), request.preferredType());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApplicationSummary.from(app));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<?> getMyApplications(@AuthenticationPrincipal UserDetails userDetails) {
        User founder = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        List<ApplicationSummary> summaries = applicationService.getByFounder(founder).stream()
                .map(ApplicationSummary::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApplication(@PathVariable Long id) {
        Application app = applicationService.getById(id);
        return ResponseEntity.ok(ApplicationSummary.from(app));
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> review(@PathVariable Long id, @RequestBody ReviewRequest request) {
        Application app = applicationService.review(id, request.approve(), request.notes());
        return ResponseEntity.ok(ApplicationSummary.from(app));
    }

    @PostMapping("/{id}/fund")
    @PreAuthorize("hasAnyRole('INVESTOR', 'ADMIN')")
    public ResponseEntity<?> fund(@PathVariable Long id) {
        Application app = applicationService.markFunded(id);
        return ResponseEntity.ok(ApplicationSummary.from(app));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getByStatus(@PathVariable ApplicationStatus status) {
        List<ApplicationSummary> summaries = applicationService.getByStatus(status).stream()
                .map(ApplicationSummary::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/{id}/matches")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<?> getMatches(@PathVariable Long id, @RequestParam(required = false) FundingType preferredType) {
        // Here we assume {id} is the business ID for matching
        Business business = businessRepository.findById(id).orElseThrow();
        User founder = business.getFounder();
        return ResponseEntity.ok(matchingService.findMatches(business, founder, preferredType));
    }
}
