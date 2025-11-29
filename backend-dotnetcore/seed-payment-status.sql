-- Payment Status Seed Data
INSERT OR IGNORE INTO PaymentStatuses (Id, Code, Name, Description, IsActive, SortOrder, CreatedAt, UpdatedAt) VALUES
(1, 'PENDING', 'Pending', 'Payment is pending', 1, 1, datetime('now'), datetime('now')),
(2, 'PARTIAL', 'Partial', 'Payment is partially completed', 1, 2, datetime('now'), datetime('now')),
(3, 'PAID', 'Paid', 'Payment is fully completed', 1, 3, datetime('now'), datetime('now')),
(4, 'CANCELLED', 'Cancelled', 'Payment was cancelled', 1, 4, datetime('now'), datetime('now')),
(5, 'REFUNDED', 'Refunded', 'Payment was refunded', 1, 5, datetime('now'), datetime('now'));

-- Update Currency table with exchange rates and active status
UPDATE Currencies SET ExchangeRateToUsd = 1.0, IsActive = 1 WHERE Code = 'USD';
UPDATE Currencies SET ExchangeRateToUsd = 0.92, IsActive = 1 WHERE Code = 'EUR';
UPDATE Currencies SET ExchangeRateToUsd = 0.0036, IsActive = 1 WHERE Code = 'PKR';
UPDATE Currencies SET ExchangeRateToUsd = 0.012, IsActive = 1 WHERE Code = 'INR';