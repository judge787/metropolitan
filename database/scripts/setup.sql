-- Switch to the desired database
USE template_db;

-- Drop the existing table
--DROP TABLE note;

-- Create the new table
-- Create the table (if not exists)
CREATE TABLE IF NOT EXISTS housing_data (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary Key',
    census_metropolitan_area VARCHAR(255) COMMENT 'Census Metropolitan Area',
    month INT DEFAULT NULL COMMENT 'Month',
    total_starts INT DEFAULT 0 COMMENT 'Total Starts',
    total_complete INT DEFAULT 0 COMMENT 'Total Complete',
    singles_starts INT DEFAULT 0 COMMENT 'Singles Starts',
    semis_starts INT DEFAULT 0 COMMENT 'Semis Starts',
    row_starts INT DEFAULT 0 COMMENT 'Row Starts',
    apartment_starts INT DEFAULT 0 COMMENT 'Apartment Starts',
    singles_complete INT DEFAULT 0 COMMENT 'Singles Complete',
    semis_complete INT DEFAULT 0 COMMENT 'Semis Complete',
    row_complete INT DEFAULT 0 COMMENT 'Row Complete',
    apartment_complete INT DEFAULT 0 COMMENT 'Apartment Complete'
);

CREATE TABLE IF NOT EXISTS labour_market_data (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary Key',
    province INT DEFAULT 0 COMMENT 'Province',
    education_level INT DEFAULT 0 COMMENT 'Education Level',
    labour_force_status INT DEFAULT 0 COMMENT 'Labour Force Status'
);