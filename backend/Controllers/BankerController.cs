using System.Security.Claims;
using BankLoanApp.DTOs.Loan;
using BankLoanApp.Enums;
using BankLoanApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankLoanApp.Controllers;

[ApiController]
[Route("api/banker")]
[Authorize(Roles = UserRoles.Banker)]
[Produces("application/json")]
public class BankerController : ControllerBase
{
    private readonly IBankerService _bankerService;
    private readonly ILogger<BankerController> _logger;

    public BankerController(IBankerService bankerService, ILogger<BankerController> logger)
    {
        _bankerService = bankerService;
        _logger = logger;
    }

    private string GetBankerId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("Banker ID not found in token.");

    /// <summary>
    /// Get all loan applications with optional filtering and pagination
    /// </summary>
    [HttpGet("applications")]
    [ProducesResponseType(typeof(PagedResult<LoanApplicationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<LoanApplicationDto>>> GetApplications(
        [FromQuery] LoanStatus? status = null,
        [FromQuery] string? search = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;

        var result = await _bankerService.GetAllApplicationsAsync(status, search, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Get a specific loan application with full details
    /// </summary>
    [HttpGet("applications/{id:guid}")]
    [ProducesResponseType(typeof(LoanApplicationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LoanApplicationDto>> GetApplication(Guid id)
    {
        var result = await _bankerService.GetApplicationByIdAsync(id);
        return Ok(result);
    }

    /// <summary>
    /// Update the status of a loan application
    /// </summary>
    [HttpPut("applications/{id:guid}/status")]
    [ProducesResponseType(typeof(LoanApplicationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LoanApplicationDto>> UpdateStatus(Guid id, [FromBody] UpdateStatusDto dto)
    {
        var bankerId = GetBankerId();
        var result = await _bankerService.UpdateStatusAsync(id, bankerId, dto);
        return Ok(result);
    }

    /// <summary>
    /// Add a note to a loan application
    /// </summary>
    [HttpPost("applications/{id:guid}/notes")]
    [ProducesResponseType(typeof(BankerNoteDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<BankerNoteDto>> AddNote(Guid id, [FromBody] AddNoteDto dto)
    {
        var bankerId = GetBankerId();
        var result = await _bankerService.AddNoteAsync(id, bankerId, dto);
        return CreatedAtAction(nameof(GetNotes), new { id }, result);
    }

    /// <summary>
    /// Get all notes for a loan application
    /// </summary>
    [HttpGet("applications/{id:guid}/notes")]
    [ProducesResponseType(typeof(List<BankerNoteDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<List<BankerNoteDto>>> GetNotes(Guid id)
    {
        var result = await _bankerService.GetNotesAsync(id);
        return Ok(result);
    }

    /// <summary>
    /// Get statistics for loan applications
    /// </summary>
    [HttpGet("stats")]
    [ProducesResponseType(typeof(BankerStatsDto), StatusCodes.Status200OK)]
    public async Task<ActionResult<BankerStatsDto>> GetStats()
    {
        var result = await _bankerService.GetStatsAsync();
        return Ok(result);
    }
}
