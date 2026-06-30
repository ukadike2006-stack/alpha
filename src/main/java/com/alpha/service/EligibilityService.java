package com.alpha.service;

import com.alpha.model.Business;
import com.alpha.model.User;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class EligibilityService {

    private static final Set<String> AFRICAN_COUNTRIES = new HashSet<>(Arrays.asList(
        "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic",
        "Chad", "Comoros", "Democratic Republic of the Congo", "Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea",
        "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho",
        "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger",
        "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan",
        "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe", "Côte d'Ivoire"
    ));

    public record EligibilityResult(
        boolean eligible,
        List<String> passedChecks,
        List<String> failedChecks,
        boolean ageEligible,
        boolean nationalityEligible,
        boolean businessLocationEligible,
        boolean businessStageEligible,
        boolean idDocumentPresent,
        boolean pitchVideoPresent,
        boolean documentsConsistent
    ) {}

    public EligibilityResult checkEligibility(User founder, Business business) {
        List<String> passed = new ArrayList<>();
        List<String> failed = new ArrayList<>();

        // 1. Founder age >= 18
        int age = (founder.getDateOfBirth() != null) ? Period.between(founder.getDateOfBirth(), LocalDate.now()).getYears() : 0;
        boolean ageEligible = age >= 18;
        if (ageEligible) passed.add("Founder age >= 18"); else failed.add("Founder must be at least 18 years old");

        // 2. Founder nationality is African
        boolean nationalityEligible = founder.getNationality() != null && AFRICAN_COUNTRIES.contains(founder.getNationality());
        if (nationalityEligible) passed.add("Founder nationality is African"); else failed.add("Founder nationality must be an African country");

        // 3. Founder residence is African
        boolean residenceEligible = founder.getCountryOfResidence() != null && AFRICAN_COUNTRIES.contains(founder.getCountryOfResidence());
        if (residenceEligible) passed.add("Founder country of residence is African"); else failed.add("Founder residence must be in an African country");

        // 4. Business operation is African
        boolean businessLocationEligible = business.getCountryOfOperation() != null && AFRICAN_COUNTRIES.contains(business.getCountryOfOperation());
        if (businessLocationEligible) passed.add("Business country of operation is African"); else failed.add("Business must operate in an African country");

        // 5. Business is early-stage (0-5 years)
        boolean businessStageEligible = business.isEarlyStage();
        if (businessStageEligible) passed.add("Business is early-stage (0-5 years)"); else failed.add("Business must be between 0-5 years in operation");

        // 6. Founder ID verified and not blank
        boolean idDocPresent = founder.isIdVerified() && founder.getNationalIdNumber() != null && !founder.getNationalIdNumber().isBlank();
        if (idDocPresent) passed.add("Founder ID verified"); else failed.add("Founder ID must be verified and provided");

        // 7. Business registration cert present
        boolean regCertPresent = business.getBusinessRegCertPath() != null && !business.getBusinessRegCertPath().isBlank();
        if (regCertPresent) passed.add("Business registration certificate present"); else failed.add("Business registration certificate is required");

        // 8. Tax proof present
        boolean taxProofPresent = business.getTaxProofDocumentPath() != null && !business.getTaxProofDocumentPath().isBlank();
        if (taxProofPresent) passed.add("Tax proof document present"); else failed.add("Tax proof document is required");

        // 9. Pitch video present
        boolean pitchVideoPresent = business.getPitchVideoPath() != null && !business.getPitchVideoPath().isBlank();
        if (pitchVideoPresent) passed.add("Pitch video present"); else failed.add("Pitch video is required");

        // 10. Documents consistent
        boolean documentsConsistent = business.isDocumentsConsistent();
        if (documentsConsistent) passed.add("Documents are consistent"); else failed.add("Submitted documents must be consistent");

        boolean allEligible = ageEligible && nationalityEligible && residenceEligible && businessLocationEligible &&
                             businessStageEligible && idDocPresent && regCertPresent && taxProofPresent &&
                             pitchVideoPresent && documentsConsistent;

        return new EligibilityResult(
            allEligible, passed, failed, ageEligible, nationalityEligible, businessLocationEligible,
            businessStageEligible, idDocPresent, pitchVideoPresent, documentsConsistent
        );
    }
}
