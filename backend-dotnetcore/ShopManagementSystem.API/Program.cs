using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using ShopManagementSystem.Application.Handlers;
using ShopManagementSystem.Application.Services;
using ShopManagementSystem.Domain.Interfaces;
using ShopManagementSystem.Infrastructure.Data;
using ShopManagementSystem.Infrastructure.Repositories;
using ShopManagementSystem.Infrastructure.Services;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Shop Management System API",
        Version = "v1",
        Description = "A comprehensive API for managing shop operations including sales, inventory, and customer management.",
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = "Shop Management Team",
            Email = "support@shopmanagement.com"
        }
    });
    
    // Add JWT Authentication to Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
    
    c.EnableAnnotations();
    c.DescribeAllParametersInCamelCase();
});

// Add Entity Framework with SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Identity
builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Add JWT Authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };
});

// Add Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.AddPolicy("ManagerOrAdmin", policy => policy.RequireRole("Manager", "Admin"));
});

// Add MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(CreateSaleHandler).Assembly));

// Add Repository Pattern and Unit of Work
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Add Services
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<ICurrencyExchangeService, CurrencyExchangeService>();
builder.Services.AddScoped<IFinancialService, FinancialService>();
builder.Services.AddScoped<IMultiCurrencyService, MultiCurrencyService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Ensure database schema is up to date
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Ensure database is created
    await context.Database.EnsureCreatedAsync();
    Console.WriteLine("Database created/ensured");
    
    await EnsureCurrencyColumnsExist(context);
}

