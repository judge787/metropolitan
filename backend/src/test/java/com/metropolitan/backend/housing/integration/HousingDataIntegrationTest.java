package com.metropolitan.backend.housing.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class HousingDataIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void testGetHousingDataByCensusArea() throws Exception {
    String censusArea = "TestArea";

    mockMvc
      .perform(
        get("/api/housing/data")
          .param("censusArea", censusArea)
      )
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.censusArea").value(censusArea));
  }

  @Test
  void testGetHousingDataByCensusArea_WhenNotFound() throws Exception {
    String nonExistentArea = "NonExistentArea";

    mockMvc
      .perform(
        get("/api/housing/data")
          .param("censusArea", nonExistentArea)
      )
      .andExpect(status().isNotFound());
  }

  @Test
  void testGetAllHousingData() throws Exception {
    mockMvc
      .perform(get("/api/housing/data/all"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$").isArray())
      .andExpect(jsonPath("$[0]").exists());
  }
}
