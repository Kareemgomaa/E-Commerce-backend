import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    categoryImage: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    toJSON: { virtuals: true },  
    toObject: { virtuals: true }
});

categorySchema.virtual("subCategories", {
    ref: "subCategories",       
    localField: "_id",          
    foreignField: "category",   
});

export const categoryModel = mongoose.model("categories", categorySchema);
export default categoryModel;