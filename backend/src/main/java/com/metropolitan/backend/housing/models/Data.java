package com.metropolitan.backend.housing.models;

import jakarta.persistence.*;

@Entity
@Table(name = "housing_data")
public class Data {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "census_metropolitan_area")
    private String censusArea;

    @Column(name = "total_starts")
    private Integer totalStarts;

    @Column(name = "total_complete")
    private Integer totalComplete;

    @Column(name = "month")
    private Integer month;

    public Data() {
        
    }
    
    public Data(Integer id, String censusArea, Integer totalStarts, Integer totalComplete, Integer month) {
        this.id = id;
        this.censusArea = censusArea;
        this.totalStarts = totalStarts;
        this.totalComplete = totalComplete;
        this.month = month;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCensusArea() {
        return censusArea;
    }

    public void setCensusArea(String censusArea) {
        this.censusArea = censusArea;
    }

    public Integer getTotalStarts() {
        return totalStarts;
    }

    public void setTotalStarts(Integer totalStarts) {
        this.totalStarts = totalStarts;
    }

    public Integer getTotalComplete() {
        return totalComplete;
    }

    public void setTotalComplete(Integer totalComplete) {
        this.totalComplete = totalComplete;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }
}
