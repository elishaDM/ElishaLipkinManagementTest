namespace ManagementTestBackend.Controllers
{
  using Microsoft.AspNetCore.Mvc;
  using ManagementTestBackend.Helpers;
  using ManagementTestBackend.Models;
  using ManagementTestBackend.Services;

  [ApiController]
  [Route("[controller]")]
  public class UsersController : ControllerBase
  {
    private IUserService _userService;

    public UsersController(IUserService userService)
    {
      _userService = userService;
    }

    [HttpPost("authenticate")]
    public IActionResult Authenticate(AuthenticateRequest model)
    {
      var response = _userService.Authenticate(model);

      if (response == null)
        return BadRequest(new { message = "Username or password is incorrect" });

      return Ok(response);
    }

    [Authorize]
    [HttpPut("update")]
    public IActionResult Update(UpdateAddressRequest model)
    {
      var users = _userService.UpdateAddress(model);
      return Ok(users);
    }

    [HttpGet("allTz")]
    public IActionResult AllTz()
    {
      return Ok(_userService.GetUsersTz());
    }
  }
}
