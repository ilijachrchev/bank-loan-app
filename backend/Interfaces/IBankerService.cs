using BankLoanApp.DTOs.Loan;
using BankLoanApp.Enums;

namespace BankLoanApp.Interfaces;

public interface IBankerService
{
    Task<PagedResult<LoanApplicationDto>> GetAllApplicationsAsync(LoanStatus? status, string? search, int page, int pageSize);
    Task<LoanApplicationDto> GetApplicationByIdAsync(Guid id);
    Task<LoanApplicationDto> UpdateStatusAsync(Guid id, string bankerId, UpdateStatusDto dto);
    Task<BankerNoteDto> AddNoteAsync(Guid id, string bankerId, AddNoteDto dto);
    Task<List<BankerNoteDto>> GetNotesAsync(Guid id);
    Task<BankerStatsDto> GetStatsAsync();
}
