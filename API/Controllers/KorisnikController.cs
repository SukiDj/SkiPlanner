using API.DTOs;
using Application.Filters;
using Domain;
using Microsoft.AspNetCore.Mvc;
using Neo4jClient;
using Neo4jClient.Cypher;
using API.Services;

namespace API.Controllers
{
    public class KorisnikController : BaseApiController
    {
        private readonly IGraphClient _client;
        private readonly TokenService _tokenService;
        public KorisnikController(IGraphClient client, TokenService tokenService)
        {
            _client = client;
            _tokenService = tokenService;
        }

        [HttpGet("Korisnici")]
        public async Task<IActionResult> VratiSveKorisnike()
        {
            var korisnici = await _client.Cypher
                .Match("(k:Korisnik)-[:IMA_ULOGU]->(r)")
                .Return((k, r) => new
                {
                    Korisnik = k.As<Korisnik>(),
                    Uloga = Return.As<string>("labels(r)[0]")
                })
                .ResultsAsync;

            var korisniciDto = korisnici.Select(x => new KorisnikDto
            {
                ID = x.Korisnik.ID,
                Ime = x.Korisnik.Ime,
                Prezime = x.Korisnik.Prezime,
                Email = x.Korisnik.Email,
                Telefon = x.Korisnik.Telefon,
                Username = x.Korisnik.Username,
                Uloga = x.Uloga
            });

            return Ok(korisniciDto);
        }

