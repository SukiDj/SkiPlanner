namespace Application.Filters
{
    public class ZahtevZaFiltriranje
    {
        public Guid IDSkijalista { get; set; }
        public int? MinBrojStaza { get; set; }
        public string Tezina { get; set; } // Težina staze (opcionalno)
        public double? MinDuzinaStaze { get; set; } // Minimalna dužina staze (opcionalno)
        public double? MaxDuzinaStaze { get; set; } // Maksimalna dužina staze (opcionalno)
        public double? MinOcenaHotela { get; set; } // Minimalna ocena hotela (opcionalno)
        public double? MaxUdaljenostHotela { get; set; } // Maksimalna udaljenost hotela (opcionalno)
        public int BrojDana { get; set; } // Broj dana zimovanja (obavezno)
        public int BrojOsoba { get; set; } // Broj osoba (obavezno)
        public double MaxBudzet { get; set; } // Maksimalan budžet (obavezno)
    }
}