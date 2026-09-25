const mongoose=require("mongoose");
const schema=new mongoose.Schema({name:{type:String,required:true,unique:true,trim:true},code:{type:String,required:true,unique:true,trim:true},description:String},{timestamps:true});
module.exports=mongoose.model("Department",schema);