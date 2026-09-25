const express=require("express");const Attendance=require("../models/Attendance");const {authenticate,authorize}=require("../middleware/auth");const router=express.Router();router.use(authenticate);
router.post("/",authorize("admin"),async(req,res)=>{try{const a=await new Attendance(req.body).save();res.status(201).json({message:"Attendance marked successfully",attendance:a});}catch(e){res.status(400).json({message:"Error marking attendance",error:e.message});}});
router.get("/",authorize("admin"),async(req,res)=>{try{res.json(await Attendance.find().populate("student","name rollNumber course").sort({createdAt:-1}));}catch(e){res.status(500).json({message:"Error fetching attendance",error:e.message});}});
router.delete("/:id",authorize("admin"),async(req,res)=>{try{await Attendance.findByIdAndDelete(req.params.id);res.json({message:"Attendance deleted successfully"});}catch(e){res.status(500).json({message:"Error deleting attendance",error:e.message});}});
module.exports=router;
