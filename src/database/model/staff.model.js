import mongoose, { Schema } from "mongoose";

const staffSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    dailySalary:{
        type:Number,
        required:true
    },
    joinDate:{
        type:Date,
        required:true,
        default: Date.now
    },
    department:{
        type:String,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
        monthlyReports:[{
            month:{
                type:String,
                required:true
            },
            totalDaysWorked:{
                type:Number,
                required:true
            },
            totalDeductions:{
                type:Number,
                required:true
            },
            adjustments: {
                type: Number,
                default: 0
            },
            finalSalary:{
                type:Number,
                required:true
            },
            isPaid:{
                type:Boolean,
                default:false
            },
        paidAt:{
            type:Date,
            default:null
        }
    }
    ]

})

export const staffModel=mongoose.model("staffs",staffSchema);
export default staffModel;