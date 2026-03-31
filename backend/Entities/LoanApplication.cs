using BankLoanApp.Enums;

namespace BankLoanApp.Entities;

public class LoanApplication
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string CustomerId { get; set; } = string.Empty;
    public ApplicationUser Customer { get; set; } = null!;
    public decimal Amount { get; set; }
    public LoanType Type { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public int Tenure { get; set; } // months
    public decimal MonthlyIncome { get; set; }
    public LoanStatus Status { get; set; } = LoanStatus.Pending;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public ICollection<LoanStatusHistory> StatusHistory { get; set; } = new List<LoanStatusHistory>();
    public ICollection<BankerNote> Notes { get; set; } = new List<BankerNote>();
}
