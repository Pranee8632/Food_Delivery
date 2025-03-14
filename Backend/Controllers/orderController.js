import orderModel from "../Models/orderModel.js";
import userModel from "../Models/userModel.js"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// const INR_TO_CAD_RATE = 0.016; // Example: 1 INR ≈ 0.016 CAD

// placing user order for frontend
const placeOrder = async (req,res)=>{

    const frontend_url = "http://localhost:5173";
    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}}); //saving the order and cleaning the users cart data

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                // unit_amount:Math.round(item.price* item.quantity* INR_TO_CAD_RATE * 100),
                unit_amount:item.price*item.quantity*100
            },  
            quantity:1
        }));

        // Delivery charges
        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                // unit_amount:Math.round(2*INR_TO_CAD_RATE * 100)  // Convert to cents
                unit_amount:2*100,
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })

        res.json({
            success:true,
            session_url :session.url
        })
    } 
    catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
    }
}



// we are verifying the order -> if paid then we will update the payment status and if not we delete that order from the database
const verifyOrder = async(req,res)=>{
    const {orderId,success} = req.body;
    try {
        if(success=="true")
        {
            const updatedOrder = await orderModel.findOneAndUpdate(
                { _id: orderId, payment: false }, // Ensure we only update unpaid orders
                { payment: true },
                { new: true }
            );

            if (!updatedOrder) {
                return res.json({ success: false, message: "Order already processed or not found" });
            }
            // await orderModel.findByIdAndUpdate(orderId,{payment:true});
            return res.json({success:true,message:"Paid"})
        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            return res.json({success:false,message:"Not Paid"})
        }
    } 
    catch (error) 
    {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}



// User orders fro frontend
const userOrders = async(req,res)=>{
    try{
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true,data:orders})
    }
    catch(error)
    {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}


// Listing orders for the admin panel
const listOrders = async(req,res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    } 
    catch (error) 
    {
        console.log(error);
        res.json({success:false,message:"error"})
    }
}

// API for updating order status
const updateStatus = async(req,res)=>{
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status Updated"})
    } 
    catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

export {placeOrder,verifyOrder,userOrders,listOrders,updateStatus}