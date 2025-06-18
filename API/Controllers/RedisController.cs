using Application.Services;
using Domain;
using Microsoft.AspNetCore.Mvc;
using StackExchange.Redis;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RedisController : BaseApiController
    {
        private readonly RedisService _redisService;

        public RedisController(RedisService redisService)
        {
            _redisService = redisService;
        }

        [HttpGet("test-redis")]
        public async Task<IActionResult> TestRedis()
        {
            await _redisService.SetValueAsync("message", "Hello from Redis Service!");
            return Ok(await _redisService.GetValueAsync("message"));
        }

        // API za dodavanje novog skijališta
        [HttpPost("skijaliste/dodaj")]
        public async Task<IActionResult> DodajSkijaliste([FromBody] SkijalisteRedis skijaliste)
        {
            var existing = await _redisService.GetSkijalisteAsync($"skijaliste:{skijaliste.Ime}");
            if (existing != null)
            {
                return Conflict("Skijalište već postoji. Koristite PUT za ažuriranje.");
            }

            await _redisService.SetSkijalisteAsync($"skijaliste:{skijaliste.Ime}", skijaliste);
            return Ok("Skijalište uspešno dodato.");
        }

        // API za ažuriranje postojećeg skijališta
        [HttpPut("skijaliste/azuriraj")]
        public async Task<IActionResult> AzurirajSkijaliste([FromBody] SkijalisteRedis skijaliste)
        {
            var existing = await _redisService.GetSkijalisteAsync($"skijaliste:{skijaliste.Ime}");
            if (existing == null)
            {
                return NotFound("Skijalište ne postoji. Koristite POST za dodavanje.");
            }

            await _redisService.SetSkijalisteAsync($"skijaliste:{skijaliste.Ime}", skijaliste);
            return Ok("Skijalište uspešno ažurirano.");
        }

        [HttpGet("skijalista/sve")]
        public async Task<IActionResult> GetAllSkijalista()
        {
            var allKeys = await _redisService.GetAllKeysAsync("skijaliste:*");
            var skijalista = new List<SkijalisteRedis>();

            foreach (var key in allKeys)
            {
                var skijaliste = await _redisService.GetSkijalisteAsync(key);
                if (skijaliste != null)
                {
                    skijalista.Add(skijaliste);
                }
            }

            return Ok(skijalista);
        }

        // API za dohvatanje podataka za skijalište
        [HttpGet("skijaliste/{ime}")]
        public async Task<IActionResult> VratiSkijaliste(string ime)
        {
            var skijaliste = await _redisService.GetSkijalisteAsync($"skijaliste:{ime}");
            if (skijaliste == null) return NotFound("Skijalište nije pronađeno.");
            return Ok(skijaliste);
        }

        [HttpDelete("skijaliste/{ime}")]
        public async Task<IActionResult> DeleteSkijaliste(string ime)
        {
            bool deleted = await _redisService.DeleteSkijalisteAsync(ime);
            if (!deleted)
                return NotFound("Skijalište nije pronađeno.");

            return Ok($"Skijalište '{ime}' je uspešno obrisano.");
        }

        //------------------------------------------------------------------------------------------------
        // Pub/Sub
        //------------------------------------------------------------------------------------------------
        
        // API za slanje obaveštenja
        [HttpPost("notifikacija")]
        public async Task<IActionResult> SendNotification([FromBody] string message)
        {
            await _redisService.PublishNotificationAsync("notifikacije", message);
            return Ok("Notifikacija poslana.");
        }
        [HttpPost("zatvori-stazu")]
        public async Task<IActionResult> ZatvoriStazu(string ime, string staza)
        {
            await _redisService.PublishNotificationAsync("notifikacije", $"🔔 Staza \"{staza}\" na skijalištu \"{ime}\" je zatvorena.");
            return Ok("Notifikacija poslata.");
        }
        [HttpGet("all-ranked-ski-resorts")]
        public async Task<IActionResult> GetAllRankedSkiResorts(string kriterijum)
        {
            var result = await _redisService.GetAllRankedSkiResorts(kriterijum);
            if (!result.Any())
            {
                return NotFound("Nema rangiranih skijališta za izabrani kriterijum.");
            }
            return Ok(result);
        }

    }
}
