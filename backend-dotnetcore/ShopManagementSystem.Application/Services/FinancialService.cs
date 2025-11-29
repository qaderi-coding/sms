using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Enums;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Services;

public interface IFinancialService
{
    Task RecordCashTransactionAsync(DateTime date, ModuleType moduleType, int? moduleId, string description, int currencyId, decimal originalAmount, decimal exchangeRate, decimal cashIn, decimal cashOut);
    Task RecordCustomerTransactionAsync(int customerId, DateTime date, string description, int? invoiceId, int? paymentId, decimal creditAmount, decimal paymentAmount);
    Task RecordSupplierTransactionAsync(int supplierId, DateTime date, string description, int? purchaseId, int? paymentId, decimal creditAmount, decimal paymentAmount);
    Task RecordCustomerPaymentAsync(int customerId, DateTime date, decimal amount, int currencyId, decimal exchangeRate, string description);
    Task RecordSupplierPaymentAsync(int supplierId, DateTime date, decimal amount, int currencyId, decimal exchangeRate, string description);
    Task<decimal> GetCashBalanceAsync();
    Task<decimal> GetCustomerBalanceAsync(int customerId);
    Task<decimal> GetSupplierBalanceAsync(int supplierId);
}

public class FinancialService : IFinancialService
{
    private readonly IUnitOfWork _unitOfWork;

    public FinancialService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task RecordCashTransactionAsync(DateTime date, ModuleType moduleType, int? moduleId, string description, int currencyId, decimal originalAmount, decimal exchangeRate, decimal cashIn, decimal cashOut)
    {
        var currentBalance = await GetCashBalanceAsync();
        var newBalance = currentBalance + cashIn - cashOut;

        var cashEntry = new CashBook
        {
            Date = date,
            ModuleType = moduleType,
            ModuleId = moduleId,
            Description = description,
            CurrencyId = currencyId,
            OriginalAmount = originalAmount,
            ExchangeRate = exchangeRate,
            CashIn = cashIn,
            CashOut = cashOut,
            BalanceAfter = newBalance
        };

        await _unitOfWork.CashBooks.AddAsync(cashEntry);
    }

    public async Task RecordCustomerTransactionAsync(int customerId, DateTime date, string description, int? invoiceId, int? paymentId, decimal creditAmount, decimal paymentAmount)
    {
        var currentBalance = await GetCustomerBalanceAsync(customerId);
        var newBalance = currentBalance + creditAmount - paymentAmount;

        var transaction = new CustomerTransaction
        {
            CustomerId = customerId,
            Date = date,
            Description = description,
            InvoiceId = invoiceId,
            PaymentId = paymentId,
            CreditAmount = creditAmount,
            PaymentAmount = paymentAmount,
            BalanceAfter = newBalance
        };

        await _unitOfWork.CustomerTransactions.AddAsync(transaction);
    }

    public async Task RecordSupplierTransactionAsync(int supplierId, DateTime date, string description, int? purchaseId, int? paymentId, decimal creditAmount, decimal paymentAmount)
    {
        var currentBalance = await GetSupplierBalanceAsync(supplierId);
        var newBalance = currentBalance + creditAmount - paymentAmount;

        var transaction = new SupplierTransaction
        {
            SupplierId = supplierId,
            Date = date,
            Description = description,
            PurchaseId = purchaseId,
            PaymentId = paymentId,
            CreditAmount = creditAmount,
            PaymentAmount = paymentAmount,
            BalanceAfter = newBalance
        };

        await _unitOfWork.SupplierTransactions.AddAsync(transaction);
    }

    public async Task<decimal> GetCashBalanceAsync()
    {
        var cashBooks = await _unitOfWork.CashBooks.GetAllAsync();
        var lastEntry = cashBooks.OrderByDescending(c => c.Date).ThenByDescending(c => c.Id).FirstOrDefault();
        return lastEntry?.BalanceAfter ?? 0;
    }

    public async Task<decimal> GetCustomerBalanceAsync(int customerId)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(customerId);
        var transactions = await _unitOfWork.CustomerTransactions.GetAllAsync();
        var customerTransactions = transactions.Where(t => t.CustomerId == customerId);
        var lastTransaction = customerTransactions.OrderByDescending(t => t.Date).ThenByDescending(t => t.Id).FirstOrDefault();
        
        return lastTransaction?.BalanceAfter ?? customer?.OpeningBalance ?? 0;
    }

    public async Task<decimal> GetSupplierBalanceAsync(int supplierId)
    {
        var supplier = await _unitOfWork.Suppliers.GetByIdAsync(supplierId);
        var transactions = await _unitOfWork.SupplierTransactions.GetAllAsync();
        var supplierTransactions = transactions.Where(t => t.SupplierId == supplierId);
        var lastTransaction = supplierTransactions.OrderByDescending(t => t.Date).ThenByDescending(t => t.Id).FirstOrDefault();
        
        return lastTransaction?.BalanceAfter ?? supplier?.OpeningBalance ?? 0;
    }

    public async Task RecordCustomerPaymentAsync(int customerId, DateTime date, decimal amount, int currencyId, decimal exchangeRate, string description)
    {
        // Create payment record
        var payment = new Payment
        {
            CurrencyId = currencyId,
            PartyType = Domain.Enums.PartyType.Customer,
            PartyId = customerId,
            Amount = amount,
            Method = Domain.Enums.PaymentMethod.Cash,
            Date = date,
            Description = description
        };
        
        var createdPayment = await _unitOfWork.Payments.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();
        
        // Record cash transaction (money received from customer)
        var amountInBaseCurrency = amount * exchangeRate;
        await RecordCashTransactionAsync(
            date, 
            ModuleType.CustomerPayment, 
            createdPayment.Id, 
            description,
            currencyId,
            amount,
            exchangeRate,
            amountInBaseCurrency, // Cash in
            0 // Cash out
        );
        
        // Record customer transaction (reduce customer balance)
        await RecordCustomerTransactionAsync(
            customerId,
            date,
            description,
            null,
            createdPayment.Id,
            0, // Credit amount
            amount // Payment amount
        );
    }

    public async Task RecordSupplierPaymentAsync(int supplierId, DateTime date, decimal amount, int currencyId, decimal exchangeRate, string description)
    {
        // Create payment record
        var payment = new Payment
        {
            CurrencyId = currencyId,
            PartyType = Domain.Enums.PartyType.Supplier,
            PartyId = supplierId,
            Amount = amount,
            Method = Domain.Enums.PaymentMethod.Cash,
            Date = date,
            Description = description
        };
        
        var createdPayment = await _unitOfWork.Payments.AddAsync(payment);
        await _unitOfWork.SaveChangesAsync();
        
        // Record cash transaction (money paid to supplier)
        var amountInBaseCurrency = amount * exchangeRate;
        await RecordCashTransactionAsync(
            date, 
            ModuleType.SupplierPayment, 
            createdPayment.Id, 
            description,
            currencyId,
            amount,
            exchangeRate,
            0, // Cash in
            amountInBaseCurrency // Cash out
        );
        
        // Record supplier transaction (reduce supplier balance)
        await RecordSupplierTransactionAsync(
            supplierId,
            date,
            description,
            null,
            createdPayment.Id,
            0, // Credit amount
            amount // Payment amount
        );
    }
}