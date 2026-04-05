import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema({
    staff: {
        type: Schema.Types.ObjectId,
        ref: "staffs",
        required: true
    },
    date: {
        type: String, 
        required: true
    },
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: ["present", "late", "absent"],
        default: "present"
    },
    workingHours: {
        type: Number,
        default: 0
    },
    deduction: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const attendanceModel = mongoose.model("attendances", attendanceSchema);
export default attendanceModel;