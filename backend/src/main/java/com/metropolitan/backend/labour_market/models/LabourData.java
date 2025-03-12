package com.metropolitan.backend.labour_market.models;

import jakarta.persistence.*;

@Entity
@Table(name = "labour_market_data")
public class LabourData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "province")
    private Integer province;

    @Column(name = "education_level")
    private Integer educationLevel;

    @Column(name = "labour_force_status")
    private Integer labourForceStatus;

    public LabourData(Integer id, Integer province, Integer labour_force_status, Integer education_level) {
        this.id = id;
        this.province = province;
        this.labourForceStatus = labour_force_status;
        this.educationLevel = education_level;
    }

    public LabourData() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProvince() {
        return province;
    }

    public void setProvince(Integer province) {
        this.province = province;
    }

    public Integer getEducationLevel() {
        return educationLevel;
    }

    public void setEducationLevel(Integer educationLevel) {
        this.educationLevel = educationLevel;
    }

    public Integer getLabourForceStatus() {
        return labourForceStatus;
    }

    public void setLabourForceStatus(Integer labourForceStatus) {
        this.labourForceStatus = labourForceStatus;
    }
}
