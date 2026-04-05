import mongoose, { Schema } from "mongoose";


const userSchema =new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:false
    },
    avatar:{
        type:String,
        default:null
    },
    isActive:{
        type:Boolean,
        default:function(){
            return this.role==="admin" || this.role==="staff"
        }
    },
    role:{
        type:String,
        enum:["admin","user","staff"],
        default:"user"
    },
    isVerified:{
        type:Boolean,
        default:function(){
            return this.role==="admin" || this.role==="staff"
        }
    },
    verificationToken: {
        type: String,
        default: null
    },
    verificationTokenExpiresAt: {
        type: Date,
        default: null
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordTokenExpiresAt: {
        type: Date,
        default: null
    },
    refreshToken:{
        type:String,
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})


const userModel=mongoose.model("users",userSchema);
export default userModel;