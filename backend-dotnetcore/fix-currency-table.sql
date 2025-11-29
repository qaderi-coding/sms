-- Add missing columns to Currency table
ALTER TABLE Currencies ADD COLUMN CurrentExchangeRate TEXT DEFAULT '1.0';
ALTER TABLE Currencies ADD COLUMN LastUpdated TEXT DEFAULT (datetime('now'));

-- Update existing records with default values
UPDATE Currencies SET CurrentExchangeRate = '1.0' WHERE CurrentExchangeRate IS NULL;
UPDATE Currencies SET LastUpdated = datetime('now') WHERE LastUpdated IS NULL;