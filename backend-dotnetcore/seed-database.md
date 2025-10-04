# Database Setup and Seeding Instructions

## Prerequisites
1. Make sure you have .NET 8 SDK installed
2. Navigate to the API project directory

## Steps to Setup and Seed Database

### 1. Restore NuGet Packages
```bash
cd ShopManagementSystem.API
dotnet restore
```

### 2. Create Database Migration (if needed)
```bash
dotnet ef migrations add InitialCreate --project ../ShopManagementSystem.Infrastructure
```

### 3. Update Database
```bash
dotnet ef database update --project ../ShopManagementSystem.Infrastructure
```

### 4. Run the Application
```bash
dotnet run
```

The database will be automatically seeded when the application starts.

### 5. Manual Seeding (Alternative)
If automatic seeding doesn't work, you can use the seed endpoints:

- **Seed all data**: `POST /api/seed/all`
- **Reset and seed**: `POST /api/seed/reset`

### 6. Test the Setup
After seeding, you should have:
- **Admin User**: admin@shop.com / Admin123!
- **4 Currencies**: USD, EUR, PKR, INR
- **6 Units**: Piece, Kilogram, Liter, Meter, Box, Dozen
- **5 Categories**: Bike Parts, Accessories, Tools, Lubricants, Tires
- **6 Companies**: Honda, Yamaha, Suzuki, Kawasaki, Hero, Bajaj
- **5 Bike Models**: CB150F, CG125, YBR125, YB125Z, GS150
- **5 Customers**: Sample customer data
- **4 Suppliers**: Sample supplier data
- **5 Products**: Engine Oil, Brake Pads, Air Filter, Spark Plug, Chain Set

### 7. Database Location
The SQLite database file will be created as `ShopManagementSystem.db` in the API project root directory.

## Troubleshooting

### If you get database errors:
1. Delete the existing database file: `ShopManagementSystem.db`
2. Delete migrations folder: `ShopManagementSystem.Infrastructure/Migrations`
3. Recreate migration: `dotnet ef migrations add InitialCreate --project ../ShopManagementSystem.Infrastructure`
4. Update database: `dotnet ef database update --project ../ShopManagementSystem.Infrastructure`
5. Run the application: `dotnet run`

### If seeding fails:
Use the manual seeding endpoint: `POST /api/seed/reset`

## API Testing
Once seeded, you can test the APIs:
- Login: `POST /api/auth/login` with admin@shop.com / Admin123!
- Get Companies: `GET /api/inventory/companies`
- Get Products: `GET /api/inventory/products`
- Get Customers: `GET /api/parties/customers`