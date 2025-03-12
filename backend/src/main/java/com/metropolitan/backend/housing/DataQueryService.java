package com.metropolitan.backend.housing.service;

import com.metropolitan.backend.housing.dao.DataDao;
import com.metropolitan.backend.housing.models.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataQueryService {
    @Autowired
    private DataDao dataDao;

    public Iterable<Data> allData() {
        return dataDao.findAll();
    }

    public Iterable<Data> getDataByTotalStarts(Integer totalStarts) {
        return dataDao.getDataByTotalStarts(totalStarts);
    }

    public Iterable<Data> getDataByTotalComplete(Integer totalComplete) {
        return dataDao.getDataByTotalComplete(totalComplete);
    }
}
