package com.metropolitan.backend.housing;

import com.metropolitan.backend.housing.models.Data;

public interface DataService {
  public String addData(Data newData);

  public Data getData(Integer id);

  public String updateData(Data updatedData);

  public String deleteData(Integer id);

  public Iterable<Data> allData();

  public Integer count();

  public Iterable<Data> getDataByTotalStarts(Integer totalStarts);

  public Iterable<Data> getDataByTotalComplete(Integer totalComplete);
}
