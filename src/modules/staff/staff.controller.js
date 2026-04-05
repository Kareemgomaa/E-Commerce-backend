import { Router } from "express";
import { allowedRoles, auth } from "../../middleware/auth.js";
import { validationBy } from "../../utils/validation.js";
import { staffValidationSchema, deductionValidationSchema, salaryAdjustmentValidationSchema } from "./staff.validation.js";

import { addNewStaff, getAllStaffs, getStaffById, softDeleteStaff, updateStaff, checkIn, checkOut, addDeduction, getStaffDeductions, updateDeduction, deleteDeduction, calculateMonthlySalary, payMonthlySalary, adjustMonthlySalary } from "./staff.service.js";

let staffRouter=Router();

staffRouter.post("/",auth,allowedRoles(["admin"]),validationBy(staffValidationSchema),addNewStaff )
staffRouter.get("/",auth,allowedRoles(["admin"]),getAllStaffs)
staffRouter.get("/:id",auth,allowedRoles(["admin"]),getStaffById)
staffRouter.put("/:id",auth,allowedRoles(["admin"]),updateStaff)
staffRouter.delete("/:id",auth,allowedRoles(["admin"]),softDeleteStaff)
staffRouter.post("/checkin",auth,allowedRoles(["staff","admin"]),checkIn)
staffRouter.post("/checkout",auth,allowedRoles(["staff","admin"]),checkOut)

staffRouter.post("/:id/deductions", auth, allowedRoles(["admin"]), validationBy(deductionValidationSchema), addDeduction);
staffRouter.get("/:id/deductions", auth, allowedRoles(["admin"]), getStaffDeductions);
staffRouter.put("/:id/deductions/:deductionId", auth, allowedRoles(["admin"]), validationBy(deductionValidationSchema), updateDeduction);
staffRouter.delete("/:id/deductions/:deductionId", auth, allowedRoles(["admin"]), deleteDeduction);

staffRouter.get("/:id/salary/:month", auth, allowedRoles(["admin"]), calculateMonthlySalary);
staffRouter.post("/:id/salary/:month/pay", auth, allowedRoles(["admin"]), payMonthlySalary);
staffRouter.put("/:id/salary/:month/adjust", auth, allowedRoles(["admin"]), validationBy(salaryAdjustmentValidationSchema), adjustMonthlySalary);

export default staffRouter;