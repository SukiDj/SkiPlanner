using Application.Filters;
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

        [HttpGet("VratiSvaSkijalista")]
        public async Task<IActionResult> VratiSvaSkijalista()
        {
            var results = await _client.Cypher
                .Match("(s:Skijaliste)")
                .Return(s => s.As<Skijaliste>())
                .ResultsAsync;

            return Ok(results);
        }

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

        [HttpPost]
        public async Task<IActionResult> KreirajSkijaliste(Skijaliste skijaliste)
        {
            // Automatski generišemo Guid ako nije poslat
            if (skijaliste.ID == Guid.Empty)
            {
                skijaliste.ID = Guid.NewGuid();
            }

            await _client.Cypher
                .Create("(s:Skijaliste {ID: $ID, Ime: $Ime, Popularnost: $Popularnost, CenaSkiPasa: $CenaSkiPasa, BrojStaza: 0, Lat: $Lat, Lng: $Lng})")
                .WithParams(new
                {
                    skijaliste.ID,
                    skijaliste.Ime,
                    skijaliste.Popularnost,
                    skijaliste.CenaSkiPasa,
                    skijaliste.Lat,
                    skijaliste.Lng
                })
                .ExecuteWithoutResultsAsync();

            // Pronađi i poveži slična skijališta
            await _client.Cypher
                .Match("(s1:Skijaliste)", "(s2:Skijaliste)")
                .Where("s1.ID = $id AND s2.ID <> $id")
                .AndWhere("abs(s1.CenaSkiPasa - s2.CenaSkiPasa) < 5")
                .AndWhere("abs(s1.Popularnost - s2.Popularnost) < 5")
                //.AndWhere("abs(s1.BrojStaza - s2.BrojStaza) < 5")
                .Create("(s1)-[:SLICNO_SKIJALISTE]->(s2)")
                .WithParam("id", skijaliste.ID)
                .ExecuteWithoutResultsAsync();

            return Ok(skijaliste);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> AzurirajSkijaliste(Guid id, Skijaliste azuriranoSkijaliste)
        {
            var existingSkijaliste = await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == id)
                .Return(s => s.As<Skijaliste>())
                .ResultsAsync;

            var skijaliste = existingSkijaliste.SingleOrDefault();

            if (skijaliste == null)
                return NotFound($"Skijalište sa ID-jem {id} ne postoji.");

            await _client.Cypher
                .Match("(s:Skijaliste)")
                .Where((Skijaliste s) => s.ID == id)
                .Set("s = $azuriranoSkijaliste")
                .WithParam("azuriranoSkijaliste", new
                {
                    ID = id,
                    Ime = !string.IsNullOrEmpty(azuriranoSkijaliste.Ime) ? azuriranoSkijaliste.Ime : skijaliste.Ime,
                    Popularnost = azuriranoSkijaliste.Popularnost != default ? azuriranoSkijaliste.Popularnost : skijaliste.Popularnost,
                    CenaSkiPasa = azuriranoSkijaliste.CenaSkiPasa != default ? azuriranoSkijaliste.CenaSkiPasa : skijaliste.CenaSkiPasa,
                    Lat = azuriranoSkijaliste.Lat != default ? azuriranoSkijaliste.Lat : skijaliste.Lat,
                    Lng = azuriranoSkijaliste.Lng != default ? azuriranoSkijaliste.Lng : skijaliste.Lng
                })
                .ExecuteWithoutResultsAsync();

            // Obrisi postojeće veze sličnosti
            await _client.Cypher
                .Match("(s1:Skijaliste)-[r:SLICNO_SKIJALISTE]-(s2:Skijaliste)")
                .Where("s1.ID = $id")
                .WithParam("id", id)
                .Delete("r")
                .ExecuteWithoutResultsAsync();

            // Kreiraj nove veze sličnosti
            await _client.Cypher
                .Match("(s1:Skijaliste)", "(s2:Skijaliste)")
                .Where("s1.ID = $id AND s2.ID <> $id")
                .AndWhere("abs(s1.CenaSkiPasa - s2.CenaSkiPasa) < 5")
                .AndWhere("abs(s1.Popularnost - s2.Popularnost) < 5")
                //.AndWhere("abs(s1.BrojStaza - s2.BrojStaza) < 5")
                .Create("(s1)-[:SLICNO_SKIJALISTE]->(s2)")
                .WithParam("id", id)
                .ExecuteWithoutResultsAsync();

            return Ok($"Skijalište sa ID-jem {id} je uspešno ažurirano.");
        }

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

            // Brisanje skijališta sa svim povezanim hotelima, restoranima i stazama
            await _client.Cypher
                .Match("(s:Skijaliste)<-[r]-(x)")
                .Where((Skijaliste s) => s.ID == id)
                .DetachDelete("s, x")
                .ExecuteWithoutResultsAsync();

            return Ok($"Skijalište sa ID-jem {id} i svi povezani entiteti su uspešno obrisani.");
        }


        [HttpPost("FiltrirajOpcijeZaZimovanje")]
        public async Task<IActionResult> FiltrirajOpcijeZaZimovanje([FromBody] ZahtevZaFiltriranje zahtev)
        {
            var skijalistaQuery = _client.Cypher
                .Match("(sk:Skijaliste)");

            if (zahtev.IDSkijalista == Guid.Empty)
                skijalistaQuery = skijalistaQuery.Where((Skijaliste sk) => sk.ID == zahtev.IDSkijalista);


            if (zahtev.MinBrojStaza.HasValue)
                skijalistaQuery = skijalistaQuery.Where((Skijaliste sk) => sk.BrojStaza >= zahtev.MinBrojStaza);

            var skijalista = await skijalistaQuery.Return(sk => sk.As<Skijaliste>()).ResultsAsync;

            var opcije = new List<OpcionaPonuda>();

            foreach (var skijaliste in skijalista)
            {
                // Dohvati sve staze za skijalište koje odgovaraju težini i dužini
                var stazeQuery = _client.Cypher
                    .Match("(s:Staza)-[:PRIPADA]->(sk:Skijaliste)")
                    .Where((Skijaliste sk) => sk.ID == skijaliste.ID);

                if (!string.IsNullOrEmpty(zahtev.Tezina))
                    stazeQuery = stazeQuery.AndWhere((Staza s) => s.Tezina == zahtev.Tezina);

                if (zahtev.MinDuzinaStaze.HasValue)
                    stazeQuery = stazeQuery.AndWhere((Staza s) => s.Duzina >= zahtev.MinDuzinaStaze);

                if (zahtev.MaxDuzinaStaze.HasValue)
                    stazeQuery = stazeQuery.AndWhere((Staza s) => s.Duzina <= zahtev.MaxDuzinaStaze);

                var staze = await stazeQuery.Return(s => s.As<Staza>()).ResultsAsync;

                if (zahtev.Tezina != null || zahtev.MinDuzinaStaze.HasValue || zahtev.MaxDuzinaStaze.HasValue)
                {
                    if (!staze.Any()) continue;
                }

                // Dohvati sve hotele za skijalište koji odgovaraju oceni i udaljenosti
                var hoteliQuery = _client.Cypher
                    .Match("(h:Hotel)-[:NALAZI_SE_U]->(sk:Skijaliste)")
                    .Where((Skijaliste sk) => sk.ID == skijaliste.ID);

                if (zahtev.MinOcenaHotela.HasValue)
                    hoteliQuery = hoteliQuery.AndWhere((Hotel h) => h.Ocena >= zahtev.MinOcenaHotela);

                if (zahtev.MaxUdaljenostHotela.HasValue)
                    hoteliQuery = hoteliQuery.AndWhere((Hotel h) => h.Udaljenost <= zahtev.MaxUdaljenostHotela);

                var hoteli = await hoteliQuery.Return(h => h.As<Hotel>()).ResultsAsync;

                if (zahtev.MinOcenaHotela.HasValue || zahtev.MaxUdaljenostHotela.HasValue)
                {
                    if (!hoteli.Any()) continue;
                }

                // Dohvati sve restorane za skijalište
                var restorani = await _client.Cypher
                    .Match("(r:Restoran)-[:PRIPADA]->(sk:Skijaliste)")
                    .Where((Skijaliste sk) => sk.ID == skijaliste.ID)
                    .Return(r => r.As<Restoran>())
                    .ResultsAsync;

                if (!restorani.Any() && zahtev.MaxBudzet > 0)
                {
                    // Ako su restorani bitni deo kalkulacije i nema ih, preskoči ovo skijalište
                    continue;
                }

                foreach (var hotel in hoteli)
                {
                    foreach (var restoran in restorani)
                    {
                        // Kalkulacija troškova
                        var cenaSkiPasa = skijaliste.CenaSkiPasa * zahtev.BrojDana * zahtev.BrojOsoba;

                        var cenaHotela = zahtev.BrojOsoba switch
                        {
                            <= 2 => hotel.CenaDvokrevetneSobe,
                            <= 3 => hotel.CenaTrokrevetneSobe,
                            <= 4 => hotel.CenaCetvorokrevetneSobe,
                            _ => hotel.CenaPetokrevetneSobe
                        } * zahtev.BrojDana;

                        var cenaRestorana = restoran.ProsecnaCena * zahtev.BrojOsoba * zahtev.BrojDana;

                        var ukupno = cenaSkiPasa + cenaHotela + cenaRestorana;

                        if (ukupno <= zahtev.MaxBudzet)
                        {
                            opcije.Add(new OpcionaPonuda
                            {
                                ID = Guid.NewGuid(),
                                Skijaliste = skijaliste,
                                Hotel = hotel,
                                Restoran = restoran,
                                UkupnaCena = ukupno
                            });
                        }
                    }
                }
            }

            return Ok(opcije);
        }

        // funk gde moraju da se unesu svi parametri za filtriranje

        // [HttpPost("FiltrirajOpcijeZaZimovanje")]
        // public async Task<IActionResult> FiltrirajOpcijeZaZimovanje([FromBody] ZahtevZaFiltriranje zahtev)
        // {
        //     var skijalista = await _client.Cypher
        //         .Match("(sk:Skijaliste)")
        //         .Return(sk => sk.As<Skijaliste>())
        //         .ResultsAsync;

        //     var opcije = new List<OpcionaPonuda>();

        //     foreach (var skijaliste in skijalista)
        //     {
        //         // Dohvati sve staze za skijalište koje odgovaraju težini i dužini
        //         var staze = await _client.Cypher
        //             .Match("(s:Staza)-[:PRIPADA]->(sk:Skijaliste)")
        //             .Where((Skijaliste sk) => sk.ID == skijaliste.ID)
        //             .AndWhere((Staza s) => s.Tezina == zahtev.Tezina)
        //             .AndWhere((Staza s) => s.Duzina >= zahtev.MinDuzinaStaze)
        //             .AndWhere((Staza s) => s.Duzina <= zahtev.MaxDuzinaStaze)
        //             .Return(s => s.As<Staza>())
        //             .ResultsAsync;

        //         if (!staze.Any()) continue;

        //         // Dohvati sve hotele za skijalište koji odgovaraju oceni i udaljenosti
        //         var hoteli = await _client.Cypher
        //             .Match("(h:Hotel)-[:NALAZI_SE_U]->(sk:Skijaliste)")
        //             .Where((Skijaliste sk) => sk.ID == skijaliste.ID)
        //             .AndWhere((Hotel h) => h.Ocena >= zahtev.MinOcenaHotela)
        //             .AndWhere((Hotel h) => h.Udaljenost <= zahtev.MaxUdaljenostHotela)
        //             .Return(h => h.As<Hotel>())
        //             .ResultsAsync;

        //         if (!hoteli.Any()) continue;

        //         // Dohvati sve restorane za skijalište
        //         var restorani = await _client.Cypher
        //             .Match("(r:Restoran)-[:PRIPADA]->(sk:Skijaliste)")
        //             .Where((Skijaliste sk) => sk.ID == skijaliste.ID)
        //             .Return(r => r.As<Restoran>())
        //             .ResultsAsync;

        //         if (!restorani.Any()) continue;

        //         foreach (var hotel in hoteli)
        //         {
        //             foreach (var restoran in restorani)
        //             {
        //                 // Kalkulacija troškova
        //                 var cenaSkiPasa = skijaliste.CenaSkiPasa * zahtev.BrojDana * zahtev.BrojOsoba;
        //                 var cenaHotela = zahtev.BrojOsoba switch
        //                 {
        //                     <= 2 => hotel.CenaDvokrevetneSobe,
        //                     <= 3 => hotel.CenaTrokrevetneSobe,
        //                     <= 4 => hotel.CenaCetvorokrevetneSobe,
        //                     _ => hotel.CenaPetokrevetneSobe
        //                 } * zahtev.BrojDana;
        //                 var cenaRestorana = restoran.ProsecnaCena * zahtev.BrojOsoba * zahtev.BrojDana;

        //                 var ukupno = cenaSkiPasa + cenaHotela + cenaRestorana;

        //                 if (ukupno <= zahtev.MaxBudzet)
        //                 {
        //                     opcije.Add(new OpcionaPonuda
        //                     {
        //                         Skijaliste = skijaliste,
        //                         Hotel = hotel,
        //                         Restoran = restoran,
        //                         UkupnaCena = ukupno
        //                     });
        //                 }
        //             }
        //         }
        //     }

        //     return Ok(opcije);
        // }


    }
}