package com.metropolitan.backend.integrationTests;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class CombinedDataIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  @Sql(scripts = {"/schema.sql", "/data.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
  void testCombinedDataEndpoint() throws Exception {
    String censusArea = "TestArea";
    Integer id = 1;

    mockMvc.perform(get("/api/combined/{censusArea}/{id}", censusArea, id.toString()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.censusArea").value(censusArea))
            .andExpect(jsonPath("$.totalStarts").value(280))
            .andExpect(jsonPath("$.labourData.id").value(id))
            .andExpect(jsonPath("$.labourData.province").value(1))
            .andExpect(jsonPath("$.labourData.educationLevel").value(2))
            .andExpect(jsonPath("$.labourData.labourForceStatus").value(1));
  }

  @Test
  @Sql(scripts = {"/schema.sql", "/data.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
  void testCombinedDataEndpointWithMissingParameters() throws Exception {
    mockMvc.perform(get("/api/combined/{censusArea}", "TestArea"))
            .andExpect(status().isNotFound());

    mockMvc.perform(get("/api/combined/{id}", 10))
            .andExpect(status().isNotFound());
  }

}