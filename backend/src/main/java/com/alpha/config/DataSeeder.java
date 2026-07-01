package com.alpha.config;

import com.alpha.model.*;
import com.alpha.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BusinessRepository businessRepository;
    private final FundingOpportunityRepository opportunityRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      BusinessRepository businessRepository,
                      FundingOpportunityRepository opportunityRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.businessRepository = businessRepository;
        this.opportunityRepository = opportunityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return;
        }

        // 1. Create Users
        User admin = User.builder()
                .firstName("Alpha")
                .lastName("Admin")
                .email("admin@alpha.com")
                .password(passwordEncoder.encode("Admin@1234"))
                .role(Role.ADMIN)
                .active(true)
                .build();

        User investor = User.builder()
                .firstName("Victor")
                .lastName("Okonkwo")
                .email("investor@alpha.com")
                .password(passwordEncoder.encode("Invest@1234"))
                .role(Role.INVESTOR)
                .active(true)
                .build();

        User mentor = User.builder()
                .firstName("Amara")
                .lastName("Eze")
                .email("mentor@alpha.com")
                .password(passwordEncoder.encode("Mentor@1234"))
                .role(Role.MENTOR)
                .active(true)
                .build();

        User founder = User.builder()
                .firstName("Stanford")
                .lastName("Shawn")
                .email("founder@alpha.com")
                .password(passwordEncoder.encode("Found@1234"))
                .role(Role.FOUNDER)
                .nationality("Nigeria")
                .countryOfResidence("Nigeria")
                .dateOfBirth(LocalDate.of(1998, 5, 15))
                .nationalIdNumber("NGA-12345678")
                .idVerified(true)
                .emailVerified(true)
                .profileComplete(true)
                .active(true)
                .build();

        userRepository.saveAll(Arrays.asList(admin, investor, mentor, founder));

        // 2. Create Business
        Business business = Business.builder()
                .businessName("AgriLink Nigeria Ltd")
                .registrationNumber("RC-2023-001234")
                .countryOfOperation("Nigeria")
                .sector("AgriTech")
                .description("AgriLink is a digital platform connecting smallholder farmers to markets.")
                .pitchSummary("Revolutionizing Nigerian agriculture through technology.")
                .foundedDate(LocalDate.of(2022, 3, 1))
                .businessRegCertPath("uploads/agrilink_reg.pdf")
                .taxProofDocumentPath("uploads/agrilink_tax.pdf")
                .bankReferencePath("uploads/agrilink_bank.pdf")
                .pitchVideoPath("uploads/agrilink_pitch.mp4")
                .documentsConsistent(true)
                .registrationVerified(true)
                .founder(founder)
                .build();

        businessRepository.save(business);

        // 3. Create Funding Opportunities
        FundingOpportunity tef = FundingOpportunity.builder()
                .title("Tony Elumelu Foundation Entrepreneurship Programme 2026")
                .description("The TEF Entrepreneurship Programme is the $100million commitment of the Tony Elumelu Foundation to empower African entrepreneurs.")
                .fundingType(FundingType.INSTITUTIONAL_VENTURE)
                .minAmount(new BigDecimal("5000"))
                .maxAmount(new BigDecimal("5000"))
                .currency("USD")
                .targetSector("Any")
                .targetCountry("Any African Country")
                .applicationDeadline(LocalDate.of(2026, 7, 31))
                .postedBy(admin)
                .active(true)
                .build();

        FundingOpportunity agriTech = FundingOpportunity.builder()
                .title("AgriTech Angel Round — Nigeria 2026")
                .description("Seed funding for innovative AgriTech startups in Nigeria.")
                .fundingType(FundingType.ANGEL_INVESTOR)
                .minAmount(new BigDecimal("10000"))
                .maxAmount(new BigDecimal("50000"))
                .currency("USD")
                .targetSector("AgriTech")
                .targetCountry("Nigeria")
                .applicationDeadline(LocalDate.of(2026, 9, 30))
                .postedBy(investor)
                .active(true)
                .build();

        opportunityRepository.saveAll(Arrays.asList(tef, agriTech));

        System.out.println("\n" + "*".repeat(60));
        System.out.println("DATA SEEDING COMPLETE");
        System.out.println("Test Credentials:");
        System.out.println("  Admin:    admin@alpha.com / Admin@1234");
        System.out.println("  Investor: investor@alpha.com / Invest@1234");
        System.out.println("  Mentor:   mentor@alpha.com / Mentor@1234");
        System.out.println("  Founder:  founder@alpha.com / Found@1234");
        System.out.println("*".repeat(60) + "\n");
    }
}
