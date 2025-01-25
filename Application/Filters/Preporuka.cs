using Domain;

namespace Application.Filters
{
    public class Preporuka
    {
        public Skijaliste Skijaliste { get; set; }
        public ICollection<Hotel> Hoteli { get; set; }
        public ICollection<Restoran> Restorani { get; set; }
    }
}