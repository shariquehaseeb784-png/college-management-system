const mongoose=require("mongoose");
const schema=new mongoose.Schema({name:{type:String,required:true,trim:true},code:{type:String,required:true,unique:true,trim:true},credits:{type:Number,default:4},department:{type:mongoose.Schema.Types.ObjectId,ref:"Department"},semester:{type:Number,min:1,max:12}},{timestamps:true});
module.exports=mongoose.model("Subject",schema);