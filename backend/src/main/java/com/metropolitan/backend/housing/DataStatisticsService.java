package com.metropolitan.backend.housing.service;

import com.metropolitan.backend.housing.dao.DataDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataStatisticsService {
    @Autowired
    private DataDao dataDao;

    public Integer count() {
        return dataDao.getCount();
    }

    public Integer getTotalStartsByArea(String area) {
        return dataDao.sumTotalStartsByCensusArea(area);
    }

    public Integer getTotalCompleteByArea(String area) {
        return dataDao.sumTotalCompleteByCensusArea(area);
    }
}
