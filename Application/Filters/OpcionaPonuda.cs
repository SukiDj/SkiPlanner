using Domain;

namespace Application.Filters
{
    public class OpcionaPonuda
    {
        public Guid ID { get; set; }
        public Skijaliste Skijaliste { get; set; }
        public Hotel Hotel { get; set; }
        public Restoran Restoran { get; set; }
        public double UkupnaCena { get; set; }
    }
}