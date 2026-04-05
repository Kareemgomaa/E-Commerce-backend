import { Router } from "express";
import { allowedRoles, auth } from "../../middleware/auth.js";
import { uploadsubCategoriesPhoto } from "../../middleware/multer.js";
import { categoriesPhotoMerge, merge, subCategoriesPhotoMerge } from "../../middleware/bodyAndFileMerge.js";
import { validationBy } from "../../utils/validation.js";
import { addSubCategoryValidation } from "./subCategories.validation.js";
import { createNewSubCategory, softDeletSubCategory, updateSubCategory } from "./subCategories.service.js";

let subCategoriesRouter=Router();
subCategoriesRouter.post("/subcategories/:categoryId",auth,allowedRoles(["admin"]),uploadsubCategoriesPhoto.single("image"),subCategoriesPhotoMerge,validationBy(addSubCategoryValidation),createNewSubCategory)
subCategoriesRouter.put("/subcategories/:id",auth,allowedRoles(["admin"]),subCategoriesPhotoMerge,updateSubCategory)
subCategoriesRouter.delete("/subcategories/:id",auth,allowedRoles(["admin"]),softDeletSubCategory)



export default subCategoriesRouter;