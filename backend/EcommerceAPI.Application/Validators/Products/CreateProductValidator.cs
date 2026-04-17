using EcommerceAPI.Application.DTOs.Products;
using EcommerceAPI.Domain.Enums;
using FluentValidation;

namespace EcommerceAPI.Application.Validators.Products;

public class CreateProductValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code is required.")
            .MaximumLength(50).WithMessage("Code must not exceed 50 characters.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(200).WithMessage("Name must not exceed 200 characters.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0.");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("Stock must be 0 or more.");

        RuleFor(x => x.Size)
            .IsInEnum().WithMessage("Size must be a valid ProductSize value.");

        RuleFor(x => x.Color)
            .IsInEnum().WithMessage("Color must be a valid ProductColor value.");
    }
}