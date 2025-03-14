import userModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import 'dotenv/config.js'


// login User

const loginUser = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if(!user)
        {
            return res.json({
                success:false,
                message:"User Doesn't exist"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({
                success:false,
                message:"Invalid Credentials",
            })
        }

        const token = createToken(user._id); 
        res.json({
            success:true,
            token
        })
    } 
    catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }

}

// Create a token
const createToken = (id) =>{
    return jwt.sign({id},process.env.JWT_SECRET)
}


// register User
const registerUser = async(req,res)=>
{
    const {name,password,email} = req.body;
    try {

        // Checking whether the user already exists or not
        const exists = await userModel.findOne({email});
        if(exists)
        {
            return res.json({
                success:false,message:"User Already Exists"
            })
        }

        // Validating email format & Strong password
        if(!validator.isEmail(email))
        {
            return res.json({
                success:false,message:"Please enter a Valid email"
            })
        }

        if(password.length < 8)
        {
            return res.json({
                success:false,
                message:"Please enter a strong password"
            })
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);


        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({
            success:true,
            token
        })


    }   
    catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}


export {loginUser,registerUser};