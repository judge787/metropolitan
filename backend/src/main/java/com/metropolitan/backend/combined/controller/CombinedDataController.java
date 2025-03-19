package com.metropolitan.backend.combined.controller;

import com.metropolitan.backend.combined.model.CombinedDTO;
import com.metropolitan.backend.combined.service.CombinedDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/combined")
public class CombinedDataController {

  @Autowired
  private CombinedDataService combinedDataService;

  @GetMapping("/{censusArea}/{id}/")
  public ResponseEntity<CombinedDTO> getCombinedData(
    @PathVariable String censusArea,
    @PathVariable Integer id
  ) {
    CombinedDTO combinedData = combinedDataService.getHousingStartsWithLabourData(
      censusArea,
      id
    );

    return ResponseEntity.ok(combinedData);
  }
}
