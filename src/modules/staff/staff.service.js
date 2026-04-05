import userModel from "../../database/model/user.model.js";
import staffModel from "../../database/model/staff.model.js";
import attendanceModel from "../../database/model/attendance.model.js";
import deductionModel from "../../database/model/deduction.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

export const addNewStaff=async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        let {email,password,name,phone,dailySalary,department}=req.body;
        let user=await userModel.findOne({email}).session(session);
        if(user){
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({message:"user already exist"})
        }

        let hashedPassword = await bcrypt.hash(password, 12);
        const [newUser] = await userModel.create([{
            email,
            password: hashedPassword,
            name,
            phone,
            role: "staff"
        }], { session });

        const [newStaff] = await staffModel.create([{
            user: newUser._id,
            dailySalary,
            department
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({message:"staff created successfully", staff: newStaff, user: newUser})
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({message: "Transaction failed", error: error.message})
    }
}

export const getAllStaffs=async(req,res)=>{
    try {
        const staffs = await staffModel.find().populate("user", "name email phone role");
        res.status(200).json({ message: "Success", staffs });
    } catch (error) {
        res.status(500).json({ message: "Error fetching staffs", error: error.message });
    }
}

export const getStaffById=async(req,res)=>{
    try {
        let {id}=req.params;
        const staff = await staffModel.findById(id).populate("user", "name email phone role");
        if(!staff){
            return res.status(404).json({message:"staff not found"})
        }else{
            res.status(200).json({message:"success",staff})
        }
    } catch (error) {return res.status(500).json({message:error.message})}
}
export const updateStaff=async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let {id}=req.params;
        let staff=await staffModel.findById(id).session(session);
        if(!staff){
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({message:"staff not found"})
        }
        let {name,email,phone,dailySalary,department}=req.body;

        const userUpdate = {};
        if (name) userUpdate.name = name;
        if (email) userUpdate.email = email;
        if (phone) userUpdate.phone = phone;

        if (Object.keys(userUpdate).length > 0) {
            await userModel.findByIdAndUpdate(staff.user, userUpdate, { session });
        }

        if (dailySalary !== undefined) staff.dailySalary = dailySalary;
        if (department !== undefined) staff.department = department;

        await staff.save({ session });
        
        await staff.populate("user", "name email phone role");

        await session.commitTransaction();
        session.endSession();

        return res.status(200).json({message:"staff updated successfully", updatedStaff: staff})
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({message:error.message})
    }
}
export const softDeleteStaff=async(req,res)=>{
    let {id}=req.params;
    let staff=await staffModel.findById(id);
    if(!staff){
        return res.status(404).json({message:"staff not found"})
    }
    if(staff.isActive===false){
        return res.status(400).json({message:"staff already deleted"})
    }
    staff.isActive=false;
    await staff.save();
    res.status(200).json({message:"staff deleted successfully",staff})
}
export const checkIn=async(req,res)=>{
    try {
        let{id}=req.user
        const staff = await staffModel.findOne({ user:id });
        if (!staff) return res.status(404).json({ message: "Staff record not found" });
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0]; 
        const existingRecord = await attendanceModel.findOne({ staff: staff._id, date: todayDate });
        if (existingRecord) return res.status(400).json({ message: "Already checked in today" });
        let status = "present";
        const startWorkTime = new Date(now);
        startWorkTime.setHours(9, 0, 0, 0); 
        if (now > startWorkTime) status = "late";
        const record = await attendanceModel.create({
            staff: staff._id,
            date: todayDate,
            checkIn: now,
            status
        });
        res.status(201).json({ message: "Check-in successful", record });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const checkOut = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const staff = await staffModel.findOne({ user: req.user._id }).session(session);
        if (!staff) throw new Error("Staff record not found");

        const now = new Date();
        const todayDate = now.toISOString().split('T')[0];

        const attendance = await attendanceModel.findOne({ staff: staff._id, date: todayDate }).session(session);
        if (!attendance) throw new Error("No check-in record found for today");
        if (attendance.checkOut) throw new Error("Already checked out today");

        const diffInMs = now - attendance.checkIn;
        const workingHours = diffInMs / (1000 * 60 * 60);

        let dailyDeduction = 0;
        if (workingHours < 8) {
            const hourlyRate = staff.dailySalary / 8;
            dailyDeduction = (8 - workingHours) * hourlyRate;
        }

        attendance.checkOut = now;
        attendance.workingHours = workingHours;
        attendance.deduction = dailyDeduction;
        await attendance.save({ session });

        const currentMonth = now.toLocaleString('default', { month: 'long', year: 'numeric' });
        let report = staff.monthlyReports.find(r => r.month === currentMonth);

        if (!report) {
            staff.monthlyReports.push({
                month: currentMonth,
                totalDaysWorked: 1,
                totalDeductions: dailyDeduction,
                finalSalary: staff.dailySalary - dailyDeduction
            });
        } else {
            report.totalDaysWorked += 1;
            report.totalDeductions += dailyDeduction;
            report.finalSalary = (report.totalDaysWorked * staff.dailySalary) - report.totalDeductions;
        }

        await staff.save({ session });
        await session.commitTransaction();
        session.endSession();

        res.status(200).json({ 
            message: "Check-out successful", 
            workingHours: workingHours.toFixed(2), 
            deduction: dailyDeduction.toFixed(2) 
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
}
const formatMonthName = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
}
export const addDeduction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const { month, amount, reason } = req.body;

        const staff = await staffModel.findById(id).session(session);
        if (!staff) throw new Error("Staff not found");

        const deduction = await deductionModel.create([{ staff: id, month, amount, reason }], { session });

        const reportMonth = formatMonthName(month);
        let report = staff.monthlyReports.find(r => r.month === reportMonth);

        if (!report) {
            staff.monthlyReports.push({
                month: reportMonth,
                totalDaysWorked: 0,
                totalDeductions: amount,
                finalSalary: -amount 
            });
        } else {
            report.totalDeductions += amount;
            report.finalSalary = (report.totalDaysWorked * staff.dailySalary) - report.totalDeductions;
        }

        await staff.save({ session });
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ message: "Deduction added successfully", deduction: deduction[0] });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
}

