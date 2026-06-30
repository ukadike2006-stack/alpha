package com.alpha.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.DRAFT;

    @Enumerated(EnumType.STRING)
    private FundingType fundingType;

    private boolean ageEligible;
    private boolean nationalityEligible;
    private boolean businessStageEligible;
    private boolean businessLocationEligible;
    private boolean idDocumentPresent;
    private boolean pitchVideoPresent;
    private boolean allDocumentsConsistent;

    private String reviewNotes;
    private String rejectionReason;

    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "founder_id")
    private User founder;

    @ManyToOne
    @JoinColumn(name = "business_id")
    private Business business;

    @ManyToOne
    @JoinColumn(name = "opportunity_id")
    private FundingOpportunity opportunity;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public boolean isFullyEligible() {
        return ageEligible && nationalityEligible && businessStageEligible &&
               businessLocationEligible && idDocumentPresent &&
               pitchVideoPresent && allDocumentsConsistent;
    }
}
