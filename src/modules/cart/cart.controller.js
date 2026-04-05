import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { addProductToCart, clearCart, getCart, removeItemFromCart, updateQuantity } from "./cart.service.js";

let cartRouter = Router();

cartRouter.post('/cart', auth, addProductToCart);
cartRouter.get('/cart', auth, getCart);
cartRouter.delete('/cart', auth, clearCart);
cartRouter.put('/cart/:productId', auth, updateQuantity);
cartRouter.delete('/cart/:productId', auth, removeItemFromCart);

export default cartRouter;
