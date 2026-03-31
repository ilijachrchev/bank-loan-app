using BankLoanApp.Enums;

namespace BankLoanApp.Entities;

public class LoanStatusHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LoanApplicationId { get; set; }
    public LoanApplication LoanApplication { get; set; } = null!;
    public LoanStatus Status { get; set; }
    public string? Note { get; set; }
    public string ChangedById { get; set; } = string.Empty;
    public ApplicationUser ChangedBy { get; set; } = null!;
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}
