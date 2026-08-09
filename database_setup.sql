CREATE DATABASE IF NOT EXISTS scribe_db;

USE scribe_db;

CREATE TABLE IF NOT EXISTS volunteer (
    vol_id INT AUTO_INCREMENT PRIMARY KEY,
    vol_name VARCHAR(255) NOT NULL,
    vol_contact VARCHAR(255) NOT NULL,
    availability VARCHAR(255) NOT NULL,
    language VARCHAR(255) NOT NULL,
    education VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS person (
    person_id INT AUTO_INCREMENT PRIMARY KEY,
    contact_info VARCHAR(255) NOT NULL,
    education_level VARCHAR(255) NOT NULL,
    preferred_language VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS examination (
    exam_id INT AUTO_INCREMENT PRIMARY KEY,
    date_time DATETIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    duration DECIMAL(5,2) NOT NULL,
    person_id INT NOT NULL,
    vol_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS coordinator (
    coord_id INT AUTO_INCREMENT PRIMARY KEY,
    coord_name VARCHAR(255) NOT NULL,
    contact_info VARCHAR(255) NOT NULL,
    assigned_exam VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS feedback (
    feedback_id INT AUTO_INCREMENT PRIMARY KEY,
    person_id INT NOT NULL,
    vol_id INT NOT NULL,
    exam_id INT NOT NULL,
    rating INT NOT NULL,
    comments TEXT NOT NULL
);