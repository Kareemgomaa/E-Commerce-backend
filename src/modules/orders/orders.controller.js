import { Router } from "express";
import { auth, allowedRoles } from "../../middleware/auth.js";
import { checkout, getMyOrders, getOrderDetails, getAllOrdersAdmin, updateOrderStatusAdmin } from "./orders.service.js";

const ordersRouter = Router();

ordersRouter.post('/orders/checkout', auth, checkout);
ordersRouter.get('/orders', auth, getMyOrders);
ordersRouter.get('/orders/:id', auth, getOrderDetails);

ordersRouter.get('/admin/orders', auth, allowedRoles(['admin']), getAllOrdersAdmin);
ordersRouter.patch('/admin/orders/:id/status', auth, allowedRoles(['admin']), updateOrderStatusAdmin);

export default ordersRouter;