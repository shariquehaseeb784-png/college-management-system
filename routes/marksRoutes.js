const express=require("express");const Marks=require("../models/Marks");const {authenticate,authorize}=require("../middleware/auth");const router=express.Router();router.use(authenticate);
router.post("/",authorize("admin"),async(req,res)=>{try{const r=await new Marks(req.body).save();res.status(201).json({message:"Marks added successfully",result:r});}catch(e){res.status(400).json({message:"Error adding marks",error:e.message});}});
router.get("/",authorize("admin"),async(req,res)=>{try{res.json(await Marks.find().populate("student","name rollNumber course").sort({createdAt:-1}));}catch(e){res.status(500).json({message:"Error fetching marks",error:e.message});}});
router.delete("/:id",authorize("admin"),async(req,res)=>{try{await Marks.findByIdAndDelete(req.params.id);res.json({message:"Marks deleted successfully"});}catch(e){res.status(500).json({message:"Error deleting marks",error:e.message});}});
module.exports=router;
