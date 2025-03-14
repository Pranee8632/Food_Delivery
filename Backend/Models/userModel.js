import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    cartData:{
        type:Object,
        default:{}
    }
},{minimize:false}
)

// By default, Mongoose automatically removes empty objects when saving a document.
// minimize: false prevents Mongoose from automatically removing empty objects.

// If you don't use { minimize: false }, an empty cartData object {} will be removed when the document is saved.


const userModel = mongoose.models.user || mongoose.model("user",userSchema);


export default userModel;