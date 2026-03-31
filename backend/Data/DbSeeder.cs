using BankLoanApp.Entities;
using BankLoanApp.Enums;
using Microsoft.AspNetCore.Identity;

namespace BankLoanApp.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ILogger<ApplicationDbContext> logger)
    {
        try
        {
            // Seed roles
            foreach (var roleName in new[] { UserRoles.Customer, UserRoles.Banker })
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                    logger.LogInformation("Created role: {Role}", roleName);
                }
            }

            // Seed customer user
            ApplicationUser? customer = null;
            if (await userManager.FindByEmailAsync("customer@demo.com") == null)
            {
                customer = new ApplicationUser
                {
                    UserName = "customer@demo.com",
                    Email = "customer@demo.com",
                    EmailConfirmed = true,
                    FirstName = "John",
                    LastName = "Doe",
                    Role = UserRoles.Customer
                };
                var result = await userManager.CreateAsync(customer, "Demo@1234");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(customer, UserRoles.Customer);
                    logger.LogInformation("Created customer user: customer@demo.com");
                }
                else
                {
                    logger.LogError("Failed to create customer: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                customer = await userManager.FindByEmailAsync("customer@demo.com");
            }

            // Seed banker user
            ApplicationUser? banker = null;
            if (await userManager.FindByEmailAsync("banker@demo.com") == null)
            {
                banker = new ApplicationUser
                {
                    UserName = "banker@demo.com",
                    Email = "banker@demo.com",
                    EmailConfirmed = true,
                    FirstName = "Jane",
                    LastName = "Smith",
                    Role = UserRoles.Banker
                };
                var result = await userManager.CreateAsync(banker, "Demo@1234");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(banker, UserRoles.Banker);
                    logger.LogInformation("Created banker user: banker@demo.com");
                }
                else
                {
                    logger.LogError("Failed to create banker: {Errors}", string.Join(", ", result.Errors.Select(e => e.Description)));
                }
            }
            else
            {
                banker = await userManager.FindByEmailAsync("banker@demo.com");
            }

            // Seed loan applications if none exist
            if (!context.LoanApplications.Any() && customer != null && banker != null)
            {
                var now = DateTime.UtcNow;

                var loanApplications = new List<LoanApplication>
                {
                    new LoanApplication
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Amount = 50000m,
                        Type = LoanType.Home,
                        Purpose = "Purchase new home",
                        Tenure = 240,
                        MonthlyIncome = 8000m,
                        Status = LoanStatus.Pending,
                        CreatedAt = now.AddDays(-5),
                        UpdatedAt = now.AddDays(-5)
                    },
                    new LoanApplication
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Amount = 15000m,
                        Type = LoanType.Car,
                        Purpose = "Buy a new car",
                        Tenure = 60,
                        MonthlyIncome = 8000m,
                        Status = LoanStatus.UnderReview,
                        CreatedAt = now.AddDays(-10),
                        UpdatedAt = now.AddDays(-3)
                    },
                    new LoanApplication
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Amount = 5000m,
                        Type = LoanType.Personal,
                        Purpose = "Medical expenses",
                        Tenure = 24,
                        MonthlyIncome = 8000m,
                        Status = LoanStatus.Approved,
                        CreatedAt = now.AddDays(-20),
                        UpdatedAt = now.AddDays(-7)
                    },
                    new LoanApplication
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Amount = 100000m,
                        Type = LoanType.Business,
                        Purpose = "Expand business operations",
                        Tenure = 120,
                        MonthlyIncome = 8000m,
                        Status = LoanStatus.Rejected,
                        CreatedAt = now.AddDays(-30),
                        UpdatedAt = now.AddDays(-15)
                    },
                    new LoanApplication
                    {
                        Id = Guid.NewGuid(),
                        CustomerId = customer.Id,
                        Amount = 25000m,
                        Type = LoanType.Education,
                        Purpose = "Graduate school tuition",
                        Tenure = 84,
                        MonthlyIncome = 8000m,
                        Status = LoanStatus.MoreInfoRequired,
                        CreatedAt = now.AddDays(-8),
                        UpdatedAt = now.AddDays(-2)
                    }
                };

                await context.LoanApplications.AddRangeAsync(loanApplications);
                await context.SaveChangesAsync();

                // Seed status history
                var statusHistories = new List<LoanStatusHistory>();

                // Pending application - just pending history
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[0].Id,
                    Status = LoanStatus.Pending,
                    Note = "Application submitted",
                    ChangedById = customer.Id,
                    ChangedAt = loanApplications[0].CreatedAt
                });

                // UnderReview application
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[1].Id,
                    Status = LoanStatus.Pending,
                    Note = "Application submitted",
                    ChangedById = customer.Id,
                    ChangedAt = loanApplications[1].CreatedAt
                });
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[1].Id,
                    Status = LoanStatus.UnderReview,
                    Note = "Application is being reviewed by our team",
                    ChangedById = banker.Id,
                    ChangedAt = loanApplications[1].CreatedAt.AddDays(2)
                });

                // Approved application
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[2].Id,
                    Status = LoanStatus.Pending,
                    Note = "Application submitted",
                    ChangedById = customer.Id,
                    ChangedAt = loanApplications[2].CreatedAt
                });
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[2].Id,
                    Status = LoanStatus.UnderReview,
                    Note = "Application moved to review",
                    ChangedById = banker.Id,
                    ChangedAt = loanApplications[2].CreatedAt.AddDays(3)
                });
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[2].Id,
                    Status = LoanStatus.Approved,
                    Note = "Loan approved. Funds will be disbursed within 3 business days.",
                    ChangedById = banker.Id,
                    ChangedAt = loanApplications[2].UpdatedAt
                });

                // Rejected application
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[3].Id,
                    Status = LoanStatus.Pending,
                    Note = "Application submitted",
                    ChangedById = customer.Id,
                    ChangedAt = loanApplications[3].CreatedAt
                });
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[3].Id,
                    Status = LoanStatus.UnderReview,
                    Note = "Application under review",
                    ChangedById = banker.Id,
                    ChangedAt = loanApplications[3].CreatedAt.AddDays(3)
                });
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[3].Id,
                    Status = LoanStatus.Rejected,
                    Note = "Loan amount exceeds maximum eligible based on income-to-debt ratio",
                    ChangedById = banker.Id,
                    ChangedAt = loanApplications[3].UpdatedAt
                });

                // MoreInfoRequired application
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[4].Id,
                    Status = LoanStatus.Pending,
                    Note = "Application submitted",
                    ChangedById = customer.Id,
                    ChangedAt = loanApplications[4].CreatedAt
                });
                statusHistories.Add(new LoanStatusHistory
                {
                    LoanApplicationId = loanApplications[4].Id,
                    Status = LoanStatus.MoreInfoRequired,
                    Note = "Please provide proof of enrollment and academic transcripts",
                    ChangedById = banker.Id,
                    ChangedAt = loanApplications[4].UpdatedAt
                });

                await context.LoanStatusHistories.AddRangeAsync(statusHistories);
                await context.SaveChangesAsync();

                // Seed some banker notes
                var bankerNotes = new List<BankerNote>
                {
                    new BankerNote
                    {
                        LoanApplicationId = loanApplications[1].Id,
                        BankerId = banker.Id,
                        Note = "Customer has good credit history. Proceeding with standard review.",
                        CreatedAt = now.AddDays(-3)
                    },
                    new BankerNote
                    {
                        LoanApplicationId = loanApplications[2].Id,
                        BankerId = banker.Id,
                        Note = "All documents verified. Income sufficient for loan repayment.",
                        CreatedAt = now.AddDays(-8)
                    },
                    new BankerNote
                    {
                        LoanApplicationId = loanApplications[3].Id,
                        BankerId = banker.Id,
                        Note = "Business plan reviewed. Revenue projections appear overly optimistic.",
                        CreatedAt = now.AddDays(-18)
                    },
                    new BankerNote
                    {
                        LoanApplicationId = loanApplications[4].Id,
                        BankerId = banker.Id,
                        Note = "Need to verify enrollment status at the educational institution.",
                        CreatedAt = now.AddDays(-2)
                    }
                };

                await context.BankerNotes.AddRangeAsync(bankerNotes);
                await context.SaveChangesAsync();

                logger.LogInformation("Seeded {Count} loan applications with history and notes", loanApplications.Count);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred during database seeding");
            throw;
        }
    }
}
