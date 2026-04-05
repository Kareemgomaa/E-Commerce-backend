import productModel from "../../database/model/product.model.js";

export const addProduct=async(req,res)=>{
    let {name,description,price,stock,category,subcategory,images}=req.body;
    let newProduct = await productModel.create({
        name, description, price, stock, category, subcategory, images
    });
    if(stock<=0){
        await productModel.findByIdAndUpdate(newProduct._id,{isDeleted:true});
    }
    res.status(201).json({message:"Product created successfully",newProduct})
}
export const updateProduct=async(req,res)=>{
    let {id}=req.params;
    let product= await productModel.findById(id);
    if(!product) return res.status(404).json({message:"Product not found"});
    let updatedProduct=await productModel.findByIdAndUpdate(id,req.body,{new:true});
    res.status(200).json({message:"Product updated successfully",updatedProduct});
}
export const deleteProduct=async(req,res)=>{
    let {id}=req.params;
    let product= await productModel.findById(id);
    if(!product){
        return res.status(404).json({message:"Product not found"});
    }
    if(product.isDeleted) return res.status(400).json({message:"Product already deleted"});
    await productModel.findByIdAndUpdate(id,{isDeleted:true});
    res.status(200).json({message:"Product deleted successfully"});
}
export const updateStockQuntity=async(req,res)=>{
    let {id}=req.params;
    let {quantity}=req.body;
    let product= await productModel.findById(id);
    if(!product){
        return res.status(404).json({message:"Product not found"});
    }
    await productModel.findByIdAndUpdate(id,{stock:product.stock+quantity});
    if(product.stock+quantity<=0){
        await productModel.findByIdAndUpdate(id,{isDeleted:true,autoDeletedAt:new Date()});
    }
    res.status(200).json({message:"Stock updated successfully"});
}
