import userModel from "../../database/model/user.model.js";
export const getProfile=(req,res)=>{
    let user=req.user;
    res.json({message:"user found successfully",user})
}
export const uploadUsrAvatar = async (req, res) => {
    try {
        const userId = req.user._id; 
        if (!req.body.avatarPath) {
            return res.status(400).json({ message: "No file path found" });
        }
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { avatar: req.body.avatarPath },
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Avatar updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const updateProfile=async(req,res)=>{
    let user=req.user;
    if(!user){
        return res.json({message:"user not found"})
    }
    const {name,phone,avatarPath}=req.body;
    let updatedUser=await userModel.findByIdAndUpdate(user._id,{name,phone,avatar:avatarPath},{new:true});
    res.json({message:"user updated successfully",user:updatedUser});
}
export const deleteProfile=async(req,res)=>{
    let user=req.user;
    if(!user){
        return res.json({message:"user not found"})
    }
    let deletedUser=await userModel.findByIdAndUpdate(user._id,{isDeleted:true},{new:true});
    res.json({message:"user deleted successfully",user:deletedUser});
}