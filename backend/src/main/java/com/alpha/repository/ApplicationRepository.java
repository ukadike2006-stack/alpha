package com.alpha.repository;

import com.alpha.model.Application;
import com.alpha.model.ApplicationStatus;
import com.alpha.model.FundingOpportunity;
import com.alpha.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByFounder(User founder);
    List<Application> findByStatus(ApplicationStatus status);
    List<Application> findByOpportunity(FundingOpportunity opportunity);
    List<Application> findByFounderAndStatus(User founder, ApplicationStatus status);
    long countByStatus(ApplicationStatus status);
}
