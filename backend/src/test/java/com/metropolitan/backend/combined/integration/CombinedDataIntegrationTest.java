package com.metropolitan.backend.combined.integration;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CombinedDataIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void testCombinedDataEndpoint() throws Exception {
    String censusArea = "TestArea";
    Integer id = 123;

    mockMvc
      .perform(
        get("/api/combined/data")
          .param("censusArea", censusArea)
          .param("id", id.toString())
      )
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.censusArea").value(censusArea))
      .andExpect(jsonPath("$.id").value(id))
      .andExpect(jsonPath("$.housingData").exists())
      .andExpect(jsonPath("$.labourData").exists());
  }

  @Test
  void testCombinedDataEndpointWithMissingParameters() throws Exception {
    mockMvc
      .perform(get("/api/combined/data").param("censusArea", "TestArea"))
      .andExpect(status().isBadRequest());

    mockMvc
      .perform(get("/api/combined/data").param("id", "123"))
      .andExpect(status().isBadRequest());
  }

  @Test
  void testGetCombinedData() throws Exception {
    String censusArea = "TestArea";
    Integer labourDataId = 1;

    mockMvc
      .perform(
        get("/api/combined/{censusArea}/{id}/", censusArea, labourDataId)
      )
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.censusArea").value(censusArea))
      .andExpect(jsonPath("$.labourData.id").value(labourDataId));
  }

  @Test
  void testGetCombinedData_WhenCensusAreaNotFound() throws Exception {
    String nonExistentArea = "NonExistentArea";
    Integer labourDataId = 1;

    mockMvc
      .perform(
        get("/api/combined/{censusArea}/{id}/", nonExistentArea, labourDataId)
      )
      .andExpect(status().isNotFound());
  }

  @Test
  void testGetCombinedData_WhenLabourDataIdNotFound() throws Exception {
    String censusArea = "TestArea";
    Integer nonExistentId = 99999;

    mockMvc
      .perform(
        get("/api/combined/{censusArea}/{id}/", censusArea, nonExistentId)
      )
      .andExpect(status().isNotFound());
  }
}
