namespace Domain
{
    public class Korisnik
    {
        public Guid ID { get; set; }
        public string ImePrezime { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }// ne treba ako se nasledjuje ona klasa
    }
}