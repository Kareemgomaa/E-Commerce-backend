import { Router } from "express";
import subCategoryModel from "../../../database/model/subCategories.model.js";
import categoryModel from "../../../database/model/category.model.js";
import { categories, getSubCategoriesByCategoryId, getSubCategoryById } from "./publicCategory.service.js";

let publicCategoryRouter=Router();
publicCategoryRouter.get("/puclicCategories",categories)
publicCategoryRouter.get("/categories/:id/subcategories",getSubCategoriesByCategoryId)
publicCategoryRouter.get("/subcategories/:id",getSubCategoryById)
export default publicCategoryRouter;