namespace ShopManagementSystem.Domain.Enums;

public enum TransactionType
{
    Sale,
    Purchase,
    Expense,
    LoanGiven,
    LoanReceived,
    LoanRepaymentMade,
    LoanRepaymentReceived,
    PaymentReceived,
    PaymentMade,
    Withdrawal,
    ReturnSale,
    ReturnPurchase
}

public enum PartyType
{
    Customer,
    Supplier,
    Owner,
    None
}

public enum ExpenseCategory
{
    Transport,
    Commission,
    Rent,
    Salary,
    Miscellaneous
}

public enum PaymentMethod
{
    Cash,
    Bank,
    Transfer
}

public enum LoanStatus
{
    Active,
    Closed
}

public enum StockMovementType
{
    Sale,
    Purchase,
    ReturnSale,
    ReturnPurchase
}

public enum ModuleType
{
    Sale = 1,
    SaleReturn = 2,
    Purchase = 3,
    PurchaseReturn = 4,
    Expense = 5,
    LoanIn = 6,
    LoanOut = 7,
    CapitalIn = 8,
    CapitalOut = 9,
    CustomerPayment = 10,
    SupplierPayment = 11,
    Other = 12
}