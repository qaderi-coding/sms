-- SQLite Seed Data for Shop Management System

-- Insert Currencies
INSERT OR IGNORE INTO Currencies (Id, Code, Name, Symbol, CreatedAt, UpdatedAt) VALUES
(1, 'USD', 'US Dollar', '$', datetime('now'), datetime('now')),
(2, 'EUR', 'Euro', '€', datetime('now'), datetime('now')),
(3, 'PKR', 'Pakistani Rupee', '₨', datetime('now'), datetime('now')),
(4, 'INR', 'Indian Rupee', '₹', datetime('now'), datetime('now'));

-- Insert Units
INSERT OR IGNORE INTO Units (Id, Name, Symbol, CreatedAt, UpdatedAt) VALUES
(1, 'Piece', 'pcs', datetime('now'), datetime('now')),
(2, 'Kilogram', 'kg', datetime('now'), datetime('now')),
(3, 'Liter', 'L', datetime('now'), datetime('now')),
(4, 'Meter', 'm', datetime('now'), datetime('now')),
(5, 'Box', 'box', datetime('now'), datetime('now')),
(6, 'Dozen', 'dz', datetime('now'), datetime('now'));

-- Insert Categories
INSERT OR IGNORE INTO Categories (Id, Name, Description, CreatedAt, UpdatedAt) VALUES
(1, 'Bike Parts', 'Motorcycle and bicycle parts', datetime('now'), datetime('now')),
(2, 'Accessories', 'Bike accessories and gear', datetime('now'), datetime('now')),
(3, 'Tools', 'Repair and maintenance tools', datetime('now'), datetime('now')),
(4, 'Lubricants', 'Oils and lubricants', datetime('now'), datetime('now')),
(5, 'Tires', 'Bike tires and tubes', datetime('now'), datetime('now'));

-- Insert Companies
INSERT OR IGNORE INTO Companies (Id, Name, Country, CreatedAt, UpdatedAt) VALUES
(1, 'Honda', 'Japan', datetime('now'), datetime('now')),
(2, 'Yamaha', 'Japan', datetime('now'), datetime('now')),
(3, 'Suzuki', 'Japan', datetime('now'), datetime('now')),
(4, 'Kawasaki', 'Japan', datetime('now'), datetime('now')),
(5, 'Hero', 'India', datetime('now'), datetime('now')),
(6, 'Bajaj', 'India', datetime('now'), datetime('now'));

-- Insert BikeModels
INSERT OR IGNORE INTO BikeModels (Id, CompanyId, Name, Description, CreatedAt, UpdatedAt) VALUES
(1, 1, 'CB150F', 'Honda CB150F motorcycle', datetime('now'), datetime('now')),
(2, 1, 'CG125', 'Honda CG125 motorcycle', datetime('now'), datetime('now')),
(3, 2, 'YBR125', 'Yamaha YBR125 motorcycle', datetime('now'), datetime('now')),
(4, 2, 'YB125Z', 'Yamaha YB125Z motorcycle', datetime('now'), datetime('now')),
(5, 3, 'GS150', 'Suzuki GS150 motorcycle', datetime('now'), datetime('now'));

-- Insert Customers
INSERT OR IGNORE INTO Customers (Id, Name, Phone, Address, Email, CreatedAt, UpdatedAt) VALUES
(1, 'Ahmed Ali', '+92-300-1234567', '123 Main St, Karachi', 'ahmed@email.com', datetime('now'), datetime('now')),
(2, 'Sara Khan', '+92-301-2345678', '456 Park Ave, Lahore', 'sara@email.com', datetime('now'), datetime('now')),
(3, 'Muhammad Hassan', '+92-302-3456789', '789 Garden Rd, Islamabad', 'hassan@email.com', datetime('now'), datetime('now')),
(4, 'Fatima Sheikh', '+92-303-4567890', '321 Mall Rd, Faisalabad', 'fatima@email.com', datetime('now'), datetime('now')),
(5, 'Ali Raza', '+92-304-5678901', '654 Canal Rd, Multan', 'ali@email.com', datetime('now'), datetime('now'));

-- Insert Suppliers
INSERT OR IGNORE INTO Suppliers (Id, Name, Phone, Address, CreatedAt, UpdatedAt) VALUES
(1, 'Bike Parts Wholesale', '+92-21-1234567', 'Industrial Area, Karachi', datetime('now'), datetime('now')),
(2, 'Motor Accessories Ltd', '+92-42-2345678', 'Shalimar Link Rd, Lahore', datetime('now'), datetime('now')),
(3, 'Auto Parts Depot', '+92-51-3456789', 'Blue Area, Islamabad', datetime('now'), datetime('now')),
(4, 'Spare Parts Hub', '+92-41-4567890', 'Jaranwala Rd, Faisalabad', datetime('now'), datetime('now'));

-- Insert Products
INSERT OR IGNORE INTO Products (Id, Name, Sku, Price, StockQuantity, Description, CategoryId, CompanyId, BikeModelId, BaseUnitId, CreatedAt, UpdatedAt) VALUES
(1, 'Engine Oil 10W-40', 'EO-10W40-1L', '850.00', 50, 'High quality engine oil for motorcycles', 1, 1, 1, 1, datetime('now'), datetime('now')),
(2, 'Brake Pads', 'BP-FRONT-001', '1200.00', 25, 'Front brake pads for motorcycles', 1, 1, 1, 1, datetime('now'), datetime('now')),
(3, 'Air Filter', 'AF-125CC-001', '450.00', 30, 'Air filter for 125cc motorcycles', 1, 1, 1, 1, datetime('now'), datetime('now')),
(4, 'Spark Plug', 'SP-NGK-001', '350.00', 100, 'NGK spark plug for motorcycles', 1, 1, 1, 1, datetime('now'), datetime('now')),
(5, 'Chain Set', 'CS-428H-001', '2500.00', 15, '428H chain set for motorcycles', 1, 1, 1, 1, datetime('now'), datetime('now'));