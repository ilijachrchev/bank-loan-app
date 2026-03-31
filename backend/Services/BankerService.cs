using AutoMapper;
using BankLoanApp.Data;
using BankLoanApp.DTOs.Loan;
using BankLoanApp.Entities;
using BankLoanApp.Enums;
using BankLoanApp.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BankLoanApp.Services;

public class BankerService : IBankerService
{
    private readonly ApplicationDbContext _context;
    private readonly IMapper _mapper;
    private readonly ILogger<BankerService> _logger;

    public BankerService(ApplicationDbContext context, IMapper mapper, ILogger<BankerService> logger)
    {
        _context = context;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<PagedResult<LoanApplicationDto>> GetAllApplicationsAsync(
        LoanStatus? status, string? search, int page, int pageSize)
    {
        var query = _context.LoanApplications
            .Include(l => l.Customer)
            .Include(l => l.StatusHistory.OrderBy(h => h.ChangedAt))
                .ThenInclude(h => h.ChangedBy)
            .Include(l => l.Notes.OrderByDescending(n => n.CreatedAt))
                .ThenInclude(n => n.Banker)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(l => l.Status == status.Value);

        if (!string.IsNullOrWhiteSpace(search))
        {
            var lowerSearch = search.ToLower();
            query = query.Where(l =>
                l.Customer.Email!.ToLower().Contains(lowerSearch) ||
                l.Customer.FirstName.ToLower().Contains(lowerSearch) ||
                l.Customer.LastName.ToLower().Contains(lowerSearch) ||
                l.Purpose.ToLower().Contains(lowerSearch));
        }

        var totalCount = await query.CountAsync();

        var applications = await query
            .OrderByDescending(l => l.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<LoanApplicationDto>
        {
            Items = _mapper.Map<List<LoanApplicationDto>>(applications),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<LoanApplicationDto> GetApplicationByIdAsync(Guid id)
    {
        var application = await _context.LoanApplications
            .Include(l => l.Customer)
            .Include(l => l.StatusHistory.OrderBy(h => h.ChangedAt))
                .ThenInclude(h => h.ChangedBy)
            .Include(l => l.Notes.OrderByDescending(n => n.CreatedAt))
                .ThenInclude(n => n.Banker)
            .FirstOrDefaultAsync(l => l.Id == id);

        if (application == null)
            throw new KeyNotFoundException($"Loan application with id {id} not found.");

        return _mapper.Map<LoanApplicationDto>(application);
    }

    public async Task<LoanApplicationDto> UpdateStatusAsync(Guid id, string bankerId, UpdateStatusDto dto)
    {
        var application = await _context.LoanApplications
            .FirstOrDefaultAsync(l => l.Id == id);

        if (application == null)
            throw new KeyNotFoundException($"Loan application with id {id} not found.");

        var previousStatus = application.Status;
        application.Status = dto.Status;
        application.UpdatedAt = DateTime.UtcNow;

        var history = new LoanStatusHistory
        {
            LoanApplicationId = id,
            Status = dto.Status,
            Note = dto.Note,
            ChangedById = bankerId
        };

        await _context.LoanStatusHistories.AddAsync(history);
        await _context.SaveChangesAsync();

        _logger.LogInformation(
            "Loan {Id} status changed from {PreviousStatus} to {NewStatus} by banker {BankerId}",
            id, previousStatus, dto.Status, bankerId);

        return await GetApplicationByIdAsync(id);
    }

    public async Task<BankerNoteDto> AddNoteAsync(Guid id, string bankerId, AddNoteDto dto)
    {
        var application = await _context.LoanApplications
            .FirstOrDefaultAsync(l => l.Id == id);

        if (application == null)
            throw new KeyNotFoundException($"Loan application with id {id} not found.");

        var note = new BankerNote
        {
            LoanApplicationId = id,
            BankerId = bankerId,
            Note = dto.Note
        };

        await _context.BankerNotes.AddAsync(note);
        await _context.SaveChangesAsync();

        // Reload with banker info
        var savedNote = await _context.BankerNotes
            .Include(n => n.Banker)
            .FirstOrDefaultAsync(n => n.Id == note.Id);

        _logger.LogInformation("Banker {BankerId} added note to loan {Id}", bankerId, id);

        return _mapper.Map<BankerNoteDto>(savedNote);
    }

    public async Task<List<BankerNoteDto>> GetNotesAsync(Guid id)
    {
        var application = await _context.LoanApplications
            .FirstOrDefaultAsync(l => l.Id == id);

        if (application == null)
            throw new KeyNotFoundException($"Loan application with id {id} not found.");

        var notes = await _context.BankerNotes
            .Include(n => n.Banker)
            .Where(n => n.LoanApplicationId == id)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        return _mapper.Map<List<BankerNoteDto>>(notes);
    }

    public async Task<BankerStatsDto> GetStatsAsync()
    {
        var stats = await _context.LoanApplications
            .GroupBy(l => l.Status)
            .Select(g => new { Status = g.Key, Count = g.Count() })
            .ToListAsync();

        return new BankerStatsDto
        {
            TotalApplications = stats.Sum(s => s.Count),
            PendingCount = stats.FirstOrDefault(s => s.Status == LoanStatus.Pending)?.Count ?? 0,
            UnderReviewCount = stats.FirstOrDefault(s => s.Status == LoanStatus.UnderReview)?.Count ?? 0,
            ApprovedCount = stats.FirstOrDefault(s => s.Status == LoanStatus.Approved)?.Count ?? 0,
            RejectedCount = stats.FirstOrDefault(s => s.Status == LoanStatus.Rejected)?.Count ?? 0,
            MoreInfoRequiredCount = stats.FirstOrDefault(s => s.Status == LoanStatus.MoreInfoRequired)?.Count ?? 0
        };
    }
}
