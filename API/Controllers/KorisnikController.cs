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

    }
}