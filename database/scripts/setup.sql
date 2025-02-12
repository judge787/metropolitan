-- Switch to the desired database
USE template_db;

-- Create the new table
-- Create the table (if not exists)
CREATE TABLE IF NOT EXISTS housing_data (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary Key',
    census_metropolitan_area VARCHAR(255) COMMENT 'Census Metropolitan Area',
    total_starts INT DEFAULT 0 COMMENT 'Total Starts',
    total_complete INT DEFAULT 0 COMMENT 'Total Complete',
    last_updated VARCHAR(255) COMMENT 'Last Updated',
);




