import mongoose, { mongo, Schema } from "mongoose";

const subCategorySchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    subCategoryImage:{
        type:String,
        required:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"categories",
        required:true
    }
})

export const subCategoryModel=mongoose.model("subCategories",subCategorySchema);
export default subCategoryModel;