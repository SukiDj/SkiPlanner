namespace API.DTOs
{
    public class KorisnikDto
    {
        public Guid ID { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Telefon { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Uloga { get; set; }
    }
}