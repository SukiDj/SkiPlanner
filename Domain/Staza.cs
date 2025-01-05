namespace Domain
{
    public class Staza
    {
        public Guid ID { get; set; }
        public string Naziv { get; set; }
        public string Tezina { get; set; }
        public double Duzina { get; set; }
        public Skijaliste Skijaliste { get; set; }
    }
}