namespace ManagementTestBackend.Services
{
  using Microsoft.Extensions.Options;
  using ManagementTestBackend.Entities;
  using ManagementTestBackend.Helpers;
  using Newtonsoft.Json;

  public interface IReadWriteDataService
  {
    List<CustomerData> GetCustomersData();
    void SaveData(List<CustomerData> data);
  }
  public class ReadWriteDataService : IReadWriteDataService
  {
    private readonly AppSettings _appSettings;

    public ReadWriteDataService(IOptions<AppSettings> appSettings)
    {
      _appSettings = appSettings.Value;
    }

    public List<CustomerData> GetCustomersData()
    {
      
      string fileName = _appSettings.JsonFile;

      using (StreamReader r = new StreamReader(fileName))
      {
        string json = r.ReadToEnd();
        List<CustomerData>? items = JsonConvert.DeserializeObject<List<CustomerData>>(json);
        return items == null? new List<CustomerData>() : items;
      }
    }

    public void SaveData(List<CustomerData> data)
    {
      string fileName = _appSettings.JsonFile;
      using (StreamWriter w = new StreamWriter(fileName))
      {
        JsonSerializer serializer = new JsonSerializer();
        serializer.Serialize(w, data);
      }
    }
  }

}
