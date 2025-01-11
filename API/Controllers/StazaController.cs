using Domain;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace API.Controllers
{
    public class StazaController : BaseApiController
    {
        private readonly IGraphClient _client;

        public StazaController(IGraphClient client)
        {
            _client = client;
        }

        // GET: api/Staza/VratiSveStaze
        [HttpGet("VratiSveStaze")]
        public async Task<IActionResult> VratiSveStaze()
        {
            var staze = await _client.Cypher
                .Match("(s:Staza)")
                .Return(s => s.As<Staza>())
                .ResultsAsync;

            return Ok(staze);
        }

        // POST: api/Staza/Kreiraj
        [HttpPost("Kreiraj")]
        public async Task<IActionResult> KreirajStazu(Staza staza)
        {
            // Automatski generiši ID ako nije postavljen
            if (staza.ID == Guid.Empty)
            {
                staza.ID = Guid.NewGuid();
            }

            await _client.Cypher
                .Create("(s:Staza {ID: $ID, Naziv: $Naziv, Tezina: $Tezina, Duzina: $Duzina})")
                .WithParams(new
                {
                    staza.ID,
                    staza.Naziv,
                    staza.Tezina,
                    staza.Duzina
                })
                .ExecuteWithoutResultsAsync();

            return Ok(staza);
        }

        // GET: api/Staza/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> VratiStazu(Guid id)
        {
            var staza = await _client.Cypher
                .Match("(s:Staza)")
                .Where((Staza s) => s.ID == id)
                .Return(s => s.As<Staza>())
                .ResultsAsync;

            var rezultat = staza.SingleOrDefault();

            if (rezultat == null)
                return NotFound();

            return Ok(rezultat);
        }

        // PUT: api/Staza/Izmeni/{id}
        [HttpPut("Izmeni/{id}")]
        public async Task<IActionResult> IzmeniStazu(Guid id, Staza staza)
        {
            var postoji = await _client.Cypher
                .Match("(s:Staza)")
                .Where((Staza s) => s.ID == id)
                .Return(s => s.As<Staza>())
                .ResultsAsync;

            if (!postoji.Any())
                return NotFound($"Staza sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(s:Staza)")
                .Where((Staza s) => s.ID == id)
                .Set("s = $staza")
                .WithParam("staza", new
                {
                    staza.ID,
                    staza.Naziv,
                    staza.Tezina,
                    staza.Duzina
                })
                .ExecuteWithoutResultsAsync();

            return Ok(staza);
        }

        // DELETE: api/Staza/Obrisi/{id}
        [HttpDelete("Obrisi/{id}")]
        public async Task<IActionResult> ObrisiStazu(Guid id)
        {
            var postoji = await _client.Cypher
                .Match("(s:Staza)")
                .Where((Staza s) => s.ID == id)
                .Return(s => s.As<Staza>())
                .ResultsAsync;

            if (!postoji.Any())
                return NotFound($"Staza sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(s:Staza)")
                .Where((Staza s) => s.ID == id)
                .DetachDelete("s")
                .ExecuteWithoutResultsAsync();

            return Ok($"Staza sa ID-jem {id} je uspešno obrisana.");
        }

        // POST: api/Staza/PoveziSaSkijalistem
        [HttpPost("PoveziSaSkijalistem")]
        public async Task<IActionResult> PoveziStazuSaSkijalistem(Guid stazaId, Guid skijalisteId)
        {
            var stazaPostoji = await _client.Cypher
                .Match("(s:Staza)")
                .Where((Staza s) => s.ID == stazaId)
                .Return(s => s.As<Staza>())
                .ResultsAsync;

            if (!stazaPostoji.Any())
                return NotFound($"Staza sa ID-jem {stazaId} ne postoji.");

            var skijalistePostoji = await _client.Cypher
                .Match("(sk:Skijaliste)")
                .Where((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(sk => sk.As<Skijaliste>())
                .ResultsAsync;

            if (!skijalistePostoji.Any())
                return NotFound($"Skijalište sa ID-jem {skijalisteId} ne postoji.");

            await _client.Cypher
                .Match("(s:Staza)", "(sk:Skijaliste)")
                .Where((Staza s) => s.ID == stazaId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Create("(s)-[:PRIPADA]->(sk)")
                .ExecuteWithoutResultsAsync();

            return Ok($"Staza sa ID-jem {stazaId} je povezana sa skijalištem sa ID-jem {skijalisteId}.");
        }

        [HttpGet("VratiStazeZaSkijaliste/{skijalisteId}")]
        public async Task<IActionResult> VratiStazeZaSkijaliste(Guid skijalisteId)
        {
            var staze = await _client.Cypher
                .Match("(s:Staza)-[:PRIPADA]->(sk:Skijaliste)")
                .Where((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(s => s.As<Staza>())
                .ResultsAsync;

            return Ok(staze);
        }

        [HttpGet("ProveriPovezanost")]
        public async Task<IActionResult> ProveriPovezanost(Guid stazaId, Guid skijalisteId)
        {
            var postojiVeza = await _client.Cypher
                .Match("(s:Staza)-[:PRIPADA]->(sk:Skijaliste)")
                .Where((Staza s) => s.ID == stazaId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(s => s.As<Staza>())
                .ResultsAsync;

            if (!postojiVeza.Any())
                return NotFound("Nema veze između zadate staze i skijališta.");

            return Ok("Veza postoji.");
        }

        [HttpDelete("UkloniPovezanost")]
        public async Task<IActionResult> UkloniPovezanost(Guid stazaId, Guid skijalisteId)
        {
            await _client.Cypher
                .Match("(s:Staza)-[r:PRIPADA]->(sk:Skijaliste)")
                .Where((Staza s) => s.ID == stazaId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Delete("r")
                .ExecuteWithoutResultsAsync();

            return Ok($"Veza između staze sa ID-jem {stazaId} i skijališta sa ID-jem {skijalisteId} je uklonjena.");
        }
    }
}
