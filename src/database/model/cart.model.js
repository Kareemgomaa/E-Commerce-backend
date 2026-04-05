import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    cartItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
            quantity: { type: Number, default: 1 },
            price: { type: Number, required: true }
        }
    ],
    totalPrice: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const cartModel = mongoose.model('cart', cartSchema);
export default cartModel;