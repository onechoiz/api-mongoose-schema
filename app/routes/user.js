const bcrypt = require('bcrypt');
const express = require('express');
const router =new express.Router();
const User = require('../models/user');
const jwt = require("jsonwebtoken")
const auth = require("../middleware/auth")
const multer = require("multer")
const sharp = require('sharp');


router.post("/register", async (req,res)=>{
    const { email, password } = req.body;
    try{ 
   
    const user = new User({email, password})

     await user.save()
     res.status(201).send(user)
    
} catch(err){
    console.log(err);
    res.status(500).send('Failed to register user');
}
})


router.get("/users", auth,  async (req,res)=>{
    try{
 const users =  await User.find({})
 if(!users){
   return res.status(404).send("no users")
 }
      res.send(users)
    }catch(err){
        console.log(err);
        res.status(500).send("server error")
    }
   
})

router.post("/login", async(req,res)=>{
   const { email, password } = req.body;
//    console.log(req.params, "params");
   try{const user = await User.findOne({email});
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
     
    const token = await user.generateToken()

    console.log(token);
    res.send({user,token})}
    catch(err){
        console.log(err);
        res.status(500).send('Failed to login');
    }

})

router.get("/users/me", async (req,res)=>{

})

router.get('/protected', auth, (req, res) => {
  res.send('Protected route accessed successfully');
});

// uploading
// const upload = multer({
//     dest: 'images'
// })

// router.post('/upload',upload.single('upload'),async (req, res) => {
//     res.send("ok on upload")

// })
// const upload = multer( {
//   dest: 'images'
// })

// router.post('/upload', upload.single('upload'), (req, res) => {

//   res.send()
// })


// router.post("/users/avatar", auth, upload.single('avatar'), async (req,res)=>{
//        res.send("uploaded")
     
// })

const upload = multer({
limits : {
  fileSize: 100000
},
fileFilter(req, file, cb) {
  if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
    return cb(new Error('Please upload an image'))
  }
  cb(undefined, true)
}
})

router.post('/users/avatar', auth, upload.single('avatar'), async (req, res) =>{
  const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
  req.user.avatar = buffer
  // console.log(buffer)
  await req.user.save()  
  res.send()
}, (error, req,res, next) => {
  console.log(error)
  res.status(400).send({error: error.message})
},)

router.delete("/users/avatar", auth,  async (req,res)=>{
  try{
    console.log(req.user,"deleting");
    if(!req.user.avatar) return res.send("no avatar to begin with")
    req.user.avatar = undefined
    await req.user.save()
    res.send("deleted")
  }catch(e){
    console.log(e);
  }
   
})

module.exports = router