const mongoos = require('mongoose')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const userSchema = new mongoos.Schema({
  name: {
    type : String,
    required : [true,'name is required'],
    trim : true,
    minLength : [3,'Name must be atleast 3 character'],
    maxLength : [12,'Name must be not greater than 12 character']
  },
  email: {
    type : String,
    required : [true,'email is required'],
    unique : [true,'Already registered'],
    lowercase : true
  },
  password: {
    type : String,
    required : [true,'Password is required'],
    select : false
},
confirmPassword : {
    type : String,
    required : [true,'confirm Password is required'],
    select : false
  }
},
{timeStamps:true})

 userSchema.methods.jwtToken = function(){
   return JWT.sign(
      {id:this._id,email:this.email},
      process.env.SECRET_TOKEN,
      {expiresIn: '24h'}
    )
  }
 
  userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
     return next()
    }
    this.password = await bcrypt.hash(this.password,10)
    return next();
  })

 const userModel =  mongoos.model('User',userSchema);
 module.exports = userModel;