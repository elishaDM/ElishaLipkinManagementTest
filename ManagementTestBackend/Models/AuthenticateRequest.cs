namespace ManagementTestBackend.Models
{
  using System.ComponentModel.DataAnnotations;

  public class AuthenticateRequest
  {
    [Required]
    public int TzNumber { get; set; }

  }
}
