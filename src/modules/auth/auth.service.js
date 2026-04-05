import userModel from "../../database/model/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import sendEmail from "../../common/email/sendEmail.js";
import { generateRefreshToken, generateToken } from "../../middleware/auth.js";

export const signup=async(req,res)=>{
    try{
    let {email,password,name,phone}=req.body;
    let existUser=await userModel.findOne({email});
    if(existUser){
        return res.status(409).json({message:"user already exist"})
    }
    let hashedPassword=await bcrypt.hash(password,12);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    let newUser=new userModel({
        email,
        password:hashedPassword,
        name,
        phone,
        verificationToken,
        verificationTokenExpiresAt
    })
    if(newUser){
        await newUser.save();
        const verificationLink = `http://localhost:3000/api/v1/auth/verify-email/${verificationToken}`;
        await sendEmail({
            email:newUser.email,
            subject:"Verify Your Email",
            text:`use this link to verify your email ${verificationLink}`
        })
        res.status(201).json({message:"user created successfully",newUser})
    }else{
        res.json({message:"user not created"})
    }
}catch(err){
    res.status(500).json({message:err.message})
}
}
export const varifyEmail= async(req,res)=>{
    let {token}=req.params;
    let user=await userModel.findOne({verificationToken:token});
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    if(user.verificationTokenExpiresAt<Date.now()){
        return res.status(400).json({message:"token expired"})
    }
    user.isActive=true;
    user.isVerified=true;
    user.verificationToken=undefined;
    user.verificationTokenExpiresAt=undefined;
    let accessToken = generateToken(user);
    let refreshToken = generateRefreshToken(user);
    user.refreshToken=refreshToken;
    await user.save();
    res.status(200).json({message:"email verified successfully",user,accessToken,refreshToken})

}
export const login=async(req,res)=>{
    let {email,password}=req.body;
    let user=await userModel.findOne({email});
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    if(!user.isActive){
        return res.status(400).json({message:"user is banned"})
    }
    if(!user.isVerified){
        return res.status(400).json({message:"user is not verified"})
    }
    let isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"invalid password"})
    }
    let accessToken = generateToken(user);
    let refreshToken = generateRefreshToken(user);
    user.refreshToken=refreshToken;
    await user.save();
    res.status(200).json({message:"login successfully",userData :user,accessToken,refreshToken})
}
export const resendVerification=async(req,res)=>{
    let {email,password}=req.body;
    let user=await userModel.findOne({email}); 
    if (!user){
        return res.status(404).json({message:"user not found"})
    }
    let matchedPassword=await bcrypt.compare(password,user.password);
    if(!matchedPassword){
        return res.status(400).json({message:"invalid password"})
    }
    if(user.isVerified){
        return res.status(400).json({message:"user is already verified"})
    }
    const updatedVerificationToken = crypto.randomBytes(32).toString("hex");
    const updatedVerificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.verificationToken = updatedVerificationToken;
    user.verificationTokenExpiresAt = updatedVerificationTokenExpiresAt;
    await user.save();
    const verificationLink = `http://localhost:3000/api/v1/auth/verify-email/${updatedVerificationToken}`;
        await sendEmail({
            email:user.email,
            subject:"Verify Your Email",
            text:`use this link to verify your email ${verificationLink}`
        })
    res.status(200).json({message:"verification email sent successfully"}) 
}
export const fogetPassword=async (req,res)=>{
    let {email}=req.body;
    let user=await userModel.findOne({email});
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    const resetPasswordToken=crypto.randomBytes(32).toString("hex");
    const resetPasswordTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.resetPasswordToken=resetPasswordToken;
    user.resetPasswordTokenExpiresAt=resetPasswordTokenExpiresAt;
    await user.save();
    const resetLink = `http://localhost:3000/api/v1/auth/reset-password/${resetPasswordToken}`;
        await sendEmail({
            email:user.email,
            subject:"Verify Your Email",
            text:`use this link to change your password ${resetLink}`
        })
        res.status(200).json({message:"password reset email sent successfully"})
    
}
export const resetPassword=async(req,res)=>{
    let {token}=req.params;
    let {password}=req.body;
    let user=await userModel.findOne({resetPasswordToken:token});
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    if(user.resetPasswordTokenExpiresAt<Date.now()){
        return res.status(400).json({message:"token expired"})
    }
    let hashedPassword=await bcrypt.hash(password,12);
    user.password=hashedPassword;
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpiresAt=undefined;
    await user.save();
    res.status(200).json({message:"password reset successfully",user})
}
