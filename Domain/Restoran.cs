namespace Domain
{
    public class Restoran
    {
        public Guid ID { get; set; }
        public string Naziv { get; set; }
        public string TipKuhinje { get; set; }
        public double Ocena { get; set; }
        public double ProsecnaCena { get; set; } // prosecna cena npr rucka po osobi
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}