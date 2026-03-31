using AutoMapper;
using BankLoanApp.DTOs.Loan;
using BankLoanApp.Entities;

namespace BankLoanApp.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<LoanApplication, LoanApplicationDto>()
            .ForMember(dest => dest.CustomerFirstName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.FirstName : string.Empty))
            .ForMember(dest => dest.CustomerLastName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.LastName : string.Empty))
            .ForMember(dest => dest.CustomerEmail, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Email : string.Empty))
            .ForMember(dest => dest.TypeName, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.StatusHistory, opt => opt.MapFrom(src => src.StatusHistory))
            .ForMember(dest => dest.Notes, opt => opt.MapFrom(src => src.Notes));

        CreateMap<LoanStatusHistory, LoanStatusHistoryDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.ToString()))
            .ForMember(dest => dest.ChangedByName, opt => opt.MapFrom(src =>
                src.ChangedBy != null
                    ? $"{src.ChangedBy.FirstName} {src.ChangedBy.LastName}"
                    : string.Empty));

        CreateMap<BankerNote, BankerNoteDto>()
            .ForMember(dest => dest.BankerName, opt => opt.MapFrom(src =>
                src.Banker != null
                    ? $"{src.Banker.FirstName} {src.Banker.LastName}"
                    : string.Empty));
    }
}
