namespace ShopManagementSystem.Application.Services;

public interface ITokenService
{
    Task<string> GenerateTokenAsync(string userId, string userName, string email, IList<string> roles);
}