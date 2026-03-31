using BankLoanApp.Enums;

namespace BankLoanApp.DTOs.Loan;

public class UpdateStatusDto
{
    public LoanStatus Status { get; set; }
    public string? Note { get; set; }
}
