import subCategoryModel from "../../database/model/subCategories.model.js";

export const createNewSubCategory=async(req,res)=>{
    let {categoryId}=req.params
    let {title,description,subCategoryImage}=req.body;
    let subCategory=await subCategoryModel.create({title,description,subCategoryImage,category:categoryId});
    res.status(201).json({message:"subCategory created successfully",subCategory})
}
export const updateSubCategory=async(req,res)=>{
    let {id}=req.params;
    let isExist=await subCategoryModel.findById(id);
    if(!isExist){
        return res.status(404).json({message:"subCategory not found"})
    }
    let {title,description,subCategoryImage}=req.body;
    let updatedSubCategory=await subCategoryModel.findByIdAndUpdate(id,{title,description,subCategoryImage},{new:true});
    res.status(200).json({message:"subCategory updated successfully",updatedSubCategory})

}
export const softDeletSubCategory=async(req,res)=>{
    let {id}=req.params;
    if(!id){
        return res.status(400).json({message:"id is required"})
    }
    let subCategory=await subCategoryModel.findById(id);
    if(!subCategory){
        return res.status(404).json({message:"subCategory not found"})
    }
    if(subCategory.isDeleted){
        return res.status(400).json({message:"subCategory already deleted"})
    }
    let deletedSubCategory=await subCategoryModel.findByIdAndUpdate(id,{isDeleted:true},{new:true});
    res.status(200).json({message:"subCategory deleted successfully",deletedSubCategory})
}