package com.metropolitan.backend.labour_market.controller;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.labour_market.LabourDataService;
import com.metropolitan.backend.labour_market.models.LabourData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/labourMarket")
public class LabourDataController {
    private LabourDataService labourDataService;

    @Autowired
    public LabourDataController(LabourDataService labourDataService) {
        this.labourDataService = labourDataService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabourData> getData(@PathVariable Integer id) {
        try {
            LabourData data = labourDataService.getDataById(id);
            return ResponseEntity.ok(data);
        } catch (NotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    @GetMapping()
    private ResponseEntity<Iterable<LabourData>> allData() {
        Iterable<LabourData> data = labourDataService.allData();
        return ResponseEntity.ok(data);
    }
}
