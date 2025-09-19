-- Create database (run this first: CREATE DATABASE grip_invest;)
USE grip_invest;

-- Users Table
CREATE TABLE users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    risk_appetite ENUM('low','moderate','high') DEFAULT 'moderate',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Investment Products Table
CREATE TABLE investment_products (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    investment_type ENUM('bond','fd','mf','etf','other') NOT NULL,
    tenure_months INT NOT NULL,
    annual_yield DECIMAL(5,2) NOT NULL,
    risk_level ENUM('low','moderate','high') NOT NULL,
    min_investment DECIMAL(12,2) DEFAULT 1000.00,
    max_investment DECIMAL(12,2),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Investments Table
CREATE TABLE investments (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36) NOT NULL,
    product_id CHAR(36) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    invested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active','matured','cancelled') DEFAULT 'active',
    expected_return DECIMAL(12,2),
    maturity_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES investment_products(id) ON DELETE CASCADE
);

-- Transaction Logs Table
CREATE TABLE transaction_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36),
    email VARCHAR(255),
    endpoint VARCHAR(255) NOT NULL,
    http_method ENUM('GET','POST','PUT','DELETE') NOT NULL,
    status_code INT NOT NULL,
    error_message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed Data (for testing)
INSERT INTO users (id, first_name, last_name, email, password_hash, risk_appetite) VALUES
(UUID(), 'Nikhil', 'Jangid', 'nikhil.jangid@example.com', '$2b$10$hashedpass', 'moderate'),  -- Use bcrypt in code
(UUID(), 'Johny', 'Singh', 'johny.singh@example.com', '$2b$10$hashedpass', 'low'),
(UUID(), 'Ben', 'Patel', 'ben10.patel@example.com', '$2b$10$hashedpass', 'high');

INSERT INTO investment_products (id, name, investment_type, tenure_months, annual_yield, risk_level, min_investment, max_investment, description) VALUES
(UUID(), 'Sovereign Gold Bond', 'bond', 12, 2.50, 'low', 5000.00, 500000.00, 'Government-backed gold investment in India with assured returns.'),
(UUID(), 'Equity MF', 'mf', 36, 12.00, 'high', 5000.00, NULL, 'High-growth mutual fund with Indian equity exposure.'),
(UUID(), 'Fixed Deposit', 'fd', 24, 6.75, 'low', 1000.00, 1000000.00, 'Secure FD from Indian banks with guaranteed returns.');

-- Note: Hash passwords in code before seeding real data.