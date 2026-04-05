import { Router } from "express";
import { allowedRoles, auth } from "../../../middleware/auth.js";
import { getAllActiveProducts,getFillteredProducts,getProduct,getProductsByCategory ,getProductsBySubCategory} from "./publicProduct.service.js";

let publicProductRouter=Router();
publicProductRouter.get('/products',getAllActiveProducts)
publicProductRouter.get('/products/filter',getFillteredProducts)
publicProductRouter.get('/products/:id',getProduct)
publicProductRouter.get('/products/category/:categoryId',getProductsByCategory)
publicProductRouter.get('/products/subCategory/:subCategoryId',getProductsBySubCategory)



export default publicProductRouter;