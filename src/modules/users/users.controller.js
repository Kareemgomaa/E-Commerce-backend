import { Router } from "express"
import {  auth } from "../../middleware/auth.js";
import { deleteProfile, getProfile, updateProfile, uploadUsrAvatar } from "./users.service.js";
import { filterDeletedUsed } from "../../middleware/filterDeletedUser.js";
import { merge } from "../../middleware/bodyAndFileMerge.js";
import { uploadAvatar } from "../../middleware/multer.js";

let usersRouter=Router();
usersRouter.get("/profile",auth,filterDeletedUsed,getProfile)
usersRouter.post("/upload-avatar", auth, uploadAvatar.single('image'), merge, uploadUsrAvatar);
usersRouter.put("/profile", auth, uploadAvatar.single('image'), merge, updateProfile)

usersRouter.delete("/profile",auth,deleteProfile)
export default usersRouter;