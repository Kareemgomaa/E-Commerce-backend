import categoryModel from "../../../database/model/category.model.js";
import subCategoryModel from "../../../database/model/subCategories.model.js";

export const categories=async (req,res)=>{
    let categories=await categoryModel.find({isDeleted:false});
    if (categories.length === 0){
        return res.status(404).json({message:"Categories not found",categoriesList:[]})
    }
    res.status(200).json({message:"Categories fetched successfully",categories})
}
export const getSubCategoriesByCategoryId=async(req,res)=>{
    let {id}=req.params;
    let category=await categoryModel.findById(id);
    if(!category){
        return res.status(404).json({message:"Category not found"})
    }
    let subCategories=await subCategoryModel.find({category:id,isDeleted:false});
    if(subCategories.length===0){
        res.status(404).json({message:"SubCategories not found",subCategoriesList:[]})
    }
    res.status(200).json({message:"SubCategories fetched successfully",subCategories})
}
export const getSubCategoryById=async(req,res)=>{
    let {id}=req.params;
    let subCategory=await subCategoryModel.findById(id);
    if(!subCategory){
        return res.status(404).json({message:"SubCategory not found"})
    }
    res.status(200).json({message:"SubCategory fetched successfully",subCategory})
}