import { Router } from "express";
import { validationBy } from "../../utils/validation.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

import { fogetPassword, login, resendVerification, resetPassword, signup, varifyEmail } from "./auth.service.js";


let authRouter = Router();
authRouter.post('/signup',validationBy(signupSchema),signup)
authRouter.put("/verify-email/:token",varifyEmail)
authRouter.post("/login",validationBy(loginSchema),login)
authRouter.post("/resend-verification",resendVerification)
authRouter.post("/forgot-password",fogetPassword)
authRouter.post("/reset-password/:token",resetPassword)

export default authRouter;