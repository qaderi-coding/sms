using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Enums;

namespace ShopManagementSystem.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Seed Roles
        await SeedRoles(roleManager);

        // Seed Users
        await SeedUsers(userManager);

        // Seed Master Data
        await SeedCurrencies(context);
        await SeedPaymentStatuses(context);
        await SeedUnits(context);
        await SeedCategories(context);
        await SeedCompanies(context);
        await SeedBikeModels(context);
        await SeedCustomers(context);
        await SeedSuppliers(context);
        await SeedProducts(context);
        await SeedItems(context);

        await context.SaveChangesAsync();
    }

    private static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
    {
        var roles = new[] { "Admin", "Manager", "User" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private static async Task SeedUsers(UserManager<IdentityUser> userManager)
    {
        if (await userManager.FindByEmailAsync("admin@shop.com") == null)
        {
            var adminUser = new IdentityUser
            {
                UserName = "admin@shop.com",
                Email = "admin@shop.com",
                EmailConfirmed = true
            };
            var result = await userManager.CreateAsync(adminUser, "Admin123!");
            if (result.Succeeded)
            {
                await userManager.AddClaimAsync(adminUser, new System.Security.Claims.Claim("FirstName", "Admin"));
                await userManager.AddClaimAsync(adminUser, new System.Security.Claims.Claim("LastName", "User"));
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }

    private static async Task SeedCurrencies(ApplicationDbContext context)
    {
        if (!await context.Currencies.AnyAsync())
        {
            var currencies = new[]
            {
                new Currency { Code = "AFN", Name = "Afghan Afghani", Symbol = "؋", IsActive = true, IsBaseCurrency = true, CurrentExchangeRate = 1.0m },
                new Currency { Code = "USD", Name = "US Dollar", Symbol = "$", IsActive = true, CurrentExchangeRate = 71.4m },
                new Currency { Code = "IRR", Name = "Iranian Rial", Symbol = "﷼", IsActive = true, CurrentExchangeRate = 0.0017m },
                new Currency { Code = "CNY", Name = "Chinese Yuan", Symbol = "¥", IsActive = true, CurrentExchangeRate = 10.0m },
                new Currency { Code = "PKR", Name = "Pakistani Rupee", Symbol = "₨", IsActive = true, CurrentExchangeRate = 0.26m }
            };
            await context.Currencies.AddRangeAsync(currencies);
        }
    }

    private static async Task SeedPaymentStatuses(ApplicationDbContext context)
    {
        if (!await context.PaymentStatuses.AnyAsync())
        {
            var paymentStatuses = new[]
            {
                new Domain.Entities.PaymentStatus { Code = "PENDING", Name = "Pending", Description = "Payment is pending", IsActive = true, SortOrder = 1 },
                new Domain.Entities.PaymentStatus { Code = "PARTIAL", Name = "Partial", Description = "Payment is partially completed", IsActive = true, SortOrder = 2 },
                new Domain.Entities.PaymentStatus { Code = "PAID", Name = "Paid", Description = "Payment is fully completed", IsActive = true, SortOrder = 3 },
                new Domain.Entities.PaymentStatus { Code = "CANCELLED", Name = "Cancelled", Description = "Payment was cancelled", IsActive = true, SortOrder = 4 },
                new Domain.Entities.PaymentStatus { Code = "REFUNDED", Name = "Refunded", Description = "Payment was refunded", IsActive = true, SortOrder = 5 }
            };
            await context.PaymentStatuses.AddRangeAsync(paymentStatuses);
        }
    }

    private static async Task SeedUnits(ApplicationDbContext context)
    {
        if (!await context.Units.AnyAsync())
        {
            var units = new[]
            {
                new Unit { Name = "Piece", Symbol = "pcs" },
                new Unit { Name = "Kilogram", Symbol = "kg" },
                new Unit { Name = "Liter", Symbol = "L" },
                new Unit { Name = "Meter", Symbol = "m" },
                new Unit { Name = "Box", Symbol = "box" },
                new Unit { Name = "Dozen", Symbol = "dz" }
            };
            await context.Units.AddRangeAsync(units);
        }
    }

    private static async Task SeedCategories(ApplicationDbContext context)
    {
        if (!await context.Categories.AnyAsync())
        {
            var categories = new[]
            {
                new Category { Name = "Bike Parts", Description = "Motorcycle and bicycle parts" },
                new Category { Name = "Accessories", Description = "Bike accessories and gear" },
                new Category { Name = "Tools", Description = "Repair and maintenance tools" },
                new Category { Name = "Lubricants", Description = "Oils and lubricants" },
                new Category { Name = "Tires", Description = "Bike tires and tubes" }
            };
            await context.Categories.AddRangeAsync(categories);
        }
    }

    private static async Task SeedCompanies(ApplicationDbContext context)
    {
        if (!await context.Companies.AnyAsync())
        {
            var companies = new[]
            {
                new Company { Name = "Honda", Country = "Japan" },
                new Company { Name = "Yamaha", Country = "Japan" },
                new Company { Name = "Suzuki", Country = "Japan" },
                new Company { Name = "Kawasaki", Country = "Japan" },
                new Company { Name = "Hero", Country = "India" },
                new Company { Name = "Bajaj", Country = "India" }
            };
            await context.Companies.AddRangeAsync(companies);
        }
    }

    private static async Task SeedBikeModels(ApplicationDbContext context)
    {
        if (!await context.BikeModels.AnyAsync())
        {
            await context.SaveChangesAsync(); // Save companies first to get IDs

            var honda = await context.Companies.FirstAsync(c => c.Name == "Honda");
            var yamaha = await context.Companies.FirstAsync(c => c.Name == "Yamaha");
            var suzuki = await context.Companies.FirstAsync(c => c.Name == "Suzuki");

            var bikeModels = new[]
            {
                new BikeModel { CompanyId = honda.Id, Name = "CB150F", Description = "Honda CB150F motorcycle" },
                new BikeModel { CompanyId = honda.Id, Name = "CG125", Description = "Honda CG125 motorcycle" },
                new BikeModel { CompanyId = yamaha.Id, Name = "YBR125", Description = "Yamaha YBR125 motorcycle" },
                new BikeModel { CompanyId = yamaha.Id, Name = "YB125Z", Description = "Yamaha YB125Z motorcycle" },
                new BikeModel { CompanyId = suzuki.Id, Name = "GS150", Description = "Suzuki GS150 motorcycle" }
            };
            await context.BikeModels.AddRangeAsync(bikeModels);
        }
    }

    private static async Task SeedCustomers(ApplicationDbContext context)
    {
        if (!await context.Customers.AnyAsync())
        {
            var customers = new[]
            {
                new Customer { Name = "Ahmed Ali", Phone = "+92-300-1234567", Address = "123 Main St, Karachi", OpeningBalance = 0 },
                new Customer { Name = "Sara Khan", Phone = "+92-301-2345678", Address = "456 Park Ave, Lahore", OpeningBalance = 1500 },
                new Customer { Name = "Muhammad Hassan", Phone = "+92-302-3456789", Address = "789 Garden Rd, Islamabad", OpeningBalance = 0 },
                new Customer { Name = "Fatima Sheikh", Phone = "+92-303-4567890", Address = "321 Mall Rd, Faisalabad", OpeningBalance = 2000 },
                new Customer { Name = "Ali Raza", Phone = "+92-304-5678901", Address = "654 Canal Rd, Multan", OpeningBalance = 0 }
            };
            await context.Customers.AddRangeAsync(customers);
        }
    }

    private static async Task SeedSuppliers(ApplicationDbContext context)
    {
        if (!await context.Suppliers.AnyAsync())
        {
            var suppliers = new[]
            {
                new Supplier { Name = "Bike Parts Wholesale", Phone = "+92-21-1234567", Address = "Industrial Area, Karachi", OpeningBalance = 0 },
                new Supplier { Name = "Motor Accessories Ltd", Phone = "+92-42-2345678", Address = "Shalimar Link Rd, Lahore", OpeningBalance = 5000 },
                new Supplier { Name = "Parts Express", Phone = "+92-51-3456789", Address = "Blue Area, Islamabad", OpeningBalance = 0 }
            };
            await context.Suppliers.AddRangeAsync(suppliers);
        }
    }

    private static async Task SeedItems(ApplicationDbContext context)
    {
        if (!await context.Items.AnyAsync())
        {
            var items = new[]
            {
                new Item { Name = "Engine Oil 10W-40", Unit = "Liter", OpeningQty = 50, OpeningCost = 800 },
                new Item { Name = "Brake Pads", Unit = "Set", OpeningQty = 25, OpeningCost = 1200 },
                new Item { Name = "Air Filter", Unit = "Piece", OpeningQty = 30, OpeningCost = 600 },
                new Item { Name = "Spark Plug", Unit = "Piece", OpeningQty = 100, OpeningCost = 300 },
                new Item { Name = "Chain Lubricant", Unit = "Bottle", OpeningQty = 20, OpeningCost = 450 }
            };
            await context.Items.AddRangeAsync(items);
        }
    }

    private static async Task SeedProducts(ApplicationDbContext context)
    {
        if (!await context.Products.AnyAsync())
        {
            await context.SaveChangesAsync(); // Save dependencies first

            var category = await context.Categories.FirstAsync();
            var unit = await context.Units.FirstAsync();
            var company = await context.Companies.FirstAsync();
            var bikeModel = await context.BikeModels.FirstAsync();

            var products = new[]
            {
                new Product 
                { 
                    Name = "Engine Oil 10W-40", 
                    Sku = "EO-10W40-1L", 
                    Price = 850.00m, 
                    StockQuantity = 50, 
                    Description = "High quality engine oil for motorcycles",
                    CategoryId = category.Id,
                    CompanyId = company.Id,
                    BikeModelId = bikeModel.Id,
                    BaseUnitId = unit.Id
                },
                new Product 
                { 
                    Name = "Brake Pads", 
                    Sku = "BP-FRONT-001", 
                    Price = 1200.00m, 
                    StockQuantity = 25, 
                    Description = "Front brake pads for motorcycles",
                    CategoryId = category.Id,
                    CompanyId = company.Id,
                    BikeModelId = bikeModel.Id,
                    BaseUnitId = unit.Id
                },
                new Product 
                { 
                    Name = "Air Filter", 
                    Sku = "AF-125CC-001", 
                    Price = 450.00m, 
                    StockQuantity = 30, 
                    Description = "Air filter for 125cc motorcycles",
                    CategoryId = category.Id,
                    CompanyId = company.Id,
                    BikeModelId = bikeModel.Id,
                    BaseUnitId = unit.Id
                },
                new Product 
                { 
                    Name = "Spark Plug", 
                    Sku = "SP-NGK-001", 
                    Price = 350.00m, 
                    StockQuantity = 100, 
                    Description = "NGK spark plug for motorcycles",
                    CategoryId = category.Id,
                    CompanyId = company.Id,
                    BikeModelId = bikeModel.Id,
                    BaseUnitId = unit.Id
                },
                new Product 
                { 
                    Name = "Chain Set", 
                    Sku = "CS-428H-001", 
                    Price = 2500.00m, 
                    StockQuantity = 15, 
                    Description = "428H chain set for motorcycles",
                    CategoryId = category.Id,
                    CompanyId = company.Id,
                    BikeModelId = bikeModel.Id,
                    BaseUnitId = unit.Id
                }
            };
            await context.Products.AddRangeAsync(products);
        }
    }
}