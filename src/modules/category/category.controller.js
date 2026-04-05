import { Router } from "express";
import { allowedRoles, auth } from "../../middleware/auth.js";
import { uploadCategoriesPhoto } from "../../middleware/multer.js";
import { categoriesPhotoMerge, merge } from "../../middleware/bodyAndFileMerge.js";
import { validationBy } from "../../utils/validation.js";
import { addCategory } from "./category.validation.js";
import { createNewCategory, getAllCategories, softDeleteCategory, updateCategory } from "./category.service.js";

let categoryRouter=Router();
categoryRouter.post("/categories",auth,allowedRoles(["admin"]),uploadCategoriesPhoto.single("image"),categoriesPhotoMerge,validationBy(addCategory),createNewCategory)
categoryRouter.put("/categories/:id",auth,allowedRoles(["admin"]),uploadCategoriesPhoto.single("image"),categoriesPhotoMerge,updateCategory)
categoryRouter.delete("/categories/:id",auth,allowedRoles(["admin"]),softDeleteCategory)
categoryRouter.get("/categories",auth,allowedRoles(["admin"]),getAllCategories)

export default categoryRouter;