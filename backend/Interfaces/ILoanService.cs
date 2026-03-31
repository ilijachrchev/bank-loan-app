using BankLoanApp.DTOs.Loan;

namespace BankLoanApp.Interfaces;

public interface ILoanService
{
    Task<List<LoanApplicationDto>> GetMyApplicationsAsync(string userId);
    Task<LoanApplicationDto> ApplyForLoanAsync(string userId, ApplyLoanDto dto);
    Task<LoanApplicationDto> GetApplicationByIdAsync(Guid id, string userId);
    Task<List<LoanStatusHistoryDto>> GetApplicationHistoryAsync(Guid id, string userId);
}
