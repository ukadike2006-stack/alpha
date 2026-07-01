package com.alpha.controller;

import com.alpha.model.FundingOpportunity;
import com.alpha.model.User;
import com.alpha.repository.FundingOpportunityRepository;
import com.alpha.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/opportunities")
public class OpportunityController {

    private final FundingOpportunityRepository opportunityRepository;
    private final UserRepository userRepository;

    public OpportunityController(FundingOpportunityRepository opportunityRepository, UserRepository userRepository) {
        this.opportunityRepository = opportunityRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/public")
    public ResponseEntity<?> getPublicOpportunities() {
        return ResponseEntity.ok(opportunityRepository.findByActive(true));
    }

    @PostMapping("/post")
    @PreAuthorize("hasAnyRole('INVESTOR', 'ADMIN')")
    public ResponseEntity<?> postOpportunity(@RequestBody FundingOpportunity opportunity, @AuthenticationPrincipal UserDetails userDetails) {
        User postedBy = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        opportunity.setPostedBy(postedBy);
        opportunity.setActive(true);
        return ResponseEntity.status(HttpStatus.CREATED).body(opportunityRepository.save(opportunity));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOpportunity(@PathVariable Long id) {
        return opportunityRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('INVESTOR', 'ADMIN')")
    public ResponseEntity<?> closeOpportunity(@PathVariable Long id) {
        FundingOpportunity opp = opportunityRepository.findById(id).orElse(null);
        if (opp == null) return ResponseEntity.notFound().build();
        opp.setActive(false);
        return ResponseEntity.ok(opportunityRepository.save(opp));
    }
}
