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
    public DbSet<Category> Categories { get; set; }
    public DbSet<Company> Companies { get; set; }
    public DbSet<BikeModel> BikeModels { get; set; }
    public DbSet<Unit> Units { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductItem> ProductItems { get; set; }
    public DbSet<ProductUnitConversion> ProductUnitConversions { get; set; }
    public DbSet<Sale> Sales { get; set; }
    public DbSet<SaleItem> SaleItems { get; set; }
    public DbSet<Purchase> Purchases { get; set; }
    public DbSet<PurchaseItem> PurchaseItems { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Loan> Loans { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Currency> Currencies { get; set; }
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
            entity.Property(e => e.Email).HasMaxLength(100);
        });

        // Supplier configuration
        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.Address).HasMaxLength(500);
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

        // Transaction configuration
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Currency).HasMaxLength(3);
            entity.Property(e => e.Notes).HasMaxLength(1000);
        });

        // Sale configuration
        modelBuilder.Entity<Sale>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Currency).HasMaxLength(3);
            entity.Property(e => e.Notes).HasMaxLength(1000);
            
            entity.HasOne(e => e.Customer)
                  .WithMany(c => c.Sales)
                  .HasForeignKey(e => e.CustomerId);
                  
            entity.HasOne(e => e.Transaction)
                  .WithMany(t => t.Sales)
                  .HasForeignKey(e => e.TransactionId);
        });

        // SaleItem configuration
        modelBuilder.Entity<SaleItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.HasOne(e => e.Sale)
                  .WithMany(s => s.Items)
                  .HasForeignKey(e => e.SaleId);
                  
            entity.HasOne(e => e.Product)
                  .WithMany(p => p.SaleItems)
                  .HasForeignKey(e => e.ProductId);
        });

        // Purchase configuration
        modelBuilder.Entity<Purchase>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Currency).HasMaxLength(3);
            
            entity.HasOne(e => e.Supplier)
                  .WithMany(s => s.Purchases)
                  .HasForeignKey(e => e.SupplierId);
                  
            entity.HasOne(e => e.Transaction)
                  .WithMany(t => t.Purchases)
                  .HasForeignKey(e => e.TransactionId);
        });

        // PurchaseItem configuration
        modelBuilder.Entity<PurchaseItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Currency).HasMaxLength(3);
            
            entity.HasOne(e => e.Purchase)
                  .WithMany(p => p.Items)
                  .HasForeignKey(e => e.PurchaseId);
                  
            entity.HasOne(e => e.Product)
                  .WithMany(p => p.PurchaseItems)
                  .HasForeignKey(e => e.ProductId);
        });
    }
}