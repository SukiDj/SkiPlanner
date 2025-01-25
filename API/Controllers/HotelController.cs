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
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> VratiHotel(Guid id)
        {
            var hotels = await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == id)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            var hotel = hotels.SingleOrDefault();

            // if (hotel == null)
            //     return NotFound();

            return Ok(hotel);
        }

        [HttpPost]
        public async Task<IActionResult> KreirajHotel(Hotel hotel)
        {
            if (hotel.ID == Guid.Empty)
            {
                hotel.ID = Guid.NewGuid();
            }
            
            await _client.Cypher
                .Create("(h:Hotel {ID: $ID, Ime: $Ime, Ocena: $Ocena, Udaljenost: $Udaljenost, CenaDvokrevetneSobe: $CenaDvokrevetneSobe, CenaTrokrevetneSobe: $CenaTrokrevetneSobe, CenaCetvorokrevetneSobe: $CenaCetvorokrevetneSobe, CenaPetokrevetneSobe: $CenaPetokrevetneSobe, Lat: $Lat, Lng: $Lng})")
                .WithParams(new
                {
                    hotel.ID,
                    hotel.Ime,
                    hotel.Ocena,
                    hotel.Udaljenost,
                    hotel.CenaDvokrevetneSobe,
                    hotel.CenaTrokrevetneSobe,
                    hotel.CenaCetvorokrevetneSobe,
                    hotel.CenaPetokrevetneSobe,
                    hotel.Lat,
                    hotel.Lng
                })
                .ExecuteWithoutResultsAsync();

            // Pronađi i poveži slične hotele
            await _client.Cypher
                .Match("(h1:Hotel)", "(h2:Hotel)")
                .Where("h1.ID = $id AND h2.ID <> $id")
                .AndWhere("abs(h1.Ocena - h2.Ocena) <= 0.5")
                .AndWhere("abs(h1.Udaljenost - h2.Udaljenost) <= 100")
                .AndWhere("abs(h1.CenaDvokrevetneSobe - h2.CenaDvokrevetneSobe) <= 10")
                .Create("(h1)-[:SLICAN_HOTEL]->(h2)")
                .WithParam("id", hotel.ID)
                .ExecuteWithoutResultsAsync();

            return Ok(hotel);
        }

        [HttpPost("KreirajHotelNaSkijalistu/{idSkijalista}")]
        public async Task<IActionResult> KreirajHotelNaSkijalistu(Guid idSkijalista, Hotel hotel)
        {
            if (hotel.ID == Guid.Empty)
            {
                hotel.ID = Guid.NewGuid();
            }

            await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == idSkijalista)
                .Create("(h:Hotel {ID: $ID, Ime: $Ime, Ocena: $Ocena, Udaljenost: $Udaljenost, CenaDvokrevetneSobe: $CenaDvokrevetneSobe, CenaTrokrevetneSobe: $CenaTrokrevetneSobe, CenaCetvorokrevetneSobe: $CenaCetvorokrevetneSobe, CenaPetokrevetneSobe: $CenaPetokrevetneSobe, Lat: $Lat, Lng: $Lng})")
                .Create("(h)-[:NALAZI_SE_U]->(s)")
                .WithParams(new
                {
                    hotel.ID,
                    hotel.Ime,
                    hotel.Ocena,
                    hotel.Udaljenost,
                    hotel.CenaDvokrevetneSobe,
                    hotel.CenaTrokrevetneSobe,
                    hotel.CenaCetvorokrevetneSobe,
                    hotel.CenaPetokrevetneSobe,
                    hotel.Lat,
                    hotel.Lng
                })
                .ExecuteWithoutResultsAsync();

            // Pronađi i poveži slične hotele
            await _client.Cypher
                .Match("(h1:Hotel)", "(h2:Hotel)")
                .Where("h1.ID = $id AND h2.ID <> $id")
                .AndWhere("abs(h1.Ocena - h2.Ocena) <= 0.5")
                .AndWhere("abs(h1.Udaljenost - h2.Udaljenost) <= 100")
                .AndWhere("abs(h1.CenaDvokrevetneSobe - h2.CenaDvokrevetneSobe) <= 10")
                .Create("(h1)-[:SLICAN_HOTEL]->(h2)")
                .WithParam("id", hotel.ID)
                .ExecuteWithoutResultsAsync();


            return Ok(hotel);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AzurirajHotel(Guid id, Hotel azuriraniHotel)
        {
            var existingHotel = await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == id)
                .Return(h => h.As<Hotel>())
                .ResultsAsync;

            var hotel = existingHotel.SingleOrDefault();

            if (hotel == null)
                return NotFound($"Hotel sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(h:Hotel)")
                .Where((Hotel h) => h.ID == id)
                .Set("h = $azuriraniHotel")
                .WithParam("azuriraniHotel", new
                {
                    ID = id,
                    Ime = !string.IsNullOrEmpty(azuriraniHotel.Ime) ? azuriraniHotel.Ime : hotel.Ime,
                    Ocena = azuriraniHotel.Ocena != default ? azuriraniHotel.Ocena : hotel.Ocena,
                    Udaljenost = azuriraniHotel.Udaljenost != default ? azuriraniHotel.Udaljenost : hotel.Udaljenost,
                    CenaDvokrevetneSobe = azuriraniHotel.CenaDvokrevetneSobe != default ? azuriraniHotel.CenaDvokrevetneSobe : hotel.CenaDvokrevetneSobe,
                    CenaTrokrevetneSobe = azuriraniHotel.CenaTrokrevetneSobe != default ? azuriraniHotel.CenaTrokrevetneSobe : hotel.CenaTrokrevetneSobe,
                    CenaCetvorokrevetneSobe = azuriraniHotel.CenaCetvorokrevetneSobe != default ? azuriraniHotel.CenaCetvorokrevetneSobe : hotel.CenaCetvorokrevetneSobe,
                    CenaPetokrevetneSobe = azuriraniHotel.CenaPetokrevetneSobe != default ? azuriraniHotel.CenaPetokrevetneSobe : hotel.CenaPetokrevetneSobe,
                    Lat = azuriraniHotel.Lat != default ? azuriraniHotel.Lat : hotel.Lat,
                    Lng = azuriraniHotel.Lng != default ? azuriraniHotel.Lng : hotel.Lng
                })
                .ExecuteWithoutResultsAsync();

            // Obrisi postojeće veze sličnosti
            await _client.Cypher
                .Match("(h1:Hotel)-[r:SLICAN_HOTEL]-(h2:Hotel)")
                .Where("h1.ID = $id")
                .WithParam("id", id)
                .Delete("r")
                .ExecuteWithoutResultsAsync();

            // Pronađi i poveži slične hotele
            await _client.Cypher
                .Match("(h1:Hotel)", "(h2:Hotel)")
                .Where("h1.ID = $id AND h2.ID <> $id")
                .AndWhere("abs(h1.Ocena - h2.Ocena) <= 0.5")
                .AndWhere("abs(h1.Udaljenost - h2.Udaljenost) <= 100")
                .AndWhere("abs(h1.CenaDvokrevetneSobe - h2.CenaDvokrevetneSobe) <= 10")
                .Create("(h1)-[:SLICAN_HOTEL]->(h2)")
                .WithParam("id", hotel.ID)
                .ExecuteWithoutResultsAsync();


            return Ok($"Hotel sa ID-jem {id} je uspešno ažuriran.");
        }

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

            // if (!hotels.Any())
            //     return NotFound($"Nema hotela za skijalište sa ID-jem {skijalisteId}.");

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

        // Funkcija za dodavanje veza sa sličnim hotelima
        private async Task DodajVezeSaSlicnimHotelima(Hotel hotel)
        {
            await _client.Cypher
                .Match("(h:Hotel)")
                .Where("h.ID <> $ID")
                .AndWhere("abs(h.Ocena - $Ocena) <= 0.5")
                .AndWhere("abs(h.CenaDvokrevetneSobe - $CenaDvokrevetneSobe) <= 100")
                .Create("(h1:Hotel {ID: $ID})-[r:SLICAN]->(h)")
                .WithParams(new
                {
                    hotel.ID,
                    hotel.Ocena,
                    hotel.CenaDvokrevetneSobe
                })
                .ExecuteWithoutResultsAsync();
        }
    }
}