import joi from "joi";

export const createNewProductValidation=joi.object({
    name:joi.string().min(3).max(20).required().messages({
        "string.empty":"name is required",
        "string.min":"name must be at least 3 characters long",
        "string.max":"name must be at most 20 characters long",
        "any.required":"name is required"
    }),
    description:joi.string().min(3).max(200).messages({
        "string.empty":"description is required",
        "string.min":"description must be at least 3 characters long",
        "string.max":"description must be at most 200 characters long"
    }),
    price:joi.number().min(0).required().messages({
        "number.empty":"price is required",
        "number.min":"price must be greater than 0",
        "any.required":"price is required"
    }),
    stock:joi.number().min(0).required().messages({
        "number.empty":"stock is required",
        "number.min":"stock must be greater than 0",
        "any.required":"stock is required"
    }),
    category:joi.string().required().messages({
        "string.empty":"category is required",
        "any.required":"category is required"
    }),
    subcategory:joi.string().required().messages({
        "string.empty":"subcategory is required",
        "any.required":"subcategory is required"
    }),
    images:joi.array().items(joi.string()).messages({
        "array.base":"images must be an array of strings"
    })
})