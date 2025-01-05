namespace Domain
{
    public class Skijaliste
    {
        public Guid ID { get; set; }
        public string Ime { get; set; }
        public string Lokacija { get; set; }
        public int Popularnost { get; set; }
        public int CenaSkiPasa { get; set; } // ovo treba da se smisli kako da bude
        public int BrojStaza { get; set; }
        public ICollection<Staza> Staze { get; set; } = [];
        public ICollection<Hotel> Hoteli { get; set; } = [];
        public ICollection<Restoran> Restorani { get; set; } = [];
    }
}