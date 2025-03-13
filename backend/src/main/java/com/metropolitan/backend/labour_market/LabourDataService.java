package com.metropolitan.backend.labour_market;


import com.metropolitan.backend.labour_market.models.LabourData;

public interface LabourDataService {
    public Iterable<LabourData> allData();

    public LabourData getDataById(Integer id);

}
