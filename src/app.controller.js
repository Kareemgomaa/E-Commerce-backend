import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dataBaseConnection from "./database/connection.js";
import authRouter from "./modules/auth/auth.controller.js";
import usersRouter from "./modules/users/users.controller.js";
import categoryRouter from "./modules/category/category.controller.js";
import subCategoriesRouter from "./modules/subCategories/subCategories.controller.js";
import publicCategoryRouter from "./modules/public/category/publicCategory.controller.js";
import productRouter from "./modules/products/products.controller.js";
import publicProductRouter from "./modules/public/products/publicproduct.controller.js";
import cartRouter from "./modules/cart/cart.controller.js";
import ordersRouter from "./modules/orders/orders.controller.js";
import { initNotificationSocket } from "./notification.socket.js";
import staffRouter from "./modules/staff/staff.controller.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

export const bootstrap =()=>{
    let app=express();
    app.set('trust proxy', 1);
    const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"],
    },
    transports: ['websocket', 'polling'] 
});
    let version = "v1";
    app.use(express.json() );
    dataBaseConnection();


app.use(helmet());
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use("/api/" + version + "/auth", limiter);
    app.use("/api/"+version+"/auth",authRouter)
    app.use("/api/"+version+"/users",usersRouter)
    app.use("/api/"+version+"/",categoryRouter)
    app.use("/api/"+version+"/",subCategoriesRouter)
    app.use("/api/"+version+"/",publicCategoryRouter)
    app.use("/api/"+version+"/admin",productRouter)
    app.use("/api/"+version+"/",publicProductRouter)
    app.use("/api/"+version+"/",cartRouter)
    app.use("/api/"+version+"/",ordersRouter)
    app.use("/api/"+version+"/admin/staff",staffRouter)
    app.use("/api/"+version+"/staff",staffRouter)

    initNotificationSocket(io);

    httpServer.listen(process.env.PORT || 3001,()=>{
        console.log("server run on 3001");
        
    })
}