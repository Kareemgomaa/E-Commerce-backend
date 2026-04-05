import mongoose from "mongoose";
import cartModel from "../../database/model/cart.model.js";
import productModel from "../../database/model/product.model.js";


const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach(item => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalPrice = totalPrice;
};
export const addProductToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const product = await productModel.findById(productId);
    if (!product || product.isDeleted) {
        return res.status(404).json({ message: "Product not found or is inactive" });
    }
    if (quantity > product.stock) {
        return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }

    let cart = await cartModel.findOne({ user: req.user._id });

    if (!cart) {
        cart = await cartModel.create({
            user: req.user._id,
            cartItems: [{ product: productId, quantity: quantity || 1, price: product.price }]
        });
    } else {
        const itemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            const newQuantity = cart.cartItems[itemIndex].quantity + (quantity || 1);
            if (newQuantity > product.stock) {
                return res.status(400).json({ message: "Total quantity in cart exceeds available stock" });
            }
            cart.cartItems[itemIndex].quantity = newQuantity;
        } else {
            cart.cartItems.push({ product: productId, quantity: quantity || 1, price: product.price });
        }
    }

    calcTotalCartPrice(cart);
    await cart.save();
    res.status(201).json({ message: "Product added to cart successfully", cart });
};

export const getCart = async (req, res) => {
    const cart = await cartModel.findOne({ user: req.user._id }).populate('cartItems.product');
    if (!cart) return res.status(404).json({ message: "Cart is empty" });
    res.status(200).json({ cart });
};

export const updateQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID format" });
    }
    const product = await productModel.findById(productId);
    if (!product || product.isDeleted) return res.status(404).json({ message: "Product not found" });
    if (quantity > product.stock) {
        return res.status(400).json({ message: "Requested quantity exceeds available stock" });
    }
    const cart = await cartModel.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const item = cart.cartItems.find(item => item.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Product not found in cart" });
    item.quantity = quantity;
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({ message: "Quantity updated successfully", cart });
};

export const removeItemFromCart = async (req, res) => {
    const cart = await cartModel.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { cartItems: { product: req.params.productId } } },
        { new: true }
    );
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({ message: "Item removed from cart successfully", cart });
};

export const clearCart = async (req, res) => {
    const cart = await cartModel.findOneAndDelete({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart already empty" });
    res.status(200).json({ message: "Cart cleared successfully" });
};