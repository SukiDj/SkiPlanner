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

        [HttpGet("SviHoteli")]
        public async Task<IActionResult> SviHoteli()
        {
            var results = await _client.Cypher
                .Match("(h:Hotel)")
                .Return(h => h.As<string>())
                .ResultsAsync;

            return Ok(results);
        }
        [HttpPost]
        public async Task<IActionResult> CreateHotel(Hotel hotel)
        {
            // Automatski generišemo Guid ako nije poslat
            if (hotel.ID == Guid.Empty)
            {
                hotel.ID = Guid.NewGuid();
            }
            
            await _client.Cypher
                .Create("(h:Hotel {ID: $ID, Ime: $Ime, Ocena: $Ocena, Udaljenost: $Udaljenost, Cena: $Cena})")
                .WithParams(new
                {
                    hotel.ID,
                    hotel.Ime,
                    hotel.Ocena,
                    hotel.Udaljenost,
                    hotel.Cena
                })
                .ExecuteWithoutResultsAsync();

            return Ok(hotel);
        }


        // GET: api/Hotel/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetHotelById(Guid id)
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
    }
}