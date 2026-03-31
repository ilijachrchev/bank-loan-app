using BankLoanApp.Enums;

namespace BankLoanApp.DTOs.Loan;

public class LoanApplicationDto
{
    public Guid Id { get; set; }
    public string CustomerId { get; set; } = string.Empty;
    public string CustomerFirstName { get; set; } = string.Empty;
    public string CustomerLastName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public LoanType Type { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public string Purpose { get; set; } = string.Empty;
    public int Tenure { get; set; }
    public decimal MonthlyIncome { get; set; }
    public LoanStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<LoanStatusHistoryDto> StatusHistory { get; set; } = new();
    public List<BankerNoteDto> Notes { get; set; } = new();
}

public class LoanStatusHistoryDto
{
    public Guid Id { get; set; }
    public LoanStatus Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? Note { get; set; }
    public string ChangedById { get; set; } = string.Empty;
    public string ChangedByName { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
}

public class BankerNoteDto
{
    public Guid Id { get; set; }
    public string BankerId { get; set; } = string.Empty;
    public string BankerName { get; set; } = string.Empty;
    public string Note { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class BankerStatsDto
{
    public int TotalApplications { get; set; }
    public int PendingCount { get; set; }
    public int UnderReviewCount { get; set; }
    public int ApprovedCount { get; set; }
    public int RejectedCount { get; set; }
    public int MoreInfoRequiredCount { get; set; }
}

public class PagedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
}
