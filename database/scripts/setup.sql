-- Switch to the desired database
USE template_db;

-- Drop the existing table
--DROP TABLE note;

-- Create the new table
-- Create the table (if not exists)
CREATE TABLE IF NOT EXISTS myawesomeproject (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary Key',
);

