package com.metropolitan.backend.labour_market;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.labour_market.dao.LabourDataDao;
import com.metropolitan.backend.labour_market.models.LabourData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LabourDataServiceImpl implements LabourDataService {

    @Autowired
    private LabourDataDao labourDataDao;

    @Override
    public Iterable<LabourData> allData() {
        return labourDataDao.findAll();
    }

    @Override
    public LabourData getDataById(Integer id) {
        return labourDataDao.findById(id).orElseThrow(() -> new NotFoundException("Data not found"));
    }
}
