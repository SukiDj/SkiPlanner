using Application.Filters;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace API.Controllers
{
    public class KorisnikController : BaseApiController
    {
        private readonly IGraphClient _client;

        public KorisnikController(IGraphClient client)
        {
            _client = client;
        }

        [HttpPost("KreirajKorisnika")]
        public async Task<IActionResult> KreirajKorisnika(Korisnik korisnik)
        {
            if (korisnik.ID == Guid.Empty)
            {
                korisnik.ID = Guid.NewGuid();
            }

            await _client.Cypher
                .Create("(k:Korisnik {ID: $ID, Ime: $Ime, Email: $Email})")
                .WithParams(new
                {
                    korisnik.ID,
                    korisnik.ImePrezime,
                    korisnik.Email
                })
                .ExecuteWithoutResultsAsync();

            return Ok(korisnik);
        }

        [HttpPost("Poseti")]
        public async Task<IActionResult> Poseti([FromBody] PosetaZahtev zahtev)
        {
            // Provera da li korisnik postoji
            var korisnikPostoji = await _client.Cypher
                .Match("(k:Korisnik)")
                .Where((Korisnik k) => k.ID == zahtev.KorisnikID)
                .Return(k => k.As<Korisnik>())
                .ResultsAsync;

            if (!korisnikPostoji.Any())
            {
                return NotFound($"Korisnik sa ID-jem {zahtev.KorisnikID} ne postoji.");
            }

            // Provera da li skijalište postoji
            var skijalistePostoji = await _client.Cypher
                .Match("(sk:Skijaliste)")
                .Where((Skijaliste sk) => sk.ID == zahtev.SkijalisteID)
                .Return(sk => sk.As<Skijaliste>())
                .ResultsAsync;

            if (!skijalistePostoji.Any())
            {
                return NotFound($"Skijalište sa ID-jem {zahtev.SkijalisteID} ne postoji.");
            }

            // Provera da li hotel postoji
            var hotelPostoji = await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == zahtev.HotelID)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            if (!hotelPostoji.Any())
            {
                return NotFound($"Hotel sa ID-jem {zahtev.HotelID} ne postoji.");
            }

            // Provera da li restoran postoji
            var restoranPostoji = await _client.Cypher
                .Match("(r:Restoran)")
                .Where((Restoran r) => r.ID == zahtev.RestoranID)
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            if (!restoranPostoji.Any())
            {
                return NotFound($"Restoran sa ID-jem {zahtev.RestoranID} ne postoji.");
            }

            // Kreiranje veze između korisnika i skijališta
            await _client.Cypher
                .Match("(k:Korisnik)", "(sk:Skijaliste)")
                .Where((Korisnik k) => k.ID == zahtev.KorisnikID)
                .AndWhere((Skijaliste sk) => sk.ID == zahtev.SkijalisteID)
                .Merge("(k)-[:POSETIO]->(sk)")
                .ExecuteWithoutResultsAsync();

            // Kreiranje veze između korisnika i hotela
            await _client.Cypher
                .Match("(k:Korisnik)", "(h:Hotel)")
                .Where((Korisnik k) => k.ID == zahtev.KorisnikID)
                .AndWhere((Hotel h) => h.ID == zahtev.HotelID)
                .Merge("(k)-[:POSETIO]->(h)")
                .ExecuteWithoutResultsAsync();

            // Kreiranje veze između korisnika i restorana
            await _client.Cypher
                .Match("(k:Korisnik)", "(r:Restoran)")
                .Where((Korisnik k) => k.ID == zahtev.KorisnikID)
                .AndWhere((Restoran r) => r.ID == zahtev.RestoranID)
                .Merge("(k)-[:POSETIO]->(r)")
                .ExecuteWithoutResultsAsync();

            return Ok("Poseta uspešno zabeležena.");
        }

    }
}