static async Task EnsureCurrencyColumnsExist(ApplicationDbContext context)
{
    // Recreate CurrencyExchangeRates table with correct schema
    try
    {
        await context.Database.ExecuteSqlRawAsync("DROP TABLE IF EXISTS CurrencyExchangeRates");
        await context.Database.ExecuteSqlRawAsync(@"
            CREATE TABLE CurrencyExchangeRates (
                Id INTEGER PRIMARY KEY AUTOINCREMENT,
                CurrencyId INTEGER NOT NULL,
                RateToAfghani TEXT NOT NULL,
                Date TEXT NOT NULL,
                EffectiveDate TEXT,
                Source TEXT,
                IsActive INTEGER DEFAULT 1,
                CreatedAt TEXT DEFAULT (datetime('now')),
                UpdatedAt TEXT DEFAULT (datetime('now'))
            )");
        Console.WriteLine("Recreated CurrencyExchangeRates table with correct schema");
        
        // Seed dummy exchange rate data
        await context.Database.ExecuteSqlRawAsync(@"
            INSERT INTO CurrencyExchangeRates (CurrencyId, RateToAfghani, Date, EffectiveDate, Source, IsActive) VALUES
            (1, '1.0', '2024-01-01', '2024-01-01', 'System', 1),
            (2, '0.014', '2024-01-01', '2024-01-01', 'System', 1),
            (3, '0.012', '2024-01-01', '2024-01-01', 'System', 1)
        ");
        Console.WriteLine("Seeded exchange rate data");
        
        // Seed basic data if tables are empty
        await SeedBasicData(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed to recreate CurrencyExchangeRates table: {ex.Message}");
    }



    // Add missing columns to Currencies table
    var columnsToAdd = new Dictionary<string, string>
    {
        { "CurrentExchangeRate", "ALTER TABLE Currencies ADD COLUMN CurrentExchangeRate TEXT DEFAULT '1.0'" },
        { "LastUpdated", "ALTER TABLE Currencies ADD COLUMN LastUpdated TEXT DEFAULT '2024-01-01'" },
        { "IsBaseCurrency", "ALTER TABLE Currencies ADD COLUMN IsBaseCurrency INTEGER DEFAULT 0" },
        { "IsActive", "ALTER TABLE Currencies ADD COLUMN IsActive INTEGER DEFAULT 1" }
    };

    foreach (var column in columnsToAdd)
    {
        try
        {
            await context.Database.ExecuteSqlRawAsync($"SELECT {column.Key} FROM Currencies LIMIT 1");
        }
        catch
        {
            try
            {
                await context.Database.ExecuteSqlRawAsync(column.Value);
                Console.WriteLine($"Added column: {column.Key}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to add column {column.Key}: {ex.Message}");
            }
        }
    }

    // Add missing columns to PaymentStatuses table
    var paymentStatusColumns = new Dictionary<string, string>
    {
        { "Code", "ALTER TABLE PaymentStatuses ADD COLUMN Code TEXT DEFAULT ''" },
        { "Description", "ALTER TABLE PaymentStatuses ADD COLUMN Description TEXT DEFAULT ''" },
        { "IsActive", "ALTER TABLE PaymentStatuses ADD COLUMN IsActive INTEGER DEFAULT 1" },
        { "SortOrder", "ALTER TABLE PaymentStatuses ADD COLUMN SortOrder INTEGER DEFAULT 0" }
    };

    foreach (var column in paymentStatusColumns)
    {
        try
        {
            await context.Database.ExecuteSqlRawAsync($"SELECT {column.Key} FROM PaymentStatuses LIMIT 1");
        }
        catch
        {
            try
            {
                await context.Database.ExecuteSqlRawAsync(column.Value);
                Console.WriteLine($"Added PaymentStatuses column: {column.Key}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to add PaymentStatuses column {column.Key}: {ex.Message}");
            }
        }
    }

    // Add missing columns to Sales table
    var salesColumns = new Dictionary<string, string>
    {
        { "CurrencyId", "ALTER TABLE Sales ADD COLUMN CurrencyId INTEGER DEFAULT 1" },
        { "PaymentStatusId", "ALTER TABLE Sales ADD COLUMN PaymentStatusId INTEGER DEFAULT 1" },
        { "IsReturn", "ALTER TABLE Sales ADD COLUMN IsReturn INTEGER DEFAULT 0" }
    };

    // Update existing Sales records to have CurrencyId = 1 if NULL
    try
    {
        await context.Database.ExecuteSqlRawAsync("UPDATE Sales SET CurrencyId = 1 WHERE CurrencyId IS NULL");
        Console.WriteLine("Updated existing Sales records with default CurrencyId");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error updating Sales CurrencyId: {ex.Message}");
    }

    foreach (var column in salesColumns)
    {
        try
        {
            await context.Database.ExecuteSqlRawAsync($"SELECT {column.Key} FROM Sales LIMIT 1");
        }
        catch
        {
            try
            {
                await context.Database.ExecuteSqlRawAsync(column.Value);
                Console.WriteLine($"Added Sales column: {column.Key}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to add Sales column {column.Key}: {ex.Message}");
            }
        }
    }

    // Add missing columns to SaleItems table
    var saleItemColumns = new Dictionary<string, string>
    {
        { "CurrencyId", "ALTER TABLE SaleItems ADD COLUMN CurrencyId INTEGER DEFAULT 1" }
    };

    foreach (var column in saleItemColumns)
    {
        try
        {
            await context.Database.ExecuteSqlRawAsync($"SELECT {column.Key} FROM SaleItems LIMIT 1");
        }
        catch
        {
            try
            {
                await context.Database.ExecuteSqlRawAsync(column.Value);
                Console.WriteLine($"Added SaleItems column: {column.Key}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to add SaleItems column {column.Key}: {ex.Message}");
            }
        }
    }
}

static async Task SeedBasicData(ApplicationDbContext context)
{
    try
    {
        await context.Database.ExecuteSqlRawAsync(@"
            INSERT OR IGNORE INTO Currencies (Id, Code, Name, Symbol, IsBaseCurrency, IsActive, CurrentExchangeRate, LastUpdated, CreatedAt, UpdatedAt) VALUES
            (1, 'AFN', 'Afghan Afghani', '؋', 1, 1, '1.0', '2024-01-01', datetime('now'), datetime('now')),
            (2, 'USD', 'US Dollar', '$', 0, 1, '0.014', '2024-01-01', datetime('now'), datetime('now')),
            (3, 'EUR', 'Euro', '€', 0, 1, '0.012', '2024-01-01', datetime('now'), datetime('now'))
        ");
        
        await context.Database.ExecuteSqlRawAsync(@"
            INSERT OR IGNORE INTO PaymentStatuses (Id, Code, Name, Description, IsActive, SortOrder, CreatedAt, UpdatedAt) VALUES
            (1, 'PENDING', 'Pending', 'Payment is pending', 1, 1, datetime('now'), datetime('now')),
            (2, 'PAID', 'Paid', 'Payment completed', 1, 2, datetime('now'), datetime('now')),
            (3, 'CANCELLED', 'Cancelled', 'Payment cancelled', 1, 3, datetime('now'), datetime('now')),
            (4, 'PARTIAL', 'Partial', 'Partially paid', 1, 4, datetime('now'), datetime('now'))
        ");
        
        await context.Database.ExecuteSqlRawAsync(@"
            INSERT OR IGNORE INTO Customers (Id, Name, Phone, Address, OpeningBalance, CreatedAt, UpdatedAt) VALUES
            (1, 'Ahmed Ali', '123456789', 'Test Address 1', 0, datetime('now'), datetime('now')),
            (2, 'Sara Khan', '987654321', 'Test Address 2', 0, datetime('now'), datetime('now')),
            (3, 'Muhammad Hassan', '555666777', 'Test Address 3', 0, datetime('now'), datetime('now'))
        ");
        
        await context.Database.ExecuteSqlRawAsync(@"
            INSERT OR IGNORE INTO Products (Id, Name, Sku, Price, StockQuantity, Description, BaseUnitId, CreatedAt, UpdatedAt) VALUES
            (1, 'Engine Oil 10W-40', 'EO-10W40-1L', '850.00', 50, 'High quality engine oil', 1, datetime('now'), datetime('now')),
            (2, 'Brake Pads', 'BP-FRONT-001', '1200.00', 25, 'Front brake pads', 1, datetime('now'), datetime('now')),
            (3, 'Air Filter', 'AF-125CC-001', '450.00', 30, 'Air filter for 125cc', 1, datetime('now'), datetime('now'))
        ");
        
        await context.Database.ExecuteSqlRawAsync(@"
            INSERT OR IGNORE INTO Units (Id, Name, Symbol, CreatedAt, UpdatedAt) VALUES
            (1, 'Piece', 'pcs', datetime('now'), datetime('now'))
        ");
        
        Console.WriteLine("Seeded basic data (Currencies, PaymentStatuses, Customers, Products, Units)");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error seeding basic data: {ex.Message}");
    }

    // Add missing columns to Purchases table
    var purchaseColumns = new Dictionary<string, string>
    {
        { "CurrencyId", "ALTER TABLE Purchases ADD COLUMN CurrencyId INTEGER DEFAULT 1" },
        { "IsReturn", "ALTER TABLE Purchases ADD COLUMN IsReturn INTEGER DEFAULT 0" }
    };

    foreach (var column in purchaseColumns)
    {
        try
        {
            await context.Database.ExecuteSqlRawAsync($"SELECT {column.Key} FROM Purchases LIMIT 1");
        }
        catch
        {
            try
            {
                await context.Database.ExecuteSqlRawAsync(column.Value);
                Console.WriteLine($"Added Purchases column: {column.Key}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to add Purchases column {column.Key}: {ex.Message}");
            }
        }
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();