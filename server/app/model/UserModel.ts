import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},  
    password:{type:String,required:true},
    referralCode:{type:String,required:true,unique:true},
    referredBy:{type:String,default:null},
    credits:{type:Number,default:0},
    referredUser:[
        {
            user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"},
            status:{type:String,enum:["pending","converted","null"],default:"null"}
        },
    ]
},
{
    timestamps:true
}); 
export const UserModel=mongoose.model("User",UserSchema);
