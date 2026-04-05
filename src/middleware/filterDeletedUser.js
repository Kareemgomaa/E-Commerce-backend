import userModel from "../database/model/user.model.js"

export const filterDeletedUsed=(req,res,next)=>{
    let user=req.user;
    if(user.isDeleted){
        return res.json({message:"user was deleted"})
    }
    next();
}