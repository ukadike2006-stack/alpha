package com.alpha.service;

import com.alpha.model.*;
import com.alpha.repository.ApplicationRepository;
import com.alpha.repository.BusinessRepository;
import com.alpha.repository.FundingOpportunityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final BusinessRepository businessRepository;
    private final FundingOpportunityRepository opportunityRepository;
    private final EligibilityService eligibilityService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              BusinessRepository businessRepository,
                              FundingOpportunityRepository opportunityRepository,
                              EligibilityService eligibilityService) {
        this.applicationRepository = applicationRepository;
        this.businessRepository = businessRepository;
        this.opportunityRepository = opportunityRepository;
        this.eligibilityService = eligibilityService;
    }

    @Transactional
    public Application submit(User founder, Long businessId, Long opportunityId, FundingType preferredType) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        FundingOpportunity opportunity = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new RuntimeException("Opportunity not found"));

        EligibilityService.EligibilityResult eligibility = eligibilityService.checkEligibility(founder, business);

        Application application = Application.builder()
                .founder(founder)
                .business(business)
                .opportunity(opportunity)
                .fundingType(preferredType != null ? preferredType : opportunity.getFundingType())
                .status(eligibility.eligible() ? ApplicationStatus.ELIGIBILITY_PASSED : ApplicationStatus.ELIGIBILITY_FAILED)
                .ageEligible(eligibility.ageEligible())
                .nationalityEligible(eligibility.nationalityEligible())
                .businessStageEligible(eligibility.businessStageEligible())
                .businessLocationEligible(eligibility.businessLocationEligible())
                .idDocumentPresent(eligibility.idDocumentPresent())
                .pitchVideoPresent(eligibility.pitchVideoPresent())
                .allDocumentsConsistent(eligibility.documentsConsistent())
                .submittedAt(LocalDateTime.now())
                .build();

        return applicationRepository.save(application);
    }

    @Transactional
    public Application review(Long applicationId, boolean approve, String notes) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(approve ? ApplicationStatus.SHORTLISTED : ApplicationStatus.REJECTED);
        application.setReviewNotes(notes);
        application.setReviewedAt(LocalDateTime.now());

        return applicationRepository.save(application);
    }

    @Transactional
    public Application markFunded(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(ApplicationStatus.FUNDED);
        return applicationRepository.save(application);
    }

    public List<Application> getByFounder(User founder) {
        return applicationRepository.findByFounder(founder);
    }

    public List<Application> getByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatus(status);
    }

    public Application getById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
}
