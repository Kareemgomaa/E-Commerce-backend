import mongoose, { Schema } from "mongoose";

const deductionSchema = new Schema({
    staff: {
        type: Schema.Types.ObjectId,
        ref: "staffs",
        required: true
    },
    month: {
        type: String, 
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    reason: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const deductionModel = mongoose.model("deductions", deductionSchema);
export default deductionModel;