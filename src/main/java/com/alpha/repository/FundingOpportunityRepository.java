package com.alpha.repository;

import com.alpha.model.FundingOpportunity;
import com.alpha.model.FundingType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface FundingOpportunityRepository extends JpaRepository<FundingOpportunity, Long> {
    List<FundingOpportunity> findByActive(boolean active);
    List<FundingOpportunity> findByTargetSectorAndActive(String sector, boolean active);
    List<FundingOpportunity> findByFundingTypeAndActive(FundingType type, boolean active);

    @Query("SELECT f FROM FundingOpportunity f WHERE f.active = true AND " +
           "(f.targetSector = :sector OR f.targetSector = 'Any') AND " +
           "(f.targetCountry = :country OR f.targetCountry = 'Any African Country')")
    List<FundingOpportunity> findMatchingOpportunities(@Param("sector") String sector,
                                                        @Param("country") String country);
}
