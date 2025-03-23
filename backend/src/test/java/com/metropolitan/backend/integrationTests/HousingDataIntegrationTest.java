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
class HousingDataIntegrationTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  @Sql(scripts = {"/schema.sql", "/data.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
  void testGetHousingDataByCensusArea() throws Exception {
    String censusArea = "TestArea";

    mockMvc.perform(get("/api/housingStats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].censusArea").value(censusArea))
            .andExpect(jsonPath("$[0].totalStarts").value(150))
            .andExpect(jsonPath("$[1].month").value(2));
  }

  @Test
  @Sql(scripts = "/schema.sql") // Tables without data
  void testGetHousingDataByCensusArea_WhenNotFound() throws Exception {
    String nonExistentArea = "NonExistentArea";

    mockMvc.perform(get("/api/housingStats/starts/" + nonExistentArea))
            .andExpect(status().isOk()) ;
  }

  @Test
  @Sql(scripts = {"/schema.sql", "/data.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
  void testGetAllHousingData() throws Exception {
    mockMvc.perform(get("/api/housingStats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$.length()").value(2)) // 2 TestArea entries
            .andExpect(jsonPath("$[?(@.censusArea == 'TestArea')]").exists());
  }

  @Test
  @Sql(scripts = {"/schema.sql", "/data.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
  void testGetTotalHousingStartsByCensusArea() throws Exception {
    String censusArea = "TestArea";

    mockMvc.perform(get("/api/housingStats/starts/" + censusArea))
            .andExpect(status().isOk())
            .andExpect(content().string("280"));
  }

  @Test
  @Sql(scripts = {"/schema.sql", "/data.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
  void testGetTotalHousingCompletionsByCensusArea() throws Exception {
    String censusArea = "TestArea";

    mockMvc.perform(get("/api/housingStats/completions/" + censusArea))
            .andExpect(status().isOk())
            .andExpect(content().string("230"));
  }
}