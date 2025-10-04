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