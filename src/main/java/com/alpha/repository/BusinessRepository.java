package com.alpha.repository;

import com.alpha.model.Business;
import com.alpha.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BusinessRepository extends JpaRepository<Business, Long> {
    List<Business> findByFounder(User founder);
    Optional<Business> findByRegistrationNumber(String registrationNumber);
    List<Business> findBySector(String sector);
    List<Business> findByCountryOfOperation(String country);
}
