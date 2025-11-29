using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ShopManagementSystem.Domain.Entities;

namespace ShopManagementSystem.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Customer> Customers { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<BikeModel> BikeModels { get; set; }
    public DbSet<Unit> Units { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductItem> ProductItems { get; set; }
    public DbSet<ProductUnitConversion> ProductUnitConversions { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<SaleItem> SaleItems { get; set; }
    public DbSet<SalesReturn> SalesReturns { get; set; }
    public DbSet<SaleReturnItem> SaleReturnItems { get; set; }
    public DbSet<Purchase> Purchases { get; set; }
    public DbSet<PurchaseItem> PurchaseItems { get; set; }
    public DbSet<PurchaseReturn> PurchaseReturns { get; set; }
    public DbSet<PurchaseReturnItem> PurchaseReturnItems { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<ExpenseType> ExpenseTypes { get; set; }
    public DbSet<Loan> Loans { get; set; }
    public DbSet<LoanTransaction> LoanTransactions { get; set; }
    public DbSet<Capital> Capitals { get; set; }
    public DbSet<CashBook> CashBooks { get; set; }
    public DbSet<CustomerTransaction> CustomerTransactions { get; set; }
    public DbSet<SupplierTransaction> SupplierTransactions { get; set; }
    public DbSet<Currency> Currencies { get; set; }
    public DbSet<CurrencyExchangeRate> CurrencyExchangeRates { get; set; }
    public DbSet<PaymentStatus> PaymentStatuses { get; set; }
    public DbSet<StockMovement> StockMovements { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure all decimal properties for SQLite
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(decimal) || property.ClrType == typeof(decimal?))
                {
                    property.SetColumnType("TEXT");
                }
            }
        }

        // Customer configuration
        modelBuilder.Entity<Customer>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Address).HasMaxLength(500);
        });

        // Supplier configuration
        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Address).HasMaxLength(500);
        });

        // Item configuration
        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Unit).IsRequired().HasMaxLength(20);
        });

        // Category configuration
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        // Company configuration
        modelBuilder.Entity<Company>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Country).HasMaxLength(100);
        });

        // BikeModel configuration
        modelBuilder.Entity<BikeModel>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            
            entity.HasOne(e => e.Company)
                  .WithMany(c => c.BikeModels)
                  .HasForeignKey(e => e.CompanyId);
        });

        // Unit configuration
        modelBuilder.Entity<Unit>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Symbol).HasMaxLength(10);
        });

        // Currency configuration
        modelBuilder.Entity<Currency>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(3);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Symbol).HasMaxLength(5);
            entity.HasIndex(e => e.Code).IsUnique();
        });

        // CurrencyExchangeRate configuration
        modelBuilder.Entity<CurrencyExchangeRate>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Source).HasMaxLength(50);
            
            entity.HasOne(e => e.Currency)
                  .WithMany(c => c.ExchangeRates)
                  .HasForeignKey(e => e.CurrencyId)
                  .OnDelete(DeleteBehavior.Restrict);
                  
            entity.HasIndex(e => new { e.CurrencyId, e.Date });
            entity.HasIndex(e => new { e.CurrencyId, e.EffectiveDate });
        });

        // PaymentStatus configuration
        modelBuilder.Entity<PaymentStatus>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Code).IsRequired().HasMaxLength(20);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.HasIndex(e => e.Code).IsUnique();
        });

        // Product configuration
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Sku).HasMaxLength(50);
            entity.Property(e => e.Description).HasMaxLength(500);
            
            entity.HasOne(e => e.Category)
                  .WithMany(c => c.Products)
                  .HasForeignKey(e => e.CategoryId);
                  
            entity.HasOne(e => e.Company)
                  .WithMany(c => c.Products)
                  .HasForeignKey(e => e.CompanyId);
                  
            entity.HasOne(e => e.BikeModel)
                  .WithMany(bm => bm.Products)
                  .HasForeignKey(e => e.BikeModelId);
                  
            entity.HasOne(e => e.BaseUnit)
                  .WithMany(u => u.Products)
                  .HasForeignKey(e => e.BaseUnitId);
        });



        // Sale configuration
        modelBuilder.Entity<Sale>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            
            entity.HasOne(e => e.Customer)
                  .WithMany(c => c.Sales)
                  .HasForeignKey(e => e.CustomerId)
                  .IsRequired(false);
        });

        // SaleItem configuration
        modelBuilder.Entity<SaleItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Sale)
                  .WithMany(s => s.Items)
                  .HasForeignKey(e => e.SaleId);
                  
            entity.HasOne(e => e.Item)
                  .WithMany(i => i.SaleItems)
                  .HasForeignKey(e => e.ItemId);
        });

        // SalesReturn configuration
        modelBuilder.Entity<SalesReturn>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            
            entity.HasOne(e => e.Customer)
                  .WithMany(c => c.SalesReturns)
                  .HasForeignKey(e => e.CustomerId);
        });

        // SaleReturnItem configuration
        modelBuilder.Entity<SaleReturnItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.SalesReturn)
                  .WithMany(sr => sr.Items)
                  .HasForeignKey(e => e.SaleReturnId);
                  
            entity.HasOne(e => e.Item)
                  .WithMany(i => i.SaleReturnItems)
                  .HasForeignKey(e => e.ItemId);
        });

        // Purchase configuration
        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            
            entity.HasOne(e => e.Supplier)
                  .WithMany(s => s.Purchases)
                  .HasForeignKey(e => e.SupplierId);
                  
            entity.HasOne(e => e.Currency)
                  .WithMany(c => c.Purchases)
                  .HasForeignKey(e => e.CurrencyId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // PurchaseItem configuration
        modelBuilder.Entity<PurchaseItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Purchase)
                  .WithMany(p => p.Items)
                  .HasForeignKey(e => e.PurchaseId);
                  
            entity.HasOne(e => e.Item)
                  .WithMany(i => i.PurchaseItems)
                  .HasForeignKey(e => e.ItemId);
        });

        // PurchaseReturn configuration
        modelBuilder.Entity<PurchaseReturn>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            
            entity.HasOne(e => e.Supplier)
                  .WithMany(s => s.PurchaseReturns)
                  .HasForeignKey(e => e.SupplierId);
        });

        // PurchaseReturnItem configuration
        modelBuilder.Entity<PurchaseReturnItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.PurchaseReturn)
                  .WithMany(pr => pr.Items)
                  .HasForeignKey(e => e.PurchaseReturnId);
                  
            entity.HasOne(e => e.Item)
                  .WithMany(i => i.PurchaseReturnItems)
                  .HasForeignKey(e => e.ItemId);
        });

        // ExpenseType configuration
        modelBuilder.Entity<ExpenseType>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        // Expense configuration
        modelBuilder.Entity<Expense>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500);
            
            entity.HasOne(e => e.ExpenseType)
                  .WithMany(et => et.Expenses)
                  .HasForeignKey(e => e.ExpenseTypeId);
                  
            entity.HasOne(e => e.Currency)
                  .WithMany(c => c.Expenses)
                  .HasForeignKey(e => e.CurrencyId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // Loan configuration
        modelBuilder.Entity<Loan>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
        });

        // LoanTransaction configuration
        modelBuilder.Entity<LoanTransaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500);
            
            entity.HasOne(e => e.Loan)
                  .WithMany(l => l.LoanTransactions)
                  .HasForeignKey(e => e.LoanId);
        });

        // Capital configuration
        modelBuilder.Entity<Capital>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500);
        });

        // CashBook configuration
        modelBuilder.Entity<CashBook>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500);
            entity.Property(e => e.ModuleType)
                  .HasConversion<int>();
            
            entity.HasOne(e => e.Currency)
                  .WithMany(c => c.CashBooks)
                  .HasForeignKey(e => e.CurrencyId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // CustomerTransaction configuration
        modelBuilder.Entity<CustomerTransaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500);
            
            entity.HasOne(e => e.Customer)
                  .WithMany(c => c.CustomerTransactions)
                  .HasForeignKey(e => e.CustomerId);
        });

        // SupplierTransaction configuration
        modelBuilder.Entity<SupplierTransaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500);
            
            entity.HasOne(e => e.Supplier)
                  .WithMany(s => s.SupplierTransactions)
                  .HasForeignKey(e => e.SupplierId);
        });

        // Payment configuration
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Description).HasMaxLength(500);
            
            entity.HasOne(e => e.Currency)
                  .WithMany(c => c.Payments)
                  .HasForeignKey(e => e.CurrencyId);
        });
    }
}