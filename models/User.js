//user model
const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt-nodejs'),
  userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
  })

// a method to return an encrypted password string
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8))
}

// a method return boolean indicating if correct password is used to authenticate
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

  module.exports = mongoose.model('User1', userSchema)