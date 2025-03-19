package com.metropolitan.backend.combined.service;

import com.metropolitan.backend.combined.model.CombinedDTO;
import com.metropolitan.backend.housing.DataService;
import com.metropolitan.backend.housing.models.Data;
import com.metropolitan.backend.labour_market.LabourDataService;
import com.metropolitan.backend.labour_market.models.LabourData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class CombinedDataService {

  @Autowired
  private DataService dataService;

  @Autowired
  private LabourDataService labourDataService;


  public CombinedDataService(DataService dataService, LabourDataService labourDataService ) {
    this.dataService = dataService;
    this.labourDataService = labourDataService;
  }

  public CombinedDTO getHousingStartsWithLabourData(String censusArea, Integer labourDataId) {
    Integer totalCompleteByArea = dataService.getTotalCompleteByArea(censusArea);
    LabourData labourData = labourDataService.getDataById(labourDataId);
      return new CombinedDTO(censusArea, totalCompleteByArea, labourData);
  }
}
