using BankLoanApp.DTOs.Loan;
using FluentValidation;

namespace BankLoanApp.Validators;

public class ApplyLoanValidator : AbstractValidator<ApplyLoanDto>
{
    public ApplyLoanValidator()
    {
        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero")
            .LessThanOrEqualTo(10_000_000).WithMessage("Amount must not exceed 10,000,000");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Invalid loan type");

        RuleFor(x => x.Purpose)
            .NotEmpty().WithMessage("Purpose is required")
            .MinimumLength(10).WithMessage("Purpose must be at least 10 characters")
            .MaximumLength(500).WithMessage("Purpose must not exceed 500 characters");

        RuleFor(x => x.Tenure)
            .GreaterThan(0).WithMessage("Tenure must be greater than zero")
            .LessThanOrEqualTo(360).WithMessage("Tenure must not exceed 360 months (30 years)");

        RuleFor(x => x.MonthlyIncome)
            .GreaterThan(0).WithMessage("Monthly income must be greater than zero");
    }
}
