namespace ManagementTestBackend.Entities
{
  public class CustomerData
  {
    public string Name { get; set; }
    public int TzNumber   { get; set; }
    public Address Address { get; set; }
    public List<Package>? Packages { get; set; }
  }

  public class Address
  {
    public string City { get; set; }
    public string Street { get; set; }
    public int House { get; set; }
    public int Zip { get; set; }

  }
  public class Package
  {
    public string Name { get; set; }
    public bool IsActive { get; set; }
    public DateTime? Start { get; set; }
    public DateTime? End { get; set; }
  }
}
