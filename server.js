const express=require("express");
const cors=require("cors");
const path=require("path");
const mongoose=require("mongoose");
require("dotenv").config();
const authRoutes=require("./routes/authRoutes");
const studentRoutes=require("./routes/studentRoutes");
const attendanceRoutes=require("./routes/attendanceRoutes");
const marksRoutes=require("./routes/marksRoutes");
const studentPortalRoutes=require("./routes/studentPortalRoutes");
const seedAdmin=require("./scripts/seedAdmin");

const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));

app.get("/",(req,res)=>res.sendFile(path.join(__dirname,"public","login.html")));
app.get("/api/test",(req,res)=>res.json({message:"College Management System API is working!"}));
app.use("/api/auth",authRoutes);
app.use("/api/students",studentRoutes);
app.use("/api/attendance",attendanceRoutes);
app.use("/api/marks",marksRoutes);
app.use("/api/student-portal",studentPortalRoutes);

mongoose.connect(process.env.MONGODB_URI).then(async()=>{
 await seedAdmin();
 const PORT=process.env.PORT||5000;
 app.listen(PORT,()=>console.log(`Server running at http://localhost:${PORT}`));
}).catch(error=>console.error("MongoDB connection failed:",error.message));
