namespace ManagementTestBackend.Models
{
  using ManagementTestBackend.Entities;
  public class UpdateAddressRequest : Address
  {
    public int TzNumber { get; set; }
  }
}
