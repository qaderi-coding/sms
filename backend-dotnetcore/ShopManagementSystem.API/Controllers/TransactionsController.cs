using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/transactions")]
[SwaggerTag("Transaction management endpoints")]
public class TransactionsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public TransactionsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all transactions", Description = "Retrieves transaction history")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactions()
    {
        var transactions = await _unitOfWork.Transactions.GetAllAsync();
        return Ok(transactions);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get transaction by ID")]
    public async Task<ActionResult<Transaction>> GetTransaction(int id)
    {
        var transaction = await _unitOfWork.Transactions.GetByIdAsync(id);
        if (transaction == null) return NotFound();
        return Ok(transaction);
    }

    [HttpGet("by-party/{partyType}/{partyId}")]
    [SwaggerOperation(Summary = "Get transactions by party", Description = "Get all transactions for a specific customer or supplier")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByParty(string partyType, int partyId)
    {
        var transactions = await _unitOfWork.Transactions.FindAsync(t => 
            t.PartyType.ToString().ToLower() == partyType.ToLower() && t.PartyId == partyId);
        return Ok(transactions);
    }

    [HttpGet("by-type/{transactionType}")]
    [SwaggerOperation(Summary = "Get transactions by type", Description = "Get all transactions of a specific type")]
    public async Task<ActionResult<IEnumerable<Transaction>>> GetTransactionsByType(string transactionType)
    {
        var transactions = await _unitOfWork.Transactions.FindAsync(t => 
            t.Type.ToString().ToLower() == transactionType.ToLower());
        return Ok(transactions);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create transaction", Description = "Creates a standalone transaction")]
    public async Task<ActionResult<Transaction>> CreateTransaction([FromBody] Transaction transaction)
    {
        var createdTransaction = await _unitOfWork.Transactions.AddAsync(transaction);
        await _unitOfWork.SaveChangesAsync();
        return CreatedAtAction(nameof(GetTransaction), new { id = createdTransaction.Id }, createdTransaction);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update transaction")]
    public async Task<ActionResult<Transaction>> UpdateTransaction(int id, [FromBody] Transaction transaction)
    {
        var existingTransaction = await _unitOfWork.Transactions.GetByIdAsync(id);
        if (existingTransaction == null) return NotFound();

        existingTransaction.Notes = transaction.Notes;
        existingTransaction.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Transactions.UpdateAsync(existingTransaction);
        await _unitOfWork.SaveChangesAsync();
        return Ok(existingTransaction);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete transaction")]
    public async Task<ActionResult> DeleteTransaction(int id)
    {
        var transaction = await _unitOfWork.Transactions.GetByIdAsync(id);
        if (transaction == null) return NotFound();

        await _unitOfWork.Transactions.DeleteAsync(transaction);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
}