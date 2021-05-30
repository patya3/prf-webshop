const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

var userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String },
  },
  { collection: 'users' }
);

userSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.role = 'user';
    bcryptjs.genSalt(10, function (error, salt) {
      if (error) return next(error);

      bcryptjs.hash(user.password, salt, function (error, hash) {
        if (error) return next(error);
        user.password = hash;
        return next();
      });
    });
  } else {
    return next();
  }
});

userSchema.methods.comparePasswords = function (password, nx) {
  bcryptjs.compare(password, this.password, function (error, isMatch) {
    nx(error, isMatch);
  });
};

mongoose.model('user', userSchema);
