namespace ManagementTestBackend.Models
{

  using ManagementTestBackend.Entities;

  public class AuthenticateResponse
  {
    public string Name { get; set; }
    public int TzNumber { get; set; }
    public Address Address { get; set; }
    public List<Package> Packages { get; set; }


    public AuthenticateResponse(CustomerData user, string token)
    {
      Name = user.Name;
      TzNumber = user.TzNumber;
      Address = user.Address;
      Packages = user.Packages;
    }
  }
}
