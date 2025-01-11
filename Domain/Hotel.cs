namespace Domain
{
    public class Hotel
    {
        public Guid ID { get; set; }
        public string Ime { get; set; }
        public double Ocena { get; set; }
        public double Udaljenost { get; set; }
        public double CenaDvokrevetneSobe { get; set; }
        public double CenaTrokrevetneSobe { get; set; }
        public double CenaCetvorokrevetneSobe { get; set; }
        public double CenaPetokrevetneSobe { get; set; }
    }
}