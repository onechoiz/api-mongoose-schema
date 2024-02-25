const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken")

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: {
    type: Buffer
  },


 token:{
        type: String,
        // required:true
      }

       
});

userSchema.virtual("tasks",{
    ref:"Task",
    localField: "_id",
    foreignField: "user"
})

userSchema.methods.generateToken = async function(){

    const user = this
    const token = jwt.sign({id: user._id},"gone")

    user.token = token
    await user.save()
    return token
}


const User = mongoose.model('User', userSchema);

module.exports = User;
