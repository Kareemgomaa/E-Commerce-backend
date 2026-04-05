import mongoose from "mongoose";
import cartModel from "../../database/model/cart.model.js";
import orderModel from "../../database/model/order.model.js";
import productModel from "../../database/model/product.model.js";
import stripe from "stripe";

export const checkout = async (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;
    const cart = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product');

    if (!cart || cart.cartItems.length === 0) {
        return res.status(404).json({ message: "Cart is empty" });
    }
    for (const item of cart.cartItems) {
        const product = item.product; 
        if (!product || product.isDeleted) {
            return res.status(404).json({ message: `Product not found or inactive` });
        }
        if (product.stock < item.quantity) {
            return res.status(400).json({ 
                message: `Insufficient stock for product: ${product.name}`, 
                availableQuantity: product.stock 
            });
        }
    }
    if (paymentMethod === 'cod') {
        const order = await orderModel.create({
            user: req.user._id,
            items: cart.cartItems,
            totalAmount: cart.totalPrice,
            shippingAddress,
            paymentMethod: 'cod'
        });
        const bulkOption = cart.cartItems.map(item => ({
            updateOne: {
                filter: { _id: item.product._id },
                update: { $inc: { stock: -item.quantity } }
            }
        }));
        await productModel.bulkWrite(bulkOption);
        await cartModel.findOneAndDelete({ user: req.user._id });
        return res.status(201).json({ message: "Order created successfully (COD)", order });
    }

    if (paymentMethod === 'card') {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: req.user.email,
            metadata: {
                userId: req.user._id.toString(),
                shippingAddress: JSON.stringify(shippingAddress)
            },
            line_items: cart.cartItems.map(item => ({
                price_data: {
                    currency: 'egp',
                    product_data: { name: item.product.name },
                    unit_amount: item.price * 100, 
                },
                quantity: item.quantity,
            })),
            success_url: `${req.protocol}://${req.get('host')}/api/v1/orders/success`,
            cancel_url: `${req.protocol}://${req.get('host')}/api/v1/orders/cancel`,
        });
        return res.status(200).json({ message: "Redirect to Stripe", url: session.url });
    }

    res.status(400).json({ message: "Invalid payment method" });
};

export const getMyOrders = async (req, res) => {
    const orders = await orderModel.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
};

export const getOrderDetails = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID format" });
    }
    const order = await orderModel.findOne({ _id: id, user: req.user._id }).populate('items.product');
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ order });
};

export const getAllOrdersAdmin = async (req, res) => {
    const orders = await orderModel.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ orders });
};

export const updateOrderStatusAdmin = async (req, res) => {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid order ID format" });
    }

    const updateData = {};
    if (orderStatus) {
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status" });
        }
        updateData.orderStatus = orderStatus;
    }

    if (paymentStatus) {
        const validPaymentStatuses = ['pending', 'paid', 'failed'];
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({ message: "Invalid payment status" });
        }
        updateData.paymentStatus = paymentStatus;
    }

    const order = await orderModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order updated successfully", order });
};