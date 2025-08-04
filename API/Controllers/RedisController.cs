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
        private readonly SubscriptionService _subscriptionService;
        private static readonly Dictionary<string, List<string>> korisnikPretplate = new();

        public RedisController(RedisService redisService, SubscriptionService subscriptionService)
        {
            _redisService = redisService;
            _subscriptionService = subscriptionService;
        }

        [HttpGet("test-redis")]
        public async Task<IActionResult> TestRedis()
        {
            await _redisService.SetValueAsync("message", "Hello from Redis Service!");
            return Ok(await _redisService.GetValueAsync("message"));
        }

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

        [HttpPut("skijaliste/azuriraj")]
        public async Task<IActionResult> AzurirajSkijaliste([FromBody] SkijalisteRedis skijaliste)
        {
            var promena = "";
            var existing = await _redisService.GetSkijalisteAsync($"skijaliste:{skijaliste.Ime}");
            if (existing == null)
            {
                return NotFound("Skijalište ne postoji. Koristite POST za dodavanje.");
            }

            if (Math.Abs(skijaliste.BrojSkijasa - existing.BrojSkijasa) >= 5)
            {
                promena += $"📈 Skijalište '{skijaliste.Ime}': broj skijaša se promenio sa {existing.BrojSkijasa} na {skijaliste.BrojSkijasa}.\n";
            }
            if (existing.SlobodnihParkingMesta != skijaliste.SlobodnihParkingMesta)
            {
                promena += $"🅿️ Skijalište '{skijaliste.Ime}': broj slobodnih parking mesta: {skijaliste.SlobodnihParkingMesta}.\n";
            }
            if (existing.OtvorenihStaza != skijaliste.OtvorenihStaza)
            {
                promena += $"⛷️ Skijalište '{skijaliste.Ime}': broj otvorenih staza: {skijaliste.OtvorenihStaza}.\n";
            }
            if (existing.ZatvorenihStaza != skijaliste.ZatvorenihStaza)
            {
                promena += $"⛷️ Skijalište '{skijaliste.Ime}': broj zatvorenih staza: {skijaliste.ZatvorenihStaza}.\n";
            }

            if (!string.IsNullOrEmpty(promena))
            {
                await _redisService.PublishNotificationAsync("notifikacije", promena.Trim());
                await _subscriptionService.NotifySubscribersAsync(skijaliste.Ime, $"📢 Skijalište {skijaliste.Ime} je ažurirano!");

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

        [HttpGet("skijaliste/{ime}")]
        public async Task<IActionResult> VratiSkijaliste(string ime)
        {
            var skijaliste = await _redisService.GetSkijalisteAsync($"skijaliste:{ime}");
            if (skijaliste == null) return NotFound("Skijalište nije pronađeno.");
            return Ok(skijaliste);
        }

        [HttpDelete("obrisiSkijaliste/{ime}")]
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

        [HttpPost("pretplata")]
        public IActionResult PretplatiSe(string korisnikId, string skijaliste)
        {
            if (!korisnikPretplate.ContainsKey(korisnikId))
                korisnikPretplate[korisnikId] = new List<string>();

            korisnikPretplate[korisnikId].Add(skijaliste);
            return Ok($"Korisnik {korisnikId} je pretplaćen na {skijaliste}.");
        }

        // API za slanje obaveštenja
        [HttpPost("notifikacija")]
        public async Task<IActionResult> SendNotification([FromBody] string message)
        {
            await _redisService.PublishNotificationAsync("notifikacije", message);
            return Ok("Notifikacija poslata.");
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
