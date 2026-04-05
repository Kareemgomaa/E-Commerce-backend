import joi  from "joi";

export const signupSchema=joi.object({
    email:joi.string().email().required().pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
    .message({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
        "string.pattern.base": "Invalid email format example@example.com",
    }),
    password:joi.string().required().min(8).pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d).+$")).message({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter and one digit",
    }),
    name:joi.string().required().min(3).max(15).message({
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters long",
        "string.max": "Name must be at most 15 characters long",
    }),
    phone:joi.string().required().pattern(new RegExp(/^(?:\+20|0)?1[0125]\d{8}$/)).message({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Invalid phone number format",
    }),
    avatar:joi.string().optional(),
    isActive:joi.boolean().default(false),
    isVerified:joi.boolean().default(false), 
})

export const loginSchema=joi.object({
    email:joi.string().email().required().pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
    .message({
        "string.empty": "Email is required",
        "string.email": "Invalid email format",
        "string.pattern.base": "Invalid email format example@example.com",
    }),
    password:joi.string().required().min(8).pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d).+$")).message({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "string.pattern.base": "Password must contain at least one uppercase letter and one digit",
    }),
})