using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;


namespace Hotels.Models
{
    public partial class HotelsDBContext : DbContext
    {
        public HotelsDBContext()
        {
            Database.EnsureCreated();
        }

        public HotelsDBContext(DbContextOptions<HotelsDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Hotel> Hotels { get; set; }
        public virtual DbSet<Reservation> Reservations { get; set; }
        public virtual DbSet<Room> Rooms { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Hotel>(entity =>
            {
                entity.Property(e => e.Address).HasMaxLength(50);

                entity.Property(e => e.City).HasMaxLength(20);

                entity.Property(e => e.Country).HasMaxLength(20);

                entity.Property(e => e.Image).HasMaxLength(100);

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<Reservation>(entity =>
            {
                entity.Property(e => e.EndDate).HasColumnType("date");

                entity.Property(e => e.StartDate).HasColumnType("date");

                entity.HasOne<Room>()
                    .WithMany(p => p.Reservations)
                    .HasForeignKey(d => d.RoomId);

                entity.HasOne<User>()
                    .WithMany(p => p.Reservations)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<Room>(entity =>
            {
                entity.Property(e => e.RoomNumber).HasMaxLength(20);

                entity.Property(e => e.Cost).HasPrecision(9,2);

                entity.Property(e => e.Image).HasMaxLength(100);

                entity.Property(e => e.Image)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.RoomType).HasMaxLength(50);

                entity.HasOne<Hotel>()
                    .WithMany(p => p.Rooms)
                    .HasForeignKey(d => d.HotelId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Login).HasMaxLength(50);

                entity.Property(e => e.Role).HasMaxLength(50);
            });
        }
     
    }
}
