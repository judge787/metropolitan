package com.metropolitan.backend.housing;

import com.metropolitan.backend.housing.models.Data;

public interface DataService {

  public Data getData(Integer id);

  public Iterable<Data> allData();

  public Integer getTotalStartsByArea(String area);

  public Integer getTotalCompleteByArea(String area);
}
