import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const imageFileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only image files are allowed."), false);
    }
};

const createCloudinaryStorage = (folderName) => {
    return new CloudinaryStorage({
        cloudinary,
        params: async (req, file) => {
            let folder = folderName;
            if (folderName === "products") {
                const productName = req.body?.name
                    ? String(req.body.name).trim().replace(/\s+/g, "_")
                    : "unnamed";
                folder = `products/${productName}`;
            }
            return {
                folder,
                allowed_formats: ["jpg", "jpeg", "png", "webp"],
                transformation: [{ width: 800, crop: "limit" }],
            };
        },
    });
};
export const uploadAvatar = multer({
    storage: createCloudinaryStorage("avatars"),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadCategoriesPhoto = multer({
    storage: createCloudinaryStorage("categories"),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadsubCategoriesPhoto = multer({
    storage: createCloudinaryStorage("subcategories"),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProductImages = multer({
    storage: createCloudinaryStorage("products"),
    fileFilter: imageFileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});