package com.metropolitan.backend.combined.model;

import com.metropolitan.backend.labour_market.models.LabourData;

public class CombinedDTO {
  private String censusArea;
  private Integer totalStarts;;
  private LabourData labourData;


  public CombinedDTO(String censusArea, Integer totalStarts, LabourData labourData) {
    this.censusArea = censusArea;
    this.totalStarts = totalStarts;
    this.labourData = labourData;
  }

  public CombinedDTO() {

  }

  public String getCensusArea() {
    return censusArea;
  }

  public void setCensusArea(String censusArea) {
    this.censusArea = censusArea;
  }


  public LabourData getLabourData() {
    return labourData;
  }

  public void setLabourData(LabourData labourData) {
    this.labourData = labourData;
  }

  public Integer getTotalStarts() {
    return totalStarts;
  }

  public void setTotalStarts(Integer totalStarts) {
    this.totalStarts = totalStarts;
  }
}
