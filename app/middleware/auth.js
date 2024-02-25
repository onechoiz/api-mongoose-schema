const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req,res, next) => {

const token = req.header("Authorization").replace("Bearer ", "")
console.log(token);

if(!token){
    res.status(401).send("access denied")
}

try{
    const decoded = jwt.verify(token, "gone")
    console.log(decoded, "decoded");
  const user = await User.findOne({ _id: decoded.id})
  console.log(user);
    req.token = token
    req.user = user

    next()
}catch(err){
    console.log(err);
}

}


module.exports = auth