        [HttpPost("RegistrujKorisnika")]
        public async Task<IActionResult> RegistrujKorisnika([FromBody] RegistracijaDto dto)
        {
            var postojeciKorisnici = await _client.Cypher
                .Match("(k:Korisnik)")
                .Where((Korisnik k) => k.Username == dto.Username || k.Email == dto.Email || k.Telefon == dto.Telefon)
                .Return(k => k.As<Korisnik>())
                .ResultsAsync;

            var postojeciKorisnik = postojeciKorisnici.SingleOrDefault();

            if (postojeciKorisnik != null)
            {
                return BadRequest("Korisnik sa unetim podacima vec postoji.");
            }

            var id = Guid.NewGuid();
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            await _client.Cypher
                .Merge($"(uloga:{dto.Uloga})")
                .Merge("(k:Korisnik {ID: $ID})")
                .OnCreate()
                .Set("k = $korisnikData")
                .Merge("(k)-[:IMA_ULOGU]->(uloga)")
                .WithParams(new
                {
                    ID = id,
                    korisnikData = new
                    {
                        ID = id,
                        Ime = dto.Ime,
                        Prezime = dto.Prezime,
                        Telefon = dto.Telefon,
                        Email = dto.Email,
                        Username = dto.Username,
                        Password = hashedPassword
                    }
                })
                .ExecuteWithoutResultsAsync();

            return Ok(new { Message = "Korisnik uspesno registrovan." });
        }

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginZahtev loginPodaci)
        {
            if (string.IsNullOrWhiteSpace(loginPodaci.Email) || string.IsNullOrWhiteSpace(loginPodaci.Password))
            {
                return BadRequest(new { Message = "Email i lozinka su obavezni" });
            }

            var korisnici = await _client.Cypher
                .Match("(k:Korisnik)")
                .Where((Korisnik k) => k.Email == loginPodaci.Email)
                .Return(k => k.As<Korisnik>())
                .ResultsAsync;

            var korisnik = korisnici.SingleOrDefault();

            if (korisnik == null || !BCrypt.Net.BCrypt.Verify(loginPodaci.Password, korisnik.Password))
            {
                return Unauthorized(new { Message = "Neispravan email ili lozinka" });
            }

            var role = await _client.Cypher
                .Match("(k:Korisnik)-[:IMA_ULOGU]->(r)")
                .Where((Korisnik k) => k.ID == korisnik.ID)
                .Return(r => Return.As<string>("labels(r)[0]"))  //rola kao string
                .ResultsAsync;

            var korisnikUloga = role.SingleOrDefault() ?? "NepoznataUloga";

            var token = await _tokenService.CreateToken(korisnik, korisnikUloga);

            return Ok(new
            {
                Message = "Uspešna prijava",
                Token = token,
                Korisnik = new
                {
                    korisnik.ID,
                    korisnik.Ime,
                    korisnik.Prezime,
                    korisnik.Email,
                    korisnik.Telefon,
                    korisnik.Username,
                    Uloga = korisnikUloga
                }
            });
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

        [HttpGet("{korisnikId}/Preporuke")]
        public async Task<IActionResult> Preporuke(Guid korisnikId)
        {
            // Provera da li korisnik postoji
            var korisnikPostoji = await _client.Cypher
                .Match("(k:Korisnik)")
                .Where((Korisnik k) => k.ID == korisnikId)
                .Return(k => k.As<Korisnik>())
                .ResultsAsync;

            if (!korisnikPostoji.Any())
            {
                return NotFound($"Korisnik sa ID-jem {korisnikId} ne postoji.");
            }

            var preporuke = new List<Preporuka>();

            var posecenaSkijalista = await _client.Cypher
                .Match("(k:Korisnik)-[:POSETIO]->(p:Skijaliste)")
                .Where("k.ID = $korisnikId")
                .WithParam("korisnikId", korisnikId)
                .Return(p => p.As<Skijaliste>())
                .ResultsAsync;

            var listaSkijalista = new List<Skijaliste>(posecenaSkijalista);
            
            var slicnaSkijalista = await _client.Cypher
                .Match("(k:Korisnik)-[:POSETIO]->(p:Skijaliste)")
                .Match("(p)-[:SLICNO_SKIJALISTE]-(slicno:Skijaliste)")
                .Where("k.ID = $korisnikId")// NOT EXISTS((k)-[:POSETIO]->(slicno)) AND 
                .WithParam("korisnikId", korisnikId)
                .Return(slicno => slicno.As<Skijaliste>())
                .ResultsAsync;

            listaSkijalista.AddRange(slicnaSkijalista);


            foreach (var skijaliste in listaSkijalista)
            {
                var listaHotela = new List<Hotel>();
                var listaRestorana = new List<Restoran>();

                var poseceniHoteli = await _client.Cypher
                    .Match("(k:Korisnik)-[:POSETIO]->(h:Hotel)")
                    .Match("(h)-[:NALAZI_SE_U]->(skij:Skijaliste)")
                    .Where("skij.ID = $skijalisteId AND k.ID = $korId")
                    .WithParams(new
                    {
                        skijalisteId = skijaliste.ID,
                        korId = korisnikId
                    })
                    .Return(h => h.As<Hotel>())
                    .ResultsAsync;

                listaHotela.AddRange(poseceniHoteli);
                
                var slicniHoteli = await _client.Cypher
                    .Match("(k:Korisnik)-[:POSETIO]->(h:Hotel)")
                    .Match("(h)-[:SLICAN_HOTEL]-(slicno:Hotel)")
                    .Match("(slicno)-[:NALAZI_SE_U]->(skij:Skijaliste)")
                    .Where("skij.ID = $skijalisteId AND k.ID = $korId")//  AND NOT EXISTS((k)-[:POSETIO]->(slicno))
                    .WithParams(new
                    {
                        skijalisteId = skijaliste.ID,
                        korId = korisnikId
                    })
                    .Return(slicno => slicno.As<Hotel>())
                    .ResultsAsync;

                
                listaHotela.AddRange(slicniHoteli);


                var poseceniRestorani = await _client.Cypher
                    .Match("(k:Korisnik)-[:POSETIO]->(r:Restoran)")
                    .Match("(r)-[:PRIPADA]->(skij:Skijaliste)")
                    .Where("skij.ID = $skijalisteId AND k.ID = $korId")
                    .WithParams(new
                    {
                        skijalisteId = skijaliste.ID,
                        korId = korisnikId
                    })
                    .Return(r => r.As<Restoran>())
                    .ResultsAsync;

                listaRestorana.AddRange(poseceniRestorani);
                
                var slicniRestorani = await _client.Cypher
                    .Match("(k:Korisnik)-[:POSETIO]->(r:Restoran)")
                    .Match("(r)-[:SLICAN_RESTORAN]-(slicno:Restoran)")
                    .Match("(slicno)-[:PRIPADA]->(skij:Skijaliste)")
                    .Where("skij.ID = $skijalisteId AND k.ID = $korId")//  AND NOT EXISTS((k)-[:POSETIO]->(slicno))
                    .WithParams(new
                    {
                        skijalisteId = skijaliste.ID,
                        korId = korisnikId
                    })
                    .Return(slicno => slicno.As<Restoran>())
                    .ResultsAsync;

                listaRestorana.AddRange(slicniRestorani);

                var preporuka = new Preporuka
                {
                    Skijaliste = skijaliste,
                    Hoteli = listaHotela,
                    Restorani = listaRestorana
                };

                preporuke.Add(preporuka);
            }

            return Ok(preporuke);
        }
    }
}