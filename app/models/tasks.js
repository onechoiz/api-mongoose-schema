const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const User = require("./user")

// creating a schema for  tasks
const TaskSchema = new Schema({
      title:{
        type: String
      },
      desc: 
        { type: String },
      completed: { type: Boolean, default: false },
      user: {
        type: Schema.Types.ObjectId, 
        ref: "User",
        required: true
      }
      
})

// creating a model 
const Task = mongoose.model("Task", TaskSchema)

module.exports = Task