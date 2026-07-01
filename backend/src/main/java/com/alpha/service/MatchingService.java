package com.alpha.service;

import com.alpha.model.Business;
import com.alpha.model.FundingOpportunity;
import com.alpha.model.FundingType;
import com.alpha.model.User;
import com.alpha.repository.FundingOpportunityRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final FundingOpportunityRepository opportunityRepository;

    public MatchingService(FundingOpportunityRepository opportunityRepository) {
        this.opportunityRepository = opportunityRepository;
    }

    public record MatchResult(
        FundingOpportunity opportunity,
        int score,
        List<String> matchReasons
    ) {}

    public List<MatchResult> findMatches(Business business, User founder, FundingType preferredType) {
        List<FundingOpportunity> opportunities = opportunityRepository.findByActive(true);
        List<MatchResult> results = new ArrayList<>();

        for (FundingOpportunity opp : opportunities) {
            int score = 0;
            List<String> reasons = new ArrayList<>();

            // Disqualify if business age exceeds max
            if (business.getYearsInOperation() > opp.getMaxBusinessAgeYears()) {
                continue;
            }

            // Sector match (40 pts)
            if (opp.getTargetSector().equalsIgnoreCase("Any") || opp.getTargetSector().equalsIgnoreCase(business.getSector())) {
                score += 40;
                reasons.add("Sector match (" + opp.getTargetSector() + ")");
            }

            // Country match (30 pts)
            if (opp.getTargetCountry().equalsIgnoreCase("Any African Country") || opp.getTargetCountry().equalsIgnoreCase(business.getCountryOfOperation())) {
                score += 30;
                reasons.add("Country match (" + opp.getTargetCountry() + ")");
            }

            // FundingType preference match (20 pts)
            if (preferredType != null && opp.getFundingType() == preferredType) {
                score += 20;
                reasons.add("Funding type preference match (" + preferredType + ")");
            }

            // Deadline still open (10 pts)
            if (opp.getApplicationDeadline() == null || !opp.getApplicationDeadline().isBefore(LocalDate.now())) {
                score += 10;
                reasons.add("Application deadline is still open");
            }

            if (score > 0) {
                results.add(new MatchResult(opp, score, reasons));
            }
        }

        return results.stream()
                .sorted(Comparator.comparingInt(MatchResult::score).reversed())
                .collect(Collectors.toList());
    }
}
