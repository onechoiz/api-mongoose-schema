const express = require('express');
const router =new express.Router();
const Task = require("../models/tasks")
const auth =  require("../middleware/auth")

router.post("/tasks", auth, async (req,res)=>{
    console.log(req.user, "id");
   try{
      const task = new Task({...req.body, user: req.user._id});
      await task.save()
       res.status(201).json(task);
   }catch(err){
    console.log(err);
     res.status(500).send('Failed to create task');
   }
})

router.get("/tasks/my-tasks", auth, async (req,res)=>{
     try{
        const foundTasks = await Task.find({user: req.user._id})
        console.log(req.user, "user");
        res.send(foundTasks)

     }catch(err){
        console.log(err);
        res.status(500).send('Failed on server side');
     }

})

router.get("/tasks", async (req,res)=>{
    //Get all tasks from the database
     try{
        const foundTasks = await Task.find({})
        res.send(foundTasks)

     }catch(err){
        console.log(err);
        res.status(500).send('Failed on server side');
     }
})

// //  try the populate 
// router.get("/tasks/test", auth,  async (req,res)=>{
//   try {
//     // console.log(req.user, "req.user");
//     await req.user.populate('tasks').execPopulate();
//     res.send(req.user.tasks);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Failed on server side');
//   }
// });
router.get("/tasks/test", auth,  async (req,res)=>{
   try {
    await req.user.populate('tasks').execPopulate()
    res.send(req.user.tasks);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  } 
  
});






module.exports = router