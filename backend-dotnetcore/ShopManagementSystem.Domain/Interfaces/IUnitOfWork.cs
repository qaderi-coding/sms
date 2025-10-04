using ShopManagementSystem.Domain.Entities;

namespace ShopManagementSystem.Domain.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Customer> Customers { get; }
    IRepository<Supplier> Suppliers { get; }
    IRepository<Product> Products { get; }
    IRepository<ProductItem> ProductItems { get; }
    IRepository<Category> Categories { get; }
    IRepository<Company> Companies { get; }
    IRepository<BikeModel> BikeModels { get; }
    IRepository<Unit> Units { get; }
    IRepository<ProductUnitConversion> ProductUnitConversions { get; }
    IRepository<Sale> Sales { get; }
    IRepository<SaleItem> SaleItems { get; }
    IRepository<Purchase> Purchases { get; }
    IRepository<PurchaseItem> PurchaseItems { get; }
    IRepository<Transaction> Transactions { get; }
    IRepository<Expense> Expenses { get; }
    IRepository<Loan> Loans { get; }
    IRepository<Payment> Payments { get; }
    IRepository<Currency> Currencies { get; }
    IRepository<StockMovement> StockMovements { get; }
    
    Task<int> SaveChangesAsync();
    Task BeginTransactionAsync();
    Task CommitTransactionAsync();
    Task RollbackTransactionAsync();
}