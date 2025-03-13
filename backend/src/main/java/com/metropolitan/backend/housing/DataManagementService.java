package com.metropolitan.backend.housing.service;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.housing.dao.DataDao;
import com.metropolitan.backend.housing.models.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataManagementService {
    @Autowired
    private DataDao dataDao;

    public String addData(Data newData) {
        try {
            dataDao.save(newData);
        } catch (Exception e) {
            return e.getMessage();
        }
        return "Saved";
    }

    public Data getData(Integer id) {
        return dataDao.findById(id).orElseThrow(() -> new NotFoundException("Data not found"));
    }

    public String updateData(Data updatedData) {
        try {
            dataDao.save(updatedData);
        } catch (Exception e) {
            return e.getMessage();
        }
        return "Updated";
    }

    public String deleteData(Integer id) {
        if (!dataDao.existsById(id)) {
            throw new NotFoundException("Data not found");
        }
        dataDao.deleteById(id);
        return "Deleted";
    }
}
