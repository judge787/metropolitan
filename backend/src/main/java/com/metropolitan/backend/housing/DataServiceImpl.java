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
    public String addData(Data newData) {
        try {
            dataDao.save(newData);
        } catch (Exception e) {
            return e.getMessage();
        }

        return "Saved";
    }

    @Override
    public Data getData(Integer id) {
        return dataDao.findById(id).orElseThrow(() -> new NotFoundException("Data not found"));
    }
  
    @Override
    public String updateData(Data updatedData) {
        try {
            dataDao.save(updatedData);
        } catch (Exception e) {
            return e.getMessage();
        }

        return "Updated";
    }
  
    @Override
    public String deleteData(Integer id) {
        if (!dataDao.existsById(id)) {
            throw new NotFoundException("Data not found");
        }

        dataDao.deleteById(id);
        return "Deleted";
    }
  
    public Iterable<Data> allData() {
        return dataDao.findAll();
    }
  
    @Override
    public Integer count() {
        return dataDao.getCount();
    }
  
    @Override
    public Iterable<Data> getDataByTotalStarts(Integer totalStarts) {
        return dataDao.getDataByTotalStarts(totalStarts);
    }
  
   @Override
   public Iterable<Data> getDataByTotalComplete(Integer totalComplete) {
       return dataDao.getDataByTotalComplete(totalComplete);
   }
   @Override
   public Integer getTotalStartsByArea(String area){
        return dataDao.sumTotalStartsByCensusArea(area);
   }
    public Integer getTotalCompleteByArea(String area){
        return dataDao.sumTotalCompleteByCensusArea(area);
    }
}
