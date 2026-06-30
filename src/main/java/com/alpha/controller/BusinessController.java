package com.alpha.controller;

import com.alpha.model.Business;
import com.alpha.model.User;
import com.alpha.repository.BusinessRepository;
import com.alpha.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/businesses")
public class BusinessController {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;

    public BusinessController(BusinessRepository businessRepository, UserRepository userRepository) {
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<?> createBusiness(@RequestBody Business business, @AuthenticationPrincipal UserDetails userDetails) {
        User founder = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        business.setFounder(founder);
        return ResponseEntity.status(HttpStatus.CREATED).body(businessRepository.save(business));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<?> getMyBusinesses(@AuthenticationPrincipal UserDetails userDetails) {
        User founder = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return ResponseEntity.ok(businessRepository.findByFounder(founder));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBusiness(@PathVariable Long id) {
        return businessRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<?> updateBusiness(@PathVariable Long id, @RequestBody Business updatedBusiness, @AuthenticationPrincipal UserDetails userDetails) {
        Business business = businessRepository.findById(id).orElse(null);
        if (business == null) return ResponseEntity.notFound().build();

        User founder = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        if (!business.getFounder().getId().equals(founder.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new AuthController.ErrorResponse("Not authorized to update this business"));
        }

        business.setBusinessName(updatedBusiness.getBusinessName());
        business.setSector(updatedBusiness.getSector());
        business.setDescription(updatedBusiness.getDescription());
        business.setPitchSummary(updatedBusiness.getPitchSummary());
        business.setFoundedDate(updatedBusiness.getFoundedDate());

        return ResponseEntity.ok(businessRepository.save(business));
    }
}
