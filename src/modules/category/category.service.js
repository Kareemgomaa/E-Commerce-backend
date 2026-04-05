import categoryModel from "../../database/model/category.model.js";

export const createNewCategory=async(req,res)=>{
    try {
        let {title,description,categoryImage}=req.body;
        const category = await categoryModel.create({title,description,categoryImage});
        res.status(201).json({message: "Category created successfully", category});
    } catch (error) {
     res.status(500).json({message:error.message})   
    }
}
export const updateCategory=async(req,res)=>{
    try{
    let {id}=req.params;
    let {title,description,categoryImage}=req.body;
    let updatedCategory=await categoryModel.findByIdAndUpdate(id,{title,description,categoryImage},{new:true});
    res.status(200).json({message:"Category updated successfully",updatedCategory})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
export const softDeleteCategory=async(req,res)=>{
    try{
    let {id}=req.params;
    if(!id){
        return res.status(400).json({message:"id is required"})
    }
    let category=await categoryModel.findById(id);
    if(!category){
        return res.status(404).json({message:"Category not found"})
    }
    if(category.isDeleted){
        return res.status(400).json({message:"Category already deleted"})
    }
    let deletedCategory=await categoryModel.findByIdAndUpdate(id,{isDeleted:true},{new:true});
    res.status(200).json({message:"Category deleted successfully",deletedCategory})
    }catch(error){
        res.status(500).json({message:error.message})
    }
}
export const getAllCategories = async (req, res) => {
    try {
        let categories = await categoryModel
            .find({ isDeleted: false })
            .populate({
                path: "subCategories",
                match: { isDeleted: false },     
                select: "title description subCategoryImage"  
            });

        if (categories.length === 0) {
            return res.status(404).json({ message: "Categories not found", categoriesList: [] });
        }

        res.status(200).json({ message: "Categories fetched successfully", categories });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}