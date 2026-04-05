import { Router } from "express";
import { allowedRoles, auth } from "../../middleware/auth.js";
import { createNewProductValidation } from "./products.validation.js";
import { uploadProductImages } from "../../middleware/multer.js";
import { productMerge } from "../../middleware/bodyAndFileMerge.js";
import { validationBy } from "../../utils/validation.js";
import { addProduct, deleteProduct, updateProduct, updateStockQuntity } from "./product.service.js";

let productRouter=Router();
productRouter.post('/products',auth,allowedRoles(["admin"]),uploadProductImages.array("images",10),productMerge,validationBy(createNewProductValidation),addProduct);
productRouter.put('/products/:id',auth,allowedRoles(["admin"]),uploadProductImages.array("images",10),productMerge,updateProduct)
productRouter.delete('/products/:id',auth,allowedRoles(["admin"]),deleteProduct)
productRouter.patch('/products/:id/stock',auth,allowedRoles(["admin"]),updateStockQuntity)

export default productRouter;