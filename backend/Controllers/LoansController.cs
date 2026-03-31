using System.Security.Claims;
using BankLoanApp.DTOs.Loan;
using BankLoanApp.Enums;
using BankLoanApp.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BankLoanApp.Controllers;

[ApiController]
[Route("api/loans")]
[Authorize(Roles = UserRoles.Customer)]
[Produces("application/json")]
public class LoansController : ControllerBase
{
    private readonly ILoanService _loanService;
    private readonly ILogger<LoansController> _logger;

    public LoansController(ILoanService loanService, ILogger<LoansController> logger)
    {
        _loanService = loanService;
        _logger = logger;
    }

    private string GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new UnauthorizedAccessException("User ID not found in token.");

    /// <summary>
    /// Get all loan applications for the authenticated customer
    /// </summary>
    [HttpGet("my")]
    [ProducesResponseType(typeof(List<LoanApplicationDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<LoanApplicationDto>>> GetMyApplications()
    {
        var userId = GetUserId();
        var result = await _loanService.GetMyApplicationsAsync(userId);
        return Ok(result);
    }

    /// <summary>
    /// Apply for a new loan
    /// </summary>
    [HttpPost("apply")]
    [ProducesResponseType(typeof(LoanApplicationDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<LoanApplicationDto>> Apply([FromBody] ApplyLoanDto dto)
    {
        var userId = GetUserId();
        var result = await _loanService.ApplyForLoanAsync(userId, dto);
        return CreatedAtAction(nameof(GetApplication), new { id = result.Id }, result);
    }

    /// <summary>
    /// Get a specific loan application by ID
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(LoanApplicationDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<LoanApplicationDto>> GetApplication(Guid id)
    {
        var userId = GetUserId();
        var result = await _loanService.GetApplicationByIdAsync(id, userId);
        return Ok(result);
    }

    /// <summary>
    /// Get status history for a specific loan application
    /// </summary>
    [HttpGet("{id:guid}/history")]
    [ProducesResponseType(typeof(List<LoanStatusHistoryDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<List<LoanStatusHistoryDto>>> GetApplicationHistory(Guid id)
    {
        var userId = GetUserId();
        var result = await _loanService.GetApplicationHistoryAsync(id, userId);
        return Ok(result);
    }
}
