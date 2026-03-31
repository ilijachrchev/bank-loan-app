namespace BankLoanApp.Entities;

public class BankerNote
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LoanApplicationId { get; set; }
    public LoanApplication LoanApplication { get; set; } = null!;
    public string BankerId { get; set; } = string.Empty;
    public ApplicationUser Banker { get; set; } = null!;
    public string Note { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
