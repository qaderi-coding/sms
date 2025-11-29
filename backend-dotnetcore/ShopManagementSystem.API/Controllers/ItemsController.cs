using Microsoft.AspNetCore.Mvc;
using ShopManagementSystem.Application.DTOs;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly IUnitOfWork _unitOfWork;

    public ItemsController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ItemDto>>> GetItems()
    {
        var items = await _unitOfWork.Items.GetAllAsync();
        var itemDtos = items.Select(i => new ItemDto
        {
            Id = i.Id,
            Name = i.Name,
            Unit = i.Unit,
            OpeningQty = i.OpeningQty,
            OpeningCost = i.OpeningCost
        });
        
        return Ok(itemDtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ItemDto>> GetItem(int id)
    {
        var item = await _unitOfWork.Items.GetByIdAsync(id);
        if (item == null)
            return NotFound();

        var itemDto = new ItemDto
        {
            Id = item.Id,
            Name = item.Name,
            Unit = item.Unit,
            OpeningQty = item.OpeningQty,
            OpeningCost = item.OpeningCost
        };

        return Ok(itemDto);
    }

    [HttpPost]
    public async Task<ActionResult<ItemDto>> CreateItem(CreateItemDto createItemDto)
    {
        var item = new Item
        {
            Name = createItemDto.Name,
            Unit = createItemDto.Unit,
            OpeningQty = createItemDto.OpeningQty,
            OpeningCost = createItemDto.OpeningCost
        };

        var createdItem = await _unitOfWork.Items.AddAsync(item);
        await _unitOfWork.SaveChangesAsync();

        var itemDto = new ItemDto
        {
            Id = createdItem.Id,
            Name = createdItem.Name,
            Unit = createdItem.Unit,
            OpeningQty = createdItem.OpeningQty,
            OpeningCost = createdItem.OpeningCost
        };

        return CreatedAtAction(nameof(GetItem), new { id = itemDto.Id }, itemDto);
    }
}