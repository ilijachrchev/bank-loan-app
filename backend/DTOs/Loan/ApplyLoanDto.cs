using BankLoanApp.Enums;

namespace BankLoanApp.DTOs.Loan;

public class ApplyLoanDto
{
    public decimal Amount { get; set; }
    public LoanType Type { get; set; }
    public string Purpose { get; set; } = string.Empty;
    public int Tenure { get; set; }
    public decimal MonthlyIncome { get; set; }
}
