package com.metropolitan.backend.integrationTests;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class LabourDataIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  @Sql(scripts = {"/schema.sql", "/data.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
  void testGetLabourDataById() throws Exception {
    Integer id = 1; // Matches data.sql entry

    mockMvc.perform(get("/api/labourMarket/{id}", id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(id))
            .andExpect(jsonPath("$.province").value(1))
            .andExpect(jsonPath("$.educationLevel").value(2))
            .andExpect(jsonPath("$.labourForceStatus").value(1));
  }

  @Test
  @Sql(scripts = "/schema.sql") // Empty tables
  void testGetLabourDataById_WhenNotFound() throws Exception {
    Integer nonExistentId = 99999;

    mockMvc.perform(get("/api/labourMarket/{id}", nonExistentId))
            .andExpect(status().isNotFound());
  }

  @Test
  @Sql(scripts = {"/schema.sql", "/data.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
  void testGetAllLabourData() throws Exception {
    mockMvc.perform(get("/api/labourMarket"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(1)) // Total entries in data.sql
            .andExpect(jsonPath("$[?(@.province == 1)]").exists())
            .andExpect(jsonPath("$[?(@.educationLevel == 2)]").exists())
            .andExpect(jsonPath("$[?(@.labourForceStatus == 1)]").exists());
  }
}