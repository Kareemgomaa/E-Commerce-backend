import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    stock:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"categories",
        required:true
    },
    subcategory:{
        type:Schema.Types.ObjectId,
        ref:"subCategories",
        required:true
    },
    images:{
        type:Array,
        required:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        default:null
    },
    autoDeletedAt:{
        type:Date,
        default:null
    }
})

productSchema.plugin(mongoosePaginate);

export const productModel=mongoose.model("products",productSchema);
export default productModel;