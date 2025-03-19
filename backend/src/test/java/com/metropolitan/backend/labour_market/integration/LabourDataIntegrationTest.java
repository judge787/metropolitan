package com.metropolitan.backend.labour_market.integration;

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
class LabourDataIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void testGetLabourDataById() throws Exception {
    Integer id = 1;

    mockMvc
      .perform(
        get("/api/labour/data/" + id)
      )
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.id").value(id));
  }

  @Test
  void testGetLabourDataById_WhenNotFound() throws Exception {
    Integer nonExistentId = 99999;

    mockMvc
      .perform(
        get("/api/labour/data/" + nonExistentId)
      )
      .andExpect(status().isNotFound());
  }

  @Test
  void testGetAllLabourData() throws Exception {
    mockMvc
      .perform(get("/api/labour/data"))
      .andExpect(status().isOk())
      .andExpect(jsonPath("$").isArray())
      .andExpect(jsonPath("$[0]").exists());
  }
}
