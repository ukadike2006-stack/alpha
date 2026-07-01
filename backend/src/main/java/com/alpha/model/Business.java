package com.alpha.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "businesses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Business {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String businessName;
    private String registrationNumber;
    private String countryOfOperation;
    private String sector;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String pitchSummary;

    private LocalDate foundedDate;

    private String taxProofDocumentPath;
    private String bankReferencePath;
    private String businessRegCertPath;
    private String pitchVideoPath;

    private boolean registrationVerified;
    private boolean documentsConsistent;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "founder_id")
    private User founder;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public int getYearsInOperation() {
        if (foundedDate == null) return 0;
        return LocalDate.now().getYear() - foundedDate.getYear();
    }

    public boolean isEarlyStage() {
        int years = getYearsInOperation();
        return years >= 0 && years <= 5;
    }
}
