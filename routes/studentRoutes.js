const express=require("express");
const bcrypt=require("bcryptjs");
const Student=require("../models/Student");
const User=require("../models/User");
const {authenticate,authorize}=require("../middleware/auth");
const router=express.Router();
router.use(authenticate);

router.post("/",authorize("admin"),async(req,res)=>{
 try{
  const {name,rollNumber,email,course,semester,password}=req.body;
  const student=new Student({name,rollNumber,email,course,semester});
  const saved=await student.save();
  const loginPassword=password||rollNumber;
  await User.create({name,email,passwordHash:await bcrypt.hash(loginPassword,10),role:"student",student:saved._id});
  res.status(201).json({message:"Student added successfully",student:saved,defaultPassword:password?undefined:loginPassword});
 }catch(error){
  if(error.code===11000)return res.status(400).json({message:"Roll number or email already exists"});
  res.status(500).json({message:"Error adding student",error:error.message});
 }
});
router.get("/",authorize("admin"),async(req,res)=>{try{res.json(await Student.find().sort({createdAt:-1}));}catch(error){res.status(500).json({message:"Error fetching students",error:error.message});}});
router.put("/:id",authorize("admin"),async(req,res)=>{
 try{const student=await Student.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});if(!student)return res.status(404).json({message:"Student not found"});res.json(student);}
 catch(error){res.status(500).json({message:"Error updating student",error:error.message});}
});
router.delete("/:id",authorize("admin"),async(req,res)=>{
 try{const student=await Student.findByIdAndDelete(req.params.id);if(!student)return res.status(404).json({message:"Student not found"});await User.deleteOne({student:student._id});await require("../models/Attendance").deleteMany({student:student._id});await require("../models/Marks").deleteMany({student:student._id});res.json({message:"Student deleted successfully"});}
 catch(error){res.status(500).json({message:"Error deleting student",error:error.message});}
});
module.exports=router;
