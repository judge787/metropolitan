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
    HousingDataController(DataService dataService) {
        this.dataService = dataService;
    }

    @PostMapping()
    private ResponseEntity<String> addData(@RequestBody Data newData) {
        String result = dataService.addData(newData);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping("/{id}")
    private ResponseEntity<Data> getData(@PathVariable Integer id) {
        try {
            Data data = dataService.getData(id);
            return ResponseEntity.ok(data);
        } catch (NotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping()
    private ResponseEntity<String> updateData(@RequestBody Data updatedData) {
        String result = dataService.updateData(updatedData);
        if ("Updated".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    @DeleteMapping("/{id}")
    private ResponseEntity<String> deleteData(@PathVariable Integer id) {
        String result = dataService.deleteData(id);
        if ("Deleted".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    @GetMapping()
    private ResponseEntity<Iterable<Data>> allData() {
        Iterable<Data> data = dataService.allData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/count")
    private ResponseEntity<Integer> count() {
        Integer count = dataService.count();
        return ResponseEntity.ok(count);
    }
    @GetMapping("/starts/{censusArea}")
    private ResponseEntity<Integer> getTotalHousingStartsByCensusArea(@PathVariable String censusArea){
        Integer total = dataService.getTotalStartsByArea(censusArea);
        return  ResponseEntity.ok(total);
    }
    @GetMapping("/Complete/{censusArea}")
    private ResponseEntity<Integer> getTotalHousingCompleteByCensusArea(@PathVariable String censusArea){
        Integer total = dataService.getTotalCompleteByArea(censusArea);
        return  ResponseEntity.ok(total);
    }
//    @GetMapping("/starts/{totalStarts}")
//    private ResponseEntity<Iterable<Data>> getDataByTotalStarts(@PathVariable Integer totalStarts){
//        Iterable<Data> data = dataService.getDataByTotalStarts(totalStarts);
//        return ResponseEntity.ok(data);
//    }
//
//    @GetMapping("/complete/{totalComplete}")
//    private ResponseEntity<Iterable<Data>> getDataByTotalComplete(@PathVariable Integer totalComplete) {
//        Iterable<Data> data = dataService.getDataByTotalComplete(totalComplete);
//        return ResponseEntity.ok(data);
//    }
}
