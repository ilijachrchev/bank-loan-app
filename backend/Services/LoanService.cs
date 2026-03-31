using AutoMapper;
using BankLoanApp.Data;
using BankLoanApp.DTOs.Loan;
using BankLoanApp.Entities;
using BankLoanApp.Enums;
using BankLoanApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BankLoanApp.Services;

public class LoanService : ILoanService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<LoanService> _logger;

    public LoanService(ApplicationDbContext context, IMapper mapper, ILogger<LoanService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<LoanApplicationDto>> GetMyApplicationsAsync(string userId)
    {
        var applications = await _context.LoanApplications
            .Include(l => l.Customer)
            .Include(l => l.StatusHistory)
                .ThenInclude(h => h.ChangedBy)
            .Include(l => l.Notes)
                .ThenInclude(n => n.Banker)
            .Where(l => l.CustomerId == userId)
            .OrderByDescending(l => l.CreatedAt)
            .ToListAsync();

        return _mapper.Map<List<LoanApplicationDto>>(applications);
    }

    public async Task<LoanApplicationDto> ApplyForLoanAsync(string userId, ApplyLoanDto dto)
    {
        var application = new LoanApplication
        {
            CustomerId = userId,
            Amount = dto.Amount,
            Type = dto.Type,
            Purpose = dto.Purpose,
            Tenure = dto.Tenure,
            MonthlyIncome = dto.MonthlyIncome,
            Status = LoanStatus.Pending
        };

        await _context.LoanApplications.AddAsync(application);

        // Add initial status history
        var history = new LoanStatusHistory
        {
            LoanApplicationId = application.Id,
            Status = LoanStatus.Pending,
            Note = "Application submitted",
            ChangedById = userId
        };
        await _context.LoanStatusHistories.AddAsync(history);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Loan application created: {Id} for user {UserId}", application.Id, userId);

        return await GetApplicationByIdAsync(application.Id, userId);
    }

    public async Task<LoanApplicationDto> GetApplicationByIdAsync(Guid id, string userId)
    {
        var application = await _context.LoanApplications
            .Include(l => l.Customer)
            .Include(l => l.StatusHistory.OrderBy(h => h.ChangedAt))
                .ThenInclude(h => h.ChangedBy)
            .Include(l => l.Notes.OrderByDescending(n => n.CreatedAt))
                .ThenInclude(n => n.Banker)
            .Where(l => l.Id == id && l.CustomerId == userId)
            .FirstOrDefaultAsync();

        if (application == null)
            throw new KeyNotFoundException($"Loan application with id {id} not found.");

        return _mapper.Map<LoanApplicationDto>(application);
    }

    public async Task<List<LoanStatusHistoryDto>> GetApplicationHistoryAsync(Guid id, string userId)
    {
        var application = await _context.LoanApplications
            .Where(l => l.Id == id && l.CustomerId == userId)
            .FirstOrDefaultAsync();

        if (application == null)
            throw new KeyNotFoundException($"Loan application with id {id} not found.");

        var history = await _context.LoanStatusHistories
            .Include(h => h.ChangedBy)
            .Where(h => h.LoanApplicationId == id)
            .OrderBy(h => h.ChangedAt)
            .ToListAsync();

        return _mapper.Map<List<LoanStatusHistoryDto>>(history);
    }
}
