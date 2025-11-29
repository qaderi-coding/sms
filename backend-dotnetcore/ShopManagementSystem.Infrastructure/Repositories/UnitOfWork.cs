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
    private IRepository<Item>? _items;
    private IRepository<Product>? _products;
    private IRepository<ProductItem>? _productItems;
    private IRepository<Category>? _categories;
    private IRepository<Company>? _companies;
    private IRepository<BikeModel>? _bikeModels;
    private IRepository<Unit>? _units;
    private IRepository<ProductUnitConversion>? _productUnitConversions;
    private IRepository<Sale>? _sales;
    private IRepository<SaleItem>? _saleItems;
    private IRepository<SalesReturn>? _salesReturns;
    private IRepository<SaleReturnItem>? _saleReturnItems;
    private IRepository<Purchase>? _purchases;
    private IRepository<PurchaseItem>? _purchaseItems;
    private IRepository<PurchaseReturn>? _purchaseReturns;
    private IRepository<PurchaseReturnItem>? _purchaseReturnItems;
    private IRepository<Expense>? _expenses;
    private IRepository<ExpenseType>? _expenseTypes;
    private IRepository<Loan>? _loans;
    private IRepository<LoanTransaction>? _loanTransactions;
    private IRepository<Capital>? _capitals;
    private IRepository<CashBook>? _cashBooks;
    private IRepository<CustomerTransaction>? _customerTransactions;
    private IRepository<SupplierTransaction>? _supplierTransactions;
    private IRepository<Currency>? _currencies;
    private ICurrencyExchangeRateRepository? _currencyExchangeRates;
    private IRepository<Payment>? _payments;
    private IRepository<PaymentStatus>? _paymentStatuses;
    private IRepository<StockMovement>? _stockMovements;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IRepository<Customer> Customers => 
        _customers ??= new Repository<Customer>(_context);

    public IRepository<Supplier> Suppliers => 
        _suppliers ??= new Repository<Supplier>(_context);

    public IRepository<Item> Items => 
        _items ??= new Repository<Item>(_context);

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

    public IRepository<SalesReturn> SalesReturns => 
        _salesReturns ??= new Repository<SalesReturn>(_context);

    public IRepository<SaleReturnItem> SaleReturnItems => 
        _saleReturnItems ??= new Repository<SaleReturnItem>(_context);

    public IRepository<Purchase> Purchases => 
        _purchases ??= new Repository<Purchase>(_context);

    public IRepository<PurchaseItem> PurchaseItems => 
        _purchaseItems ??= new Repository<PurchaseItem>(_context);

    public IRepository<PurchaseReturn> PurchaseReturns => 
        _purchaseReturns ??= new Repository<PurchaseReturn>(_context);

    public IRepository<PurchaseReturnItem> PurchaseReturnItems => 
        _purchaseReturnItems ??= new Repository<PurchaseReturnItem>(_context);

    public IRepository<Expense> Expenses => 
        _expenses ??= new Repository<Expense>(_context);

    public IRepository<ExpenseType> ExpenseTypes => 
        _expenseTypes ??= new Repository<ExpenseType>(_context);

    public IRepository<Loan> Loans => 
        _loans ??= new Repository<Loan>(_context);

    public IRepository<LoanTransaction> LoanTransactions => 
        _loanTransactions ??= new Repository<LoanTransaction>(_context);

    public IRepository<Capital> Capitals => 
        _capitals ??= new Repository<Capital>(_context);

    public IRepository<CashBook> CashBooks => 
        _cashBooks ??= new Repository<CashBook>(_context);

    public IRepository<CustomerTransaction> CustomerTransactions => 
        _customerTransactions ??= new Repository<CustomerTransaction>(_context);

    public IRepository<SupplierTransaction> SupplierTransactions => 
        _supplierTransactions ??= new Repository<SupplierTransaction>(_context);

    public IRepository<Currency> Currencies => 
        _currencies ??= new Repository<Currency>(_context);

    public ICurrencyExchangeRateRepository CurrencyExchangeRates => 
        _currencyExchangeRates ??= new CurrencyExchangeRateRepository(_context);

    public IRepository<Payment> Payments => 
        _payments ??= new Repository<Payment>(_context);

    public IRepository<PaymentStatus> PaymentStatuses => 
        _paymentStatuses ??= new Repository<PaymentStatus>(_context);

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