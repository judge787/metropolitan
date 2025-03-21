package com.metropolitan.backend.combined.controller;

import com.metropolitan.backend.combined.model.CombinedDTO;
import com.metropolitan.backend.combined.service.CombinedDataService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class CombinedDataControllerTest {

    @Mock
    private CombinedDataService combinedDataService;

    @InjectMocks
    private CombinedDataController combinedDataController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCombinedData() {
        // Arrange
        String censusArea = "TestArea";
        Integer id = 123;

        CombinedDTO mockData = new CombinedDTO();
        mockData.setCensusArea(censusArea);

        when(combinedDataService.getHousingStartsWithLabourData(censusArea, id)).thenReturn(mockData);

        // Act
        ResponseEntity<CombinedDTO> response = combinedDataController.getCombinedData(censusArea, id);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(censusArea, response.getBody().getCensusArea());

        verify(combinedDataService, times(1)).getHousingStartsWithLabourData(censusArea, id);
    }

}
