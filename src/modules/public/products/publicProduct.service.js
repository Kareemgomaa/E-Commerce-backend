import mongoose from "mongoose";
import productModel from "../../../database/model/product.model.js";

export const getAllActiveProducts=async(req,res)=>{
    let products=await productModel.find({isDeleted:false});
    if(!products) return res.status(404).json({message:"No products found"});
    await res.status(200).json({message:"Products found",products});
}
export const getProduct=async(req,res)=>{
    let {id}=req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }
    let product=await productModel.findById(id);
    if(!product) return res.status(404).json({message:"Product not found"});
    if(product.isDeleted) return res.status(400).json({message:"Product deleted"});
    res.status(200).json({message:"Product found",product});
}
export const getProductsByCategory=async(req,res)=>{
    let {categoryId}=req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID format" });
    }
    let products=await productModel.find({category:categoryId,isDeleted:false});
    if(!products){
        return res.status(404).json({message:"No products found in this category"});
    }
    res.status(200).json({message:"Products found",products});
}
export const getProductsBySubCategory=async(req,res)=>{
    let {subCategoryId}=req.params;
    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
        return res.status(400).json({ message: "Invalid subcategory ID format" });
    }
    let products=await productModel.find({subcategory:subCategoryId,isDeleted:false});
    if(!products){
        return res.status(404).json({message:"No products found in this subcategory"})
    }
    res.status(200).json({message:"Products found",products});
}

export const getFillteredProducts = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            minPrice, 
            maxPrice, 
            sort, 
            category, 
            subcategory,
            name 
        } = req.query;
        const filter = { isDeleted: false }; 
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            filter.category = category;
        }
        if (subcategory && mongoose.Types.ObjectId.isValid(subcategory)) {
            filter.subcategory = subcategory;
        }
        if (name) {
            filter.name = { $regex: name, $options: "i" };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice); 
            if (maxPrice) filter.price.$lte = Number(maxPrice); 
        }
        let sortOption = { createdAt: -1 }; 
        if (sort) {
            if (sort === 'price_asc') sortOption = { price: 1 };
            if (sort === 'price_desc') sortOption = { price: -1 };
            if (sort === 'name') sortOption = { name: 1 };
        }
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption,
            populate: [
                { path: 'category', select: 'name' },
                { path: 'subcategory', select: 'name' }
            ], 
            lean: true 
        };
        const result = await productModel.paginate(filter, options);
        if (!result.docs.length) {
            return res.status(404).json({ success: false, message: "No products match these filters" });
        }
        res.status(200).json({
            success: true,
            message: "Products filtered successfully",
            ...result
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });}}