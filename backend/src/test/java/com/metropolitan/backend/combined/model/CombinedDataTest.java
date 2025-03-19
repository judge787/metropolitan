package com.metropolitan.backend.combined.model;

import static org.junit.jupiter.api.Assertions.*;

import com.metropolitan.backend.labour_market.models.LabourData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CombinedDataTest {

  private CombinedDTO combinedData;

  @BeforeEach
  void setUp() {
    combinedData = new CombinedDTO();
  }

  @Test
  void testDefaultConstructor() {
    assertNotNull(combinedData);
    assertNull(combinedData.getCensusArea());
    assertNull(combinedData.getTotalStarts());
    assertNull(combinedData.getLabourData());
  }

  @Test
  void testSetAndGetCensusArea() {
    String censusArea = "TestArea";
    combinedData.setCensusArea(censusArea);
    assertEquals(censusArea, combinedData.getCensusArea());
  }

  @Test
  void testSetAndGetTotalStarts() {
    Integer totalStarts = 500;
    combinedData.setTotalStarts(totalStarts);
    assertEquals(totalStarts, combinedData.getTotalStarts());
  }

  @Test
  void testSetAndGetLabourData() {
    LabourData labourData = new LabourData(1, 2, 3, 4);
    combinedData.setLabourData(labourData);
    assertEquals(labourData, combinedData.getLabourData());
  }
}
