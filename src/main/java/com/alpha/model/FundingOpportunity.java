package com.alpha.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "funding_opportunities")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundingOpportunity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private FundingType fundingType;

    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private String currency;

    private String targetSector;
    private String targetCountry;

    @Builder.Default
    private int maxBusinessAgeYears = 5;

    @Builder.Default
    private int minFounderAgeYears = 18;

    private LocalDate applicationDeadline;

    @Builder.Default
    private boolean active = true;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "posted_by")
    private User postedBy;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (maxBusinessAgeYears == 0) maxBusinessAgeYears = 5;
        if (minFounderAgeYears == 0) minFounderAgeYears = 18;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
