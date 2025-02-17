package com.metropolitan.backend.housing.dao;

import com.metropolitan.backend.housing.models.Data;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface DataDao extends CrudRepository<Data, Integer> {
  @Query("SELECT COUNT(d) FROM Data d")
  Integer getCount();

  @Query("SELECT d FROM Data d WHERE d.totalStarts = :totalStarts")
  Iterable<Data> getDataByTotalStarts(@Param("totalStarts") int totalStarts);

  @Query("SELECT d FROM Data d WHERE d.totalComplete = :totalComplete")
  Iterable<Data> getDataByTotalComplete(@Param("totalComplete") int totalComplete);

  @Query("SELECT SUM(d.totalStarts) FROM Data d WHERE d.censusArea = :censusArea")
  Integer sumTotalStartsByCensusArea(@Param("censusArea") String censusArea);
}
