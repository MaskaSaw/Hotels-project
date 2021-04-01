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
        public virtual DbSet<Service> Services { get; set; }
        public virtual DbSet<ReservationService> ReservationServices { get; set; }
        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<RoomBlock> RoomBlocks { get; set; }


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

                entity.HasOne<Room>(r => r.Room)
                    .WithMany(p => p.Reservations)
                    .HasForeignKey(d => d.RoomId);

                entity.HasOne<User>(r => r.User)
                    .WithMany(p => p.Reservations)
                    .HasForeignKey(d => d.UserId);
            });

            modelBuilder.Entity<RoomBlock>(entity =>
            {
                entity.Property(e => e.End).HasColumnType("smalldatetime");

                entity.Property(e => e.CheckIn).HasColumnType("date");

                entity.Property(e => e.CheckOut).HasColumnType("date");

                entity.HasOne<Room>(r => r.Room)
                    .WithMany(p => p.RoomBlocks)
                    .HasForeignKey(d => d.RoomId);

            });

            modelBuilder.Entity<Room>(entity =>
            {
                entity.Property(e => e.RoomNumber).HasMaxLength(20);

                entity.Property(e => e.Cost).HasPrecision(9,2);

                entity.Property(e => e.Image)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.RoomType).HasMaxLength(50);

                entity.HasOne<Hotel>(r => r.Hotel)
                    .WithMany(p => p.Rooms)
                    .HasForeignKey(d => d.HotelId)
                    .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<Service>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(20);

                entity.Property(e => e.Cost).HasPrecision(9, 2);

                entity.HasOne<Hotel>()
                   .WithMany(p => p.Services)
                   .HasForeignKey(d => d.HotelId)
                   .OnDelete(DeleteBehavior.ClientSetNull);
            });

            modelBuilder.Entity<ReservationService>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(20);

                entity.Property(e => e.Cost).HasPrecision(9, 2);

                entity.HasOne<Reservation>()
                   .WithMany(p => p.ReservationServices)
                   .HasForeignKey(d => d.ReservationId)
                   .OnDelete(DeleteBehavior.Cascade);
            });


            modelBuilder.Entity<User>(entity =>
            {
                entity.Property(e => e.Login).HasMaxLength(50);

                entity.Property(e => e.Role).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(20);

                entity.Property(e => e.Surname).HasMaxLength(50);
            });
        }
    }
}
