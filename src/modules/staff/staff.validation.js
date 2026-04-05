import joi from "joi";

export const staffValidationSchema=joi.object({
    name:joi.string().required().min(3).max(15).messages({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must be at most 15 characters long",
    }),
    email: joi.string().email().required().pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)).messages({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
        "string.pattern.base": "Invalid email format example@example.com",
    }),
    password: joi.string().required().min(8).pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d).+$")).messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter and one digit",
    }),
    phone: joi.string().required().pattern(new RegExp(/^(?:\+20|0)?1[0125]\d{8}$/)).messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Invalid phone number format",
    }),
    dailySalary:joi.number().required().min(0).messages({
        "number.empty": "Daily salary is required",
        "number.min": "Daily salary must be a positive number",
    }),
    joinDate:joi.date().optional(),
    department:joi.string().required().messages({
        "string.empty": "Department is required",
    }),
    isActive:joi.boolean().default(true),
    monthlyReports: joi.array().items(
        joi.object({
            month: joi.string().required().messages({
                "string.empty": "Month is required",
            }),
            totalDaysWorked: joi.number().integer().min(0).max(31).required().messages({
                "number.min": "Days worked cannot be less than 0",
                "number.max": "Days worked cannot exceed 31",
                "any.required": "Total days worked is required",
            }),
            totalDeductions: joi.number().min(0).required().messages({
                "number.min": "Deductions cannot be negative",
                "any.required": "Total deductions is required",
            }),
            finalSalary: joi.number().min(0).required().messages({
                "number.min": "Final salary cannot be negative",
                "any.required": "Final salary is required",
            }),
            isPaid: joi.boolean().default(false),
            paidAt: joi.date().allow(null).default(null)
        })
    ).default([]),
})

export const deductionValidationSchema = joi.object({
    month: joi.string().pattern(new RegExp(/^\d{4}-(0[1-9]|1[0-2])$/)).required().messages({
        "string.pattern.base": "Month must be in YYYY-MM format"
    }),
    amount: joi.number().min(0).required(),
    reason: joi.string().required(),
});

export const salaryAdjustmentValidationSchema = joi.object({
    amount: joi.number().required(),
    reason: joi.string().required()
});