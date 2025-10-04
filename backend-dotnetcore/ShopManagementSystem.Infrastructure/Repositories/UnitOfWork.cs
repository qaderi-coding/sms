using Microsoft.EntityFrameworkCore.Storage;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using ShopManagementSystem.Infrastructure.Data;

namespace ShopManagementSystem.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IDbContextTransaction? _transaction;
    
    private IRepository<Customer>? _customers;
    private IRepository<Supplier>? _suppliers;
    private IRepository<Product>? _products;
    private IRepository<ProductItem>? _productItems;
    private IRepository<Category>? _categories;
    private IRepository<Company>? _companies;
    private IRepository<BikeModel>? _bikeModels;
    private IRepository<Unit>? _units;
    private IRepository<ProductUnitConversion>? _productUnitConversions;
    private IRepository<Sale>? _sales;
    private IRepository<SaleItem>? _saleItems;
    private IRepository<Purchase>? _purchases;
    private IRepository<PurchaseItem>? _purchaseItems;
    private IRepository<Transaction>? _transactions;
    private IRepository<Expense>? _expenses;
    private IRepository<Loan>? _loans;
    private IRepository<Payment>? _payments;
    private IRepository<Currency>? _currencies;
    private IRepository<StockMovement>? _stockMovements;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IRepository<Customer> Customers => 
        _customers ??= new Repository<Customer>(_context);

    public IRepository<Supplier> Suppliers => 
        _suppliers ??= new Repository<Supplier>(_context);

    public IRepository<Product> Products => 
        _products ??= new Repository<Product>(_context);

    public IRepository<ProductItem> ProductItems => 
        _productItems ??= new Repository<ProductItem>(_context);

    public IRepository<Category> Categories => 
        _categories ??= new Repository<Category>(_context);

    public IRepository<Company> Companies => 
        _companies ??= new Repository<Company>(_context);

    public IRepository<BikeModel> BikeModels => 
        _bikeModels ??= new Repository<BikeModel>(_context);

    public IRepository<Unit> Units => 
        _units ??= new Repository<Unit>(_context);

    public IRepository<ProductUnitConversion> ProductUnitConversions => 
        _productUnitConversions ??= new Repository<ProductUnitConversion>(_context);

    public IRepository<Sale> Sales => 
        _sales ??= new Repository<Sale>(_context);

    public IRepository<SaleItem> SaleItems => 
        _saleItems ??= new Repository<SaleItem>(_context);

    public IRepository<Purchase> Purchases => 
        _purchases ??= new Repository<Purchase>(_context);

    public IRepository<PurchaseItem> PurchaseItems => 
        _purchaseItems ??= new Repository<PurchaseItem>(_context);

    public IRepository<Transaction> Transactions => 
        _transactions ??= new Repository<Transaction>(_context);

    public IRepository<Expense> Expenses => 
        _expenses ??= new Repository<Expense>(_context);

    public IRepository<Loan> Loans => 
        _loans ??= new Repository<Loan>(_context);

    public IRepository<Payment> Payments => 
        _payments ??= new Repository<Payment>(_context);

    public IRepository<Currency> Currencies => 
        _currencies ??= new Repository<Currency>(_context);

    public IRepository<StockMovement> StockMovements => 
        _stockMovements ??= new Repository<StockMovement>(_context);

    public async Task<int> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync();
    }

    public async Task BeginTransactionAsync()
    {
        _transaction = await _context.Database.BeginTransactionAsync();
    }

    public async Task CommitTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.CommitAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public async Task RollbackTransactionAsync()
    {
        if (_transaction != null)
        {
            await _transaction.RollbackAsync();
            await _transaction.DisposeAsync();
            _transaction = null;
        }
    }

    public void Dispose()
    {
        _transaction?.Dispose();
        _context.Dispose();
    }
}