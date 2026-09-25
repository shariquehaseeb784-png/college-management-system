const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
require("dotenv").config();
const User=require("../models/User");

async function seedAdmin(){
  const email=(process.env.ADMIN_EMAIL||"admin@college.com").trim().toLowerCase();
  const password=process.env.ADMIN_PASSWORD||"Admin@12345";
  const name=process.env.ADMIN_NAME||"College Admin";

  if(!process.env.MONGODB_URI){
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing=await User.findOne({email});
  if(existing){
    if(existing.role!=="admin"){
      existing.role="admin";
      existing.name=name;
      existing.passwordHash=await bcrypt.hash(password,10);
      existing.student=null;
      await existing.save();
      console.log("Existing account promoted to admin:",email);
    }else{
      console.log("Admin already exists:",email);
    }
  }else{
    await User.create({
      name,
      email,
      passwordHash:await bcrypt.hash(password,10),
      role:"admin",
      student:null
    });
    console.log("Admin created:",email);
  }

  await mongoose.disconnect();
}

seedAdmin().catch(async error=>{
  console.error("Admin setup failed:",error.message);
  try{await mongoose.disconnect();}catch{}
  process.exit(1);
});
