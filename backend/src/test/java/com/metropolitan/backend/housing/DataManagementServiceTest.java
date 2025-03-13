package com.metropolitan.backend.housing.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.housing.dao.DataDao;
import com.metropolitan.backend.housing.models.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

public class DataManagementServiceTest {
    
    @Mock
    private DataDao dataDao;

    @InjectMocks
    private DataManagementService dataManagementService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAddData_Success() {
        Data newData = new Data();
        when(dataDao.save(newData)).thenReturn(newData);

        String result = dataManagementService.addData(newData);

        assertEquals("Saved", result);
        verify(dataDao).save(newData);
    }

    @Test
    public void testGetData_Success() {
        Data expectedData = new Data();
        when(dataDao.findById(1)).thenReturn(Optional.of(expectedData));

        Data result = dataManagementService.getData(1);

        assertNotNull(result);
        assertEquals(expectedData, result);
        verify(dataDao).findById(1);
    }

    @Test
    public void testDeleteData_Success() {
        Integer id = 1;
        when(dataDao.existsById(id)).thenReturn(true);

        String result = dataManagementService.deleteData(id);

        assertEquals("Deleted", result);
        verify(dataDao).deleteById(id);
    }

    @Test
    public void testDeleteData_NotFound() {
        Integer id = 1;
        when(dataDao.existsById(id)).thenReturn(false);

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            dataManagementService.deleteData(id);
        });

        assertEquals("Data not found", exception.getMessage());
        verify(dataDao).existsById(id);
        verify(dataDao, never()).deleteById(id);
    }
}