export const getStaffDeductions = async (req, res) => {
    try {
        const { id } = req.params;
        const deductions = await deductionModel.find({ staff: id }).sort({ date: -1 });
        res.status(200).json({ message: "Success", deductions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDeduction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { deductionId } = req.params;
        const { amount, reason } = req.body;

        const oldDeduction = await deductionModel.findById(deductionId).session(session);
        if (!oldDeduction) throw new Error("Deduction not found");

        const staff = await staffModel.findById(oldDeduction.staff).session(session);
        const diff = amount - oldDeduction.amount;

        oldDeduction.amount = amount;
        oldDeduction.reason = reason;
        await oldDeduction.save({ session });

        const reportMonth = formatMonthName(oldDeduction.month);
        let report = staff.monthlyReports.find(r => r.month === reportMonth);
        if (report) {
            report.totalDeductions += diff;
            report.finalSalary = (report.totalDaysWorked * staff.dailySalary) - report.totalDeductions;
            await staff.save({ session });
        }

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: "Deduction updated", deduction: oldDeduction });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
};

export const deleteDeduction = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { deductionId } = req.params;

        const deduction = await deductionModel.findById(deductionId).session(session);
        if (!deduction) throw new Error("Deduction not found");

        const staff = await staffModel.findById(deduction.staff).session(session);
        const amountToRemove = deduction.amount;

        const reportMonth = formatMonthName(deduction.month);
        let report = staff.monthlyReports.find(r => r.month === reportMonth);
        if (report) {
            report.totalDeductions -= amountToRemove;
            report.finalSalary = (report.totalDaysWorked * staff.dailySalary) - report.totalDeductions;
            await staff.save({ session });
        }

        await deductionModel.findByIdAndDelete(deductionId).session(session);

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ message: "Deduction deleted successfully" });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
}

export const calculateMonthlySalary = async (req, res) => {
    try {
        const { id, month } = req.params; 
        const staff = await staffModel.findById(id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        const workedDays = await attendanceModel.countDocuments({ staff: id, date: new RegExp(`^${month}`), status: { $in: ["present", "late"] } });
        const lateDays = await attendanceModel.countDocuments({ staff: id, date: new RegExp(`^${month}`), status: "late" });
        const absentDays = await attendanceModel.countDocuments({ staff: id, date: new RegExp(`^${month}`), status: "absent" });

        const manualDeductions = await deductionModel.aggregate([
            { $match: { staff: staff._id, month: month } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalManual = manualDeductions[0]?.total || 0;
        const baseSalary = staff.dailySalary * workedDays;
        const systemDeductions = (lateDays * (staff.dailySalary * 0.1)) + (absentDays * staff.dailySalary);
        const totalDeductions = systemDeductions + totalManual;
        const reportMonth = formatMonthName(month);
        let report = staff.monthlyReports.find(r => r.month === reportMonth);
        
        const adjustments = report ? (report.adjustments || 0) : 0;
        const finalSalary = baseSalary - totalDeductions + adjustments;

        if (!report) {
            staff.monthlyReports.push({ month: reportMonth, totalDaysWorked: workedDays, totalDeductions, finalSalary, adjustments });
        } else {
            report.totalDaysWorked = workedDays;
            report.totalDeductions = totalDeductions;
            report.finalSalary = finalSalary;
        }

        await staff.save();
        res.status(200).json({ message: "Salary calculated", calculation: { baseSalary, systemDeductions, totalManual, adjustments, finalSalary }, report: staff.monthlyReports.find(r => r.month === reportMonth) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const payMonthlySalary = async (req, res) => {
    try {
        const { id, month } = req.params;
        const staff = await staffModel.findById(id);
        const reportMonth = formatMonthName(month);
        let report = staff.monthlyReports.find(r => r.month === reportMonth);

        if (!report) return res.status(404).json({ message: "Salary report not found for this month. Calculate it first." });
        if (report.isPaid) return res.status(400).json({ message: "Salary already paid" });

        report.isPaid = true;
        report.paidAt = new Date();
        await staff.save();

        res.status(200).json({ message: "Salary marked as paid", report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const adjustMonthlySalary = async (req, res) => {
    try {
        const { id, month } = req.params;
        const { amount, reason } = req.body; 

        const staff = await staffModel.findById(id);
        const reportMonth = formatMonthName(month);
        let report = staff.monthlyReports.find(r => r.month === reportMonth);

        if (!report) {
            staff.monthlyReports.push({
                month: reportMonth,
                totalDaysWorked: 0,
                totalDeductions: 0,
                adjustments: amount,
                finalSalary: amount
            });
        } else {
            report.adjustments = (report.adjustments || 0) + amount;
            report.finalSalary += amount;
        }

        await staff.save();
        res.status(200).json({ message: "Salary adjusted successfully", report: staff.monthlyReports.find(r => r.month === reportMonth) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
