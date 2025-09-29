using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/purchases")]
[SwaggerTag("Purchase management endpoints")]
public class PurchasesController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public PurchasesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Get all purchases",
        Description = "Retrieves a list of all purchases"
    )]
    [SwaggerResponse(200, "Purchases retrieved successfully", typeof(IEnumerable<Purchase>))]
    public async Task<ActionResult<IEnumerable<Purchase>>> GetPurchases()
    {
        var purchases = await _unitOfWork.Purchases.GetAllAsync();
        return Ok(purchases);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get purchase by ID")]
    public async Task<ActionResult<Purchase>> GetPurchase(int id)
    {
        var purchase = await _unitOfWork.Purchases.GetByIdAsync(id);
        if (purchase == null) return NotFound();
        return Ok(purchase);
    }

    [HttpPost("bulk-create")]
    [SwaggerOperation(
        Summary = "Create bulk purchase",
        Description = "Creates a new purchase with multiple items"
    )]
    [SwaggerResponse(201, "Purchase created successfully", typeof(Purchase))]
    public async Task<ActionResult<Purchase>> CreateBulkPurchase(
        [FromBody, SwaggerParameter("Purchase data")] Purchase purchase)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            // Create transaction first
            var transaction = new Transaction
            {
                Type = Domain.Enums.TransactionType.Purchase,
                PartyType = Domain.Enums.PartyType.Supplier,
                PartyId = purchase.SupplierId,
                OriginalAmount = purchase.TotalAmount,
                Currency = purchase.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = purchase.TotalAmount,
                Notes = "Purchase"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            purchase.TransactionId = createdTransaction.Id;
            var createdPurchase = await _unitOfWork.Purchases.AddAsync(purchase);
            await _unitOfWork.SaveChangesAsync();
            
            await _unitOfWork.CommitTransactionAsync();
            return CreatedAtAction(nameof(GetPurchase), new { id = createdPurchase.Id }, createdPurchase);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpPut("bulk-update/{id}")]
    [SwaggerOperation(Summary = "Update bulk purchase")]
    public async Task<ActionResult<Purchase>> UpdateBulkPurchase(int id, [FromBody] Purchase purchase)
    {
        var existingPurchase = await _unitOfWork.Purchases.GetByIdAsync(id);
        if (existingPurchase == null) return NotFound();

        existingPurchase.SupplierId = purchase.SupplierId;
        existingPurchase.TotalAmount = purchase.TotalAmount;
        existingPurchase.Currency = purchase.Currency;
        existingPurchase.Status = purchase.Status;
        existingPurchase.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Purchases.UpdateAsync(existingPurchase);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingPurchase);
    }

    [HttpPost("returns/bulk-create")]
    [SwaggerOperation(Summary = "Create bulk purchase return")]
    public async Task<ActionResult<Purchase>> CreateBulkPurchaseReturn([FromBody] Purchase purchase)
    {
        await _unitOfWork.BeginTransactionAsync();
        
        try
        {
            var transaction = new Transaction
            {
                Type = Domain.Enums.TransactionType.ReturnPurchase,
                PartyType = Domain.Enums.PartyType.Supplier,
                PartyId = purchase.SupplierId,
                OriginalAmount = -purchase.TotalAmount, // Negative for return
                Currency = purchase.Currency,
                ExchangeRateToUsd = 1.0m,
                AmountUsd = -purchase.TotalAmount,
                Notes = "Purchase Return"
            };

            var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
            await _unitOfWork.SaveChangesAsync();

            purchase.TransactionId = createdTransaction.Id;
            var createdPurchase = await _unitOfWork.Purchases.AddAsync(purchase);
            await _unitOfWork.SaveChangesAsync();
            
            await _unitOfWork.CommitTransactionAsync();
            return CreatedAtAction(nameof(GetPurchase), new { id = createdPurchase.Id }, createdPurchase);
        }
        catch
        {
            await _unitOfWork.RollbackTransactionAsync();
            throw;
        }
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete purchase")]
    public async Task<ActionResult> DeletePurchase(int id)
    {
        var purchase = await _unitOfWork.Purchases.GetByIdAsync(id);
        if (purchase == null) return NotFound();

        await _unitOfWork.Purchases.DeleteAsync(purchase);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}