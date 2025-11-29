using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;
using Swashbuckle.AspNetCore.Annotations;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/core/payment-status")]
[SwaggerTag("Payment status management endpoints")]
public class PaymentStatusController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public PaymentStatusController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    [SwaggerOperation(Summary = "Get all payment statuses")]
    public async Task<ActionResult<IEnumerable<PaymentStatusDto>>> GetAll()
    {
        var paymentStatuses = await _unitOfWork.PaymentStatuses.GetAllAsync();
        var result = paymentStatuses.Select(ps => new PaymentStatusDto
        {
            Id = ps.Id,
            Code = ps.Code,
            Name = ps.Name,
            Description = ps.Description,
            IsActive = ps.IsActive,
            SortOrder = ps.SortOrder
        }).OrderBy(ps => ps.SortOrder);
        
        return Ok(result);
    }

    [HttpGet("{id}")]
    [SwaggerOperation(Summary = "Get payment status by ID")]
    public async Task<ActionResult<PaymentStatusDto>> GetById(int id)
    {
        var paymentStatus = await _unitOfWork.PaymentStatuses.GetByIdAsync(id);
        if (paymentStatus == null)
            return NotFound();

        var result = new PaymentStatusDto
        {
            Id = paymentStatus.Id,
            Code = paymentStatus.Code,
            Name = paymentStatus.Name,
            Description = paymentStatus.Description,
            IsActive = paymentStatus.IsActive,
            SortOrder = paymentStatus.SortOrder
        };

        return Ok(result);
    }

    [HttpPost]
    [SwaggerOperation(Summary = "Create new payment status")]
    public async Task<ActionResult<PaymentStatusDto>> Create([FromBody] CreatePaymentStatusDto dto)
    {
        var paymentStatus = new PaymentStatus
        {
            Code = dto.Code,
            Name = dto.Name,
            Description = dto.Description,
            IsActive = dto.IsActive,
            SortOrder = dto.SortOrder
        };

        var created = await _unitOfWork.PaymentStatuses.AddAsync(paymentStatus);
        await _unitOfWork.SaveChangesAsync();

        var result = new PaymentStatusDto
        {
            Id = created.Id,
            Code = created.Code,
            Name = created.Name,
            Description = created.Description,
            IsActive = created.IsActive,
            SortOrder = created.SortOrder
        };

        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [SwaggerOperation(Summary = "Update payment status")]
    public async Task<ActionResult<PaymentStatusDto>> Update(int id, [FromBody] CreatePaymentStatusDto dto)
    {
        var paymentStatus = await _unitOfWork.PaymentStatuses.GetByIdAsync(id);
        if (paymentStatus == null)
            return NotFound();

        paymentStatus.Code = dto.Code;
        paymentStatus.Name = dto.Name;
        paymentStatus.Description = dto.Description;
        paymentStatus.IsActive = dto.IsActive;
        paymentStatus.SortOrder = dto.SortOrder;

        await _unitOfWork.PaymentStatuses.UpdateAsync(paymentStatus);
        await _unitOfWork.SaveChangesAsync();

        var result = new PaymentStatusDto
        {
            Id = paymentStatus.Id,
            Code = paymentStatus.Code,
            Name = paymentStatus.Name,
            Description = paymentStatus.Description,
            IsActive = paymentStatus.IsActive,
            SortOrder = paymentStatus.SortOrder
        };

        return Ok(result);
    }

    [HttpDelete("{id}")]
    [SwaggerOperation(Summary = "Delete payment status")]
    public async Task<ActionResult> Delete(int id)
    {
        var paymentStatus = await _unitOfWork.PaymentStatuses.GetByIdAsync(id);
        if (paymentStatus == null)
            return NotFound();

        await _unitOfWork.PaymentStatuses.DeleteAsync(paymentStatus);
        await _unitOfWork.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("active")]
    [SwaggerOperation(Summary = "Get active payment statuses")]
    public async Task<ActionResult<IEnumerable<PaymentStatusDto>>> GetActive()
    {
        var paymentStatuses = await _unitOfWork.PaymentStatuses.GetAllAsync();
        var result = paymentStatuses
            .Where(ps => ps.IsActive)
            .Select(ps => new PaymentStatusDto
            {
                Id = ps.Id,
                Code = ps.Code,
                Name = ps.Name,
                Description = ps.Description,
                IsActive = ps.IsActive,
                SortOrder = ps.SortOrder
            })
            .OrderBy(ps => ps.SortOrder);
        
        return Ok(result);
    }
}