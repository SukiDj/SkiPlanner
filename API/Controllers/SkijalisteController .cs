using Domain;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace API.Controllers
{
    public class SkijalisteController : BaseApiController
    {
        private readonly IGraphClient _client;

        public SkijalisteController(IGraphClient client)
        {
            _client = client;
        }

        // GET: api/Skijaliste
        [HttpGet("VratiSvaSkijalista")]
        public async Task<IActionResult> VratiSvaSkijalista()
        {
            var results = await _client.Cypher
                .Match("(s:Skijaliste)")
                .Return(s => s.As<Skijaliste>())
                .ResultsAsync;

            return Ok(results);
        }

        // GET: api/Skijaliste/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> VratiSkijaliste(Guid id)
        {
            var skijalista = await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == id)
                .Return(s => s.As<Skijaliste>())
                .ResultsAsync;

            var skijaliste = skijalista.SingleOrDefault();

            if (skijaliste == null)
                return NotFound($"Skijalište sa ID-jem {id} nije pronađeno.");

            return Ok(skijaliste);
        }

        // POST: api/Skijaliste
        [HttpPost]
        public async Task<IActionResult> KreirajSkijaliste(Skijaliste skijaliste)
        {
            // Automatski generišemo Guid ako nije poslat
            if (skijaliste.ID == Guid.Empty)
            {
                skijaliste.ID = Guid.NewGuid();
            }

            await _client.Cypher
                .Create("(s:Skijaliste {ID: $ID, Ime: $Ime, Lokacija: $Lokacija, Popularnost: $Popularnost, CenaSkiPasa: $CenaSkiPasa, BrojStaza: $BrojStaza})")
                .WithParams(new
                {
                    skijaliste.ID,
                    skijaliste.Ime,
                    skijaliste.Lokacija,
                    skijaliste.Popularnost,
                    skijaliste.CenaSkiPasa,
                    skijaliste.BrojStaza
                })
                .ExecuteWithoutResultsAsync();

            return Ok(skijaliste);
        }

        // PUT: api/Skijaliste/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> AzurirajSkijaliste(Guid id, Skijaliste azuriranoSkijaliste)
        {
            var existingSkijaliste = await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == id)
                .Return(s => s.As<Skijaliste>())
                .ResultsAsync;

            if (existingSkijaliste.SingleOrDefault() == null)
                return NotFound($"Skijalište sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == id)
                .Set("s = $azuriranoSkijaliste")
                .WithParam("azuriranoSkijaliste", new
                {
                    ID = id,
                    azuriranoSkijaliste.Ime,
                    azuriranoSkijaliste.Lokacija,
                    azuriranoSkijaliste.Popularnost,
                    azuriranoSkijaliste.CenaSkiPasa,
                    azuriranoSkijaliste.BrojStaza
                })
                .ExecuteWithoutResultsAsync();

            return Ok($"Skijalište sa ID-jem {id} je uspešno ažurirano.");
        }

        // DELETE: api/Skijaliste/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiSkijaliste(Guid id)
        {
            var existingSkijaliste = await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == id)
                .Return(s => s.As<Skijaliste>())
                .ResultsAsync;

            if (existingSkijaliste.SingleOrDefault() == null)
                return NotFound($"Skijalište sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == id)
                .Delete("s")
                .ExecuteWithoutResultsAsync();

            return Ok($"Skijalište sa ID-jem {id} je uspešno obrisano.");
        }
    }
}
