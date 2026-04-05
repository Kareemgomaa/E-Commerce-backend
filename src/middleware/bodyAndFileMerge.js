export const merge = (req, res, next) => {
    if (req.file) {
        req.body.avatarPath = req.file.path;
    } else {
        return res.status(400).json({ message: "Please upload an image file." });
    }
    next();
}

export const categoriesPhotoMerge = (req, res, next) => {
    if (req.file) {
        req.body.categoryImage = req.file.path;
    }
    next();
}

export const subCategoriesPhotoMerge = (req, res, next) => {
    if (req.file) {
        req.body.subCategoryImage = req.file.path;
    }
    next();
}

export const productMerge = (req, res, next) => {
    if (req.files && req.files.length > 0) {
        req.body.images = req.files.map(file => file.path);
    }
    next();
}