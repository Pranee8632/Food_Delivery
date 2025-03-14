import express from "express"
import authMiddleware from "../Middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders, verifyOrder } from "../Controllers/orderController.js";


const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeOrder)
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrders) //authmiddleware is used to convert auth token into the user id
orderRouter.get('/list',listOrders);
orderRouter.post('/status',updateStatus);

export default orderRouter;