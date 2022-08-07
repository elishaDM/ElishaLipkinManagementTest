namespace ManagementTestBackend.Services;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ManagementTestBackend.Entities;
using ManagementTestBackend.Helpers;
using ManagementTestBackend.Models;

public interface IUserService
{
  AuthenticateResponse Authenticate(AuthenticateRequest model);
  AuthenticateResponse UpdateAddress(UpdateAddressRequest model);
  List<int> GetUsersTz();
  User GetById(int id);
}

public class UserService : IUserService
{
  private IReadWriteDataService _dataService;
  private List<CustomerData> _customersData = new List<CustomerData>();
  // users hardcoded for simplicity, store in a db with hashed passwords in production applications
  private List<User> _users = new List<User>
    {
        new User { Id = 1, FirstName = "Elisha", LastName = "User", Username = "test", TzNumber = 306304825 }
    };
  
  private readonly AppSettings _appSettings;
  private readonly List<int> _usersTz;

  public UserService(IOptions<AppSettings> appSettings, IReadWriteDataService readWriteDataService)
  {
    _appSettings = appSettings.Value;
    _dataService = readWriteDataService;
    _customersData = _dataService.GetCustomersData();
    _usersTz = new List<int>();
    _customersData.ForEach(u => _usersTz.Add(u.TzNumber));
}

  public AuthenticateResponse Authenticate(AuthenticateRequest model)
  {
    var user = _customersData.SingleOrDefault(x => x.TzNumber == model.TzNumber);

    // return null if user not found
    if (user == null) return null;

    // authentication successful so generate jwt token
    var token = generateJwtToken(user);

    return new AuthenticateResponse(user, token);
  }

  public AuthenticateResponse UpdateAddress(UpdateAddressRequest model)
  {
    var user = _customersData.FirstOrDefault(x => x.TzNumber == model.TzNumber);
    user.Address = new Address()
    {
      City = model.City,
      Street = model.Street,
      House = model.House,
      Zip =  model.Zip
    };
    int editedIndex = _customersData.FindIndex(u => u.TzNumber == model.TzNumber);
    _customersData[editedIndex] = user;
    try
    {
      _dataService.SaveData(_customersData);
      var token = generateJwtToken(user);

      return new AuthenticateResponse(user, token);
    }
    catch(Exception ex)
    {
      throw new Exception(ex.Message);
    }

  }

  public List<int> GetUsersTz()
  {
    return this._usersTz;
  }

  public User? GetById(int tzNumber)
  {
    return _users.FirstOrDefault(x => x.TzNumber == tzNumber);
  }

  // helper methods

  private string generateJwtToken(CustomerData user)
  {
    // generate token that is valid for 5 minutes
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
    var tokenDescriptor = new SecurityTokenDescriptor
    {
      Subject = new ClaimsIdentity(new[] { new Claim("TzNumber", user.TzNumber.ToString()) }),
      Expires = DateTime.UtcNow.AddMinutes(2),//TODO- 5 min
      SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };
    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
  }
}
