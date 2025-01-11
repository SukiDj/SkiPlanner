namespace Domain
{
    public class Skijaliste
    {
        public Guid ID { get; set; }
        public string Ime { get; set; }
        //public string Lokacija { get; set; }
        public int Popularnost { get; set; }
        public int CenaSkiPasa { get; set; } // cena dnevnog ski pasa, razmisliti dal da se doda popust na veci broj dana
        public int BrojStaza { get; set; }
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}