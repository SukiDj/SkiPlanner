using Application.Services;
using Domain;
using Microsoft.AspNetCore.Mvc;

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

        // API za dodavanje ili ažuriranje podataka skijališta
        [HttpPost("skijaliste")]
        public async Task<IActionResult> AddOrUpdateSkijaliste([FromBody] SkijalisteRedis skijaliste)
        {
            await _redisService.SetSkijalisteAsync($"skijaliste:{skijaliste.Ime}", skijaliste);
            return Ok("Skijalište uspešno dodato/ažurirano.");
        }

        // API za dohvatanje podataka za skijalište
        [HttpGet("skijaliste/{ime}")]
        public async Task<IActionResult> GetSkijaliste(string ime)
        {
            var skijaliste = await _redisService.GetSkijalisteAsync($"skijaliste:{ime}");
            if (skijaliste == null) return NotFound("Skijalište nije pronađeno.");
            return Ok(skijaliste);
        }

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
