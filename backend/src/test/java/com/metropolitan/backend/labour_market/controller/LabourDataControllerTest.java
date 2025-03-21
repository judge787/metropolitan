package com.metropolitan.backend.labour_market.controller;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.labour_market.LabourDataService;
import com.metropolitan.backend.labour_market.models.LabourData;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LabourDataControllerTest {

    @Mock
    private LabourDataService labourDataService;

    @InjectMocks
    private LabourDataController labourDataController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetDataById() {
        // Arrange
        Integer id = 123;
        LabourData mockLabourData = new LabourData(id, 1, 2, 3);

        when(labourDataService.getDataById(id)).thenReturn(mockLabourData);

        // Act
        ResponseEntity<LabourData> response = labourDataController.getData(id);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockLabourData, response.getBody());

        verify(labourDataService, times(1)).getDataById(id);
    }

    @Test
    void testGetDataById_WhenNotFound() {
        // Arrange
        Integer id = 999;

        doThrow(new NotFoundException("Labour data not found")).when(labourDataService).getDataById(id);

        // Act
        ResponseEntity<LabourData> response = labourDataController.getData(id);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());

        verify(labourDataService, times(1)).getDataById(id);
    }

    @Test
    void testAllData() {
        // Arrange
        LabourData mockLabourData = new LabourData(123, 1, 2, 3);
        List<LabourData> mockLabourDataList = List.of(mockLabourData);

        when(labourDataService.allData()).thenReturn(mockLabourDataList);

        // Act
        ResponseEntity<Iterable<LabourData>> response = labourDataController.allData();

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockLabourDataList, response.getBody());

        verify(labourDataService, times(1)).allData();
    }
}
