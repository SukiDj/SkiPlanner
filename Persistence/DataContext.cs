using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        // Nije relaciona baza tako da se ne radi tako
        public DbSet<Skijaliste> Skijalista { get; set; }
        public DbSet<Staza> Staze { get; set; }
        public DbSet<Hotel> Hoteli { get; set; }
        public DbSet<Restoran> Restorani { get; set; }
    }
}