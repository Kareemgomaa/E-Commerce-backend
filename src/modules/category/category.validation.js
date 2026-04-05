import joi from "joi";

export const addCategory=joi.object({
    title:joi.string().min(3).max(20).required().messages({
        "string.empty":"title is required",
        "string.min":"title must be at least 3 characters long",
        "string.max":"title must be at most 20 characters long",
        "any.required":"title is required"
    }),
    description:joi.string().min(5).max(30).required().messages({
        "string.empty":"description is required",
        "string.min":"description must be at least 5 characters long",
        "string.max":"description must be at most 30 characters long",
        "any.required":"description is required"
    }),
    categoryImage:joi.string().optional(),
    isDeleted:joi.boolean().default(false)
})