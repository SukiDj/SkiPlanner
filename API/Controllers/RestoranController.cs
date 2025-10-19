using Domain;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace API.Controllers
{
    public class RestoranController : BaseApiController
    {
        private readonly IGraphClient _client;

        public RestoranController(IGraphClient client)
        {
            _client = client;
        }

        [HttpGet("VratiSveRestorane")]
        public async Task<IActionResult> VratiSveRestorane()
        {
            var results = await _client.Cypher
                .Match("(r:Restoran)")
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> VratiRestoran(Guid id)
        {
            var restorani = await _client.Cypher
                .Match("(r:Restoran)")
                .Where((Restoran r) => r.ID == id)
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            var restoran = restorani.SingleOrDefault();

            // if (restoran == null)
            //     return NotFound($"Restoran sa ID-jem {id} nije pronađen.");

            return Ok(restoran);
        }

        [HttpPost]
        public async Task<IActionResult> KreirajRestoran(Restoran restoran)
        {
            if (restoran.ID == Guid.Empty)
            {
                restoran.ID = Guid.NewGuid();
            }

            await _client.Cypher
                .Create("(r:Restoran {ID: $ID, Naziv: $Naziv, TipKuhinje: $TipKuhinje, Ocena: $Ocena, ProsecnaCena: $ProsecnaCena, Lat: $Lat, Lng: $Lng})")
                .WithParams(new
                {
                    restoran.ID,
                    restoran.Naziv,
                    restoran.TipKuhinje,
                    restoran.Ocena,
                    restoran.ProsecnaCena,
                    restoran.Lat,
                    restoran.Lng
                })
                .ExecuteWithoutResultsAsync();

            // Pronađi i poveži slične restorane
            await _client.Cypher
                .Match("(r1:Restoran)", "(r2:Restoran)")
                .Where("r1.ID = $id AND r2.ID <> $id")
                .AndWhere("r1.TipKuhinje = r2.TipKuhinje")
                .AndWhere("abs(r1.Ocena - r2.Ocena) <= 0.7")
                .AndWhere("abs(r1.ProsecnaCena - r2.ProsecnaCena) <= 500")
                .Create("(r1)-[:SLICAN_RESTORAN]->(r2)")
                .WithParam("id", restoran.ID)
                .ExecuteWithoutResultsAsync();

            return Ok(restoran);
        }

        [HttpPost("KreirajRestoranNaSkijalistu/{idSkijalista}")]
        public async Task<IActionResult> KreirajRestoranNaSkijalistu(Guid idSkijalista, Restoran restoran)
        {
            if (restoran.ID == Guid.Empty)
            {
                restoran.ID = Guid.NewGuid();
            }

            await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == idSkijalista)
                .Create("(r:Restoran {ID: $ID, Naziv: $Naziv, TipKuhinje: $TipKuhinje, Ocena: $Ocena, ProsecnaCena: $ProsecnaCena, Lat: $Lat, Lng: $Lng})")
                .Create("(r)-[:PRIPADA]->(s)")
                .WithParams(new
                {
                    restoran.ID,
                    restoran.Naziv,
                    restoran.TipKuhinje,
                    restoran.Ocena,
                    restoran.ProsecnaCena,
                    restoran.Lat,
                    restoran.Lng
                })
                .ExecuteWithoutResultsAsync();

            // Pronađi i poveži slične restorane
            await _client.Cypher
                .Match("(r1:Restoran)", "(r2:Restoran)")
                .Where("r1.ID = $id AND r2.ID <> $id")
                .AndWhere("r1.TipKuhinje = r2.TipKuhinje")
                .AndWhere("abs(r1.Ocena - r2.Ocena) <= 0.7")
                .AndWhere("abs(r1.ProsecnaCena - r2.ProsecnaCena) <= 500")
                .Create("(r1)-[:SLICAN_RESTORAN]->(r2)")
                .WithParam("id", restoran.ID)
                .ExecuteWithoutResultsAsync();

            return Ok(restoran);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AzurirajRestoran(Guid id, Restoran azuriraniRestoran)
        {
            var existingRestoran = await _client.Cypher
                .Match("(r:Restoran)")
                .Where((Restoran r) => r.ID == id)
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            var restoran = existingRestoran.SingleOrDefault();

            if (restoran == null)
                return NotFound($"Restoran sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(r:Restoran)")
                .Where((Restoran r) => r.ID == id)
                .Set("r = $azuriraniRestoran")
                .WithParam("azuriraniRestoran", new
                {
                    ID = id,
                    Naziv = !string.IsNullOrEmpty(azuriraniRestoran.Naziv) ? azuriraniRestoran.Naziv : restoran.Naziv,
                    TipKuhinje = !string.IsNullOrEmpty(azuriraniRestoran.TipKuhinje) ? azuriraniRestoran.TipKuhinje : restoran.TipKuhinje,
                    Ocena = azuriraniRestoran.Ocena != default ? azuriraniRestoran.Ocena : restoran.Ocena,
                    ProsecnaCena = azuriraniRestoran.ProsecnaCena != default ? azuriraniRestoran.ProsecnaCena : restoran.ProsecnaCena,
                    Lat = azuriraniRestoran.Lat != default ? azuriraniRestoran.Lat : restoran.Lat,
                    Lng = azuriraniRestoran.Lng != default ? azuriraniRestoran.Lng : restoran.Lng
                })
                .ExecuteWithoutResultsAsync();

            // Obrisi postojeće veze sličnosti
            await _client.Cypher
                .Match("(r1:Restoran)-[s:SLICAN_RESTORAN]-(r2:Restoran)")
                .Where("r1.ID = $id")
                .WithParam("id", id)
                .Delete("s")
                .ExecuteWithoutResultsAsync();

            // Pronađi i poveži slične restorane
            await _client.Cypher
                .Match("(r1:Restoran)", "(r2:Restoran)")
                .Where("r1.ID = $id AND r2.ID <> $id")
                .AndWhere("r1.TipKuhinje = r2.TipKuhinje")
                .AndWhere("abs(r1.Ocena - r2.Ocena) <= 0.7")
                .AndWhere("abs(r1.ProsecnaCena - r2.ProsecnaCena) <= 500")
                .Create("(r1)-[:SLICAN_RESTORAN]->(r2)")
                .WithParam("id", restoran.ID)
                .ExecuteWithoutResultsAsync();

            return Ok($"Restoran sa ID-jem {id} je uspešno ažuriran.");
        }

        // [HttpDelete("{id}")]
        // public async Task<IActionResult> ObrisiRestoran(Guid id)
        // {
        //     var existingRestoran = await _client.Cypher
        //         .Match("(r:Restoran)")
        //         .Where((Restoran r) => r.ID == id)
        //         .Return(r => r.As<Restoran>())
        //         .ResultsAsync;

        //     if (existingRestoran.SingleOrDefault() == null)
        //         return NotFound($"Restoran sa ID-jem {id} ne postoji.");

        //     await _client.Cypher
        //         .Match("(r:Restoran)")
        //         .Where((Restoran r) => r.ID == id)
        //         .Delete("r")
        //         .ExecuteWithoutResultsAsync();

        //     return Ok($"Restoran sa ID-jem {id} je uspešno obrisan.");
        // }
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiRestoran(Guid id)
        {
            var existingRestoran = await _client.Cypher
                .Match("(r:Restoran)")
                .Where((Restoran r) => r.ID == id)
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            if (existingRestoran.SingleOrDefault() == null)
                return NotFound($"Restoran sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(r:Restoran)")
                .Where((Restoran r) => r.ID == id)
                .DetachDelete("r")   // <-- OVDE PROMENA
                .ExecuteWithoutResultsAsync();

            return Ok($"Restoran sa ID-jem {id} je uspešno obrisan.");
        }


        [HttpPost("PoveziSaSkijalistem")]
        public async Task<IActionResult> PoveziRestoranSaSkijalistem(Guid restoranId, Guid skijalisteId)
        {
            var restoranExists = await _client.Cypher
                .Match("(r:Restoran)")
                .Where((Restoran r) => r.ID == restoranId)
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            if (!restoranExists.Any())
                return NotFound($"Restoran sa ID-jem {restoranId} ne postoji.");

            var skijalisteExists = await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == skijalisteId)
                .Return(s => s.As<Skijaliste>())
                .ResultsAsync;

            if (!skijalisteExists.Any())
                return NotFound($"Skijalište sa ID-jem {skijalisteId} ne postoji.");

            await _client.Cypher
                .Match("(r:Restoran)", "(s:Skijaliste)")
                .Where((Restoran r) => r.ID == restoranId)
                .AndWhere((Skijaliste s) => s.ID == skijalisteId)
                .Create("(r)-[:PRIPADA]->(s)")
                .ExecuteWithoutResultsAsync();

            return Ok($"Restoran sa ID-jem {restoranId} je povezan sa skijalištem {skijalisteId}.");
        }

        [HttpGet("Skijaliste/{skijalisteId}/Restorani")]
        public async Task<IActionResult> VratiSveRestoraneZaSkijaliste(Guid skijalisteId)
        {
            var restorani = await _client.Cypher
                .Match("(r:Restoran)-[:PRIPADA]->(sk:Skijaliste)")
                .Where((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            // if (!restorani.Any())
            //     return NotFound($"Nema restorana za skijalište sa ID-jem {skijalisteId}.");

            return Ok(restorani);
        }

        [HttpGet("ProveriPovezanostSaSkijalistem/{restoranId}/{skijalisteId}")]
        public async Task<IActionResult> ProveriPovezanostSaSkijalistem(Guid restoranId, Guid skijalisteId)
        {
            var restoranPostoji = await _client.Cypher
                .Match("(r:Restoran)-[:PRIPADA]->(sk:Skijaliste)")
                .Where((Restoran r) => r.ID == restoranId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            if (!restoranPostoji.Any())
                return NotFound($"Restoran sa ID-jem {restoranId} nije povezan sa skijalištem sa ID-jem {skijalisteId}.");

            return Ok($"Restoran sa ID-jem {restoranId} je povezan sa skijalištem sa ID-jem {skijalisteId}.");
        }

        [HttpDelete("ObrisiVezuSaSkijalistem/{restoranId}/{skijalisteId}")]
        public async Task<IActionResult> ObrisiVezuSaSkijalistem(Guid restoranId, Guid skijalisteId)
        {
            var restoranPostoji = await _client.Cypher
                .Match("(r:Restoran)-[r:PRIPADA]->(sk:Skijaliste)")
                .Where((Restoran r) => r.ID == restoranId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(r => r.As<Restoran>())
                .ResultsAsync;

            if (!restoranPostoji.Any())
                return NotFound($"Veza između restorana sa ID-jem {restoranId} i skijališta sa ID-jem {skijalisteId} ne postoji.");

            await _client.Cypher
                .Match("(r:Restoran)-[r:PRIPADA]->(sk:Skijaliste)")
                .Where((Restoran r) => r.ID == restoranId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Delete("r")
                .ExecuteWithoutResultsAsync();

            return Ok($"Veza između restorana sa ID-jem {restoranId} i skijališta sa ID-jem {skijalisteId} je uspešno obrisana.");
        }
    }
}
