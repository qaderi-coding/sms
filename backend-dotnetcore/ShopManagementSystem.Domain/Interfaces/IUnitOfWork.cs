using ShopManagementSystem.Domain.Entities;

namespace ShopManagementSystem.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Customer> Customers { get; }
    IRepository<Supplier> Suppliers { get; }
    IRepository<Item> Items { get; }
    IRepository<Product> Products { get; }
    IRepository<ProductItem> ProductItems { get; }
    IRepository<Category> Categories { get; }
    IRepository<Company> Companies { get; }
    IRepository<BikeModel> BikeModels { get; }
    IRepository<Unit> Units { get; }
    IRepository<ProductUnitConversion> ProductUnitConversions { get; }
    IRepository<Sale> Sales { get; }
    IRepository<SaleItem> SaleItems { get; }
    IRepository<SalesReturn> SalesReturns { get; }
    IRepository<SaleReturnItem> SaleReturnItems { get; }
    IRepository<Purchase> Purchases { get; }
    IRepository<PurchaseItem> PurchaseItems { get; }
    IRepository<PurchaseReturn> PurchaseReturns { get; }
    IRepository<PurchaseReturnItem> PurchaseReturnItems { get; }
    IRepository<Expense> Expenses { get; }
    IRepository<ExpenseType> ExpenseTypes { get; }
    IRepository<Loan> Loans { get; }
    IRepository<LoanTransaction> LoanTransactions { get; }
    IRepository<Capital> Capitals { get; }
    IRepository<CashBook> CashBooks { get; }
    IRepository<CustomerTransaction> CustomerTransactions { get; }
    IRepository<SupplierTransaction> SupplierTransactions { get; }
    IRepository<Currency> Currencies { get; }
    ICurrencyExchangeRateRepository CurrencyExchangeRates { get; }
    IRepository<Payment> Payments { get; }
    IRepository<PaymentStatus> PaymentStatuses { get; }
    IRepository<StockMovement> StockMovements { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}