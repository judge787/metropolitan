package com.metropolitan.backend.housing.dao;

import com.metropolitan.backend.housing.models.Data;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface DataDao extends CrudRepository<Data, Integer> {
    @Query("SELECT COUNT(*) FROM HOUSING_DATA")
    Integer getCount();

    @Query("SELECT n FROM HOUSING_DATA n WHERE n.total_starts = :totalStarts")
    Iterable<Data> getDataByTotalStarts(@Param("totalStarts") int totalStarts);

    @Query("SELECT n FROM HOUSING_DATA n WHERE n.total_complete = :totalComplete")
    Iterable<Data> getDataByTotalComplete(@Param("totalComplete") int totalComplete);
}
