using MediatR;
using ShopManagementSystem.Application.Commands;
using ShopManagementSystem.Application.DTOs.Responses;
using ShopManagementSystem.Application.Queries;
using ShopManagementSystem.Domain.Entities;
using ShopManagementSystem.Domain.Interfaces;

namespace ShopManagementSystem.Application.Handlers;

public class GetCustomersHandler : IRequestHandler<GetCustomersQuery, IEnumerable<CustomerResponse>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCustomersHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IEnumerable<CustomerResponse>> Handle(GetCustomersQuery request, CancellationToken cancellationToken)
    {
        var customers = await _unitOfWork.Customers.GetAllAsync();
        return customers.Select(c => new CustomerResponse
        {
            Id = c.Id,
            Name = c.Name,
            Phone = c.Phone,
            Address = c.Address,
            Email = c.Email,
            CreatedAt = c.CreatedAt,
            UpdatedAt = c.UpdatedAt
        });
    }
}

public class GetCustomerByIdHandler : IRequestHandler<GetCustomerByIdQuery, CustomerResponse?>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetCustomerByIdHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CustomerResponse?> Handle(GetCustomerByIdQuery request, CancellationToken cancellationToken)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(request.Id);
        if (customer == null) return null;
        
        return new CustomerResponse
        {
            Id = customer.Id,
            Name = customer.Name,
            Phone = customer.Phone,
            Address = customer.Address,
            Email = customer.Email,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };
    }
}

public class CreateCustomerHandler : IRequestHandler<CreateCustomerCommand, CustomerResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateCustomerHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CustomerResponse> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = new Customer
        {
            Name = request.Request.Name,
            Phone = request.Request.Phone,
            Address = request.Request.Address,
            Email = request.Request.Email
        };

        var createdCustomer = await _unitOfWork.Customers.AddAsync(customer);
        await _unitOfWork.SaveChangesAsync();
        
        return new CustomerResponse
        {
            Id = createdCustomer.Id,
            Name = createdCustomer.Name,
            Phone = createdCustomer.Phone,
            Address = createdCustomer.Address,
            Email = createdCustomer.Email,
            CreatedAt = createdCustomer.CreatedAt,
            UpdatedAt = createdCustomer.UpdatedAt
        };
    }
}

public class UpdateCustomerHandler : IRequestHandler<UpdateCustomerCommand, CustomerResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCustomerHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CustomerResponse> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(request.Id);
        if (customer == null)
            throw new KeyNotFoundException($"Customer with ID {request.Id} not found");

        customer.Name = request.Request.Name;
        customer.Phone = request.Request.Phone;
        customer.Address = request.Request.Address;
        customer.Email = request.Request.Email;
        customer.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.Customers.UpdateAsync(customer);
        await _unitOfWork.SaveChangesAsync();
        
        return new CustomerResponse
        {
            Id = customer.Id,
            Name = customer.Name,
            Phone = customer.Phone,
            Address = customer.Address,
            Email = customer.Email,
            CreatedAt = customer.CreatedAt,
            UpdatedAt = customer.UpdatedAt
        };
    }
}

public class DeleteCustomerHandler : IRequestHandler<DeleteCustomerCommand, bool>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCustomerHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<bool> Handle(DeleteCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _unitOfWork.Customers.GetByIdAsync(request.Id);
        if (customer == null)
            return false;

        await _unitOfWork.Customers.DeleteAsync(customer);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}