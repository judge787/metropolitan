package com.metropolitan.backend.controller;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.housing.DataService;
import com.metropolitan.backend.housing.models.Data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/housingStats")
public class HousingDataController {
    private DataService dataService;

    @Autowired
    public HousingDataController(DataService dataService) {
        this.dataService = dataService;
    }


    // retrieves housing data by ID
    @GetMapping("/id/{id}")
    public ResponseEntity<Data> getData(@PathVariable Integer id) {
        try {
            Data data = dataService.getData(id);
            return ResponseEntity.ok(data);
        } catch (NotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping()
    public ResponseEntity<Iterable<Data>> allData() {
        Iterable<Data> data = dataService.allData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/starts/{censusArea}")
    public ResponseEntity<Integer> getTotalHousingStartsByCensusArea(@PathVariable String censusArea){
        Integer total = dataService.getTotalStartsByArea(censusArea);
        return  ResponseEntity.ok(total);
    }

    // fetches total housing completions for a given census area
    @GetMapping("/completions/{censusArea}")
    public ResponseEntity<Integer> getTotalHousingCompletionsByCensusArea(@PathVariable String censusArea){
        Integer total = dataService.getTotalCompleteByArea(censusArea);
        return  ResponseEntity.ok(total);
    }

}
