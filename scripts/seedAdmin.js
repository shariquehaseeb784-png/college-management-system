const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
require("dotenv").config();
const User=require("../models/User");

async function seedAdmin(){
  const email=(process.env.ADMIN_EMAIL||"admin@college.com").trim().toLowerCase();
  const password=process.env.ADMIN_PASSWORD||"Admin@12345";
  const name=process.env.ADMIN_NAME||"College Admin";

  if(!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");

  const existing=await User.findOne({email});
  if(existing){
    existing.role="admin";
    existing.name=name;
    existing.passwordHash=await bcrypt.hash(password,10);
    existing.student=null;
    await existing.save();
    console.log("Admin credentials synchronized:",email);
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
}

module.exports=seedAdmin;

if(require.main===module){
  mongoose.connect(process.env.MONGODB_URI)
    .then(seedAdmin)
    .then(()=>mongoose.disconnect())
    .catch(async error=>{
      console.error("Admin setup failed:",error.message);
      try{await mongoose.disconnect();}catch{}
      process.exit(1);
    });
}
