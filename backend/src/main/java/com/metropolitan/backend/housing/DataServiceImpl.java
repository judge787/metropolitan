package com.metropolitan.backend.housing;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.housing.dao.DataDao;
import com.metropolitan.backend.housing.models.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataServiceImpl implements DataService {
    @Autowired
    private DataDao dataDao;

    @Override
    public Data getData(Integer id) {
        return dataDao.findById(id).orElseThrow(() -> new NotFoundException("Data not found"));
    }

    public Iterable<Data> allData() {
        return dataDao.findAll();
    }

    @Override
    public Integer getTotalStartsByArea(String area) {
        return dataDao.sumTotalStartsByCensusArea(area);
    }

    public Integer getTotalCompleteByArea(String area) {
        return dataDao.sumTotalCompleteByCensusArea(area);
    }
}
