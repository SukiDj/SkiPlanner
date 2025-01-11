using Domain;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;

namespace API.Controllers
{
    public class HotelController : BaseApiController
    {
        private readonly IGraphClient _client;

        public HotelController(IGraphClient client)
        {
            _client = client;
        }

        [HttpGet("VratiSveHotele")]
        public async Task<IActionResult> VratiSveHotele()
        {
            var results = await _client.Cypher
                .Match("(h:Hotel)")
                .Return(h => h.As<string>())
                .ResultsAsync;

            return Ok(results);
        }

        // GET: api/Hotel/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> VratiHotel(Guid id)
        {
            var hotels = await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == id)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            var hotel = hotels.SingleOrDefault(); // Koristi LINQ za dohvaćanje jednog rezultata

            if (hotel == null)
                return NotFound();

            return Ok(hotel);
        }

        [HttpPost]
        public async Task<IActionResult> KreirajHotel(Hotel hotel)
        {
            // Automatski generišemo Guid ako nije poslat
            if (hotel.ID == Guid.Empty)
            {
                hotel.ID = Guid.NewGuid();
            }
            
            await _client.Cypher
                .Create("(h:Hotel {ID: $ID, Ime: $Ime, Ocena: $Ocena, Udaljenost: $Udaljenost, CenaDvokrevetneSobe: $CenaDvokrevetneSobe, CenaTrokrevetneSobe: $CenaTrokrevetneSobe, CenaCetvorokrevetneSobe: $CenaCetvorokrevetneSobe, CenaPetokrevetneSobe: $CenaPetokrevetneSobe})")
                .WithParams(new
                {
                    hotel.ID,
                    hotel.Ime,
                    hotel.Ocena,
                    hotel.Udaljenost,
                    hotel.CenaDvokrevetneSobe,
                    hotel.CenaTrokrevetneSobe,
                    hotel.CenaCetvorokrevetneSobe,
                    hotel.CenaPetokrevetneSobe
                })
                .ExecuteWithoutResultsAsync();

            return Ok(hotel);
        }

        // PUT: api/Hotel/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> AzurirajHotel(Guid id, Hotel azuriraniHotel)
        {
            var existingHotel = await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == id)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            if (existingHotel.SingleOrDefault() == null)
                return NotFound($"Hotel sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == id)
                .Set("h = $azuriraniHotel")
                .WithParam("azuriraniHotel", new
                {
                    ID = id,
                    azuriraniHotel.Ime,
                    azuriraniHotel.Ocena,
                    azuriraniHotel.Udaljenost,
                    azuriraniHotel.CenaDvokrevetneSobe,
                    azuriraniHotel.CenaTrokrevetneSobe,
                    azuriraniHotel.CenaCetvorokrevetneSobe,
                    azuriraniHotel.CenaPetokrevetneSobe
                })
                .ExecuteWithoutResultsAsync();

            return Ok($"Hotel sa ID-jem {id} je uspešno ažuriran.");
        }

        // DELETE: api/Hotel/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> ObrisiHotel(Guid id)
        {
            var existingHotel = await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == id)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            if (existingHotel.SingleOrDefault() == null)
                return NotFound($"Hotel sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == id)
                .Delete("h")
                .ExecuteWithoutResultsAsync();

            return Ok($"Hotel sa ID-jem {id} je uspešno obrisan.");
        }

        // POST: api/Hotel/PoveziSaSkijalistem
        [HttpPost("PoveziSaSkijalistem")]
        public async Task<IActionResult> PoveziHotelSaSkijalistem(Guid hotelId, Guid skijalisteId)
        {
            var hotelPostoji = await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == hotelId)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            if (!hotelPostoji.Any())
                return NotFound($"Hotel sa ID-jem {hotelId} ne postoji.");

            var skijalistePostoji = await _client.Cypher
                .Match("(sk:Skijaliste)")
                .Where((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(sk => sk.As<Skijaliste>())
                .ResultsAsync;

            if (!skijalistePostoji.Any())
                return NotFound($"Skijalište sa ID-jem {skijalisteId} ne postoji.");

            await _client.Cypher
                .Match("(h:Hotel)", "(sk:Skijaliste)")
                .Where((Hotel h) => h.ID == hotelId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Create("(h)-[:NALAZI_SE_U]->(sk)")
                .ExecuteWithoutResultsAsync();

            return Ok($"Hotel sa ID-jem {hotelId} je povezan sa skijalištem sa ID-jem {skijalisteId}.");
        }

        [HttpGet("Skijaliste/{skijalisteId}/Hoteli")]
        public async Task<IActionResult> VratiSveHoteleZaSkijaliste(Guid skijalisteId)
        {
            var hotels = await _client.Cypher
                .Match("(h:Hotel)-[:NALAZI_SE_U]->(sk:Skijaliste)")
                .Where((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            if (!hotels.Any())
                return NotFound($"Nema hotela za skijalište sa ID-jem {skijalisteId}.");

            return Ok(hotels);
        }

        [HttpGet("ProveriPovezanostSaSkijalistem/{hotelId}/{skijalisteId}")]
        public async Task<IActionResult> ProveriPovezanostSaSkijalistem(Guid hotelId, Guid skijalisteId)
        {
            var hotelPostoji = await _client.Cypher
                .Match("(h:Hotel)-[:NALAZI_SE_U]->(sk:Skijaliste)")
                .Where((Hotel h) => h.ID == hotelId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            if (!hotelPostoji.Any())
                return NotFound($"Hotel sa ID-jem {hotelId} nije povezan sa skijalištem sa ID-jem {skijalisteId}.");

            return Ok($"Hotel sa ID-jem {hotelId} je povezan sa skijalištem sa ID-jem {skijalisteId}.");
        }

        [HttpDelete("ObrisiVezuSaSkijalistem/{hotelId}/{skijalisteId}")]
        public async Task<IActionResult> ObrisiVezuSaSkijalistem(Guid hotelId, Guid skijalisteId)
        {
            var hotelPostoji = await _client.Cypher
                .Match("(h:Hotel)-[r:NALAZI_SE_U]->(sk:Skijaliste)")
                .Where((Hotel h) => h.ID == hotelId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Return(r => r.As<Hotel>())
                .ResultsAsync;

            if (!hotelPostoji.Any())
                return NotFound($"Veza između hotela sa ID-jem {hotelId} i skijališta sa ID-jem {skijalisteId} ne postoji.");

            await _client.Cypher
                .Match("(h:Hotel)-[r:NALAZI_SE_U]->(sk:Skijaliste)")
                .Where((Hotel h) => h.ID == hotelId)
                .AndWhere((Skijaliste sk) => sk.ID == skijalisteId)
                .Delete("r")
                .ExecuteWithoutResultsAsync();

            return Ok($"Veza između hotela sa ID-jem {hotelId} i skijališta sa ID-jem {skijalisteId} je uspešno obrisana.");
        }


    }
}