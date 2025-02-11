CREATE DATABASE IF NOT EXISTS GoodDriverIncentiveT3;
USE GoodDriverIncentiveT3;

-- Tables
-- Sponsor (Company)
CREATE TABLE IF NOT EXISTS Sponsor (
    CompanyID INT AUTO_INCREMENT PRIMARY KEY,
    CompanyName VARCHAR(255) NOT NULL,
    ProductCatalogID INT NULL,
    PointsInfo TEXT NULL
);

-- Sponsor User
CREATE TABLE IF NOT EXISTS SponsorUser (
    SponsorUserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    CompanyID INT,
    FOREIGN KEY (CompanyID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE
);

-- Admin User
CREATE TABLE IF NOT EXISTS Admin (
    AdminID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL
);

-- Driver User
CREATE TABLE IF NOT EXISTS Driver (
    DriverID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NULL,
    TotalPoints INT DEFAULT 0,
    CompanyID INT,
    FOREIGN KEY (CompanyID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE
);

-- Product Catalog
CREATE TABLE IF NOT EXISTS ProductCatalog (
    ProductID INT AUTO_INCREMENT PRIMARY KEY,
    CompanyID INT,
    ProductName VARCHAR(255) NOT NULL,
    PriceInPoints INT NOT NULL,
    Availability BOOLEAN DEFAULT TRUE,
    Description TEXT NULL,
    ImageURL VARCHAR(512) NULL,
    FOREIGN KEY (CompanyID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE
);

-- Purchases
CREATE TABLE IF NOT EXISTS Purchases (
    PurchaseID INT AUTO_INCREMENT PRIMARY KEY,
    DriverID INT,
    ProductID INT,
    PurchaseDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Quantity INT DEFAULT 1,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES ProductCatalog(ProductID) ON DELETE CASCADE
);

-- Point Transactions
CREATE TABLE IF NOT EXISTS PointTransactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    DriverID INT,
    SponsorID INT,
    AdminID INT NULL,
    AmountChanged INT NOT NULL,
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Reason TEXT NULL,
    FOREIGN KEY (DriverID) REFERENCES Driver(DriverID) ON DELETE CASCADE,
    FOREIGN KEY (SponsorID) REFERENCES Sponsor(CompanyID) ON DELETE CASCADE,
    FOREIGN KEY (AdminID) REFERENCES Admin(AdminID) ON DELETE SET NULL
);

-- Audit Log
CREATE TABLE IF NOT EXISTS AuditLog (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    UserType ENUM('Driver', 'SponsorUser', 'Admin') NOT NULL,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Action TEXT NOT NULL,
    Details TEXT NULL
);
