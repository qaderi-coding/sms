#!/bin/bash

# Find the SQLite database file
DB_FILE=$(find . -name "*.db" -type f | head -1)

if [ -z "$DB_FILE" ]; then
    echo "No SQLite database file found"
    exit 1
fi

echo "Found database: $DB_FILE"
echo "Applying currency table fix..."

# Apply the SQL fix
sqlite3 "$DB_FILE" < fix-currency-table.sql

echo "Currency table fix applied successfully!"

# Verify the changes
echo "Verifying table structure:"
sqlite3 "$DB_FILE" ".schema Currencies"