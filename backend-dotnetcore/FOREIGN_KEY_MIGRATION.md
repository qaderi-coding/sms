# Currency and PaymentStatus Foreign Key Migration

## **Changes Made**

### **1. New Entity Created**
- `PaymentStatus.cs` - Replaces PaymentStatus enum with entity

### **2. Entities Updated**
- `Sale.cs` - Currency (string) → CurrencyId (int), Status (enum) → PaymentStatusId (int)
- `SaleItem.cs` - Currency (string) → CurrencyId (int)
- `Purchase.cs` - Currency (string) → CurrencyId (int), Status (enum) → PaymentStatusId (int)
- `PurchaseItem.cs` - Currency (string) → CurrencyId (int)
- `Payment.cs` - Currency (string) → CurrencyId (int)
- `Transaction.cs` - Currency (string) → CurrencyId (int)
- `Currency.cs` - Added relationships and exchange rate

### **3. Database Configuration**
- Added PaymentStatus DbSet
- Configured all foreign key relationships
- Added unique indexes on Currency.Code and PaymentStatus.Code

## **Benefits Achieved**

### **Data Integrity**
- ✅ Prevents invalid currency codes
- ✅ Prevents invalid payment statuses
- ✅ Database enforces referential integrity
- ✅ Cascading updates/deletes possible

### **Flexibility**
- ✅ Add new currencies without code changes
- ✅ Add new payment statuses without code changes
- ✅ Support for inactive/active currencies
- ✅ Built-in exchange rate support

### **Maintainability**
- ✅ Centralized currency management
- ✅ Centralized payment status management
- ✅ Audit trail for changes
- ✅ Localization support ready

## **Migration Steps Required**

### **1. Create Migration**
```bash
dotnet ef migrations add ConvertToForeignKeys
```

### **2. Update Existing Data**
```sql
-- This would need to be done carefully to preserve existing data
-- Convert string currencies to IDs
-- Convert enum values to PaymentStatus IDs
```

### **3. Apply Migration**
```bash
dotnet ef database update
```

### **4. Seed New Data**
```bash
# Run seed-payment-status.sql
```

## **Code Changes Needed**

### **DTOs Need Updates**
- Change `string Currency` to `int CurrencyId` or keep both for backward compatibility
- Change `PaymentStatus Status` to `int PaymentStatusId` or keep both

### **Handlers Need Updates**
- Update CreateSaleHandler to use CurrencyId lookup
- Update query handlers to include Currency/PaymentStatus navigation properties

### **Controllers May Need Updates**
- Consider keeping string-based API for backward compatibility
- Add lookup logic to convert currency codes to IDs

## **Recommended Approach**

### **Phase 1: Dual Support**
Keep both old and new fields temporarily:
- `Currency` (string) + `CurrencyId` (int)
- `Status` (enum) + `PaymentStatusId` (int)

### **Phase 2: Migration**
- Populate new foreign key fields
- Update all business logic
- Test thoroughly

### **Phase 3: Cleanup**
- Remove old string/enum fields
- Update all DTOs and APIs

## **API Compatibility**

### **Option 1: Maintain String API**
```json
{
  "currency": "USD",  // API still accepts string
  "paymentStatus": "PAID"  // Converted to ID internally
}
```

### **Option 2: Hybrid API**
```json
{
  "currencyId": 1,
  "currencyCode": "USD",  // For display
  "paymentStatusId": 3,
  "paymentStatusName": "Paid"  // For display
}
```

This approach provides the best of both worlds - data integrity with foreign keys while maintaining API usability.