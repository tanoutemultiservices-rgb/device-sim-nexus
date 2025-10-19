-- Create database
CREATE DATABASE IF NOT EXISTS dashboard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dashboard_db;

-- Devices table
CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand VARCHAR(50) NOT NULL,
    os VARCHAR(50) NOT NULL,
    status ENUM('0', '1') DEFAULT '0',
    last_connect BIGINT NOT NULL,
    ip VARCHAR(45) NOT NULL,
    sim_cards INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- SIM Cards table
CREATE TABLE IF NOT EXISTS sim_cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    operator VARCHAR(50) NOT NULL,
    number VARCHAR(20) NOT NULL,
    today_activations INT DEFAULT 0,
    today_topups INT DEFAULT 0,
    connected ENUM('0', '1') DEFAULT '0',
    balance DECIMAL(10, 3) DEFAULT 0.000,
    activation_status ENUM('0', '1') DEFAULT '0',
    topup_status ENUM('0', '1') DEFAULT '0',
    device VARCHAR(50),
    last_connect BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device) REFERENCES devices(id) ON DELETE SET NULL
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    tel VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status ENUM('PENDING', 'ACCEPT', 'REJECT') DEFAULT 'PENDING',
    balance DECIMAL(10, 3) DEFAULT 0.000,
    device VARCHAR(50),
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (device) REFERENCES devices(id) ON DELETE SET NULL
);

-- Activations table
CREATE TABLE IF NOT EXISTS activations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_operation BIGINT NOT NULL,
    operator VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    ussd_code VARCHAR(50) NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REFUSED') DEFAULT 'PENDING',
    user VARCHAR(50) NOT NULL,
    date_response BIGINT DEFAULT 0,
    msg_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
);

-- Topups table
CREATE TABLE IF NOT EXISTS topups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_operation BIGINT NOT NULL,
    operator VARCHAR(50) NOT NULL,
    montant DECIMAL(10, 2) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REFUSED') DEFAULT 'PENDING',
    user VARCHAR(50) NOT NULL,
    new_balance DECIMAL(10, 3) DEFAULT 0.000,
    msg_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data (optional)
INSERT INTO devices (id, name, brand, os, status, last_connect, ip, sim_cards) VALUES
('1505ae2fee7d00aa', 'realme Note 50', 'realme', 'Android 13', '1', 1760748498092, '10.125.117.203', 2),
('2f37396e5b991337', 'A12 de Ben Dahmane', 'samsung', 'Android 13', '1', 1760775244447, '192.168.1.3', 2);

INSERT INTO users (id, username, nom, prenom, tel, email, status, balance, device, role) VALUES
('1505ae2fee7d00aa', 'Khan', 'Khan', 'Juma', '0693916148', 'techpoty@gmail.com', 'ACCEPT', 0.000, '1505ae2fee7d00aa', 'admin'),
('2f37396e5b991337', 'jawad', 'be dahmane', 'jawad', '0654166466', 'jawad.bendahmane2@gmail.com', 'ACCEPT', 1.300, '2f37396e5b991337', 'user');

INSERT INTO sim_cards (id, operator, number, today_activations, today_topups, connected, balance, activation_status, topup_status, device, last_connect) VALUES
(73, 'Maroc Telecom', '0612345678', 12, 5, '0', 45.325, '1', '1', '1505ae2fee7d00aa', 1752250399916),
(76, 'inwi', '0716522709', 18, 8, '1', 1745.525, '1', '1', '2f37396e5b991337', 1756979741970);