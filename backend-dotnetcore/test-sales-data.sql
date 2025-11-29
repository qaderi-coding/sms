-- Test Sales Data with Multiple Currencies
-- Make sure to run the seed-data.sql first

-- Insert test transactions for sales
INSERT OR IGNORE INTO Transactions (Id, Type, PartyType, PartyId, OriginalAmount, Currency, ExchangeRateToUsd, AmountUsd, Notes, CreatedAt, UpdatedAt) VALUES
(1, 0, 0, 1, '5500.00', 'PKR', '0.0036', '19.80', 'Sale to Ahmed Ali', datetime('now'), datetime('now')),
(2, 0, 0, 2, '850.00', 'USD', '1.0', '850.00', 'Sale to Sara Khan', datetime('now'), datetime('now')),
(3, 0, 0, 3, '2800.00', 'PKR', '0.0036', '10.08', 'Sale to Muhammad Hassan', datetime('now'), datetime('now'));

-- Insert test sales with different currencies
INSERT OR IGNORE INTO Sales (Id, TransactionId, CustomerId, SaleDate, TotalAmount, Currency, Discount, FinalAmount, Status, Notes, CreatedAt, UpdatedAt) VALUES
(1, 1, 1, datetime('now', '-2 days'), '5500.00', 'PKR', '200.00', '5300.00', 1, 'Engine oil and brake pads', datetime('now'), datetime('now')),
(2, 2, 2, datetime('now', '-1 day'), '850.00', 'USD', '50.00', '800.00', 2, 'Air filter and spark plug', datetime('now'), datetime('now')),
(3, 3, 3, datetime('now'), '2800.00', 'PKR', '0.00', '2800.00', 0, 'Chain set', datetime('now'), datetime('now'));

-- Insert sale items with currencies
INSERT OR IGNORE INTO SaleItems (Id, SaleId, ProductId, Quantity, UnitPrice, TotalPrice, Currency, CreatedAt, UpdatedAt) VALUES
-- Sale 1 items (PKR)
(1, 1, 1, 2, '850.00', '1700.00', 'PKR', datetime('now'), datetime('now')),
(2, 1, 2, 1, '1200.00', '1200.00', 'PKR', datetime('now'), datetime('now')),
(3, 1, 4, 5, '350.00', '1750.00', 'PKR', datetime('now'), datetime('now')),
(4, 1, 3, 2, '450.00', '900.00', 'PKR', datetime('now'), datetime('now')),

-- Sale 2 items (USD)
(5, 2, 3, 1, '450.00', '450.00', 'USD', datetime('now'), datetime('now')),
(6, 2, 4, 1, '350.00', '350.00', 'USD', datetime('now'), datetime('now')),

-- Sale 3 items (PKR)
(7, 3, 5, 1, '2500.00', '2500.00', 'PKR', datetime('now'), datetime('now')),
(8, 3, 4, 1, '350.00', '350.00', 'PKR', datetime('now'), datetime('now'));