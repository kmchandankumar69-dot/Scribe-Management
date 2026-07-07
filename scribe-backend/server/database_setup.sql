CREATE DATABASE IF NOT EXISTS scribe_db;
USE scribe_db;

CREATE TABLE IF NOT EXISTS volunteer (
  vol_id INT AUTO_INCREMENT PRIMARY KEY,
  vol_name VARCHAR(255) NOT NULL,
  vol_contact VARCHAR(255) NOT NULL,
  availability VARCHAR(255),
  language VARCHAR(255),
  education VARCHAR(255)
);