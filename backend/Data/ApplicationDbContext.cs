using BankLoanApp.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BankLoanApp.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<LoanApplication> LoanApplications => Set<LoanApplication>();
    public DbSet<LoanStatusHistory> LoanStatusHistories => Set<LoanStatusHistory>();
    public DbSet<BankerNote> BankerNotes => Set<BankerNote>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<LoanApplication>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
            entity.Property(e => e.MonthlyIncome).HasColumnType("decimal(18,2)");
            entity.HasOne(e => e.Customer)
                  .WithMany(u => u.LoanApplications)
                  .HasForeignKey(e => e.CustomerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<LoanStatusHistory>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.LoanApplication)
                  .WithMany(l => l.StatusHistory)
                  .HasForeignKey(e => e.LoanApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.ChangedBy)
                  .WithMany()
                  .HasForeignKey(e => e.ChangedById)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<BankerNote>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.LoanApplication)
                  .WithMany(l => l.Notes)
                  .HasForeignKey(e => e.LoanApplicationId)
                  .OnDelete(DeleteBehavior.Cascade);
            entity.HasOne(e => e.Banker)
                  .WithMany()
                  .HasForeignKey(e => e.BankerId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        builder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.User)
                  .WithMany(u => u.RefreshTokens)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
