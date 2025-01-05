namespace Domain
{
    public class Hotel
    {
        public Guid ID { get; set; }
        public string Ime { get; set; }
        public double Ocena { get; set; }
        public double Udaljenost { get; set; }
        public double Cena { get; set; } // treba da se smisli kako da se racuna cena
        public Skijaliste Skijaliste { get; set; }
    }
}