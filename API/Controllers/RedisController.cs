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
        private readonly RedisService _redis;
        private readonly SubscriptionService _subscriptions;

        public RedisController(RedisService redis, SubscriptionService subscriptions)
        {
            _redis = redis;
            _subscriptions = subscriptions;
        }

        [HttpGet("skijalista/sve")]
        public async Task<IActionResult> GetAllSkijalista()
        {
            var allKeys = await _redis.GetAllKeysAsync("skijaliste:*");
            var lista = new List<SkijalisteRedis>();

            foreach (var key in allKeys)
            {
                var s = await _redis.GetSkijalisteForAllAsync(key);
                if (s != null) lista.Add(s);
            }

            return Ok(lista);
        }

        [HttpGet("skijaliste/{ime}")]
        public async Task<IActionResult> VratiSkijaliste(string ime)
        {
            var skijaliste = await _redis.GetSkijalisteAsync(ime);
            if (skijaliste == null) return NotFound("Skijalište nije pronađeno.");
            return Ok(skijaliste);
        }

        [HttpPost("skijaliste/dodaj")]
        public async Task<IActionResult> DodajSkijaliste([FromBody] SkijalisteRedis skijaliste)
        {
            var existing = await _redis.GetSkijalisteAsync($"skijaliste:{skijaliste.Ime}");
            if (existing != null)
                return Conflict("Skijalište već postoji. Koristite PUT za ažuriranje.");

            await _redis.SetSkijalisteAsync(skijaliste.Ime, skijaliste);
            return Ok("Skijalište uspešno dodato.");
        }

        [HttpPut("skijaliste/azuriraj")]
        public async Task<IActionResult> AzurirajSkijaliste([FromBody] SkijalisteRedis skijaliste)
        {
            var promena = "";
            var existing = await _redis.GetSkijalisteAsync(skijaliste.Ime);
            if (existing == null)
                return NotFound("Skijalište ne postoji. Koristite POST za dodavanje.");

            if (Math.Abs(skijaliste.BrojSkijasa - existing.BrojSkijasa) >= 5)
                promena += $"📈 Broj skijaša se promenio sa {existing.BrojSkijasa} na {skijaliste.BrojSkijasa}.\n";

            if (existing.SlobodnihParkingMesta != skijaliste.SlobodnihParkingMesta)
                promena += $"🅿️ Broj slobodnih parking mesta se promenio sa {existing.SlobodnihParkingMesta} na {skijaliste.SlobodnihParkingMesta}.\n";

            if (existing.OtvorenihStaza != skijaliste.OtvorenihStaza)
                promena += $"⛷️ Otvorenih staza: {skijaliste.OtvorenihStaza}.\n";

            if (existing.ZatvorenihStaza != skijaliste.ZatvorenihStaza)
                promena += $"🚧 Zatvorenih staza: {skijaliste.ZatvorenihStaza}.\n";

            await _redis.SetSkijalisteAsync(skijaliste.Ime, skijaliste);

            if (!string.IsNullOrEmpty(promena))
            {
                string poruka = $"Skijalište '{skijaliste.Ime}' ažurirano:\n{promena.Trim()}";
                await _redis.PublishNotificationAsync(skijaliste.Ime, poruka);
                //await _subscriptions.NotifySubscribersAsync(skijaliste.Ime, poruka);
            }

            return Ok("Skijalište uspešno ažurirano.");
        }

        [HttpDelete("obrisiSkijaliste/{ime}")]
        public async Task<IActionResult> ObrisiSkijaliste(string ime)
        {
            bool deleted = await _redis.DeleteSkijalisteAsync(ime);
            if (!deleted)
                return NotFound("Skijalište nije pronađeno.");

            await _redis.PublishNotificationAsync(ime, $"Skijalište '{ime}' je obrisano.");
            return Ok($"Skijalište '{ime}' je uspešno obrisano.");
        }

        [HttpPost("subscribe")]
        public async Task<IActionResult> Subscribe([FromQuery] string userId, [FromQuery] string skiResort)
        {
            await _redis.AddSubscriptionAsync(userId, skiResort);
            return Ok($"Korisnik {userId} pretplaćen na {skiResort}");
        }

        [HttpPost("unsubscribe")]
        public async Task<IActionResult> Unsubscribe([FromQuery] string userId, [FromQuery] string skiResort)
        {
            await _redis.RemoveSubscriptionAsync(userId, skiResort);
            return Ok($"Korisnik {userId} se odjavio sa {skiResort}");
        }

        [HttpGet("pretplate/{userId}")]
        public async Task<IActionResult> GetUserSubscriptions(string userId)
        {
            var result = await _redis.GetUserSubscriptionsAsync(userId);
            return Ok(result);
        }

    }
}
