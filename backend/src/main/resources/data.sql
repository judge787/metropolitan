-- Housing Data (let ID auto-generate)
INSERT INTO housing_data
    (census_metropolitan_area, `month`, total_starts, total_complete,
     singles_starts, semis_starts, row_starts, apartment_starts,
     singles_complete, semis_complete, row_complete, apartment_complete)
VALUES
    ('TestArea', 1, 150, 120, 80, 30, 20, 20, 60, 25, 10, 15),
    ('TestArea', 2, 130, 110, 70, 25, 15, 25, 55, 20, 15, 20);

-- Labour Data (explicit ID insertion with sequence reset)
INSERT INTO labour_market_data
    (province, education_level, labour_force_status)
VALUES
    (1, 2, 1);

ALTER TABLE labour_market_data AUTO_INCREMENT = 124;