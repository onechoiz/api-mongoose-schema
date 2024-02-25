const jwt = require('jsonwebtoken');
const express = require('express');
const router = new express.Router();
const mongoose = require("mongoose")

const app = express()
app.use(express.json());

const userRouter = require("./app/routes/user")
const taskRouter =  require("./app/routes/task")

app.use(userRouter)
app.use(taskRouter)

try{
     mongoose.connect("mongodb://localhost:27017/ankpa-project")
     console.log("connected to DB");
}catch(err){
    console.log(err);

}






app.listen(3000, ()=>{
    console.log("app ruunning on 3000");
})